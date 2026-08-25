import { AnimateOnScroll } from '@/components/AnimateOnScroll';

/** Treatment offer posters — each artwork already carries its own pricing and features. */
const POSTERS = [
  { id: 'pigmentation',  title: 'Pigmentation Treatments', image: '/pigmentation-poster.png' },
  { id: 'lhr',           title: 'Laser Hair Reduction',    image: '/laser-poster.png' },
  { id: 'hifu',          title: 'HIFU Skin Tightening',    image: '/thightning-poster.png' },
  { id: 'exosomes',      title: 'Duet Exosomes Therapy',   image: '/exosomes-poster.png' },
  { id: 'laser-toning',  title: 'Laser Toning',            image: '/toning-poster.png' },
  { id: 'party-peel',    title: 'Party Peel Facial',       image: '/party-poster.png' },
  { id: 'hair-regrowth', title: 'Hair Regrowth Treatments', image: '/regrowth-poster.png' },
] as const;

function PosterCard({ item }: { item: (typeof POSTERS)[number] }) {
  return (
    <a
      href="#consultation"
      className="mr-5 block w-[240px] flex-shrink-0 overflow-hidden rounded-2xl border border-[#E3CC9D] bg-white shadow-sm transition-shadow hover:shadow-lg sm:w-[280px] lg:w-[320px]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.image}
        alt={`${item.title} — offer details`}
        loading="lazy"
        className="block w-full"
      />
    </a>
  );
}

export function TreatmentsSection() {
  return (
    <section id="treatments" className="overflow-hidden bg-white py-8 md:py-10 lg:py-12">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-[60px]">

        <AnimateOnScroll animation="fade-down" className="mb-6 text-center md:mb-8">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E3CC9D] bg-white px-3 py-1">
            <span className="material-symbols-outlined text-[13px] text-[#4E5426]" style={{ fontVariationSettings: '"FILL" 1' }}>
              spa
            </span>
            <span className="font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-[#4E5426] sm:text-[12px]">
              Treatments
            </span>
          </span>

          <h2 className="mt-3 font-heading text-[24px] font-extrabold leading-[1.2] text-[#1E2115] sm:text-[28px] md:text-[32px] lg:text-[36px]">
            Our Most <span className="text-[#4E5426]">Popular Treatments</span>
          </h2>

          <p className="mx-auto mt-3 max-w-[620px] font-body text-[14px] leading-[1.8] text-[#5F6352] sm:text-[15px]">
            Customised protocols for skin, hair and body — with transparent pricing and a plan
            built around your concern.
          </p>
        </AnimateOnScroll>
      </div>

      {/* Auto-scrolling poster row — pauses on hover */}
      {/* py-2 keeps the card borders and shadows off the overflow-hidden clip edge */}
      <AnimateOnScroll animation="fade-up" className="marquee-viewport w-full overflow-hidden py-2">
        <div className="marquee-track" style={{ '--marquee-duration': '55s' } as React.CSSProperties}>
          {/* The list is rendered twice so the loop is seamless at translateX(-50%) */}
          {[...POSTERS, ...POSTERS].map((item, i) => (
            <PosterCard key={`${item.id}-${i}`} item={item} />
          ))}
        </div>
      </AnimateOnScroll>

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-[60px]">
        <AnimateOnScroll animation="fade-up" delay={200} className="mt-7 flex justify-center md:mt-8">
          <a
            href="#consultation"
            className="font-body inline-flex items-center gap-2 rounded-full bg-[#4E5426] px-8 py-3.5 text-[14px] font-semibold text-white shadow-md transition-colors hover:bg-[#4E5426]/90 sm:text-[15px] md:px-10"
          >
            Book Your Consultation Today
            <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
          </a>
        </AnimateOnScroll>
      </div>

    </section>
  );
}
