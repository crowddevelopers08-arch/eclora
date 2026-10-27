'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { FaCircleCheck, FaLock, FaWhatsapp } from 'react-icons/fa6';
import { BlobButton } from '@/components/BlobButton';
import { PaymentBadges } from '@/components/paid/PaymentBadges';
import { inr } from '@/lib/paidOffer';
import { SITE } from '@/lib/site';

/**
 * Checkout form for the paid funnel.
 *
 * 1. Save the lead (TeleCRM only, via /api/submit-lead) so no enquiry
 *    is lost if the visitor abandons payment.
 * 2. Create a Razorpay order server-side and open the Razorpay Checkout popup.
 * 3. Verify the payment signature server-side; only then go to
 *    /skin-hair-consultation/thank-you (its own page and conversion tags).
 *
 * Until Razorpay is configured (see lib/paidOffer.ts) the lead is saved and an
 * inline confirmation is shown instead — the thank-you page (and its tags)
 * is reserved for paid bookings. /api/razorpay/webhook records the payment
 * outcome in TeleCRM independently of this browser flow.
 *
 * `price` and `paymentEnabled` are passed in by the server page because they
 * come from server-only env vars.
 */

type RazorpayResponse = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };
type RazorpayInstance = { open: () => void; on: (event: string, cb: (r: { error?: { description?: string } }) => void) => void };
declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

