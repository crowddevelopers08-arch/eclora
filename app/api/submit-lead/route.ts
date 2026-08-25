export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

interface LeadInput {
  name: string;
  phone: string;
  email?: string;
  location?: string;
  healthGoal?: string;
  source?: string;
  pageUrl?: string;
  sheetTab?: string;
  telecrmPageName?: string;
  treatmentType?: string;
  concernField?: string;
}

type LeadRouteConfig = {
  source: string;
  sheetTab: string;
  telecrmPageName: string;
  treatmentType: string;
  /** Label of the TeleCRM custom field that holds this page's concern question. */
  concernField: string;
};

const DEFAULT_ROUTE: LeadRouteConfig = {
  source: 'Eclora Aesthetics LP',
  sheetTab: 'Eclora Leads',
  telecrmPageName: 'eclora-aesthetics-website',
  treatmentType: 'Aesthetic Treatments',
  concernField: 'Treatment Concern',
};

function isValidIndianPhone(raw: string) {
  const cleaned = raw.replace(/[\s\-()]/g, '').replace(/^\+91/, '');
  return /^[6-9]\d{9}$/.test(cleaned);
}

function isValidName(raw: string) {
  return raw.trim().length >= 2 && /^[a-zA-Z\s'.-]+$/.test(raw.trim());
}

function isValidEmail(raw: string) {
  if (!raw.trim()) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw.trim());
}

async function appendToGoogleSheet(data: LeadInput) {
  const endpoint = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!endpoint) throw new Error('GOOGLE_SHEETS_WEBHOOK_URL is not set');

  const payload = {
    timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    name: data.name.trim(),
    email: data.email?.trim() || '',
    phone: data.phone.replace(/[\s\-()]/g, '').replace(/^\+91/, ''),
    location: data.location?.trim() || 'Not specified',
    treatment: data.healthGoal?.trim() || 'Not specified',
    source: data.pageUrl || data.source || DEFAULT_ROUTE.source,
    sheetTab: data.sheetTab || DEFAULT_ROUTE.sheetTab,
  };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  const text = await res.text();
  if (!res.ok) throw new Error(text || `Google Sheets responded with ${res.status}`);
  try { return text ? JSON.parse(text) : { success: true }; }
  catch { return { success: true }; }
}

async function sendToTeleCRM(data: LeadInput) {
  const endpoint = process.env.TELECRM_API_URL;
  if (!endpoint) throw new Error('TELECRM_API_URL is not set');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  const name = data.name.trim();
  const email = data.email?.trim() || '';
  const phone = data.phone.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '');
  const concern = data.healthGoal?.trim() || '';
  const treatmentType = data.treatmentType || DEFAULT_ROUTE.treatmentType;
  const concernField = data.concernField || DEFAULT_ROUTE.concernField;

  // TeleCRM ignores `fields` keys that don't match a field defined on the
  // enterprise, so only send canonical keys plus the page's own custom field.
  const fields: Record<string, string> = {
    name,
    phone,
    'Lead Status': 'new',
    'Lead Request Type': 'consultation',
    'Treatment Type': treatmentType,
    Source: data.pageUrl || data.source || DEFAULT_ROUTE.source,
    PageName: data.telecrmPageName || DEFAULT_ROUTE.telecrmPageName,
    Country: 'India',
  };

  if (email) fields.email = email;
  if (concern) fields[concernField] = concern;

  const payload = {
    fields,
    actions: [
      { type: 'SYSTEM_NOTE', text: `Lead Source: ${fields.Source}` },
      { type: 'SYSTEM_NOTE', text: `Landing Page: ${data.source || DEFAULT_ROUTE.source}` },
      { type: 'SYSTEM_NOTE', text: `Treatment Type: ${treatmentType}` },
      { type: 'SYSTEM_NOTE', text: `Treatment Concern: ${concern || 'Not specified'}` },
      { type: 'SYSTEM_NOTE', text: `Name: ${name}` },
      { type: 'SYSTEM_NOTE', text: `Phone: ${phone}` },
      { type: 'SYSTEM_NOTE', text: `Email: ${email || 'Not provided'}` },
      { type: 'SYSTEM_NOTE', text: 'Consent Given: Yes' },
    ],
  };

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.TELECRM_API_KEY}`,
        'X-Client-ID': 'eclora-aesthetics-website',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (res.status === 204) return { status: 'success', message: 'Lead created (204)' };

    const text = await res.text();

    if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
      throw new Error('TeleCRM returned an HTML response - check the API URL');
    }

    const json = text ? JSON.parse(text) : {};
    if (!res.ok) throw new Error(json.message || `TeleCRM HTTP ${res.status}`);
    return json;
  } catch (err) {
    clearTimeout(timeout);
    throw err instanceof Error ? err : new Error(String(err));
  }
}

export async function POST(req: NextRequest) {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const {
    name = '',
    phone = '',
    email = '',
    location = '',
    healthGoal = '',
    pageUrl = '',
  } = body;

  if (!name.trim()) {
    return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
  }

  if (!isValidName(name)) {
    return NextResponse.json({ error: 'Name should contain letters only.' }, { status: 400 });
  }

  if (!phone.trim()) {
    return NextResponse.json({ error: 'Please enter your phone number.' }, { status: 400 });
  }

  if (!isValidIndianPhone(phone)) {
    return NextResponse.json(
      { error: 'Please enter a valid 10-digit Indian mobile number.' },
      { status: 400 }
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  const routeConfig: LeadRouteConfig = DEFAULT_ROUTE;

  const leadData: LeadInput = {
    name,
    phone,
    email,
    location,
    healthGoal,
    source: routeConfig.source,
    pageUrl: pageUrl.trim() || routeConfig.source,
    sheetTab: routeConfig.sheetTab,
    telecrmPageName: routeConfig.telecrmPageName,
    treatmentType: routeConfig.treatmentType,
    concernField: routeConfig.concernField,
  };

  const [sheetResult, crmResult] = await Promise.allSettled([
    appendToGoogleSheet(leadData),
    sendToTeleCRM(leadData),
  ]);

  if (sheetResult.status === 'rejected') {
    console.error('[Google Sheets] Error:', sheetResult.reason?.message);
  }
  if (crmResult.status === 'rejected') {
    console.error('[TeleCRM] Error:', crmResult.reason?.message);
  }

  return NextResponse.json(
    {
      success: true,
      sheet: sheetResult.status === 'fulfilled' ? 'ok' : 'failed',
      crm: crmResult.status === 'fulfilled' ? 'ok' : 'failed',
      route: routeConfig.sheetTab,
      timestamp: new Date().toISOString(),
    },
    { status: 201 }
  );
}
