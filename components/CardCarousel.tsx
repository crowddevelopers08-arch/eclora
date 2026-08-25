'use client';
import { useRef, useState, useCallback, useEffect } from 'react';

interface Props {
  children: React.ReactNode[];
  dotColor?: string;
  interval?: number;
  btnTop?: string;
}

export function CardCarousel({
  children,
  dotColor = '#E3CC9D',
  interval = 3000,
  btnTop = '120px',
}: Props) {
  const count = children.length;
  const [active, setActive] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isJumping = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollSettleRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Infinite loop: clone last before first, first after last
  const slides = [children[count - 1], ...children, children[0]];

  const scrollToIdx = useCallback((idx: number, animate: boolean) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: idx * el.offsetWidth, behavior: animate ? 'smooth' : 'auto' });
  }, []);

  // Start at real slide 0 (index 1 in cloned array)
  useEffect(() => {
    scrollToIdx(1, false);
  }, [scrollToIdx]);

  // Auto-advance
  const advance = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.offsetWidth);
    el.scrollTo({ left: (idx + 1) * el.offsetWidth, behavior: 'smooth' });
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(advance, interval);
  }, [advance, interval]);

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startTimer]);

  // After scroll settles, handle infinite loop jump
  const handleScroll = () => {
    if (isJumping.current) return;
    if (scrollSettleRef.current) clearTimeout(scrollSettleRef.current);
    scrollSettleRef.current = setTimeout(() => {
      const el = scrollRef.current;
      if (!el) return;
      const idx = Math.round(el.scrollLeft / el.offsetWidth);
      if (idx === 0) {
        isJumping.current = true;
        el.scrollTo({ left: count * el.offsetWidth, behavior: 'auto' });
        setActive(count - 1);
        setTimeout(() => { isJumping.current = false; }, 50);
      } else if (idx === count + 1) {
        isJumping.current = true;
        el.scrollTo({ left: el.offsetWidth, behavior: 'auto' });
        setActive(0);
        setTimeout(() => { isJumping.current = false; }, 50);
      } else {
        setActive(idx - 1);
      }
    }, 80);
  };

  const handlePrev = () => {
    startTimer();
    const el = scrollRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.offsetWidth);
    scrollToIdx(idx - 1, true);
  };

  const handleNext = () => {
    startTimer();
    const el = scrollRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.offsetWidth);
    scrollToIdx(idx + 1, true);
  };

  const handleDot = (realIndex: number) => {
    startTimer();
    scrollToIdx(realIndex + 1, true);
    setActive(realIndex);
  };

  return (
    <div className="relative w-full">
      {/* Slides */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {slides.map((child, i) => (
          <div key={i} className="w-full flex-shrink-0" style={{ scrollSnapAlign: 'start' }}>
            {child}
          </div>
        ))}
      </div>

      {/* Prev button */}
      <button
        onClick={handlePrev}
        aria-label="Previous"
        className="absolute left-2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white shadow-md backdrop-blur-sm transition-all hover:bg-black/50 active:scale-90"
        style={{ top: btnTop }}
      >
        <span className="material-symbols-outlined text-[22px]">chevron_left</span>
      </button>

      {/* Next button */}
      <button
        onClick={handleNext}
        aria-label="Next"
        className="absolute right-2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white shadow-md backdrop-blur-sm transition-all hover:bg-black/50 active:scale-90"
        style={{ top: btnTop }}
      >
        <span className="material-symbols-outlined text-[22px]">chevron_right</span>
      </button>

      {/* Dot indicators */}
      <div className="mt-5 flex justify-center gap-2">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            onClick={() => handleDot(i)}
            aria-label={`Slide ${i + 1}`}
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: i === active ? '24px' : '8px',
              backgroundColor: i === active ? dotColor : dotColor + '40',
            }}
          />
        ))}
      </div>
    </div>
  );
}
