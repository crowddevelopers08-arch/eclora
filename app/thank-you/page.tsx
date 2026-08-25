import Link from 'next/link';
import Script from 'next/script';
import { SITE } from '@/lib/site';

export const metadata = {
  title: 'Thank You | Eclora Aesthetics',
  description:
    'Thank you for booking with Eclora Aesthetics. Our aesthetic team will be in touch with you shortly.',
};

const NEXT_STEPS = [
  {
    icon: 'phone_in_talk',
    title: 'Confirmation Call',
    desc: 'Our team will call you to confirm your appointment time and understand your concern in more detail.',
  },
  {
    icon: 'assignment',
    title: 'Personalised Assessment',
    desc: 'We evaluate your skin, hair, or body concern and map out a treatment roadmap built around your goals.',
  },
  {
    icon: 'verified',
    title: 'Your Customised Treatment Plan',
    desc: 'Receive a tailored plan with full transparency on the treatment, number of sessions, and aftercare.',
  },
];

export default function ThankYouPage() {
  return (
    <main className="flex min-h-screen flex-col bg-white">

      {/* Header */}
      <header className="w-full border-b border-[#E3CC9D] bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-4 sm:px-6 md:px-[80px] md:py-5">
          <Link href="/">
            {SITE.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt={SITE.name} className="h-11 w-auto object-contain md:h-12" src={SITE.logo} />
            ) : (
              <span className="font-heading text-[20px] font-bold uppercase tracking-[0.18em] text-[#4E5426] md:text-[22px]">
                Eclora
              </span>
            )}
          </Link>
          <a
            href={`tel:${SITE.phone}`}
            className="inline-flex items-center gap-2 rounded-full bg-[#4E5426] px-4 py-2 font-body text-[13px] font-semibold text-white transition-colors hover:bg-[#4E5426]/90 sm:px-5 sm:py-2.5 sm:text-[14px]"
          >
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: '"FILL" 1' }}>call</span>
            Call Now
          </a>
        </div>
      </header>

      {/* Main content */}
      <section className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6 md:px-[80px] lg:py-14">
        <div className="mx-auto w-full max-w-[640px] text-center">

          {/* Success icon */}
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-[#E3CC9D]/20 md:h-24 md:w-24">
            <span
              className="material-symbols-outlined text-[46px] text-[#4E5426] md:text-[52px]"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              check_circle
            </span>
          </div>

          <h1 className="font-heading text-[32px] font-bold tracking-[-0.01em] leading-[1.2] text-[#1E2115] sm:text-[40px] md:text-[46px]">
            You&rsquo;re All Set!
          </h1>
          <p className="mt-3 font-label text-[13px] font-semibold uppercase tracking-[0.16em] text-[#4E5426]/70">
            Consultation Request Received
          </p>

          <p className="mt-5 font-body text-[16px] leading-[1.85] text-[#5F6352]">
            Thank you for choosing{' '}
            <span className="font-semibold text-[#4E5426]">{SITE.name}</span>. Our team will reach
            out to you shortly to confirm your consultation and understand your aesthetic goals
            better.
          </p>

          {/* What happens next */}
          <div className="mt-10 rounded-[1.25rem] border border-[#E3CC9D] bg-white p-6 text-left md:mt-12 md:p-8">
            <h2 className="mb-5 font-heading text-[12px] font-bold uppercase tracking-[0.18em] text-[#4E5426]">
              What Happens Next
            </h2>
            <ul className="space-y-5">
              {NEXT_STEPS.map(({ icon, title, desc }) => (
                <li key={title} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#E3CC9D]/20">
                    <span
                      className="material-symbols-outlined text-[21px] text-[#4E5426]"
                      style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                      {icon}
                    </span>
                  </div>
                  <div>
                    <p className="font-body text-[15px] font-semibold leading-[1.4] text-[#1E2115] md:text-[16px]">
                      {title}
                    </p>
                    <p className="mt-0.5 font-body text-[14px] leading-[1.7] text-[#5F6352]">
                      {desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* CTAs */}
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center md:mt-10">
            <a
              href={`https://wa.me/${SITE.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-8 py-3.5 font-body text-[14px] font-semibold text-white transition-opacity hover:opacity-90 sm:w-auto"
            >
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat on WhatsApp
            </a>
            <Link
              href="/"
              className="flex w-full items-center justify-center gap-2 rounded-full border border-[#E3CC9D] px-8 py-3.5 font-body text-[14px] font-semibold text-[#4E5426] transition-colors hover:bg-[#E3CC9D]/20 sm:w-auto"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Back to Home
            </Link>
          </div>

          <p className="mt-10 font-body text-[14px] text-[#8A8D80]">
            Need immediate assistance?{' '}
            <a href={`tel:${SITE.phone}`} className="font-semibold text-[#4E5426] hover:underline">
              Call us now
            </a>
          </p>
        </div>
      </section>

      {/* Footer strip */}
      <footer className="border-t border-[#E3CC9D] px-4 py-6 text-center sm:px-6 md:px-[80px]">
        <p className="font-body text-[13px] text-[#8A8D80]">
          © {new Date().getFullYear()} {SITE.name}. All rights reserved.
        </p>
      </footer>

      {/* Google Ads Conversion */}
      <Script id="google-ads-conversion" strategy="afterInteractive">
        {`
          gtag('event', 'conversion', {
            'send_to': 'AW-17425479208/HZA8CPiu6LQcEKjsjvVA',
            'value': 1.0,
            'currency': 'INR'
          });
        `}
      </Script>
    </main>
  );
}
