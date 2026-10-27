import type { IconType } from 'react-icons';
import {
  FaArrowRight,
  FaBurst,
  FaCircleCheck,
  FaCircleHalfStroke,
  FaDroplet,
  FaHandHoldingHeart,
  FaHandSparkles,
  FaLayerGroup,
  FaLocationDot,
  FaMicroscope,
  FaPhone,
  FaSeedling,
  FaUserCheck,
  FaUserDoctor,
  FaWandMagicSparkles,
} from 'react-icons/fa6';
import { AnimateOnScroll } from '@/components/AnimateOnScroll';
import { BlobButton } from '@/components/BlobButton';
import { PaymentBadges } from '@/components/paid/PaymentBadges';
import { TreatmentCarousel, type Treatment } from '@/components/paid/TreatmentCarousel';
import { VideoFrame, type VideoSource } from '@/components/paid/VideoFrame';
import {
  CHECKOUT_HREF,
  CLIENT_VIDEOS,
  OFFER_ITEMS,
  OFFER_PRICE,
  PAYMENT_ENABLED,
  SAVINGS,
  TOTAL_VALUE,
  inr,
} from '@/lib/paidOffer';
import { SITE } from '@/lib/site';

/**
 * Paid-traffic landing page (/skin-hair-consultation).
 *
 * Structure follows a video-sales-letter layout: video hero → client video
 * testimonials → why Eclora → treatment carousel → priced value stack. Every
 * booking CTA goes to the checkout page (CHECKOUT_HREF). Offer prices and
 * client videos live in lib/paidOffer.ts so both pages stay in step.
 */

/* ----------------------------------------------------------------- Content
 * TODO before launch: HERO_VIDEO needs a YouTube id or MP4 URL.
 */

const HERO_VIDEO: VideoSource = { title: 'Watch this before you begin', youtubeId: '', videoUrl: '' };

const REASONS: { title: string; desc: string; icon: IconType }[] = [
  { title: 'Personalised Approach', desc: 'Treatment recommendations based on your individual concerns.', icon: FaUserCheck },
  { title: 'Advanced Technology', desc: 'Access to modern aesthetic treatment technologies.', icon: FaMicroscope },
  { title: 'Multiple Treatment Options', desc: 'Skin, hair and aesthetic solutions under one roof.', icon: FaLayerGroup },
  { title: 'Professional Guidance', desc: 'Understand your treatment options before proceeding.', icon: FaUserDoctor },
  { title: 'Pre & Post Care', desc: 'Guidance throughout your treatment journey.', icon: FaHandHoldingHeart },
];