function loadRazorpay(): Promise<boolean> {
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

/** Mirrors the treatment carousel on the landing page. */
const CONCERNS = [
  'Laser Hair Reduction',
  'Pigmentation / Uneven Skin Tone',
  'Hair Fall / Hair Thinning',
  'Acne Scars / Skin Texture',
  'Fine Lines / Skin Resurfacing',
  'IV Drips / Wellness',
  'Not sure — need guidance',
];

const inputClass =
  'mt-2 w-full rounded-xl border border-[#E3CC9D] bg-white px-4 py-3 font-body text-[16px] text-[#1E2115] outline-none transition focus:border-[#4E5426] focus:ring-2 focus:ring-[#4E5426]/15';

export function CheckoutForm({ price, paymentEnabled }: { price: number | null; paymentEnabled: boolean }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [concern, setConcern] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [leadSaved, setLeadSaved] = useState(false);
  const [done, setDone] = useState(false);

  async function startPayment() {
    if (!(await loadRazorpay()) || !window.Razorpay) {
      throw new Error('Could not load the payment window. Please check your connection and try again.');
    }

    const orderRes = await fetch('/api/razorpay/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), phone, email: email.trim(), concern, pageUrl: window.location.href }),
    });
    const order = await orderRes.json().catch(() => ({}));
    if (!orderRes.ok) throw new Error(order.error || 'Could not start the payment. Please try again.');

    const rzp = new window.Razorpay({
      key: order.keyId,
      order_id: order.orderId,
      amount: order.amount,
      currency: order.currency,
      name: SITE.name,
      description: 'Skin & Hair Consultation',
      image: SITE.favicon,
      prefill: { name: name.trim(), email: email.trim(), contact: `+91${phone}` },
      notes: { concern },
      theme: { color: '#4E5426' },
      handler: async (response: RazorpayResponse) => {
        try {
          const v = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          });
          const result = await v.json().catch(() => ({}));
          if (!v.ok || !result.verified) throw new Error(result.error || 'Payment could not be verified.');
          router.push(`/skin-hair-consultation/thank-you?payment_id=${encodeURIComponent(result.paymentId)}`);
        } catch (err) {
          setError(
            `${err instanceof Error ? err.message : 'Payment could not be verified.'} If money was deducted, please call ${SITE.phoneDisplay} with your payment ID ${response.razorpay_payment_id}.`
          );
          setSubmitting(false);
        }
      },
      modal: {
        ondismiss: () => {
          setError('Payment was cancelled. You can try again whenever you’re ready.');
          setSubmitting(false);
        },
      },
    });
    rzp.on('payment.failed', (r) => {
      setError(r.error?.description || 'Payment failed. Please try again.');
    });
    rzp.open();
  }

  const submitLabel =
    paymentEnabled && price !== null ? `Place Order ${inr(price)}` : 'Book My Consultation';

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (name.trim().length < 2 || !/^[a-zA-Z\s'.-]+$/.test(name.trim())) {
      setError('Please enter your name (letters only).');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError('Please enter a valid 10-digit WhatsApp number.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!concern) {
      setError('Please select your concern.');
      return;
    }

    setSubmitting(true);
    try {
      // Save once; a retry after a cancelled payment goes straight to Razorpay.
      if (!leadSaved) {
        const res = await fetch('/api/submit-lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            phone,
            email: email.trim(),
            healthGoal: concern,
            pageUrl: window.location.href,
            funnel: 'paid-lp', // TeleCRM only — no Google Sheet
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
        setLeadSaved(true);
      }

      if (paymentEnabled) {
        await startPayment(); // the popup's handlers take it from here
      } else {
        setDone(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div
        id="order-form"
        role="status"
        className="scroll-mt-24 rounded-[1.75rem] border border-[#E3CC9D] bg-white p-6 text-center shadow-[0_30px_80px_-40px_rgba(78,84,38,0.5)] sm:p-8"
      >
        <FaCircleCheck className="mx-auto text-[44px] text-[#4E5426]" aria-hidden="true" />
        <h2 className="mt-4 font-heading text-[22px] font-bold text-[#1E2115]">Thank you, {name.trim().split(' ')[0]}!</h2>
        <p className="mt-2 font-body text-[16px] leading-[1.7] text-[#5F6352]">
          We’ve received your details. Our team will contact you on WhatsApp at +91 {phone} to confirm your
          consultation slot.
        </p>
      </div>
    );
  }

  return (
    <form
      id="order-form"
      onSubmit={onSubmit}
      noValidate
      className="scroll-mt-24 rounded-[1.75rem] border border-[#E3CC9D] bg-white p-5 shadow-[0_30px_80px_-40px_rgba(78,84,38,0.5)] sm:p-6"
    >
      <h2 className="font-heading text-[20px] font-bold text-[#1E2115]">Your details</h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="font-body text-[14px] font-semibold text-[#1E2115]">Your Name</span>
          <input
            type="text"
            name="name"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            className={inputClass}
          />
        </label>
  
        <label className="block">
          <span className="flex items-center gap-1.5 font-body text-[14px] font-semibold text-[#1E2115]">
            <FaWhatsapp className="text-[16px] text-[#25D366]" aria-hidden="true" />
            WhatsApp Number
          </span>
          <div className="mt-2 flex overflow-hidden rounded-xl border border-[#E3CC9D] transition focus-within:border-[#4E5426] focus-within:ring-2 focus-within:ring-[#4E5426]/15">
            <span className="flex items-center border-r border-[#E3CC9D] bg-[#E3CC9D]/20 px-3 font-body text-[15px] font-semibold text-[#1E2115]">
              +91
            </span>
            <input
              type="tel"
              name="phone"
              inputMode="numeric"
              autoComplete="tel-national"
              required
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="10-digit mobile number"
              className="w-full bg-white px-4 py-3 font-body text-[16px] text-[#1E2115] outline-none"
            />
          </div>
        </label>

        <label className="block">
          <span className="font-body text-[14px] font-semibold text-[#1E2115]">Email</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="font-body text-[14px] font-semibold text-[#1E2115]">Your Concern</span>
          <select
            name="concern"
            required
            value={concern}
            onChange={(e) => setConcern(e.target.value)}
            className={`${inputClass} appearance-none bg-[url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2020%2020'%20fill='%234E5426'%3E%3Cpath%20d='M5.3%207.3a1%201%200%200%201%201.4%200L10%2010.6l3.3-3.3a1%201%200%201%201%201.4%201.4l-4%204a1%201%200%200%201-1.4%200l-4-4a1%201%200%200%201%200-1.4z'/%3E%3C/svg%3E")] bg-[length:18px] bg-[right_14px_center] bg-no-repeat pr-10 ${
              concern ? '' : 'text-[#8A8D80]'
            }`}
          >
            <option value="" disabled>
              Select your concern
            </option>
            {CONCERNS.map((c) => (
              <option key={c} value={c} className="text-[#1E2115]">
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Payment */}
      <div className="mt-4 rounded-2xl border border-[#E3CC9D] bg-[#E3CC9D]/10 p-4">
        <p className="font-heading text-[16px] font-semibold text-[#1E2115]">Payment</p>
        {paymentEnabled ? (
          <div className="mt-3 flex items-start gap-3 rounded-xl border border-[#4E5426] bg-white p-3">
            <FaCircleCheck className="mt-0.5 flex-shrink-0 text-[18px] text-[#4E5426]" aria-hidden="true" />
            <div>
              <p className="font-body text-[15px] font-semibold leading-[1.4] text-[#1E2115]">
                Credit Card / Debit Card / UPI / NetBanking
              </p>
              <p className="mt-1 font-body text-[13.5px] text-[#5F6352]">
                Pay securely through Razorpay on the next step.
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-2 font-body text-[14px] leading-[1.6] text-[#5F6352]">
            No payment is needed now. Our team will contact you on WhatsApp to confirm your consultation
            slot.
          </p>
        )}
        <PaymentBadges className="mt-3" paymentEnabled={paymentEnabled} />
      </div>

      <p className="mt-3 font-body text-[13px] leading-[1.6] text-[#8A8D80]">
        Your personal data will be used to process your booking and support your experience, as described
        in our{' '}
        <a href="/privacy-policy" className="font-semibold text-[#4E5426] underline underline-offset-2">
          privacy policy
        </a>
        .
      </p>

      {error && (
        <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 font-body text-[14px] text-red-700">
          {error}
        </p>
      )}

      <BlobButton
        type="submit"
        disabled={submitting}
        className="mt-4 w-full gap-2 rounded-full px-8 py-3.5 font-body text-[17px] font-semibold shadow-md disabled:opacity-70"
      >
        <FaLock className="text-[14px]" aria-hidden="true" />
        {submitting ? 'Please wait…' : submitLabel}
      </BlobButton>
    </form>
  );
}
