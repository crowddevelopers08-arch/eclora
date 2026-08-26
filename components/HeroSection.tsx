import { SITE } from '@/lib/site';
import { BlobButton } from '@/components/BlobButton';

export function HeroSection() {
  return (
    <section
      id="top"
      className="relative bg-white pt-[65px] md:pt-[81px]"
    >
      <div className="relative">

        {/* Banner — desktop only, always fully visible, never cropped */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/newban.png"
          alt=""
          aria-hidden
          className="hidden w-full lg:block"
        />

        {/* Legibility scrim behind the right-hand copy */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-[60%] bg-gradient-to-l from-white via-white/85 to-transparent lg:block"
        />

        {/* Copy — stacked below the banner on mobile, overlaid on its right on desktop */}
        <div className="flex items-center px-4 pb-9 max-[470px]:pb-6 pt-7 sm:px-6 sm:pt-8 max-[470px]:pt-5 lg:absolute lg:inset-0 lg:pb-0 lg:pl-[59%] lg:pr-[3%] lg:pt-0">
          <div className="w-full text-center lg:text-left">

            {/* Eyebrow */}
            <div className="hero-anim-label mb-4 inline-flex items-center gap-2 rounded-full border border-[#4E5426]/20 bg-[#E3CC9D]/20 px-4 py-1.5 lg:mb-3 xl:mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4E5426]" />
              <span className="font-label text-[13px] font-bold uppercase tracking-[0.2em] text-[#4E5426] sm:text-[14px] xl:text-[15px]">
                {SITE.name}
              </span>
            </div>

            <h1 className="hero-anim-title font-heading text-[28px] font-bold tracking-[-0.01em] leading-[1.18] text-[#1E2115] sm:text-[34px] md:text-[40px] lg:text-[30px] xl:text-[40px] 2xl:text-[46px]">
              Advanced Skin, Hair &amp; Body Treatments For{' '}
              <span className="text-[#4E5426]">Visible, Confidence-Boosting</span>{' '}
              Results
            </h1>

            {/* Mobile banner — sits between the headline and the subheadline */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/newmobban.png"
              alt=""
              aria-hidden
              className="hero-anim-video mt-6 block w-full rounded-2xl sm:mt-7 lg:hidden"
            />

            <p className="hero-anim-desc mx-auto mt-5 max-w-[600px] font-body text-[16px] leading-[1.85] text-[#5F6352] sm:text-[16px] lg:mx-0 lg:mt-4 lg:max-w-[640px] lg:text-[16px] xl:mt-5 xl:text-[16px] 2xl:text-[17px]">
              Experience personalised aesthetic care powered by advanced technology, expert
              guidance, and a luxury patient experience designed around you.
            </p>

            <div className="hero-anim-ctas mt-8 flex w-full flex-col items-stretch sm:flex-row sm:items-center sm:justify-center lg:mt-6 lg:justify-start xl:mt-8">
              <BlobButton
                href="#consultation"
                className="font-body inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-[16px] font-bold shadow-lg sm:text-[16px] md:px-10 lg:px-8 lg:py-3 lg:text-[16px] xl:px-9 xl:py-3.5 xl:text-[16px] 2xl:px-10 2xl:py-4 2xl:text-[16px]"
              >
                Book Your Consultation Today
                <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
              </BlobButton>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
