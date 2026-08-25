import { Fragment } from 'react';
import type { IconType } from 'react-icons';
import { LuClipboardList, LuFlower2, LuHeadset, LuMessageSquare, LuMoveRight } from 'react-icons/lu';
import { AnimateOnScroll } from '@/components/AnimateOnScroll';

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
            <span className="material-symbols-outlined text-[13px] text-[#4E5426]" style={{ fontVariationSettings: '"FILL" 1' }}>
              route
            </span>
            <span className="font-label text-[11px] font-semibold uppercase tracking-[0.14em] text-[#4E5426] sm:text-[12px]">
              How It Works
            </span>
          </span>

          <h2 className="mt-3 font-heading text-[24px] font-bold tracking-[-0.01em] leading-[1.2] text-[#1E2115] sm:text-[28px] md:text-[32px] lg:text-[36px]">
            Your Journey At <span className="text-[#4E5426]">Eclora</span>
          </h2>
        </AnimateOnScroll>

        {/* Steps separated by arrows. The arrows are display:none below lg, so
            they drop out of the grid entirely rather than taking a cell. */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:flex lg:items-start lg:gap-0">
          {STEPS.map((step, i) => (
            <Fragment key={step.num}>
              {i > 0 && (
                <div aria-hidden className="hidden shrink-0 items-start pt-[14px] lg:flex">
                  <LuMoveRight strokeWidth={1.75} className="h-7 w-7 text-[#1E2115]" />
                </div>
              )}

              <AnimateOnScroll animation="fade-up" delay={i * 90} className="lg:flex-1 lg:px-3">
                <div className="flex flex-col items-center text-center">

                  <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#4E5426]">
                    <step.Icon aria-hidden strokeWidth={1.75} className="h-6 w-6 text-white" />
                  </div>

                  <h3 className="mt-4 font-label text-[13px] font-extrabold uppercase tracking-[0.18em] text-[#1E2115] sm:text-[14px]">
                    Step {step.num}
                  </h3>

                  <p className="mt-1.5 font-heading text-[15px] font-bold leading-[1.3] text-[#4E5426] sm:text-[16px]">
                    {step.title}
                  </p>

                  <p className="mt-2.5 max-w-[280px] font-body text-[13px] leading-[1.8] text-[#5F6352] sm:text-[14px]">
                    {step.desc}
                  </p>
                </div>
              </AnimateOnScroll>
            </Fragment>
          ))}
        </div>

        <AnimateOnScroll animation="fade-up" delay={280} className="mt-7 flex justify-center md:mt-8">
          <a
            href="#consultation"
            className="font-body inline-flex items-center gap-2 rounded-full bg-[#4E5426] px-8 py-3.5 text-[14px] font-semibold text-white shadow-md transition-colors hover:bg-[#4E5426]/90 sm:text-[15px] md:px-10"
          >
            Start With A Consultation
            <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
          </a>
        </AnimateOnScroll>

      </div>
    </section>
  );
}
