import { AnimateOnScroll } from '@/components/AnimateOnScroll';

const CONCERNS = [
  { num: '01', text: 'Pigmentation and uneven skin tone' },
  { num: '02', text: 'Early signs of ageing' },
  { num: '03', text: 'Skin laxity and facial sagging' },
  { num: '04', text: 'Acne marks and skin texture concerns' },
  { num: '05', text: 'Unwanted facial and body hair' },
  { num: '06', text: 'Hair thinning and hair fall concerns' },
  { num: '07', text: 'Stubborn fat pockets resistant to diet and exercise' },
  { num: '08', text: 'Overall skin rejuvenation and enhancement' },
];

export function WhoCanBenefitSection() {
  return (
    <section className="bg-white px-4 py-8 sm:px-6 md:px-[60px] md:py-10 lg:py-12">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-14 xl:gap-20">

          {/* LEFT — sticky headline */}
          <AnimateOnScroll
            animation="fade-right"
            className="lg:sticky lg:top-24 lg:w-[38%] lg:self-start xl:w-[36%]"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E3CC9D] bg-white px-3 py-1">
              <span
                className="material-symbols-outlined text-[13px] text-[#4E5426]"
                style={{ fontVariationSettings: '"FILL" 1' }}
              >
                help
              </span>
              <span className="font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-[#4E5426] sm:text-[12px]">
                Is This For You?
              </span>
            </span>

            <h2 className="mt-4 font-heading text-[24px] font-extrabold leading-[1.2] text-[#1E2115] sm:text-[28px] lg:text-[28px] xl:text-[32px]">
              Who Can Benefit From{' '}
              <span className="text-[#4E5426]">Our Treatments?</span>
            </h2>

            <p className="mt-3 font-body text-[14px] leading-[1.85] text-[#5F6352]">
              Our treatments are ideal for individuals looking to address the concerns listed here.
              Book a consultation and our team will confirm the right plan for you.
            </p>

            <a
              href="#consultation"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#4E5426] px-6 py-3 font-body text-[14px] font-semibold text-white shadow-md transition-colors hover:bg-[#4E5426]/90 sm:text-[15px]"
            >
              Book Your Consultation Today
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </a>
          </AnimateOnScroll>

          {/* RIGHT — concerns list */}
          <div className="flex-1">
            <div className="overflow-hidden rounded-2xl border border-[#E3CC9D] bg-white">
              {CONCERNS.map((item, i) => (
                <AnimateOnScroll key={item.num} animation="fade-left" delay={i * 50}>
                  <div
                    className={`flex items-center gap-4 px-4 py-4 transition-colors hover:bg-[#E3CC9D]/20 md:gap-5 md:px-6 md:py-5 ${
                      i < CONCERNS.length - 1 ? 'border-b border-[#E3CC9D]' : ''
                    }`}
                  >
                    <span className="w-7 shrink-0 font-body text-[12px] font-black tracking-[0.16em] text-[#4E5426]/70">
                      {item.num}
                    </span>

                    <div className="h-7 w-px shrink-0 rounded-full bg-[#E3CC9D]" />

                    <span
                      className="material-symbols-outlined flex-shrink-0 text-[21px] text-[#4E5426]"
                      style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                      check_circle
                    </span>

                    <p className="flex-1 font-body text-[14px] font-medium leading-[1.6] text-[#1E2115] sm:text-[15px]">
                      {item.text}
                    </p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>

            {/* Bottom nudge */}
            <AnimateOnScroll animation="fade-up" delay={420} className="mt-6 rounded-2xl bg-[#4E5426] p-5 md:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-body text-[15px] font-bold text-white sm:text-[16px]">
                    Not sure which treatment is right for you?
                  </p>
                  <p className="font-body text-[13px] text-[#E3CC9D]/75 sm:text-[14px]">
                    Our experts will assess your concern and build a customised plan.
                  </p>
                </div>
                <a
                  href="#consultation"
                  className="inline-flex flex-shrink-0 items-center gap-2 self-start rounded-full bg-white px-5 py-2.5 font-body text-[13px] font-bold text-[#4E5426] transition-colors hover:bg-[#E3CC9D] sm:self-auto sm:text-[14px]"
                >
                  Get Your Assessment
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </a>
              </div>
            </AnimateOnScroll>
          </div>

        </div>
      </div>
    </section>
  );
}
