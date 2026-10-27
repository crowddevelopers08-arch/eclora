import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import {
  FaArrowLeft,
  FaCalendarCheck,
  FaCircleCheck,
  FaCircleExclamation,
  FaClipboardList,
  FaLocationDot,
  FaPhone,
  FaUserDoctor,
  FaWhatsapp,
} from 'react-icons/fa6';
import { BlobButton } from '@/components/BlobButton';
import { PaidFooter, container } from '@/components/PaidLanding';
import { SITE } from '@/lib/site';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Booking Confirmed | Eclora Aesthetics',
  description: 'Your skin & hair consultation with Eclora Aesthetics is booked.',
  robots: { index: false, follow: false },
};

/**
 * Thank-you page for the paid funnel (/skin-hair-consultation → checkout → here).
 *
 * The checkout sends ?payment_id=… after /api/razorpay/verify passes. This page
 * re-checks that payment with Razorpay on the server, so the success state and
 * the conversion tags only appear for a real, captured consultation payment —
 * not for someone opening the URL directly.
 *
 * TODO: set PAID_CONVERSION_SEND_TO to the Google Ads "Purchase" conversion
 * ("AW-XXXXXXXXX/label") for paid bookings. Until then only a gtag 'purchase'
 * event is sent.
 */
const PAID_CONVERSION_SEND_TO = '';

type VerifiedPayment = { id: string; amount: number; currency: string; createdAt: number; email?: string };

async function lookupPayment(paymentId: string): Promise<VerifiedPayment | null> {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret || !/^pay_[A-Za-z0-9]+$/.test(paymentId)) return null;

  try {
    const res = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const p = await res.json();
    const paid = p.status === 'captured' || p.status === 'authorized';
    const isConsultation = p.notes?.product === 'Skin & Hair Consultation';
    if (!paid || !isConsultation) return null;
    return { id: p.id, amount: p.amount, currency: p.currency, createdAt: p.created_at, email: p.email };
  } catch {
    return null;
  }
}

const NEXT_STEPS = [
  {
    icon: FaWhatsapp,
    title: 'Slot confirmation on WhatsApp',
    desc: 'Our team will message you shortly to confirm a consultation date and time that suits you.',
  },
  {
    icon: FaUserDoctor,
    title: 'Your 1:1 skin & hair consultation',
    desc: 'A detailed assessment of your concerns, with guidance on suitable treatment options.',
  },
  {
    icon: FaClipboardList,
    title: 'Your personalised treatment plan',
    desc: 'Clear recommendations and next steps, based on your individual assessment and suitability.',
  },
];

function Header() {
  return (
    <header className="w-full border-b border-[#E3CC9D]/60 bg-white">
      <div className={`${container} flex items-center justify-between py-3`}>
        <Link href="/skin-hair-consultation" className="flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={SITE.logo} alt={SITE.name} className="h-10 w-auto object-contain md:h-11" />
        </Link>
        <a
          href={`tel:${SITE.phone}`}
          className="inline-flex items-center gap-2 rounded-full border border-[#4E5426]/25 px-4 py-2 font-body text-[15px] font-semibold text-[#4E5426] transition-colors hover:bg-[#E3CC9D]/20"
        >
          <FaPhone className="text-[13px]" aria-hidden="true" />
          <span className="hidden sm:inline">{SITE.phoneDisplay}</span>
          <span className="sm:hidden">Call</span>
        </a>
      </div>
    </header>
  );
}

