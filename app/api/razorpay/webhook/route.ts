export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { createHmac, timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { sendToTeleCRM } from '@/lib/telecrm';

// Razorpay calls this endpoint server-to-server after a payment settles. It is
// the reliable half of the flow: the browser callback in CheckoutForm can be
// lost if the visitor closes the tab mid-payment, but this still fires, so a
// paid (or failed) consultation always reaches TeleCRM. No Google Sheet — the
// paid funnel is TeleCRM only.

interface RazorpayPayment {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
  status: string;
  method?: string;
  email?: string;
  contact?: string;
  notes?: Record<string, string>;
}

function signatureMatches(rawBody: string, signature: string, secret: string) {
  const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(signature, 'utf8');
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

const rupees = (paise: number) => (paise / 100).toFixed(2);

function sendPaymentToTeleCRM(payment: RazorpayPayment, event: string) {
  const paid = event === 'payment.captured';
  const amount = `${payment.currency} ${rupees(payment.amount)}`;
  const notes = payment.notes ?? {};
  const name = notes.name?.trim() || 'Razorpay customer';
  const phone = notes.phone || payment.contact || '';
  const concern = notes.concern || 'Not specified';

  return sendToTeleCRM({
    name,
    phone,
    email: payment.email || notes.email,
    message: paid
      ? `Paid skin & hair consultation – ${amount} (Payment ${payment.id})`
      : `Failed payment for skin & hair consultation – ${amount} (Payment ${payment.id})`,
    requestType: 'consultation-payment',
    pageName: 'eclora-paid-lp-payment',
    notes: [
      `Payment status: ${paid ? 'Captured (Paid)' : 'Failed'}`,
      `Lead Stage: ${paid ? 'Paid Consultation' : 'Payment Failed'}`,
      `Amount: ${amount}`,
      `Treatment Concern: ${concern}`,
      `Razorpay Payment ID: ${payment.id}`,
      `Razorpay Order ID: ${payment.order_id}`,
      `Method: ${payment.method || 'Not specified'}`,
      `Lead Source: Eclora Paid LP – ${notes.source || 'skin-hair-consultation/checkout'}`,
    ],
  });
}

export async function POST(req: NextRequest) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[Razorpay webhook] RAZORPAY_WEBHOOK_SECRET is not set');
    return NextResponse.json({ error: 'Webhook not configured.' }, { status: 500 });
  }

  const signature = req.headers.get('x-razorpay-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature.' }, { status: 400 });
  }

  // The signature is computed over the exact bytes Razorpay sent, so the raw
  // text must be read before any JSON parsing.
  const rawBody = await req.text();

  if (!signatureMatches(rawBody, signature, secret)) {
    console.error('[Razorpay webhook] Signature mismatch — request rejected');
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 });
  }

  let body: { event?: string; payload?: { payment?: { entity?: RazorpayPayment } } };
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  const event = body.event || '';
  const payment = body.payload?.payment?.entity;

  // Anything we don't act on is acknowledged with 200 so Razorpay stops retrying.
  if (event !== 'payment.captured' && event !== 'payment.failed') {
    return NextResponse.json({ received: true, ignored: event }, { status: 200 });
  }
  if (!payment?.id) {
    return NextResponse.json({ received: true, ignored: 'no payment entity' }, { status: 200 });
  }

  let crm: 'ok' | 'failed' = 'ok';
  try {
    await sendPaymentToTeleCRM(payment, event);
  } catch (err) {
    crm = 'failed';
    console.error('[Razorpay webhook TeleCRM] Error:', err instanceof Error ? err.message : err);
  }

  // Always 200 on a verified event. Returning an error would make Razorpay
  // retry and duplicate a lead that did go through.
  return NextResponse.json({ received: true, event, paymentId: payment.id, crm }, { status: 200 });
}
