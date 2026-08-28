'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { BlobButton } from '@/components/BlobButton';

/**
 * Full-bleed banner carousel.
 *
 * Every slide carries two creatives: a wide one for tablets and desktops and a
 * separate portrait one for phones. The swap happens in `<picture>` rather than
 * in JS, so the browser downloads only the creative it will actually paint and
 * the correct art direction is already in the first server-rendered HTML.
 *
 * Slides scroll natively with scroll-snap — swipe and momentum come free — and
 * the auto-advance only writes `scrollLeft` while no finger is down, otherwise
 * it cancels the page's vertical momentum scroll on iOS.
 */
type Banner = {
  id: number;
  /** Sentence describing the creative, not "banner 1" — it is read aloud. */
  alt: string;
  /** Wide creative (≥768px), served from `public/`. */
  desktop: string;
  /** Portrait creative (<768px), served from `public/`. */
  mobile: string;
  /** Optional destination — a slide with no href renders as a plain image. */
  href?: string;
};

/**
 * Files live in `public/banners/`; the path here is what the browser requests,
 * so it starts at `/banners/…` — `public` itself is never part of the URL.
 * Export the desktop creatives around 1600px wide and the portrait ones around
 * 900px, since nothing renders larger than that.
 */
const BANNERS: Banner[] = [
  {
    id: 1,
    alt: 'Advanced skin, hair and body treatments at Eclora Aesthetics',
    desktop: '/mainban1.png',
    mobile: '/ecban1.png',
    href: '#consultation',
  },
  {
    id: 2,
    alt: 'Laser hair reduction packages at Eclora Aesthetics',
    desktop: '/mainban2.png',
    mobile: '/ecban2.png',
    href: '#treatments',
  },
  {
    id: 3,
    alt: 'Book a consultation with the Eclora Aesthetics team',
    desktop: '/mainban3.png',
    mobile: '/ecban3.png',
    href: '#consultation',
  },
];

/** How long each slide holds before the carousel advances. */
const INTERVAL = 5000;

/**
 * Reserves the slide's height before the image loads, so the page below does
 * not jump. These must track the creatives' real proportions — the portrait
 * exports are 1086×1448 and the wide ones ~1900×828 — or `object-cover` crops
 * the difference away. Re-export at a different shape and this is the one line
 * to change.
 */
const ASPECT = 'aspect-[1086/1448] md:aspect-[1900/828]';

function BannerImage({ banner }: { banner: Banner }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={`flex w-full items-center justify-center bg-[#E3CC9D]/20 ${ASPECT}`}>
        <span
          className="material-symbols-outlined text-[38px] text-[#4E5426]/25"
          style={{ fontVariationSettings: '"FILL" 1' }}
        >
          wallpaper
        </span>
      </div>
    );
  }

  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={banner.desktop} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={banner.mobile}
        alt={banner.alt}
        loading={banner.id === 1 ? 'eager' : 'lazy'}
        onError={() => setFailed(true)}
        className={`w-full object-cover ${ASPECT}`}
      />
    </picture>
  );
}

export function BannerCarousel() {
  const [active, setActive] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const touchingRef = useRef(false);
  const hoveringRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((index: number) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const target = ((index % BANNERS.length) + BANNERS.length) % BANNERS.length;
    viewport.scrollTo({ left: target * viewport.clientWidth, behavior: 'smooth' });
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const viewport = viewportRef.current;
      // Never scroll under a finger, and leave a hovered banner alone so a
      // reader can finish it.
      if (!viewport || touchingRef.current || hoveringRef.current) return;
      const index = Math.round(viewport.scrollLeft / viewport.clientWidth);
      goTo(index + 1);
    }, INTERVAL);
  }, [goTo]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  // Keep the dots in step with wherever the scroll actually landed, whether it
  // got there from a swipe, an arrow, or the timer.
  const handleScroll = () => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    setActive(Math.round(viewport.scrollLeft / viewport.clientWidth));
  };

  const step = (delta: number) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    startTimer();
    goTo(Math.round(viewport.scrollLeft / viewport.clientWidth) + delta);
  };

  return (
    // The header is fixed, so the first section on the page owes it that much
    // top padding or it renders underneath. Matches the 65px / 81px the header
    // measures at each breakpoint. If HeroSection is ever restored above this,
    // the padding belongs on whichever section comes first — not on both.
    <section
      id="top"
      aria-label="Featured banners"
      aria-roledescription="carousel"
      className="bg-white pt-[65px] md:pt-[81px]"
    >
      <div className="relative">
        <div
          ref={viewportRef}
          onScroll={handleScroll}
          onTouchStart={() => { touchingRef.current = true; }}
          onTouchEnd={() => { touchingRef.current = false; startTimer(); }}
          onTouchCancel={() => { touchingRef.current = false; startTimer(); }}
          onMouseEnter={() => { hoveringRef.current = true; }}
          onMouseLeave={() => { hoveringRef.current = false; }}
          className="flex w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ touchAction: 'pan-x pan-y' }}
        >
          {BANNERS.map((banner, index) => (
            <div
              key={banner.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${BANNERS.length}`}
              className="w-full flex-shrink-0 snap-start"
            >
              {banner.href ? (
                <a href={banner.href} className="block">
                  <BannerImage banner={banner} />
                </a>
              ) : (
                <BannerImage banner={banner} />
              )}
            </div>
          ))}
        </div>

        {/* Arrows overlay the banner from tablet up; phones get the swipe and dots. */}
        <div className="pointer-events-none absolute inset-0 hidden items-center justify-between px-4 md:flex md:px-6">
          <BlobButton
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous banner"
            className="manual-carousel__arrow pointer-events-auto"
          >
            <span className="material-symbols-outlined text-[22px]">chevron_left</span>
          </BlobButton>
          <BlobButton
            type="button"
            onClick={() => step(1)}
            aria-label="Next banner"
            className="manual-carousel__arrow pointer-events-auto"
          >
            <span className="material-symbols-outlined text-[22px]">chevron_right</span>
          </BlobButton>
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {BANNERS.map((banner, index) => (
          <button
            key={banner.id}
            type="button"
            onClick={() => { startTimer(); goTo(index); }}
            aria-label={`Go to banner ${index + 1}`}
            aria-current={index === active}
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: index === active ? '24px' : '8px',
              backgroundColor: index === active ? '#E3CC9D' : 'rgba(227, 204, 157, 0.4)',
            }}
          />
        ))}
      </div>
    </section>
  );
}
