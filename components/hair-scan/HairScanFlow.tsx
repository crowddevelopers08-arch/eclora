'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { BlobButton } from '@/components/BlobButton';
import { SITE } from '@/lib/site';
import { PHOTO_VIEWS, type PhotoViewId, type ScanAnswers, type ScanPhotos } from '@/lib/hairScan';
import { ScanQuiz } from './ScanQuiz';
import { PhotoCapture } from './PhotoCapture';
import { ScanResult } from './ScanResult';

type Step = 'quiz' | 'photos' | 'saving' | 'result';

/** Any link to this hash opens the scan instead of jumping. */
const START_SELECTOR = 'a[href="#start-scan"]';

const SAVING_STAGES = ['Uploading your photos securely', 'Saving your hair profile', 'Preparing your summary'];

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Full-screen hair scan: questions → photo capture → save → summary.
 * Mounted once on /hair-scan; the landing page's "#start-scan" links open it.
 */
export function HairScanFlow() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>('quiz');
  const [answers, setAnswers] = useState<ScanAnswers>({});
  const [photos, setPhotos] = useState<ScanPhotos>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savingStage, setSavingStage] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const reset = useCallback(() => {
    setStep('quiz');
    setAnswers({});
    setPhotos({});
    setSaveError(null);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    // Clear a finished scan so the next open starts fresh; keep a half-done one.
    if (step === 'result') reset();
  }, [step, reset]);

  /* Intercept "#start-scan" clicks anywhere on the page. */
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as HTMLElement | null)?.closest?.(START_SELECTOR);
      if (!link) return;
      e.preventDefault();
      setOpen(true);
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  /* Lock page scroll behind the overlay, and keep each step starting at the top. */
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [step]);

  /* Cycle the saving messages while the upload runs. */
  useEffect(() => {
    if (step !== 'saving' || saveError) return;
    setSavingStage(0);
    const t = window.setInterval(() => setSavingStage((s) => Math.min(s + 1, SAVING_STAGES.length - 1)), 1400);
    return () => window.clearInterval(t);
  }, [step, saveError]);

  async function save(finalPhotos: ScanPhotos) {
    setPhotos(finalPhotos);
    setSaveError(null);
    setStep('saving');

    const started = Date.now();
    try {
      const res = await fetch('/api/hair-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, photos: finalPhotos, pageUrl: window.location.href }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.');

      // Let the scanning animation play for a moment even on a fast connection.
      const wait = Math.max(0, 2600 - (Date.now() - started));
      await new Promise((r) => setTimeout(r, wait));

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'hair_scan_submit', hair_concern: answers.concern });
      window.gtag?.('event', 'conversion', { send_to: 'AW-18275005989/-JliCMHgn_EcEKXsmYpE' });

      setStep('result');
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  }

  if (!open) return null;

  const firstName = answers.name?.trim().split(/\s+/)[0];
  const previewPhoto = photos.front ?? Object.values(photos)[0];

  return (
    <div
      ref={scrollRef}
      role="dialog"
      aria-modal="true"
      aria-label="Hair scan"
      className="fixed inset-0 z-[90] overflow-y-auto overscroll-contain bg-[#FBF8F1]"
    >
      {/* Top bar */}
      <div className="sticky top-0 z-20 border-b border-[#E3CC9D]/70 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1000px] items-center justify-between px-4 py-3 sm:px-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={SITE.logo} alt={SITE.name} className="h-9 w-auto object-contain" />
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 font-label text-[12px] font-semibold uppercase tracking-[0.2em] text-[#4E5426] sm:inline-flex">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#4E5426]" />
              Hair Scan
            </span>
            {step !== 'saving' && (
              <button
                type="button"
                onClick={close}
                aria-label="Close hair scan"
                className="flex h-10 w-10 items-center justify-center rounded-full text-[#4E5426] transition-colors hover:bg-[#E3CC9D]/30"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {step === 'quiz' && (
        <ScanQuiz
          answers={answers}
          onAnswer={(id, value) => setAnswers((a) => ({ ...a, [id]: value }))}
          onDone={() => setStep('photos')}
          onExit={close}
        />
      )}

      {step === 'photos' && (
        <PhotoCapture firstName={firstName} onComplete={save} onBack={() => setStep('quiz')} />
      )}

      {step === 'saving' && (
        <div className="mx-auto flex max-w-[480px] flex-col items-center px-4 pb-16 pt-10 text-center hs-step-in">
          <div className="relative aspect-[3/4] w-full max-w-[300px] overflow-hidden rounded-[1.75rem] bg-[#1E2115] shadow-[0_30px_70px_-30px_rgba(30,33,21,0.8)]">
            {previewPhoto && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewPhoto} alt="" className="h-full w-full object-cover opacity-80" />
            )}
            <div className="hs-grid-dark absolute inset-0" aria-hidden="true" />
            {!saveError && <div className="hs-scanline absolute inset-x-4" aria-hidden="true" />}
            {['left-4 top-4 border-l-2 border-t-2', 'right-4 top-4 border-r-2 border-t-2', 'bottom-4 left-4 border-b-2 border-l-2', 'bottom-4 right-4 border-b-2 border-r-2'].map((pos) => (
              <span key={pos} className={`absolute h-8 w-8 rounded-[5px] border-[#E3CC9D] ${pos}`} aria-hidden="true" />
            ))}
          </div>

          {saveError ? (
            <>
              <h2 className="mt-8 font-heading text-[24px] font-bold text-[#1E2115]">We couldn’t save your scan</h2>
              <p className="mt-2 font-body text-[15px] leading-[1.7] text-red-600">{saveError}</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <BlobButton type="button" onClick={() => save(photos)} className="rounded-full px-7 py-3 font-body text-[16px] font-semibold">
                  Try Again
                </BlobButton>
                <button
                  type="button"
                  onClick={() => setStep('photos')}
                  className="rounded-full border border-[#4E5426]/30 px-7 py-3 font-body text-[16px] font-semibold text-[#4E5426]"
                >
                  Back to photos
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="mt-8 font-heading text-[24px] font-bold text-[#1E2115]" aria-live="polite">
                {SAVING_STAGES[savingStage]}…
              </h2>
              <ul className="mt-5 grid w-full max-w-[320px] gap-2 text-left">
                {SAVING_STAGES.map((label, i) => (
                  <li key={label} className="flex items-center gap-3 font-body text-[15px]">
                    <span
                      className={`material-symbols-outlined text-[20px] ${
                        i < savingStage ? 'text-[#4E5426]' : i === savingStage ? 'animate-spin text-[#4E5426]' : 'text-[#E3CC9D]'
                      }`}
                    >
                      {i < savingStage ? 'check_circle' : i === savingStage ? 'progress_activity' : 'radio_button_unchecked'}
                    </span>
                    <span className={i <= savingStage ? 'text-[#1E2115]' : 'text-[#8A8D80]'}>{label}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 font-body text-[13.5px] text-[#8A8D80]">
                {PHOTO_VIEWS.filter((v) => photos[v.id as PhotoViewId]).length} photo(s) · please keep this page open
              </p>
            </>
          )}
        </div>
      )}

      {step === 'result' && (
        <ScanResult answers={answers} photos={photos} onRestart={reset} onClose={close} />
      )}
    </div>
  );
}
