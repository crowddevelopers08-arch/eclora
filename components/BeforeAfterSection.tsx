import { AnimateOnScroll } from '@/components/AnimateOnScroll';
import { BlobButton } from '@/components/BlobButton';
import { ManualCarousel } from '@/components/ManualCarousel';
import { cld } from '@/lib/site';

/**
 * Results gallery — one auto-scrolling row of cards.
 *
 * `image` is a Cloudinary public ID resolved through `cld()`. Cards render a
 * branded placeholder while a slot is empty. The supplied creatives are square
 * (1:1) JPGs with the logo and caption baked in, so the card's media box is
 * square to show each one uncropped.
 */
type Result = { id: number; title: string; icon: string; image: string };

const RESULTS: Result[] = [
  { id: 1, title: 'Acne & Acne Scars',       icon: 'healing',       image: cld('Before-After_1', 640, 'jpg') },
  { id: 2, title: 'Laser Hair Reduction',    icon: 'auto_fix_high', image: cld('Before-After_2', 640, 'jpg') },
  { id: 3, title: 'Underarm Hair Reduction', icon: 'auto_fix_high', image: cld('Before-After_3', 640, 'jpg') },
  { id: 4, title: 'Pigmentation',            icon: 'blur_on',       image: cld('Before-After_4', 640, 'jpg') },
  { id: 5, title: 'Hair Regrowth',           icon: 'psychiatry',    image: cld('Before-After_5', 640, 'jpg') },
];

function ResultCard({ item }: { item: Result }) {
  return (
    <div className="mr-5 w-[250px] flex-shrink-0 overflow-hidden rounded-2xl border border-[#E3CC9D] bg-white shadow-sm transition-shadow hover:shadow-md sm:w-[290px] lg:w-[320px]">
      {item.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.image}
          alt={`${item.title} treatment result — before and after`}
          loading="lazy"
          width={1080}
          height={1080}
          className="aspect-square w-full object-cover"
        />
      ) : (
        <div className="flex aspect-square w-full items-center justify-center bg-[#E3CC9D]/20">
          <span
            className="material-symbols-outlined text-[38px] text-[#4E5426]/25"
            style={{ fontVariationSettings: '"FILL" 1' }}
          >
            {item.icon}
          </span>
        </div>
      )}

      <div className="p-5">
        <h3 className="font-heading text-[16px] font-bold leading-snug text-[#1E2115] sm:text-[16px]">
          {item.title}
        </h3>
      </div>
    </div>
  );
}

export function BeforeAfterSection() {
  return (
    <section id="results" className="overflow-hidden bg-white py-8 md:py-10 lg:py-12">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-[60px]">

        {/* Header */}
        <AnimateOnScroll animation="fade-down" className="mb-6 text-center md:mb-8">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E3CC9D] bg-white px-3 py-1">
            <span className="material-symbols-outlined text-[15px] text-[#4E5426]" style={{ fontVariationSettings: '"FILL" 1' }}>
              photo_library
            </span>
            <span className="font-label text-[13px] font-semibold uppercase tracking-[0.14em] text-[#4E5426] sm:text-[14px]">
              Before &amp; After
            </span>
          </span>

          <h2 className="mt-3 font-heading text-[24px] font-bold tracking-[-0.01em] leading-[1.2] text-[#1E2115] sm:text-[28px] md:text-[32px] lg:text-[36px]">
            Real Results, <span className="text-[#4E5426]">Real Transformations</span>
          </h2>

          <p className="mx-auto mt-3 max-w-[620px] font-body text-[16px] leading-[1.8] text-[#5F6352] sm:text-[16px]">
            Results from our most requested skin, hair and body treatments — every plan built
            around the individual concern it was designed to solve.
          </p>
        </AnimateOnScroll>
      </div>

      {/* Auto-scrolling single row — pauses on hover */}
      {/* py-2 keeps the card borders and shadows off the overflow-hidden clip edge */}
      <AnimateOnScroll animation="fade-up" className="w-full py-2">
        <ManualCarousel duration={38}>
          {RESULTS.map((item) => (
            <ResultCard key={item.id} item={item} />
          ))}
        </ManualCarousel>
      </AnimateOnScroll>

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-[60px]">
        {/* CTA */}
        <AnimateOnScroll animation="fade-up" delay={200} className="mt-7 flex justify-center md:mt-8">
          <BlobButton
            href="#consultation"
            className="font-body inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-[16px] font-semibold shadow-md sm:text-[16px] md:px-10"
          >
            Book Your Consultation Today
            <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
          </BlobButton>
        </AnimateOnScroll>
      </div>

    </section>
  );
}