const TREATMENTS: Treatment[] = [
  {
    name: 'LHR',
    icon: <FaWandMagicSparkles />,
    image: '/paid/lhr.jpg',
    intro: [
      'Unwanted facial or body hair can become a regular grooming concern.',
      'Eclora offers personalised Laser Hair Reduction for multiple treatment areas.',
    ],
    listLabel: 'Areas can include',
    items: ['Face', 'Underarms', 'Arms', 'Legs', 'Back', 'Bikini area', 'Full body'],
  },
  {
    name: 'Q Switch Laser',
    icon: <FaCircleHalfStroke />,
    image: '/paid/q-switch.jpg',
    imagePosition: 'center 65%',
    heading: 'Address Pigmentation & Uneven Skin Tone',
    intro: [
      'Dark spots, pigmentation and uneven skin tone can have different causes.',
      'Q-Switch Laser may be considered for suitable pigmentation-related concerns after professional assessment.',
    ],
    listLabel: 'Common concerns',
    items: ['Pigmentation', 'Dark spots', 'Uneven skin tone', 'Tanning-related concerns', 'Certain pigmentation concerns'],
  },
  {
    name: 'Hair Loss Treatments',
    icon: <FaSeedling />,
    image: '/paid/hair-loss.jpg',
    imagePosition: 'center 35%',
    heading: 'Understand Your Hair Fall Before Choosing a Treatment',
    intro: [
      'Hair fall can have different underlying factors. Instead of choosing a treatment based only on symptoms, start with an assessment.',
    ],
    listLabel: 'Eclora provides personalised guidance for',
    items: ['Hair fall', 'Hair thinning', 'Reduced hair density', 'Scalp concerns', 'Hair quality concerns'],
  },
  {
    name: 'Micro Needling',
    icon: <FaHandSparkles />,
    image: '/paid/micro-needling.jpg',
    imagePosition: 'center 78%',
    heading: 'Support Better-Looking Skin Texture',
    intro: [
      "Microneedling is an aesthetic treatment that uses controlled micro-injuries to support the skin's natural renewal process.",
    ],
    listLabel: 'It may be considered for concerns such as',
    items: ['Acne scars', 'Uneven skin texture', 'Enlarged-looking pores', 'Fine lines', 'Skin rejuvenation'],
  },
  {
    name: 'CO2 Fractional Laser',
    icon: <FaBurst />,
    image: '/paid/co2-laser.jpg',
    imagePosition: 'center 80%',
    heading: 'Advanced Laser Care for Skin Texture Concerns',
    intro: ['Fractional laser treatments can be considered for selected skin texture and resurfacing concerns.'],
    listLabel: 'Common treatment considerations',
    items: ['Acne scars', 'Uneven skin texture', 'Fine lines', 'Certain pigmentation concerns', 'Skin resurfacing'],
  },
  {
    name: 'IV Drips',
    icon: <FaDroplet />,
    image: '/paid/iv-drips.jpg',
    imagePosition: 'center 45%',
    heading: 'Personalised IV Wellness Support',
    intro: ['IV drips can be considered based on individual requirements and professional assessment.'],
    listLabel: 'Depending on suitability, options may focus on',
    items: ['Hydration support', 'Nutrient support', 'Wellness needs', 'Individualised care'],
  },
];

export const container = 'mx-auto w-full max-w-[1200px] px-4 sm:px-6 md:px-10';

/* --------------------------------------------------------------- Helpers */

export function SectionHeading({ eyebrow, title, accent, sub }: { eyebrow: string; title: string; accent?: string; sub?: string }) {
  return (
    <AnimateOnScroll className="mx-auto max-w-[680px] text-center">
      <span className="font-label text-[12px] font-semibold uppercase tracking-[0.24em] text-[#4E5426]">{eyebrow}</span>
      <h2 className="mt-4 font-heading text-[28px] font-bold leading-[1.2] tracking-[-0.01em] text-[#1E2115] sm:text-[38px]">
        {title} {accent && <span className="text-[#4E5426]">{accent}</span>}
      </h2>
      {sub && <p className="mt-4 font-body text-[17px] leading-[1.75] text-[#5F6352]">{sub}</p>}
    </AnimateOnScroll>
  );
}

function PrimaryCta({
  label = 'Book Your Consultation',
  href = CHECKOUT_HREF,
  className = '',
}: {
  label?: string;
  href?: string;
  className?: string;
}) {
  return (
    <BlobButton
      href={href}
      className={`gap-2 rounded-full px-8 py-4 font-body text-[16px] font-semibold shadow-md ${className}`}
    >
      {label}
      <FaArrowRight className="text-[14px]" aria-hidden="true" />
    </BlobButton>
  );
}

/* ---------------------------------------------------------------- Header */

