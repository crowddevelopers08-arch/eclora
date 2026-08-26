'use client';
import { useState } from 'react';
import { SITE } from '@/lib/site';
import { BlobButton } from '@/components/BlobButton';

const navLinks = [
  { label: 'Results', href: '#results' },
  { label: 'Why Eclora', href: '#why-eclora' },
  { label: 'Treatments', href: '#treatments' },
  { label: 'Journey', href: '#journey' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-[#E3CC9D] bg-white shadow-sm transition-all duration-300">
      <nav className="mx-auto flex w-full max-w-[1280px] items-center justify-between px-4 py-3 sm:px-6 md:px-[60px] md:py-4">

        {/* Logo */}
        <a href="#top" className="flex-shrink-0">
          {SITE.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={SITE.logo} alt={SITE.name} className="h-10 w-auto object-contain md:h-12" />
          ) : (
            <span className="font-heading text-[19px] font-bold uppercase tracking-[0.18em] text-[#4E5426] md:text-[22px]">
              Eclora
            </span>
          )}
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center lg:flex lg:gap-5 xl:gap-7">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-body relative whitespace-nowrap py-1 text-[13px] font-semibold tracking-[0.04em] text-[#5F6352] transition-colors duration-200 hover:text-[#4E5426] xl:text-[14px]"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA + hamburger */}
        <div className="flex items-center gap-3">
          <BlobButton
            href="#consultation"
            className="font-body hidden rounded-full px-5 py-2.5 text-[14px] font-semibold shadow-sm sm:inline-flex md:px-6 md:py-3 lg:px-5 lg:text-[14px] xl:px-7 xl:text-[15px]"
          >
            Book Your Consultation
          </BlobButton>

          <BlobButton
            className="flex h-9 w-9 items-center justify-center rounded-md lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-[26px]">
              {menuOpen ? 'close' : 'menu'}
            </span>
          </BlobButton>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="border-t border-[#E3CC9D] bg-white px-4 pb-5 pt-3 sm:px-6 lg:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-body block rounded-lg px-3 py-2.5 text-[15px] font-semibold text-[#1E2115] transition-colors hover:bg-[#E3CC9D]/20 hover:text-[#4E5426]"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <BlobButton
              href="#consultation"
              className="font-body mt-3 inline-flex justify-center rounded-full px-5 py-2.5 text-[15px] font-semibold"
              onClick={() => setMenuOpen(false)}
            >
              Book Your Consultation
            </BlobButton>
          </div>
        </div>
      )}
    </header>
  );
}
