'use client';

import { useEffect, useRef } from 'react';
import { BlobButton } from '@/components/BlobButton';

type ManualCarouselProps = {
  children: React.ReactNode;
  duration?: number;
  className?: string;
};

export function ManualCarousel({ children, duration = 38, className = '' }: ManualCarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const resumeAtRef = useRef(0);
  const touchingRef = useRef(false);
  const dragRef = useRef({ active: false, startX: 0, startScrollLeft: 0 });

  const pauseAutoScroll = () => {
    resumeAtRef.current = Date.now() + 5000;
  };

  useEffect(() => {
    let frame = 0;
    let previousTime = performance.now();

    const tick = (time: number) => {
      const viewport = viewportRef.current;
      const elapsed = time - previousTime;
      previousTime = time;

      // Never write scrollLeft while a finger is down — on iOS that cancels
      // the page's vertical momentum scroll.
      if (viewport && !touchingRef.current && Date.now() >= resumeAtRef.current) {
        const loopWidth = viewport.scrollWidth / 2;
        if (loopWidth > 0) {
          viewport.scrollLeft += (loopWidth / (duration * 1000)) * elapsed;
          if (viewport.scrollLeft >= loopWidth) viewport.scrollLeft -= loopWidth;
        }
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [duration]);

  const moveBy = (amount: number) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    pauseAutoScroll();
    viewport.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <div className={`manual-carousel ${className}`}>
      <div
        ref={viewportRef}
        className="manual-carousel__viewport"
        onWheel={pauseAutoScroll}
        onTouchStart={() => { touchingRef.current = true; pauseAutoScroll(); }}
        onTouchEnd={() => { touchingRef.current = false; pauseAutoScroll(); }}
        onTouchCancel={() => { touchingRef.current = false; pauseAutoScroll(); }}
        onPointerDown={(event) => {
          if (event.pointerType === 'mouse') {
            dragRef.current = { active: true, startX: event.clientX, startScrollLeft: event.currentTarget.scrollLeft };
            event.currentTarget.setPointerCapture(event.pointerId);
          }
          pauseAutoScroll();
        }}
        onPointerMove={(event) => {
          if (!dragRef.current.active) return;
          event.currentTarget.scrollLeft = dragRef.current.startScrollLeft - (event.clientX - dragRef.current.startX);
        }}
        onPointerUp={() => { dragRef.current.active = false; }}
        onPointerCancel={() => { dragRef.current.active = false; }}
      >
        <div className="manual-carousel__track">
          {children}
          {children}
        </div>
      </div>

      <div className="manual-carousel__controls">
        <BlobButton type="button" onClick={() => moveBy(-300)} aria-label="Scroll carousel left" className="manual-carousel__arrow">
          <span className="material-symbols-outlined text-[22px]">chevron_left</span>
        </BlobButton>
        <BlobButton type="button" onClick={() => moveBy(300)} aria-label="Scroll carousel right" className="manual-carousel__arrow">
          <span className="material-symbols-outlined text-[22px]">chevron_right</span>
        </BlobButton>
      </div>
    </div>
  );
}
