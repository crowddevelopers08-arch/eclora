import { AnimateOnScroll } from '@/components/AnimateOnScroll';
import { BlobButton } from '@/components/BlobButton';
import { SITE } from '@/lib/site';

const treatments = [
  { label: 'Pigmentation Treatments', href: '#treatments' },
  { label: 'Laser Hair Reduction',    href: '#treatments' },
  { label: 'HIFU Skin Tightening',    href: '#treatments' },
  { label: 'Duet Exosomes Therapy',   href: '#treatments' },
  { label: 'Laser Toning',            href: '#treatments' },
  { label: 'Party Peel Facial',       href: '#treatments' },
  { label: 'Hair Regrowth (PRP/GFC)', href: '#treatments' },
];

const quickLinks = [
  { label: 'Real Results',   href: '#results' },
  { label: 'Why Eclora',     href: '#why-eclora' },
  { label: 'Your Journey',   href: '#journey' },
  { label: 'Testimonials',   href: '#testimonials' },
  { label: 'FAQ',            href: '#faq' },
  { label: 'Book Consultation', href: '#consultation' },
];

export function Footer() {
  return (
    <footer className="bg-[#333719]">
      <AnimateOnScroll
        animation="fade-up"
        className="mx-auto grid max-w-[1280px] grid-cols-1 gap-8 px-4 py-8 sm:grid-cols-2 sm:px-6 md:gap-10 md:px-[60px] lg:grid-cols-4"
      >
        {/* Brand */}
        <div className="space-y-5 sm:col-span-2 lg:col-span-1">
          {SITE.logoLight ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={SITE.logoLight} alt={SITE.name} className="h-10 w-auto object-contain md:h-12" />
          ) : (
            <span className="block font-heading text-[22px] font-bold uppercase tracking-[0.18em] text-white">
              Eclora
            </span>
          )}

          <p className="font-body max-w-[280px] text-[16px] leading-[1.8] text-[#E3CC9D]/70">
            Advanced skin, hair and body treatments delivered through personalised plans, expert
            guidance, and a premium patient experience.
          </p>

          <div className="flex gap-3 pt-1">
            <a
              href={SITE.instagram}
              aria-label={`${SITE.name} on Instagram`}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E3CC9D]/30 text-[#E3CC9D]/70 transition-colors hover:border-[#E3CC9D] hover:text-[#E3CC9D]"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a
              href={SITE.facebook}
              aria-label={`${SITE.name} on Facebook`}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E3CC9D]/30 text-[#E3CC9D]/70 transition-colors hover:border-[#E3CC9D] hover:text-[#E3CC9D]"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Treatments */}
        <div className="space-y-5">
          <h4 className="font-label text-[13px] font-semibold uppercase tracking-[0.22em] text-[#E3CC9D]">
            Our Treatments
          </h4>
          <ul className="space-y-3">
            {treatments.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="font-body flex items-center gap-2 text-[16px] leading-[1.5] text-[#E3CC9D]/70 transition-colors hover:text-[#E3CC9D]"
                >
                  <span className="h-1 w-1 flex-shrink-0 rounded-full bg-[#E3CC9D]/50" />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick links */}
        <div className="space-y-5">
          <h4 className="font-label text-[13px] font-semibold uppercase tracking-[0.22em] text-[#E3CC9D]">
            Quick Links
          </h4>
          <ul className="space-y-3">
            {quickLinks.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="font-body flex items-center gap-2 text-[16px] leading-[1.5] text-[#E3CC9D]/70 transition-colors hover:text-[#E3CC9D]"
                >
                  <span className="h-1 w-1 flex-shrink-0 rounded-full bg-[#E3CC9D]/50" />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-5">
          <h4 className="font-label text-[13px] font-semibold uppercase tracking-[0.22em] text-[#E3CC9D]">
            Contact Us
          </h4>

          <div className="space-y-4">
            <a href={`tel:${SITE.phone}`} className="group flex items-start gap-3">
              <span className="material-symbols-outlined mt-0.5 text-[19px] text-[#E3CC9D]" style={{ fontVariationSettings: '"FILL" 1' }}>call</span>
              <span className="font-body text-[16px] leading-[1.6] text-[#E3CC9D]/70 transition-colors group-hover:text-[#E3CC9D]">
                {SITE.phoneDisplay}
              </span>
            </a>

            <a href={`mailto:${SITE.email}`} className="group flex items-start gap-3">
              <span className="material-symbols-outlined mt-0.5 text-[19px] text-[#E3CC9D]" style={{ fontVariationSettings: '"FILL" 1' }}>mail</span>
              <span className="font-body break-all text-[16px] leading-[1.6] text-[#E3CC9D]/70 transition-colors group-hover:text-[#E3CC9D]">
                {SITE.email}
              </span>
            </a>

            <a
              href={SITE.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3"
            >
              <span className="material-symbols-outlined mt-0.5 text-[19px] text-[#E3CC9D]" style={{ fontVariationSettings: '"FILL" 1' }}>location_on</span>
              <span className="font-body text-[16px] leading-[1.6] text-[#E3CC9D]/70 transition-colors group-hover:text-[#E3CC9D]">
                {SITE.address}
              </span>
            </a>

            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined mt-0.5 text-[19px] text-[#E3CC9D]" style={{ fontVariationSettings: '"FILL" 1' }}>schedule</span>
              <span className="font-body text-[16px] leading-[1.6] text-[#E3CC9D]/70">
                {SITE.hours}
              </span>
            </div>
          </div>

          <BlobButton
            href="#consultation"
            className="[--blob-button-color:#E3CC9D] font-body mt-2 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[16px] font-semibold shadow-sm"
          >
            Book Your Consultation
            <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
          </BlobButton>
        </div>
      </AnimateOnScroll>

      <div className="border-t border-[#E3CC9D]/15">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-3 px-4 py-4 sm:flex-row sm:px-6 md:px-[60px]">
          <p className="font-body text-[15px] text-[#E3CC9D]/50">
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <a
            className="font-label text-[14px] font-semibold uppercase tracking-[0.14em] text-[#E3CC9D]/50 transition-colors hover:text-[#E3CC9D]"
            href="/privacy-policy"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}