export function PaidHeader({ homeHref = '#top', ctaHref = CHECKOUT_HREF }: { homeHref?: string; ctaHref?: string }) {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-[#E3CC9D]/60 bg-white/85 backdrop-blur-md">
      <nav className={`${container} flex items-center justify-between py-3`}>
        <a href={homeHref} className="flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={SITE.logo} alt={SITE.name} className="h-10 w-auto object-contain md:h-11" />
        </a>
        <div className="flex items-center gap-4">
          <a
            href={`tel:${SITE.phone}`}
            className="hidden items-center gap-2 font-body text-[15px] font-semibold text-[#4E5426] md:inline-flex"
          >
            <FaPhone className="text-[14px]" aria-hidden="true" />
            {SITE.phoneDisplay}
          </a>
          <BlobButton href={ctaHref} className="rounded-full px-5 py-2.5 font-body text-[15px] font-semibold md:px-6">
            Book Now
          </BlobButton>
        </div>
      </nav>
    </header>
  );
}

/* ------------------------------------------------------ Section 1: Hero */

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pb-10 pt-20 md:pb-14 md:pt-24">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#E3CC9D]/35 blur-3xl" />
        <div className="absolute -left-40 bottom-0 h-[380px] w-[380px] rounded-full bg-[#4E5426]/[0.07] blur-3xl" />
        <div className="hs-grid absolute inset-0" />
      </div>

      <div className={`${container} relative text-center`}>
        <h1 className="hero-anim-title mx-auto max-w-[900px] font-heading text-[30px] font-bold leading-[1.15] tracking-[-0.02em] text-[#1E2115] sm:text-[42px] lg:text-[52px]">
          Before you spend thousands on treatments and skincare,{' '}
          <span className="text-[#4E5426]">watch this video first.</span>
        </h1>
        <p className="hero-anim-desc mx-auto mt-5 max-w-[720px] font-body text-[17px] leading-[1.8] text-[#5F6352] md:text-[18px]">
          At Eclora Aesthetics, we help you understand your skin and hair concerns and explore suitable
          treatment options based on your individual needs.
        </p>

        <div className="hero-anim-video mx-auto mt-8 max-w-[860px] shadow-[0_30px_80px_-30px_rgba(78,84,38,0.5)]">
          <VideoFrame video={HERO_VIDEO} />
        </div>

        <p className="mx-auto mt-7 max-w-[680px] font-body text-[16px] leading-[1.75] text-[#5F6352] md:text-[17px]">
          With advanced treatments and personalised care, we focus on helping you make informed
          decisions about your skin and hair.
        </p>

        <div className="hero-anim-ctas mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <PrimaryCta />
          <a
            href={`tel:${SITE.phone}`}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#4E5426]/25 px-6 py-3.5 font-body text-[16px] font-semibold text-[#4E5426] transition-colors hover:border-[#4E5426] hover:bg-[#E3CC9D]/20"
          >
            <FaPhone className="text-[14px]" aria-hidden="true" />
            {SITE.phoneDisplay}
          </a>
        </div>

        <PaymentBadges className="mt-7" paymentEnabled={PAYMENT_ENABLED} />
      </div>
    </section>
  );
}

/* ------------------------------------------- Section 2: Client videos */

