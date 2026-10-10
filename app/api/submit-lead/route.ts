export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { sendToTeleCRM } from '@/lib/telecrm';

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
}

type LeadRouteConfig = {
  source: string;
  sheetTab: string;
  telecrmPageName: string;
  treatmentType: string;
};

const DEFAULT_ROUTE: LeadRouteConfig = {
  source: 'Eclora Aesthetics LP',
  sheetTab: 'Eclora Leads',
  telecrmPageName: 'eclora-aesthetics-website',
  treatmentType: 'Aesthetic Treatments',
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

function sendLeadToTeleCRM(data: LeadInput) {
  const concern = data.healthGoal?.trim() || '';
  const pageUrl = data.pageUrl || data.source || DEFAULT_ROUTE.source;

  return sendToTeleCRM({
    name: data.name,
    phone: data.phone,
    email: data.email,
    message: `Consultation enquiry - ${concern || 'Aesthetic treatment'} at Eclora Aesthetics`,
    requestType: 'consultation',
    pageName: data.telecrmPageName || DEFAULT_ROUTE.telecrmPageName,
    notes: [
      `Lead Source: ${data.source || DEFAULT_ROUTE.source}`,
      `Live URL: ${pageUrl}`,
      `Treatment Type: ${data.treatmentType || DEFAULT_ROUTE.treatmentType}`,
      `Treatment Concern: ${concern || 'Not specified'}`,
      `Email: ${data.email?.trim() || 'Not provided'}`,
    ],
  });
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
  };

  const [sheetResult, crmResult] = await Promise.allSettled([
    appendToGoogleSheet(leadData),
    sendLeadToTeleCRM(leadData),
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
