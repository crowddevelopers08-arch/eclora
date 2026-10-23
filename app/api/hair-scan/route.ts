export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
/* Drive uploads in Apps Script take a few seconds per photo. */
export const maxDuration = 30;

import { NextRequest, NextResponse } from 'next/server';
import { sendToTeleCRM } from '@/lib/telecrm';
import {
  MAX_PHOTO_DATA_URL_LENGTH,
  PHOTO_VIEWS,
  SCAN_QUESTIONS,
  cleanPhone,
  optionLabel,
  validateAnswer,
  type ScanAnswers,
} from '@/lib/hairScan';

const SOURCE = 'Eclora Aesthetics — Hair Scan LP';
const TELECRM_PAGE = 'eclora-hair-scan';

const JPEG_PREFIX = 'data:image/jpeg;base64,';

type PhotoLinks = Record<string, string>;

/** Saves the row in the "Hair Scan Leads" tab and the photos in Drive. */
async function saveToSheetAndDrive(
  answers: Required<Pick<ScanAnswers, 'name' | 'phone'>> & ScanAnswers,
  photos: { view: string; label: string; base64: string }[],
  pageUrl: string
): Promise<PhotoLinks> {
  const endpoint = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!endpoint) throw new Error('GOOGLE_SHEETS_WEBHOOK_URL is not set');

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'hairscan',
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      name: answers.name.trim(),
      phone: cleanPhone(answers.phone),
      age: optionLabel('age', answers.age),
      gender: optionLabel('gender', answers.gender),
      concern: optionLabel('concern', answers.concern),
      stage: optionLabel('stage', answers.stage),
      lifestyle: optionLabel('lifestyle', answers.lifestyle),
      source: pageUrl || SOURCE,
      photos,
    }),
    cache: 'no-store',
  });

  const text = await res.text();
  if (!res.ok) throw new Error(text || `Google Sheets responded with ${res.status}`);
  let json: { error?: string; photoLinks?: PhotoLinks } = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    throw new Error('Apps Script returned a non-JSON response');
  }
  if (json.error) throw new Error(json.error);
  return json.photoLinks ?? {};
}

export async function POST(req: NextRequest) {
  let body: { answers?: ScanAnswers; photos?: Record<string, unknown>; pageUrl?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  /* Answers */
  const answers: ScanAnswers = {};
  for (const q of SCAN_QUESTIONS) {
    const raw = body.answers?.[q.id];
    const value = typeof raw === 'string' ? raw.trim() : '';
    const err = validateAnswer(q, value);
    if (err) return NextResponse.json({ error: err }, { status: 400 });
    if (q.options && !q.options.some((o) => o.id === value)) {
      return NextResponse.json({ error: 'Please answer all the questions.' }, { status: 400 });
    }
    answers[q.id] = value;
  }

  /* Photos */
  const photos: { view: string; label: string; base64: string }[] = [];
  for (const view of PHOTO_VIEWS) {
    const raw = body.photos?.[view.id];
    if (raw === undefined || raw === null || raw === '') {
      if (view.required) {
        return NextResponse.json({ error: `Please add your ${view.label.toLowerCase()} photo.` }, { status: 400 });
      }
      continue;
    }
    if (typeof raw !== 'string' || !raw.startsWith(JPEG_PREFIX) || raw.length > MAX_PHOTO_DATA_URL_LENGTH) {
      return NextResponse.json({ error: `The ${view.label.toLowerCase()} photo couldn’t be read. Please retake it.` }, { status: 400 });
    }
    const base64 = raw.slice(JPEG_PREFIX.length);
    if (!/^[A-Za-z0-9+/]+=*$/.test(base64)) {
      return NextResponse.json({ error: `The ${view.label.toLowerCase()} photo couldn’t be read. Please retake it.` }, { status: 400 });
    }
    photos.push({ view: view.id, label: view.label, base64 });
  }

  const pageUrl = typeof body.pageUrl === 'string' ? body.pageUrl.slice(0, 500) : '';
  const lead = answers as Required<Pick<ScanAnswers, 'name' | 'phone'>> & ScanAnswers;

  /* Drive + Sheet first, so the CRM note can carry the photo links. */
  let photoLinks: PhotoLinks = {};
  let sheetOk = true;
  try {
    photoLinks = await saveToSheetAndDrive(lead, photos, pageUrl);
  } catch (err) {
    sheetOk = false;
    console.error('[Hair scan → Sheets/Drive] Error:', err instanceof Error ? err.message : err);
  }

  let crmOk = true;
  try {
    await sendToTeleCRM({
      name: lead.name,
      phone: lead.phone,
      message: `Hair scan - ${optionLabel('concern', answers.concern)} at Eclora Aesthetics`,
      requestType: 'consultation',
      pageName: TELECRM_PAGE,
      notes: [
        `Lead Source: ${SOURCE}`,
        `Live URL: ${pageUrl || 'Not available'}`,
        'Treatment Type: Hair Treatments',
        `Primary Concern: ${optionLabel('concern', answers.concern)}`,
        `Hair Stage: ${optionLabel('stage', answers.stage)}`,
        `Age Group: ${optionLabel('age', answers.age)}`,
        `Gender: ${optionLabel('gender', answers.gender)}`,
        `Lifestyle: ${optionLabel('lifestyle', answers.lifestyle)}`,
        ...PHOTO_VIEWS.map((v) => {
          const sent = photos.some((p) => p.view === v.id);
          const link = photoLinks[v.id];
          return `${v.label} Photo: ${link || (sent ? 'Captured (see Hair Scan sheet)' : 'Not provided')}`;
        }),
      ],
    });
  } catch (err) {
    crmOk = false;
    console.error('[Hair scan → TeleCRM] Error:', err instanceof Error ? err.message : err);
  }

  if (!sheetOk && !crmOk) {
    return NextResponse.json(
      { error: 'We couldn’t save your scan right now. Please try again in a moment.' },
      { status: 502 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      sheet: sheetOk ? 'ok' : 'failed',
      crm: crmOk ? 'ok' : 'failed',
      photos: Object.keys(photoLinks).length,
    },
    { status: 201 }
  );
}
