import { AnimateOnScroll } from '@/components/AnimateOnScroll';


export function ExperienceSection() {
  return (
    <section className="bg-white px-4 py-8 sm:px-6 md:px-[60px] md:py-10 lg:py-12">

      <AnimateOnScroll animation="fade-up" className="mx-auto max-w-[860px] text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E3CC9D] bg-white px-3 py-1">
          <span className="material-symbols-outlined text-[13px] text-[#4E5426]" style={{ fontVariationSettings: '"FILL" 1' }}>
            diamond
          </span>
          <span className="font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-[#4E5426] sm:text-[12px]">
            The Eclora Standard
          </span>
        </span>

        <h2 className="mt-4 font-heading text-[24px] font-extrabold leading-[1.22] text-[#1E2115] sm:text-[28px] md:text-[32px] lg:text-[38px]">
          Experience A New Standard Of{' '}
          <span className="text-[#4E5426]">Aesthetic Care</span>
        </h2>

        <p className="mx-auto mt-4 max-w-[680px] font-body text-[14px] leading-[1.9] text-[#5F6352] sm:text-[15px] md:text-[16px]">
          At Eclora Aesthetics, we combine advanced treatments with thoughtful patient care to
          create an experience that feels as exceptional as the results.
        </p>

        <p className="mx-auto mt-3 max-w-[680px] font-body text-[14px] leading-[1.9] text-[#5F6352] sm:text-[15px] md:text-[16px]">
          From the moment you walk through our doors, you&apos;ll experience a clinic focused on
          comfort, professionalism, and personalised attention.
        </p>

      </AnimateOnScroll>
    </section>
  );
}
