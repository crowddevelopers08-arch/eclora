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

function ReasonCard({
  reason,
  className = '',
}: {
  reason: (typeof REASONS)[number];
  className?: string;
}) {
  const { Icon } = reason;

  return (
    <div
      className={`flex min-h-[300px] flex-col rounded-[26px] bg-[#E3CC9D]/25 bg-cover bg-center bg-no-repeat p-7 sm:min-h-[330px] sm:p-8 lg:min-h-[360px] lg:p-9 ${className}`}
      style={{
        backgroundImage: "url('/bg.png')",
      } as React.CSSProperties}
    >
      <Icon aria-hidden strokeWidth={1.5} className="mb-6 h-10 w-10 flex-shrink-0 text-[#4E5426] sm:h-11 sm:w-11 lg:mb-7 lg:h-12 lg:w-12" />

      <h3 className="font-heading text-[19px] font-bold leading-[1.3] text-[#1E2115] sm:text-[21px] lg:text-[23px]">
        {reason.title}
      </h3>

      <p className="mt-3 font-body text-[16px] leading-[1.8] text-[#5F6352] sm:text-[16px] lg:mt-4 lg:text-[17px]">
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
          <span className="material-symbols-outlined text-[15px] text-[#4E5426]" style={{ fontVariationSettings: '"FILL" 1' }}>
            verified
          </span>
          <span className="font-label text-[13px] font-semibold uppercase tracking-[0.14em] text-[#4E5426] sm:text-[14px]">
            Why Eclora
          </span>
        </span>

        <h2 className="mt-3 font-heading text-[24px] font-bold tracking-[-0.01em] leading-[1.2] text-[#1E2115] sm:text-[28px] md:text-[32px] lg:text-[36px]">
          Why Choose <span className="text-[#4E5426]">Eclora Aesthetics?</span>
        </h2>
      </AnimateOnScroll>

      <AnimateOnScroll animation="fade-up" className="w-full py-2">
        <ManualCarousel duration={36}>
          {REASONS.map((reason) => (
            <ReasonCard
              key={reason.title}
              reason={reason}
              className="mr-5 w-[330px] flex-shrink-0 sm:w-[360px] lg:w-[405px] xl:w-[435px]"
            />
          ))}
        </ManualCarousel>
      </AnimateOnScroll>

      <AnimateOnScroll animation="fade-up" delay={280} className="mt-7 flex justify-center md:mt-8">
        <BlobButton
          href="#consultation"
          className="font-body inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-[16px] font-semibold shadow-md sm:text-[16px] md:px-10"
        >
          Book Your Consultation Today
          <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
        </BlobButton>
      </AnimateOnScroll>
    </section>
  );
}
