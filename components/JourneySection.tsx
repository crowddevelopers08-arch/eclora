import { Fragment } from 'react';
import type { IconType } from 'react-icons';
import { LuClipboardList, LuFlower2, LuHeadset, LuMessageSquare, LuMoveRight } from 'react-icons/lu';
import { AnimateOnScroll } from '@/components/AnimateOnScroll';
import { BlobButton } from '@/components/BlobButton';

const STEPS: { num: string; Icon: IconType; title: string; desc: string }[] = [
  {
    num: '1',
    Icon: LuMessageSquare,
    title: 'Consultation',
    desc: 'Meet with our aesthetic experts to discuss your concerns, goals, and treatment options.',
  },
  {
    num: '2',
    Icon: LuClipboardList,
    title: 'Personalised Assessment',
    desc: 'We evaluate your skin, hair, or body concerns and create a customised treatment roadmap.',
  },
  {
    num: '3',
    Icon: LuFlower2,
    title: 'Treatment',
    desc: 'Receive advanced aesthetic care in a comfortable and professionally managed environment.',
  },
  {
    num: '4',
    Icon: LuHeadset,
    title: 'Follow-Up & Support',
    desc: 'Our team stays connected throughout your journey to monitor progress and guide your results.',
  },
];

export function JourneySection() {
  return (
    <section id="journey" className="bg-white px-4 py-8 sm:px-6 md:px-[60px] md:py-10 lg:py-12">
      <div className="mx-auto max-w-[1280px]">

        <AnimateOnScroll animation="fade-down" className="mb-7 text-center md:mb-8">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E3CC9D] bg-white px-3 py-1">
            <span className="material-symbols-outlined text-[15px] text-[#4E5426]" style={{ fontVariationSettings: '"FILL" 1' }}>
              route
            </span>
            <span className="font-label text-[13px] font-semibold uppercase tracking-[0.14em] text-[#4E5426] sm:text-[14px]">
              How It Works
            </span>
          </span>

          <h2 className="mt-3 font-heading text-[24px] font-bold tracking-[-0.01em] leading-[1.2] text-[#1E2115] sm:text-[28px] md:text-[32px] lg:text-[36px]">
            Your Journey At <span className="text-[#4E5426]">Eclora</span>
          </h2>
        </AnimateOnScroll>

        {/* Steps separated by arrows. The arrows are display:none below lg, so
            they drop out of the grid entirely rather than taking a cell.
            Below sm this is a plain block: each step becomes a sticky layer
            (see .journey-stack in globals.css) that the next one slides over.
            It cannot be a grid there — a sticky grid item is trapped inside
            its own row and could never overlap its neighbour. */}
        <div className="journey-stack sm:grid sm:grid-cols-2 sm:gap-10 lg:flex lg:items-start lg:gap-0">
          {STEPS.map((step, i) => (
            <Fragment key={step.num}>
              {i > 0 && (
                <div aria-hidden className="hidden shrink-0 items-start pt-[14px] lg:flex">
                  <LuMoveRight strokeWidth={1.75} className="h-7 w-7 text-[#1E2115]" />
                </div>
              )}

              <AnimateOnScroll animation="fade-up" delay={i * 90} className="journey-stack-item lg:flex-1 lg:px-3">
                <div className="flex flex-col items-center bg-white text-center">

                  <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#4E5426]">
                    <step.Icon aria-hidden strokeWidth={1.75} className="h-6 w-6 text-white" />
                  </div>

                  <h3 className="mt-3 font-label text-[15px] font-extrabold uppercase tracking-[0.18em] text-[#1E2115] sm:text-[16px]">
                    Step {step.num}
                  </h3>

                  <p className="mt-1 font-heading text-[16px] font-bold leading-[1.3] text-[#4E5426] sm:text-[16px]">
                    {step.title}
                  </p>

                  <p className="mt-2 max-w-[280px] font-body text-[15px] leading-[1.8] text-[#5F6352] sm:text-[16px]">
                    {step.desc}
                  </p>
                </div>
              </AnimateOnScroll>
            </Fragment>
          ))}
        </div>

        <AnimateOnScroll animation="fade-up" delay={280} className="mt-7 flex justify-center md:mt-8">
          <BlobButton
            href="#consultation"
            className="font-body inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-[16px] font-semibold shadow-md sm:text-[16px] md:px-10"
          >
            Book Your Consultation
            <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
          </BlobButton>
        </AnimateOnScroll>

      </div>
    </section>
  );
}
