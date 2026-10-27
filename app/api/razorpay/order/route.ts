export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { consultationPrice } from '@/lib/paidOffer';

const RAZORPAY_ORDERS_URL = 'https://api.razorpay.com/v1/orders';

// The amount is decided here, on the server, and never taken from the client —
// otherwise a user could edit the request and pay ₹1 for the consultation.
function consultationAmountInPaise() {
  const rupees = consultationPrice();
  return rupees === null ? null : Math.round(rupees * 100);
}

function basicAuth(keyId: string, keySecret: string) {
  return `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`;
}

export async function POST(req: NextRequest) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    console.error('[Razorpay] RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are not set');
    return NextResponse.json({ error: 'Payments are not configured yet. Please call us to book.' }, { status: 500 });
  }

  const amount = consultationAmountInPaise();
  if (amount === null) {
    console.error('[Razorpay] RAZORPAY_CONSULTATION_AMOUNT is missing or invalid');
    return NextResponse.json({ error: 'Payments are not configured yet. Please call us to book.' }, { status: 500 });
  }

  // Context from the checkout form, stored on the order so the webhook can
  // build the TeleCRM lead even if the browser never comes back.
  let pageUrl = '';
  let leadName = '';
  let leadPhone = '';
  let leadEmail = '';
  let concern = '';
  try {
    const body = await req.json();
    if (typeof body?.pageUrl === 'string') pageUrl = body.pageUrl.slice(0, 200);
    if (typeof body?.name === 'string') leadName = body.name.trim().slice(0, 80);
    if (typeof body?.phone === 'string') leadPhone = body.phone.replace(/\D/g, '').slice(-10);
    if (typeof body?.email === 'string') leadEmail = body.email.trim().slice(0, 120);
    if (typeof body?.concern === 'string') concern = body.concern.trim().slice(0, 80);
  } catch {
    // No body is fine — nothing here is required.
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(RAZORPAY_ORDERS_URL, {
      method: 'POST',
      headers: { Authorization: basicAuth(keyId, keySecret), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount,
        currency: 'INR',
        // Razorpay caps receipt at 40 chars.
        receipt: `eclora_${Date.now()}`.slice(0, 40),
        notes: {
          product: 'Skin & Hair Consultation',
          source: pageUrl || 'skin-hair-consultation/checkout',
          ...(leadName ? { name: leadName } : {}),
          ...(leadPhone ? { phone: `91${leadPhone}` } : {}),
          ...(leadEmail ? { email: leadEmail } : {}),
          ...(concern ? { concern } : {}),
        },
      }),
      signal: controller.signal,
      cache: 'no-store',
    });

    const order = await res.json();
    if (!res.ok) throw new Error(order?.error?.description || `Razorpay HTTP ${res.status}`);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId, // publishable key — safe to expose to the browser
    });
  } catch (err) {
    console.error('[Razorpay create-order] Error:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Could not start the payment. Please try again.' }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
}
