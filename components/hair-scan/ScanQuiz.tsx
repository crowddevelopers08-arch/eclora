'use client';

import { useEffect, useRef, useState } from 'react';
import { BlobButton } from '@/components/BlobButton';
import {
  SCAN_QUESTIONS,
  stageImage,
  stagesFor,
  validateAnswer,
  type ScanAnswers,
} from '@/lib/hairScan';

const TOTAL = SCAN_QUESTIONS.length;

/**
 * One question per screen. Choice questions advance on tap; text inputs
 * use the Continue button (Enter also submits). The stage picker is the last
 * question: tapping a stage goes straight to the camera.
 */
export function ScanQuiz({
  answers,
  onAnswer,
  onDone,
  onExit,
}: {
  answers: ScanAnswers;
  onAnswer: (id: keyof ScanAnswers, value: string) => void;
  onDone: () => void;
  onExit: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [direction, setDirection] = useState<'fwd' | 'back'>('fwd');
  const inputRef = useRef<HTMLInputElement>(null);
  const advanceTimer = useRef<number | undefined>(undefined);

  const q = SCAN_QUESTIONS[index];
  const value = answers[q.id] ?? '';
  const firstName = answers.name?.trim().split(/\s+/)[0];

  useEffect(() => {
    if (q.type === 'text' || q.type === 'tel') inputRef.current?.focus();
    return () => window.clearTimeout(advanceTimer.current);
  }, [q.type, index]);

  function next(current = value) {
    const err = validateAnswer(q, current);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setDirection('fwd');
    if (index < TOTAL - 1) setIndex(index + 1);
    else onDone();
  }

  function back() {
    setError(null);
    setDirection('back');
    if (index > 0) setIndex(index - 1);
    else onExit();
  }

  function choose(id: string) {
    onAnswer(q.id, id);
    setError(null);
    // Short pause so the selected state registers before moving on.
    window.clearTimeout(advanceTimer.current);
    advanceTimer.current = window.setTimeout(() => next(id), 260);
  }

  const progress = ((index + 1) / TOTAL) * 100;
  const anim = direction === 'fwd' ? 'hs-step-in' : 'hs-step-in-back';

  return (
    <div className="mx-auto w-full max-w-[720px] px-4 pb-16 pt-6 sm:px-6 sm:pt-10">
      {/* Progress */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={back}
          aria-label="Back"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[#E3CC9D] text-[#4E5426] transition-colors hover:bg-[#E3CC9D]/25"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <div className="flex-1">
          <div className="flex justify-between font-label text-[12px] font-semibold uppercase tracking-[0.18em] text-[#8A8D80]">
            <span>
              Question {index + 1} of {TOTAL}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#E3CC9D]/35">
            <div
              className="h-full rounded-full bg-[#4E5426] transition-[width] duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div key={index} className={`mt-10 ${anim}`}>
        <h2 className="font-heading text-[28px] font-bold leading-[1.2] tracking-[-0.01em] text-[#1E2115] sm:text-[34px]">
          {q.question}
          {q.id === 'phone' && firstName ? (
            <span className="block text-[18px] font-medium text-[#4E5426] sm:text-[20px]">
              Nice to meet you, {firstName}.
            </span>
          ) : null}
        </h2>
        {q.subtext ? (
          <p className="mt-3 font-body text-[16px] leading-[1.7] text-[#5F6352]">{q.subtext}</p>
        ) : null}

        <div className="mt-8">
          {(q.type === 'text' || q.type === 'tel') && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                next();
              }}
            >
              <div
                className={`flex overflow-hidden rounded-2xl border-2 bg-white transition-colors focus-within:border-[#4E5426] ${
                  error ? 'border-red-400' : 'border-[#E3CC9D]'
                }`}
              >
                {q.type === 'tel' && (
                  <span className="flex items-center border-r border-[#E3CC9D] bg-[#E3CC9D]/20 px-4 font-label text-[17px] font-semibold text-[#4E5426]">
                    +91
                  </span>
                )}
                <input
                  ref={inputRef}
                  type={q.type === 'tel' ? 'tel' : 'text'}
                  inputMode={q.type === 'tel' ? 'numeric' : 'text'}
                  autoComplete={q.type === 'tel' ? 'tel-national' : 'name'}
                  maxLength={q.type === 'tel' ? 10 : 60}
                  value={value}
                  placeholder={q.placeholder}
                  onChange={(e) => {
                    const v = q.type === 'tel' ? e.target.value.replace(/\D/g, '') : e.target.value;
                    onAnswer(q.id, v);
                    if (error) setError(null);
                  }}
                  className="w-full bg-transparent px-5 py-4 font-body text-[18px] text-[#1E2115] outline-none placeholder:text-[#8A8D80]"
                />
              </div>
              {/* Hidden submit so Enter works on mobile keyboards */}
              <button type="submit" className="hidden" aria-hidden="true" tabIndex={-1} />
            </form>
          )}

          {q.type === 'single' && (
            <div className={`grid gap-3 ${q.options!.length > 3 ? 'sm:grid-cols-2' : ''}`}>
              {q.options!.map((opt) => {
                const selected = value === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => choose(opt.id)}
                    aria-pressed={selected}
                    className={`group flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-200 ${
                      selected
                        ? 'border-[#4E5426] bg-[#4E5426] text-white shadow-[0_16px_40px_-20px_rgba(78,84,38,0.7)]'
                        : 'border-[#E3CC9D]/80 bg-white hover:-translate-y-0.5 hover:border-[#4E5426]/50'
                    }`}
                  >
                    <span className="min-w-0 flex-1">
                      <span className={`block font-heading text-[17px] font-semibold ${selected ? 'text-white' : 'text-[#1E2115]'}`}>
                        {opt.label}
                      </span>
                      {opt.description ? (
                        <span className={`mt-0.5 block font-body text-[14px] ${selected ? 'text-white/75' : 'text-[#8A8D80]'}`}>
                          {opt.description}
                        </span>
                      ) : null}
                    </span>
                    <span
                      className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                        selected ? 'border-[#E3CC9D] bg-[#E3CC9D] text-[#4E5426]' : 'border-[#E3CC9D]'
                      }`}
                    >
                      {selected && <span className="material-symbols-outlined text-[16px] font-bold">check</span>}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {q.type === 'stage' && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {stagesFor(answers.gender).map((stage) => {
                const selected = value === stage.id;
                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => choose(stage.id)}
                    aria-pressed={selected}
                    className={`relative overflow-hidden rounded-2xl border-2 bg-white p-2.5 text-center transition-all duration-200 ${
                      selected
                        ? 'border-[#4E5426] shadow-[0_16px_40px_-20px_rgba(78,84,38,0.7)]'
                        : 'border-[#E3CC9D]/80 hover:-translate-y-0.5 hover:border-[#4E5426]/50'
                    }`}
                  >
                    {selected && (
                      <span className="absolute right-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-[#4E5426] text-white">
                        <span className="material-symbols-outlined text-[16px]">check</span>
                      </span>
                    )}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={stageImage(stage.id, answers.gender)}
                      alt={`${stage.label}: ${stage.description}`}
                      className="aspect-[4/3] w-full rounded-xl object-cover"
                    />
                    <span className="mt-2 block font-heading text-[15px] font-semibold text-[#1E2115]">
                      {stage.label}
                    </span>
                    <span className="mt-0.5 block font-body text-[13px] leading-snug text-[#8A8D80]">
                      {stage.description}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {error && (
            <p role="alert" className="mt-4 flex items-center gap-2 font-body text-[15px] text-red-600">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {error}
            </p>
          )}

          {q.type !== 'single' && q.type !== 'stage' && (
            <div className="mt-8 flex justify-end">
              <BlobButton
                type="button"
                onClick={() => next()}
                className="gap-2 rounded-full px-8 py-3.5 font-body text-[16px] font-semibold"
              >
                Continue
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </BlobButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
