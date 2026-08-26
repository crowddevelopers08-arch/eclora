import { LeadForm } from '@/components/LeadForm';

export function LeadFormSection() {
  return (
    <section
      id="consultation"
      className="bg-[#4E5426] px-4 py-8 sm:px-6 md:px-[60px] md:py-10 lg:py-12"
    >
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">

        {/* LEFT — The Eclora Standard */}
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E3CC9D]/30 bg-[#E3CC9D]/10 px-3 py-1">
            <span className="material-symbols-outlined text-[15px] text-[#E3CC9D]" style={{ fontVariationSettings: '"FILL" 1' }}>
              diamond
            </span>
            <span className="font-label text-[13px] font-semibold uppercase tracking-[0.14em] text-[#E3CC9D] sm:text-[14px]">
              The Eclora Standard
            </span>
          </span>

          <h2 className="mt-4 font-heading text-[24px] font-bold tracking-[-0.01em] leading-[1.22] text-white sm:text-[28px] md:text-[32px] lg:text-[36px]">
            Experience A New Standard Of{' '}
            <span className="text-[#E3CC9D]">Aesthetic Care</span>
          </h2>

          <p className="mt-4 font-body text-[16px] leading-[1.9] text-white/75 sm:text-[16px]">
            At Eclora Aesthetics, we combine advanced treatments with thoughtful patient care to
            create an experience that feels as exceptional as the results.
          </p>

          <p className="mt-3 font-body text-[16px] leading-[1.9] text-white/75 sm:text-[16px]">
            From the moment you walk through our doors, you&apos;ll experience a clinic focused on
            comfort, professionalism, and personalised attention.
          </p>

        </div>

        {/* RIGHT — form card */}
        <div className="rounded-[1.75rem] bg-white p-6 shadow-2xl sm:p-8">

          <div className="mb-6 text-center">
            <h3 className="font-heading text-[20px] font-bold tracking-[-0.01em] leading-[1.2] text-[#1E2115] sm:text-[24px]">
              Begin Your Transformation <span className="text-[#4E5426]">Today</span>
            </h3>
            <p className="mx-auto mt-2 max-w-[420px] font-body text-[15px] leading-[1.75] text-[#5F6352] sm:text-[16px]">
              Share a few details and our team will reach out to recommend the right treatment
              plan for you.
            </p>
          </div>

          <LeadForm />
        </div>

      </div>
    </section>
  );
}
