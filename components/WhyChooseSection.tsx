import type { IconType } from 'react-icons';
import { LuGem, LuMicroscope, LuSlidersHorizontal, LuSparkles, LuStethoscope } from 'react-icons/lu';
import { AnimateOnScroll } from '@/components/AnimateOnScroll';
import { BlobButton } from '@/components/BlobButton';
import { ManualCarousel } from '@/components/ManualCarousel';

const REASONS: { Icon: IconType; title: string; desc: string }[] = [
  {
    Icon: LuMicroscope,
    title: 'Advanced Aesthetic Technologies',
    desc: 'We invest in proven, modern treatment technologies that deliver effective results while prioritising patient comfort and safety.',
  },
  {
    Icon: LuSlidersHorizontal,
    title: 'Personalised Treatment Plans',
    desc: 'No two patients are alike. Every consultation begins with understanding your goals, concerns, lifestyle, and expectations before recommending a treatment plan.',
  },
  {
    Icon: LuGem,
    title: 'Premium Patient Experience',
    desc: 'From your consultation to post-treatment care, every step is designed to provide comfort, privacy, and attention to detail.',
  },
  {
    Icon: LuStethoscope,
    title: 'Experienced Medical Team',
    desc: 'Our treatments are performed under expert supervision, ensuring you receive professional guidance throughout your aesthetic journey.',
  },
  {
    Icon: LuSparkles,
    title: 'Visible Results',
    desc: 'Our focus is simple: helping patients achieve noticeable, confidence-enhancing improvements through carefully selected treatments.',
  },
];

/**
 * Cards are identical; the `cc-*` classes in globals.css cycle the solid-olive
 * highlight along the row. `--i` is this card's slot in that cycle.
 */
function ReasonCard({
  reason,
  index,
  className = '',
}: {
  reason: (typeof REASONS)[number];
  index: number;
  className?: string;
}) {
  const { Icon } = reason;

  return (
    <div
      className={`cc-card flex flex-col rounded-2xl bg-[#E3CC9D]/25 p-6 md:p-7 ${className}`}
      style={{ '--i': index } as React.CSSProperties}
    >
      <Icon aria-hidden strokeWidth={1.5} className="cc-icon mb-5 h-8 w-8 flex-shrink-0 text-[#4E5426]" />

      <h3 className="cc-title font-heading text-[16px] font-bold leading-[1.35] text-[#1E2115] sm:text-[17px]">
        {reason.title}
      </h3>

      <p className="cc-desc mt-2.5 font-body text-[13px] leading-[1.75] text-[#5F6352] sm:text-[14px]">
        {reason.desc}
      </p>
    </div>
  );
}

export function WhyChooseSection() {
  return (
    <section id="why-eclora" className="bg-white px-4 py-8 sm:px-6 md:px-[60px] md:py-10 lg:py-12">

      <AnimateOnScroll animation="fade-down" className="mx-auto mb-6 max-w-[1280px] text-center md:mb-8">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E3CC9D] bg-white px-3 py-1">
          <span className="material-symbols-outlined text-[13px] text-[#4E5426]" style={{ fontVariationSettings: '"FILL" 1' }}>
            verified
          </span>
          <span className="font-label text-[11px] font-semibold uppercase tracking-[0.14em] text-[#4E5426] sm:text-[12px]">
            Why Eclora
          </span>
        </span>

        <h2 className="mt-3 font-heading text-[24px] font-bold tracking-[-0.01em] leading-[1.2] text-[#1E2115] sm:text-[28px] md:text-[32px] lg:text-[36px]">
          Why Choose <span className="text-[#4E5426]">Eclora Aesthetics?</span>
        </h2>
      </AnimateOnScroll>

      {/* Mobile / tablet — auto-scrolling carousel, same as the results row.
          The list is rendered twice so the loop is seamless at translateX(-50%);
          spacing is mr-4 rather than a flex gap so the two halves add up to
          exactly 50%. */}
      <AnimateOnScroll animation="fade-up" className="w-full py-2 lg:hidden">
        <ManualCarousel duration={34} className="cc-row">
          {REASONS.map((reason, i) => (
            <ReasonCard
              key={reason.title}
              reason={reason}
              index={i}
              className="mr-4 w-[290px] flex-shrink-0 sm:w-[330px]"
            />
          ))}
        </ManualCarousel>
      </AnimateOnScroll>

      {/* Desktop — 5-up grid. Cards are grid items with no wrapper, so every
          one stretches to the height of the tallest. */}
      <AnimateOnScroll animation="fade-up" className="hidden lg:block">
        <div className="cc-row mx-auto grid max-w-[1480px] grid-cols-5 items-stretch gap-4">
          {REASONS.map((reason, i) => (
            <ReasonCard key={reason.title} reason={reason} index={i} />
          ))}
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll animation="fade-up" delay={280} className="mt-7 flex justify-center md:mt-8">
        <BlobButton
          href="#consultation"
          className="font-body inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-[14px] font-semibold shadow-md sm:text-[15px] md:px-10"
        >
          Book Your Consultation Today
          <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
        </BlobButton>
      </AnimateOnScroll>

    </section>
  );
}
