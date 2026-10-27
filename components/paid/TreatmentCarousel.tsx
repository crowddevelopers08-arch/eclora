'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

/** Time each slide stays up before auto-advancing. */
const AUTOPLAY_MS = 5000;
import { FaArrowRight, FaCheck, FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import { BlobButton } from '@/components/BlobButton';
import { CHECKOUT_HREF } from '@/lib/paidOffer';

export type Treatment = {
  name: string;
  /** A rendered icon element — component references can't cross the server → client boundary. */
  icon: ReactNode;
  /** Treatment photo; when set it replaces the icon tile. */
  image?: string;
  /** CSS object-position for the 16:9 crop, e.g. 'center 70%' to keep a face in frame. */
  imagePosition?: string;
  heading?: string;
  intro: string[];
  listLabel: string;
  items: string[];
};

/**
 * One treatment per slide; swipe on touch, arrows and dots everywhere.
 * Auto-advances and loops, pausing while the visitor hovers, touches or
 * focuses inside it, and staying put for prefers-reduced-motion.
 */
export function TreatmentCarousel({ treatments }: { treatments: Treatment[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const next = (i + treatments.length) % treatments.length;
    el.scrollTo({ left: next * el.offsetWidth, behavior: 'smooth' });
  }, [treatments.length]);

  const onScroll = () => {
    const el = trackRef.current;
    if (el) setActive(Math.round(el.scrollLeft / el.offsetWidth));
  };

  // Re-armed whenever the slide changes, so a manual jump restarts the countdown.
  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setTimeout(() => goTo(active + 1), AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [active, paused, goTo]);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
      }}
    >
      {/* Tabs — quick jump on larger screens */}
      <div className="mb-6 hidden flex-wrap justify-center gap-2 md:flex">
        {treatments.map((t, i) => (
          <button
            key={t.name}
            type="button"
            onClick={() => goTo(i)}
            className={`rounded-full border px-4 py-2 font-body text-[14px] font-semibold transition-colors ${
              i === active
                ? 'border-[#4E5426] bg-[#4E5426] text-[#E3CC9D]'
                : 'border-[#E3CC9D] bg-white text-[#4E5426] hover:bg-[#E3CC9D]/20'
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {treatments.map((t, i) => {
          return (
            <article
              key={t.name}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${treatments.length}: ${t.name}`}
              className="w-full flex-shrink-0 snap-start px-0.5"
            >
              {/* Photo on the left (fills the card height on desktop), all copy in the olive panel */}
              <div className="grid h-full overflow-hidden rounded-[1.75rem] border border-[#E3CC9D] bg-[#4E5426] md:grid-cols-[0.85fr_1.15fr]">
                <div className="relative aspect-[16/10] md:aspect-auto">
                  {t.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={t.image}
                      alt={`${t.name} at Eclora Aesthetics`}
                      loading={i === 0 ? 'eager' : 'lazy'}
                      className="absolute inset-0 h-full w-full object-cover"
                      style={{ objectPosition: t.imagePosition ?? 'center' }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#E3CC9D]/25 text-[56px] text-[#E3CC9D]" aria-hidden="true">
                      {t.icon}
                    </div>
                  )}
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 font-label text-[12px] font-semibold uppercase tracking-[0.2em] text-[#4E5426] backdrop-blur">
                    {String(i + 1).padStart(2, '0')} / {String(treatments.length).padStart(2, '0')}
                  </span>
                </div>

                <div className="flex flex-col justify-center p-5 text-white sm:p-8 lg:px-10 lg:py-9">
                  <h3 className="font-heading text-[22px] font-bold leading-[1.2] sm:text-[30px]">{t.name}</h3>
                  {t.heading && (
                    <p className="mt-1.5 font-heading text-[16px] font-semibold leading-[1.4] text-[#E3CC9D] sm:text-[19px]">
                      {t.heading}
                    </p>
                  )}
                  {t.intro.map((p) => (
                    <p key={p} className="mt-2.5 font-body text-[15px] leading-[1.65] text-white/80 sm:mt-3 sm:text-[15.5px] sm:leading-[1.7]">
                      {p}
                    </p>
                  ))}

                  <p className="mt-4 font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E3CC9D] sm:mt-5 sm:text-[12px] sm:tracking-[0.2em]">
                    {t.listLabel}
                  </p>
                  <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 sm:gap-x-6 sm:gap-y-2.5">
                    {t.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 font-body text-[14.5px] leading-[1.45] text-white/90 sm:gap-3 sm:text-[15.5px] sm:leading-[1.5]">
                        <span className="mt-0.5 flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full bg-[#E3CC9D] text-[#4E5426] sm:h-5 sm:w-5">
                          <FaCheck className="text-[9px] sm:text-[10px]" aria-hidden="true" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <BlobButton
                    href={CHECKOUT_HREF}
                    className="mt-6 gap-2 self-start rounded-full !bg-[#E3CC9D] px-7 py-3.5 font-body text-[16px] font-semibold !text-[#1E2115]"
                  >
                    Book Now
                    <FaArrowRight className="text-[14px]" aria-hidden="true" />
                  </BlobButton>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => goTo(active - 1)}
          aria-label="Previous treatment"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#4E5426]/30 text-[#4E5426] transition-colors hover:bg-[#4E5426] hover:text-[#E3CC9D]"
        >
          <FaChevronLeft className="text-[14px]" aria-hidden="true" />
        </button>
        <div className="flex gap-2">
          {treatments.map((t, i) => (
            <button
              key={t.name}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show ${t.name}`}
              className={`h-2 rounded-full transition-all duration-300 ${i === active ? 'w-6 bg-[#4E5426]' : 'w-2 bg-[#4E5426]/25'}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => goTo(active + 1)}
          aria-label="Next treatment"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#4E5426]/30 text-[#4E5426] transition-colors hover:bg-[#4E5426] hover:text-[#E3CC9D]"
        >
          <FaChevronRight className="text-[14px]" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