function ContactButtons() {
  return (
    <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
      <BlobButton
        href={`https://wa.me/${SITE.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="[--blob-button-color:#25D366] gap-2 rounded-full px-7 py-3.5 font-body text-[16px] font-semibold"
      >
        <FaWhatsapp className="text-[18px]" aria-hidden="true" />
        Chat on WhatsApp
      </BlobButton>
      <a
        href={`tel:${SITE.phone}`}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-[#4E5426]/25 px-7 py-3.5 font-body text-[16px] font-semibold text-[#4E5426] transition-colors hover:border-[#4E5426] hover:bg-[#E3CC9D]/20"
      >
        <FaPhone className="text-[14px]" aria-hidden="true" />
        {SITE.phoneDisplay}
      </a>
    </div>
  );
}

export default async function PaidThankYouPage({ searchParams }: { searchParams: Promise<{ payment_id?: string }> }) {
  const { payment_id = '' } = await searchParams;
  const payment = await lookupPayment(payment_id);

  const amount = payment ? payment.amount / 100 : 0;
  const paidOn = payment
    ? new Date(payment.createdAt * 1000).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : '';

  return (
    <>
      <Header />
      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-[#E3CC9D]/35 blur-3xl" />
          <div className="hs-grid absolute inset-0" />
        </div>

        <section className={`${container} relative py-10 md:py-14`}>
          <div className="mx-auto max-w-[680px] text-center">
            {payment ? (
              <>
                <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#4E5426]/10 md:h-24 md:w-24">
                  <FaCircleCheck className="text-[44px] text-[#4E5426] md:text-[52px]" aria-hidden="true" />
                </span>
                <p className="mt-6 font-label text-[12px] font-semibold uppercase tracking-[0.24em] text-[#4E5426]">
                  Payment Successful
                </p>
                <h1 className="mt-3 font-heading text-[28px] font-bold leading-[1.2] tracking-[-0.02em] text-[#1E2115] sm:text-[40px]">
                  Your Consultation Is <span className="text-[#4E5426]">Booked!</span>
                </h1>
                <p className="mx-auto mt-4 max-w-[560px] font-body text-[16px] leading-[1.75] text-[#5F6352] sm:text-[17px]">
                  Thank you for choosing {SITE.name}. We&rsquo;ve received your payment and our team will
                  be in touch on WhatsApp to confirm your slot.
                </p>

                {/* Payment summary */}
                <dl className="mx-auto mt-7 grid max-w-[520px] gap-px overflow-hidden rounded-2xl border border-[#E3CC9D] bg-[#E3CC9D]/60 text-left sm:grid-cols-3">
                  {[
                    { label: 'Amount paid', value: `₹${amount.toLocaleString('en-IN')}` },
                    { label: 'Paid on', value: paidOn },
                    { label: 'Payment ID', value: payment.id },
                  ].map((row) => (
                    <div key={row.label} className="bg-white px-4 py-3">
                      <dt className="font-label text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8A8D80]">
                        {row.label}
                      </dt>
                      <dd className="mt-1 break-all font-body text-[15px] font-semibold text-[#1E2115]">{row.value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-3 font-body text-[13px] text-[#8A8D80]">
                  {payment.email ? `A receipt has been sent to ${payment.email} by Razorpay. ` : ''}Keep your payment ID
                  for reference.
                </p>
              </>
            ) : (
              <>
                <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#E3CC9D]/30">
                  <FaCircleExclamation className="text-[42px] text-[#4E5426]" aria-hidden="true" />
                </span>
                <h1 className="mt-6 font-heading text-[26px] font-bold leading-[1.25] text-[#1E2115] sm:text-[34px]">
                  We couldn&rsquo;t confirm a payment
                </h1>
                <p className="mx-auto mt-4 max-w-[520px] font-body text-[16px] leading-[1.75] text-[#5F6352]">
                  If you&rsquo;ve just paid and money was deducted, don&rsquo;t worry — contact us with your
                  Razorpay payment ID and we&rsquo;ll confirm your booking right away.
                </p>
                <ContactButtons />
                <Link
                  href="/skin-hair-consultation/checkout"
                  className="mt-6 inline-flex items-center gap-2 font-body text-[15px] font-semibold text-[#4E5426] hover:underline"
                >
                  <FaArrowLeft className="text-[12px]" aria-hidden="true" />
                  Back to booking
                </Link>
              </>
            )}
          </div>

          {payment && (
            <>
              {/* What happens next */}
              <div className="mx-auto mt-10 max-w-[680px] rounded-[1.5rem] border border-[#E3CC9D] bg-white p-5 sm:p-7">
                <h2 className="flex items-center gap-2 font-label text-[13px] font-bold uppercase tracking-[0.18em] text-[#4E5426]">
                  <FaCalendarCheck className="text-[15px]" aria-hidden="true" />
                  What happens next
                </h2>
                <ol className="mt-5 space-y-5">
                  {NEXT_STEPS.map(({ icon: Icon, title, desc }, i) => (
                    <li key={title} className="flex items-start gap-4">
                      <span className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-[#4E5426] text-[#E3CC9D]">
                        <Icon className="text-[19px]" aria-hidden="true" />
                        <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#E3CC9D] font-label text-[10px] font-bold text-[#1E2115]">
                          {i + 1}
                        </span>
                      </span>
                      <div>
                        <p className="font-heading text-[16px] font-semibold text-[#1E2115] sm:text-[17px]">{title}</p>
                        <p className="mt-1 font-body text-[15px] leading-[1.65] text-[#5F6352]">{desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Clinic + contact */}
              <div className="mx-auto mt-6 max-w-[680px] text-center">
                <a
                  href={SITE.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-start gap-2 font-body text-[15px] text-[#5F6352] hover:text-[#4E5426]"
                >
                  <FaLocationDot className="mt-1 flex-shrink-0 text-[14px] text-[#4E5426]" aria-hidden="true" />
                  {SITE.address}
                </a>
                <ContactButtons />
              </div>
            </>
          )}
        </section>
      </main>
      <PaidFooter withMobileBar={false} />

      {payment && (
        <Script id="paid-booking-conversion" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            window.gtag = window.gtag || function(){dataLayer.push(arguments);};
            gtag('event', 'purchase', {
              transaction_id: ${JSON.stringify(payment.id)},
              value: ${amount},
              currency: ${JSON.stringify(payment.currency)},
              items: [{ item_name: 'Skin & Hair Consultation', price: ${amount}, quantity: 1 }]
            });
            ${
              PAID_CONVERSION_SEND_TO
                ? `gtag('event', 'conversion', { send_to: ${JSON.stringify(PAID_CONVERSION_SEND_TO)}, value: ${amount}, currency: ${JSON.stringify(payment.currency)}, transaction_id: ${JSON.stringify(payment.id)} });`
                : ''
            }
          `}
        </Script>
      )}
    </>
  );
}
