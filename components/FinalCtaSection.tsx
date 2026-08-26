import { AnimateOnScroll } from '@/components/AnimateOnScroll';
import { BlobButton } from '@/components/BlobButton';

export function FinalCtaSection() {
  return (
    <section className="bg-white px-4 py-8 sm:px-6 md:px-[60px] md:py-10 lg:py-12">
      <div className="mx-auto max-w-[1280px]">
        <AnimateOnScroll animation="fade-up">
          <div
            className="rounded-[2rem] bg-cover bg-center bg-no-repeat px-6 py-10 text-center sm:px-10 md:px-14 md:py-14 lg:py-16"
            style={{ backgroundImage: "url('/ctaback.png')" }}
          >
            <div className="mx-auto max-w-[720px]">

              <h2 className="font-heading text-[26px] font-bold tracking-[-0.01em] leading-[1.18] text-[#1E2115] sm:text-[30px] md:text-[36px] lg:text-[40px]">
                Ready To Begin Your{' '}
                <span className="text-[#4E5426]">Transformation?</span>
              </h2>

              <p className="mx-auto mt-4 max-w-[600px] font-body text-[14px] leading-[1.9] text-[#4E5426] sm:text-[15px] md:text-[16px]">
                Discover personalised aesthetic solutions designed around your goals.
              </p>

              <div className="mt-7 flex justify-center">
                <BlobButton
                  href="#consultation"
                  className="font-body inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-[14px] font-bold shadow-lg sm:text-[15px] md:px-10"
                >
                  Book Your Consultation Today
                  <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
                </BlobButton>
              </div>

              <p className="mx-auto mt-6 max-w-[600px] font-body text-[14px] leading-[1.9] text-[#4E5426] sm:text-[15px]">
                Speak with our team and take the first step toward healthier skin, enhanced
                confidence, and visible results.
              </p>

            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
