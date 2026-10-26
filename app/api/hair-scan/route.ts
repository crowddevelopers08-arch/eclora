export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

import { NextRequest, NextResponse } from 'next/server';
import { sendToTeleCRM } from '@/lib/telecrm';
import { prisma } from '@/lib/prisma';
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

  /* Database first: Postgres is the source of truth for the admin dashboard. */
  let leadId: string | null = null;
  try {
    const row = await prisma.hairScanLead.create({
      data: {
        name: lead.name.trim(),
        phone: cleanPhone(lead.phone),
        age: answers.age!,
        gender: answers.gender!,
        concern: answers.concern!,
        stage: answers.stage!,
        lifestyle: answers.lifestyle!,
        pageUrl: pageUrl || null,
        photos: {
          create: photos.map((p) => ({ view: p.view, data: Buffer.from(p.base64, 'base64') })),
        },
      },
      select: { id: true },
    });
    leadId = row.id;
  } catch (err) {
    console.error('[Hair scan → Database] Error:', err instanceof Error ? err.message : err);
  }
  const dbOk = leadId !== null;

  const concernLabel = optionLabel('concern', answers.concern);
  const stageLabel = optionLabel('stage', answers.stage);
  const ageLabel = optionLabel('age', answers.age);
  const genderLabel = optionLabel('gender', answers.gender);
  const lifestyleLabel = optionLabel('lifestyle', answers.lifestyle);
  const phone = cleanPhone(lead.phone);

  /* Database is saved above; the lead is then pushed to TeleCRM (no Google Sheet). */
  const [crmResult] = await Promise.allSettled([
    sendToTeleCRM({
      name: lead.name,
      phone: lead.phone,
      message: `Hair scan - ${concernLabel} at Eclora Aesthetics`,
      requestType: 'consultation',
      pageName: TELECRM_PAGE,
      notes: [
        `Form Name: ${TELECRM_PAGE}`,
        `Lead Source: ${SOURCE}`,
        `Live URL: ${pageUrl || 'Not available'}`,
        `Name: ${lead.name.trim()}`,
        `Phone: ${phone}`,
        'Treatment Type: Hair Treatments',
        `Primary Concern: ${concernLabel}`,
        `Hair Stage: ${stageLabel}`,
        `Age Group: ${ageLabel}`,
        `Gender: ${genderLabel}`,
        `Lifestyle: ${lifestyleLabel}`,
        `Details: Form Name: ${TELECRM_PAGE} | Source: ${SOURCE} | Name: ${lead.name.trim()} | Phone: ${phone} | Concern: ${concernLabel} | Stage: ${stageLabel} | Age: ${ageLabel} | Gender: ${genderLabel} | Lifestyle: ${lifestyleLabel}`,
      ],
    }),
  ]);

  const crmOk = crmResult.status === 'fulfilled';
  if (!crmOk) {
    const r = crmResult.reason;
    console.error('[Hair scan → TeleCRM] Error:', r instanceof Error ? r.message : r);
  }

  if (leadId) {
    try {
      await prisma.hairScanLead.update({ where: { id: leadId }, data: { crmSynced: crmOk } });
    } catch (err) {
      console.error('[Hair scan → Database sync flags] Error:', err instanceof Error ? err.message : err);
    }
  }

  if (!dbOk && !crmOk) {
    return NextResponse.json(
      { error: 'We couldn’t save your scan right now. Please try again in a moment.' },
      { status: 502 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      db: dbOk ? 'ok' : 'failed',
      crm: crmOk ? 'ok' : 'failed',
      photos: photos.length,
    },
    { status: 201 }
  );
}