export function ClientStories({ ctaHref = CHECKOUT_HREF }: { ctaHref?: string }) {
  return (
    <section className="bg-[#E3CC9D]/15 py-10 md:py-14">
      <div className={container}>
        <SectionHeading
          eyebrow="In Their Own Words"
          title="Real People’s Experiences"
          accent="with Eclora"
          sub="Hear what our clients have to say about their journey and how Eclora supported them."
        />

        {/* Swipe row on mobile, 4-up grid on desktop */}
        <div className="-mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 md:mx-0 md:mt-10 md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
          {CLIENT_VIDEOS.map((video, i) => (
            <AnimateOnScroll key={video.title} delay={i * 90} className="w-[72%] flex-shrink-0 snap-center sm:w-[45%] md:w-auto">
              <VideoFrame video={video} aspect="aspect-[9/16]" />
            </AnimateOnScroll>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <PrimaryCta href={ctaHref} />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------ Section 3: Why Eclora */

function WhyChoose() {
  return (
    <section className="py-10 md:py-14">
      <div className={container}>
        <SectionHeading eyebrow="Why Eclora" title="Why Choose" accent="Eclora Aesthetics & Laser Clinic?" />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:mt-10 lg:grid-cols-5">
          {REASONS.map((r, i) => {
            const Icon = r.icon;
            return (
              <AnimateOnScroll key={r.title} delay={i * 90}>
                {/* Compact row (icon left) on phones, stacked card from sm up */}
                <div className="group flex h-full gap-4 rounded-[1.25rem] border border-[#E3CC9D]/70 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#4E5426]/40 hover:shadow-[0_20px_50px_-30px_rgba(78,84,38,0.5)] sm:block sm:rounded-[1.5rem] sm:p-6">
                  <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-[#4E5426] text-[#E3CC9D] transition-transform duration-300 group-hover:scale-105 sm:h-12 sm:w-12">
                    <Icon className="text-[20px] sm:text-[22px]" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-heading text-[17px] font-semibold leading-[1.3] text-[#1E2115] sm:mt-5 sm:text-[18px]">{r.title}</h3>
                    <p className="mt-1 font-body text-[15px] leading-[1.6] text-[#5F6352] sm:mt-2 sm:text-[15.5px] sm:leading-[1.7]">{r.desc}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------- Section 4: Treatments */

function Treatments() {
  return (
    <section className="bg-[#E3CC9D]/15 py-10 md:py-14">
      <div className={container}>
        <SectionHeading eyebrow="Treatments" title="Treatments We Are" accent="Specialised In" />
        <AnimateOnScroll className="mt-8 md:mt-10">
          <TreatmentCarousel treatments={TREATMENTS} />
        </AnimateOnScroll>
      </div>
    </section>
  );
}

/* --------------------------------------------- Section 5: Value stack */

function Offer() {
  const savings = SAVINGS;

  return (
    <section id="offer" className="py-10 md:py-14">
      <div className={container}>
        <SectionHeading eyebrow="Your Plan" title="Start Your Skin & Hair Care" accent="Journey Today" />

        <AnimateOnScroll animation="scale-in" className="mx-auto mt-8 max-w-[720px] md:mt-10">
          <div className="overflow-hidden rounded-[2rem] border border-[#E3CC9D] bg-white shadow-[0_30px_80px_-40px_rgba(78,84,38,0.5)]">
            <div className="flex items-center justify-between bg-[#4E5426] px-6 py-4 sm:px-8">
              <span className="font-heading text-[18px] font-semibold text-white">Everything you get</span>
              <span className="rounded-full bg-[#E3CC9D] px-3 py-1 font-label text-[12px] font-bold uppercase tracking-[0.14em] text-[#1E2115]">
                {OFFER_ITEMS.length} items
              </span>
            </div>

            <ul className="divide-y divide-[#E3CC9D]/60 px-6 sm:px-8">
              {OFFER_ITEMS.map((item) => (
                <li key={item.label} className="flex items-center justify-between gap-4 py-3.5">
                  <span className="flex items-start gap-3 font-body text-[16px] text-[#1E2115]">
                    <FaCircleCheck className="mt-1 flex-shrink-0 text-[16px] text-[#4E5426]" aria-hidden="true" />
                    {item.label}
                  </span>
                  <span className="flex-shrink-0 font-body text-[16px] font-semibold text-[#5F6352]">{inr(item.value)}</span>
                </li>
              ))}
            </ul>

            <div className="mx-6 flex items-center justify-between border-t-2 border-dashed border-[#E3CC9D] py-4 sm:mx-8">
              <span className="font-label text-[13px] font-bold uppercase tracking-[0.16em] text-[#1E2115]">Total Value</span>
              <span className={`font-heading text-[22px] font-bold text-[#1E2115] ${OFFER_PRICE !== null ? 'line-through decoration-[#4E5426]/60' : ''}`}>
                {inr(TOTAL_VALUE)}
              </span>
            </div>

            <div className="bg-[#E3CC9D]/25 px-6 py-7 text-center sm:px-8">
              {savings !== null && savings > 0 && (
                <span className="inline-block rounded-full bg-[#4E5426] px-4 py-1.5 font-label text-[13px] font-bold uppercase tracking-[0.14em] text-[#E3CC9D]">
                  You save {inr(savings)}
                </span>
              )}
              <p className="mt-4 font-label text-[13px] font-bold uppercase tracking-[0.18em] text-[#4E5426]">
                Start your Eclora care journey today
              </p>
              {OFFER_PRICE !== null && (
                <p className="mt-2 flex items-baseline justify-center gap-3">
                  <span className="font-heading text-[44px] font-bold leading-none text-[#1E2115]">{inr(OFFER_PRICE)}</span>
                  <span className="font-body text-[20px] text-[#8A8D80] line-through">{inr(TOTAL_VALUE)}</span>
                </p>
              )}
              <PrimaryCta label="Talk to an Eclora Expert" className="mt-6 w-full sm:w-auto" />
              <PaymentBadges className="mt-6" paymentEnabled={PAYMENT_ENABLED} />
              <p className="mt-4 font-body text-[13.5px] leading-[1.6] text-[#5F6352]">
                Treatment recommendations are based on individual assessment and suitability.
              </p>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Footer */

/** `withMobileBar` keeps room for the sticky Call / Book bar (landing page only). */
export function PaidFooter({ withMobileBar = true }: { withMobileBar?: boolean }) {
  return (
    <footer className={`bg-[#333719] ${withMobileBar ? 'pb-24 md:pb-0' : ''}`}>
      <div className={`${container} flex flex-col gap-5 py-8 md:flex-row md:items-center md:justify-between`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={SITE.logoLight} alt={SITE.name} className="h-10 w-auto self-start object-contain" />
        <div className="flex flex-col gap-3 font-body text-[15px] text-[#E3CC9D]/75 md:items-end">
          <a href={SITE.mapUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 hover:text-[#E3CC9D]">
            <FaLocationDot className="mt-1 flex-shrink-0 text-[15px]" aria-hidden="true" />
            {SITE.address}
          </a>
          <a href={`tel:${SITE.phone}`} className="flex items-center gap-2 hover:text-[#E3CC9D]">
            <FaPhone className="text-[14px]" aria-hidden="true" />
            {SITE.phoneDisplay}
          </a>
        </div>
      </div>
      <div className="border-t border-[#E3CC9D]/15">
        <div className={`${container} flex flex-col items-center justify-between gap-2 py-4 sm:flex-row`}>
          <p className="font-body text-[14px] text-[#E3CC9D]/50">
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <a href="/privacy-policy" className="font-label text-[13px] font-semibold uppercase tracking-[0.14em] text-[#E3CC9D]/50 hover:text-[#E3CC9D]">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}

/* --------------------------------------------------- Mobile sticky bar */

function MobileCtaBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E3CC9D] bg-white/95 p-3 backdrop-blur-md md:hidden">
      <div className="grid grid-cols-2 gap-3">
        <a
          href={`tel:${SITE.phone}`}
          className="flex items-center justify-center gap-2 rounded-full border border-[#4E5426]/30 py-3 font-body text-[15px] font-semibold text-[#4E5426]"
        >
          <FaPhone className="text-[14px]" aria-hidden="true" />
          Call Now
        </a>
        <BlobButton href={CHECKOUT_HREF} className="rounded-full py-3 font-body text-[15px] font-semibold">
          Book Now
        </BlobButton>
      </div>
    </div>
  );
}

export function PaidLanding() {
  return (
    <>
      <PaidHeader />
      <main>
        <Hero />
        <ClientStories />
        <WhyChoose />
        <Treatments />
        <Offer />
      </main>
      <PaidFooter />
      <MobileCtaBar />
    </>
  );
}
