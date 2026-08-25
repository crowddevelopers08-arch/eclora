'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { LeadForm } from '@/components/LeadForm';

/** Anchors that should open the popup instead of jumping to the inline form. */
const CTA_SELECTOR = 'a[href="#consultation"], a[href="/#consultation"]';

/**
 * Consultation popup.
 *
 * Mounted once in the root layout. Rather than rewiring ~15 CTA anchors across
 * the site, it listens for clicks on any link pointing at #consultation and
 * opens the modal instead. The inline LeadFormSection is untouched and still
 * works on its own — this only intercepts the jump-to links.
 */
export function ConsultationModal() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const close = useCallback(() => setOpen(false), []);

  /* Intercept CTA clicks anywhere on the page. */
  useEffect(() => {
    function onClick(e: MouseEvent) {
      // Let modified clicks (new tab, etc.) and already-handled clicks through.
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const target = e.target as HTMLElement | null;
      const link = target?.closest?.(CTA_SELECTOR);
      if (!link) return;

      e.preventDefault();
      lastFocused.current = link as HTMLElement;
      setOpen(true);
    }

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  /* Escape to close, and lock the page behind the modal. */
  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
    }

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);

    // Focus the close button so keyboard users start inside the dialog.
    const t = window.setTimeout(() => closeRef.current?.focus(), 0);

    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', onKeyDown);
      window.clearTimeout(t);
      lastFocused.current?.focus?.();
    };
  }, [open, close]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto overscroll-contain bg-[#1E2115]/60 px-4 py-8 backdrop-blur-sm sm:items-center sm:py-10"
      onMouseDown={(e) => {
        // Only close on a click that starts on the backdrop itself.
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="consultation-modal-title"
        className="relative my-auto w-full max-w-[540px] rounded-[1.75rem] bg-white p-6 shadow-2xl sm:p-8"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-[#4E5426] transition-colors hover:bg-[#E3CC9D]/25"
        >
          <span className="material-symbols-outlined text-[22px]">close</span>
        </button>

        <div className="mb-6 pr-10 text-left">
          <span className="font-label text-[10px] font-bold uppercase tracking-[0.22em] text-[#4E5426]">
            Book Your Consultation
          </span>
          <h2
            id="consultation-modal-title"
            className="mt-2 font-heading text-[22px] font-bold leading-[1.2] tracking-[-0.01em] text-[#1E2115] sm:text-[26px]"
          >
            Begin Your Transformation <span className="text-[#4E5426]">Today</span>
          </h2>
          <p className="mt-2 font-body text-[13px] leading-[1.75] text-[#5F6352] sm:text-[14px]">
            Share a few details and our team will reach out to recommend the right treatment plan
            for you.
          </p>
        </div>

        <LeadForm idPrefix="modal" source="Eclora Aesthetics LP — Popup" stacked onSuccess={close} />
      </div>
    </div>
  );
}
