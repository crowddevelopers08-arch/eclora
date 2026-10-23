'use client';

import { BlobButton } from '@/components/BlobButton';
import { SITE } from '@/lib/site';
import {
  HAIR_STAGES,
  PHOTO_VIEWS,
  optionLabel,
  stageImage,
  type PhotoViewId,
  type ScanAnswers,
  type ScanPhotos,
} from '@/lib/hairScan';

/* "What happens next" reuses the three steps from the landing page. */
const NEXT_STEPS = [
  {
    icon: 'forum',
    title: 'Understand Your Hair Concerns',
    desc: 'The Eclora team reviews your answers and photos and helps you understand your concerns and available treatment options.',
  },
  {
    icon: 'science',
    title: 'Explore the Right Treatment',
    desc: 'PRP, GFC or other hair treatments? Treatment recommendations are based on your individual hair and scalp needs.',
  },
  {
    icon: 'event_note',
    title: 'Follow a Personalised Hair Care Plan',
    desc: 'Get personalised guidance and follow a treatment plan designed around your individual requirements.',
  },
];

/**
 * Summary shown after the scan is saved. Deliberately not a diagnosis: it
 * reflects back what the person shared, and the clinic team takes it from there.
 */
export function ScanResult({
  answers,
  photos,
  onRestart,
  onClose,
}: {
  answers: ScanAnswers;
  photos: ScanPhotos;
  onRestart: () => void;
  onClose: () => void;
}) {
  const firstName = answers.name?.trim().split(/\s+/)[0] || 'Your';
  const stage = HAIR_STAGES.find((s) => s.id === answers.stage);
  const captured = PHOTO_VIEWS.filter((v) => photos[v.id as PhotoViewId]);

  const rows: [string, string][] = [
    ['Primary concern', optionLabel('concern', answers.concern)],
    ['Age group', optionLabel('age', answers.age)],
    ['Gender', optionLabel('gender', answers.gender)],
    ['Lifestyle', optionLabel('lifestyle', answers.lifestyle)],
  ];

  const whatsappText = encodeURIComponent(
    `Hi Eclora Aesthetics, I just completed the hair scan on your website. Name: ${answers.name ?? ''}`
  );

  return (
    <div className="pb-20">
      {/* Header band */}
      <div className="relative overflow-hidden bg-[#4E5426] px-4 pb-24 pt-12 text-center text-white sm:pt-16">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#E3CC9D]/15 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-[640px] hs-step-in">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E3CC9D] text-[#4E5426]">
            <span className="material-symbols-outlined text-[34px]">task_alt</span>
          </span>
          <p className="mt-5 font-label text-[12px] font-semibold uppercase tracking-[0.26em] text-[#E3CC9D]">
            Hair Scan Complete
          </p>
          <h1 className="mt-3 font-heading text-[30px] font-bold leading-[1.15] sm:text-[40px]">
            {firstName === 'Your' ? 'Your' : `${firstName}’s`} Hair Concern Summary
          </h1>
          <p className="mx-auto mt-4 max-w-[520px] font-body text-[16px] leading-[1.75] text-white/80">
            Your answers and photos have been shared securely with the Eclora Aesthetics team. We’ll
            call you on <span className="font-semibold text-white">+91 {answers.phone}</span> to guide
            you on the next steps.
          </p>
        </div>
      </div>

      <div className="relative mx-auto -mt-14 grid max-w-[880px] gap-5 px-4 sm:px-6">
        {/* Photos + stage */}
        <section className="rounded-[1.75rem] border border-[#E3CC9D] bg-white p-5 shadow-[0_24px_60px_-30px_rgba(78,84,38,0.45)] sm:p-7">
          <div className="grid gap-6 md:grid-cols-[1fr_auto]">
            <div>
              <h2 className="font-label text-[12px] font-semibold uppercase tracking-[0.22em] text-[#8A8D80]">
                Your Photos
              </h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {captured.length ? (
                  captured.map((v) => (
                    <figure key={v.id} className="w-[140px] sm:w-[160px]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photos[v.id as PhotoViewId]}
                        alt={`${v.label} photo`}
                        className="aspect-[3/4] w-full rounded-2xl border border-[#E3CC9D] object-cover"
                      />
                      <figcaption className="mt-2 font-body text-[13px] font-semibold text-[#5F6352]">{v.label}</figcaption>
                    </figure>
                  ))
                ) : (
                  <p className="font-body text-[15px] text-[#8A8D80]">No photos were added.</p>
                )}
              </div>
            </div>

            {stage && (
              <div className="md:w-[220px]">
                <h2 className="font-label text-[12px] font-semibold uppercase tracking-[0.22em] text-[#8A8D80]">
                  Selected Stage
                </h2>
                <div className="mt-4 rounded-2xl border border-[#E3CC9D] p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={stageImage(stage.id)} alt={stage.label} className="aspect-[4/3] w-full rounded-xl object-cover" />
                  <p className="mt-2 font-heading text-[16px] font-semibold text-[#1E2115]">{stage.label}</p>
                  <p className="font-body text-[13.5px] text-[#5F6352]">{stage.description}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Answers */}
        <section className="rounded-[1.75rem] border border-[#E3CC9D] bg-white p-5 sm:p-7">
          <h2 className="font-label text-[12px] font-semibold uppercase tracking-[0.22em] text-[#8A8D80]">
            What You Shared
          </h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            {rows.map(([k, v]) => (
              <div key={k} className="rounded-2xl bg-[#E3CC9D]/20 px-4 py-3">
                <dt className="font-body text-[13px] text-[#8A8D80]">{k}</dt>
                <dd className="mt-0.5 font-heading text-[16px] font-semibold text-[#1E2115]">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Next steps */}
        <section className="rounded-[1.75rem] border border-[#E3CC9D] bg-white p-5 sm:p-7">
          <h2 className="font-heading text-[22px] font-bold text-[#1E2115]">What happens next</h2>
          <ol className="mt-5 grid gap-5">
            {NEXT_STEPS.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#4E5426] text-[#E3CC9D]">
                  <span className="material-symbols-outlined text-[22px]">{s.icon}</span>
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#E3CC9D] font-label text-[11px] font-bold text-[#1E2115]">
                    {i + 1}
                  </span>
                </span>
                <div>
                  <h3 className="font-heading text-[17px] font-semibold text-[#1E2115]">{s.title}</h3>
                  <p className="mt-1 font-body text-[15px] leading-[1.7] text-[#5F6352]">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* CTA */}
        <section className="overflow-hidden rounded-[1.75rem] bg-[#333719] p-6 text-center text-white sm:p-9">
          <h2 className="font-heading text-[26px] font-bold sm:text-[30px]">
            Ready to Restore <span className="text-[#E3CC9D]">Your Hair?</span>
          </h2>
          <p className="mx-auto mt-3 max-w-[480px] font-body text-[16px] leading-[1.7] text-white/75">
            Don&apos;t want to wait for our call? Reach the clinic directly.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={`tel:${SITE.phone}`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#E3CC9D] px-7 py-3.5 font-body text-[16px] font-semibold text-[#1E2115] transition hover:bg-[#E3CC9D]/90"
            >
              <span className="material-symbols-outlined text-[19px]">call</span>
              Call {SITE.phoneDisplay}
            </a>
            <a
              href={`https://wa.me/${SITE.whatsapp}?text=${whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#E3CC9D]/40 px-7 py-3.5 font-body text-[16px] font-semibold text-[#E3CC9D] transition hover:bg-white/5"
            >
              <span className="material-symbols-outlined text-[19px]">chat</span>
              WhatsApp Us
            </a>
          </div>
        </section>

        <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
          <BlobButton type="button" onClick={onClose} className="rounded-full px-7 py-3 font-body text-[15px] font-semibold">
            Back to Eclora Aesthetics
          </BlobButton>
          <button type="button" onClick={onRestart} className="font-body text-[15px] font-semibold text-[#5F6352] underline-offset-4 hover:underline">
            Start a new scan
          </button>
        </div>

        <p className="mx-auto max-w-[620px] text-center font-body text-[12.5px] leading-[1.7] text-[#8A8D80]">
          This summary reflects the information you shared and is not a medical diagnosis. Treatment
          suitability is assessed by the Eclora Aesthetics team during your consultation.
        </p>
      </div>
    </div>
  );
}
