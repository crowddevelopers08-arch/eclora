import type { IconType } from 'react-icons';
import { LuArrowRight, LuMapPin, LuPhone, LuScanFace } from 'react-icons/lu';
import {
  FaCalendarCheck,
  FaCircleQuestion,
  FaClipboardList,
  FaComments,
  FaGem,
  FaHandHoldingHeart,
  FaLightbulb,
  FaMicroscope,
  FaShieldHeart,
  FaStethoscope,
  FaSyringe,
  FaUserDoctor,
  FaVials,
} from 'react-icons/fa6';
import { AnimateOnScroll } from '@/components/AnimateOnScroll';
import { BlobButton } from '@/components/BlobButton';
import { HairRevealArt } from '@/components/hair-scan/HairRevealArt';
import { SITE } from '@/lib/site';

/**
 * Hair concern landing page (/hair-scan).
 *
 * Follows the hairscan.bonitaa.co.in flow — hero → problem → three steps →
 * what you get → what makes us different → closing CTA — with Eclora's copy.
 * "#start-scan" links open the HairScanFlow overlay (quiz → photos → summary);
 * "#consultation" links are picked up by the ConsultationModal in the root
 * layout and open the lead-form popup.
 */

type Item = { title: string; desc: string; icon: IconType };

const steps: Item[] = [
  {
    title: 'Understand Your Hair Concerns',
    desc: 'Start by sharing your hair fall, thinning or scalp concerns with the Eclora team. We’ll help you understand your concerns and available treatment options.',
    icon: FaComments,
  },
  {
    title: 'Explore the Right Treatment',
    desc: 'PRP, GFC or other hair treatments? Treatment recommendations are based on your individual hair and scalp needs.',
    icon: FaSyringe,
  },
  {
    title: 'Follow a Personalised Hair Care Plan',
    desc: 'Not every hair concern needs the same approach. Get personalised guidance and follow a treatment plan designed around your individual requirements.',
    icon: FaCalendarCheck,
  },
];

const benefits: Item[] = [
  {
    title: 'Personalised Hair Care',
    desc: 'Treatment recommendations are tailored to your hair and scalp concerns rather than using a one-size-fits-all approach.',
    icon: FaHandHoldingHeart,
  },
  {
    title: 'Advanced Treatment Options',
    desc: 'Explore hair treatments such as PRP and GFC, based on your individual condition and suitability.',
    icon: FaVials,
  },
  {
    title: 'Expert Guidance',
    desc: 'Understand your hair concerns, treatment options and the next steps with professional guidance throughout your journey.',
    icon: FaStethoscope,
  },
  {
    title: 'Comprehensive Care',
    desc: 'From initial assessment to treatment and follow-up, receive personalised support throughout your hair-care journey.',
    icon: FaShieldHeart,
  },
];

const differences: Item[] = [
  {
    title: 'Advanced Technology',
    desc: 'Modern aesthetic technology designed to support personalised skin and hair treatments.',
    icon: FaMicroscope,
  },
  {
    title: 'Personalised Treatment Plans',
    desc: 'Treatment recommendations based on your individual skin, hair and aesthetic concerns.',
    icon: FaClipboardList,
  },
  {
    title: 'Expert Guidance',
    desc: 'Professional guidance to help you understand suitable treatment options.',
    icon: FaUserDoctor,
  },
  {
    title: 'Premium Clinic Experience',
    desc: 'Personalised care in a premium aesthetic clinic in Gurugram.',
    icon: FaGem,
  },
];

const container = 'mx-auto w-full max-w-[1200px] px-4 sm:px-6 md:px-10';

function Icon({ icon: Svg, className = '' }: { icon: IconType; className?: string }) {
  return <Svg className={`shrink-0 ${className}`} aria-hidden="true" />;
}

function Eyebrow({ index, children, light = false }: { index: string; children: React.ReactNode; light?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-3 font-label text-[12px] font-semibold uppercase tracking-[0.24em] ${
        light ? 'text-[#E3CC9D]' : 'text-[#4E5426]'
      }`}
    >
      {index} · {children}
    </span>
  );
}

function CallLink({ className = '' }: { className?: string }) {
  return (
    <a
      href={`tel:${SITE.phone}`}
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-[#4E5426]/25 px-6 py-3 font-body text-[16px] font-semibold text-[#4E5426] transition-colors hover:border-[#4E5426] hover:bg-[#E3CC9D]/20 ${className}`}
    >
      <Icon icon={LuPhone} className="text-[19px]" />
      {SITE.phoneDisplay}
    </a>
  );
}

/* ---------------------------------------------------------------- Header */

function ScanHeader() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-[#E3CC9D]/60 bg-white/85 backdrop-blur-md">
      <nav className={`${container} flex items-center justify-between py-3`}>
        <a href="#top" className="flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={SITE.logo} alt={SITE.name} className="h-10 w-auto object-contain md:h-11" />
        </a>
        <div className="flex items-center gap-3">
          <a
            href={`tel:${SITE.phone}`}
            aria-label={`Call ${SITE.name}`}
            className="hidden items-center gap-2 font-body text-[15px] font-semibold text-[#4E5426] md:inline-flex"
          >
            <Icon icon={LuPhone} className="text-[19px]" />
            {SITE.phoneDisplay}
          </a>
          <BlobButton
            href="#start-scan"
            className="rounded-full px-5 py-2.5 font-body text-[15px] font-semibold md:px-6"
          >
            Start Hair Scan
          </BlobButton>
        </div>
      </nav>
    </header>
  );
}

/* ------------------------------------------------------------ Section 1 */

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pb-10 pt-24 md:pb-14 md:pt-28">
      {/* Soft sand wash + fine grid */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#E3CC9D]/35 blur-3xl" />
        <div className="absolute -left-40 bottom-0 h-[380px] w-[380px] rounded-full bg-[#4E5426]/[0.07] blur-3xl" />
        <div className="hs-grid absolute inset-0" />
      </div>

      {/* Mobile order: text → scan visual → CTAs. On desktop the visual spans both rows on the right. */}
      <div className={`${container} relative grid gap-7 lg:grid-cols-[1.05fr_0.95fr] lg:gap-x-16`}>
        <div className="lg:col-start-1 lg:row-start-1 lg:self-end">
          <div className="hero-anim-label">
            <Eyebrow index="01">Gurugram</Eyebrow>
          </div>
          <h1 className="hero-anim-title mt-6 font-heading text-[34px] font-bold leading-[1.12] tracking-[-0.02em] text-[#1E2115] sm:text-[44px] lg:text-[54px]">
            Eclora Aesthetics,
            <br className="hidden sm:block" /> A Clinic That
            <br className="hidden sm:block" /> Understands Your
            <br className="hidden sm:block" />{' '}
            <span className="relative whitespace-nowrap text-[#4E5426]">
              Skin &amp; Hair
            </span>{' '}
            Concerns
          </h1>
          <p className="hero-anim-desc mt-6 max-w-[560px] font-body text-[17px] leading-[1.8] text-[#5F6352] md:text-[18px]">
            Providing advanced skin and hair treatments with personalised care and expert guidance,
            tailored to your individual needs in Gurugram.
          </p>
        </div>

        <div className="hero-anim-ctas row-start-3 flex flex-col gap-3 sm:flex-row sm:items-center lg:col-start-1 lg:row-start-2 lg:self-start">
          <BlobButton
            href="#start-scan"
            className="gap-2 rounded-full px-7 py-3.5 font-body text-[16px] font-semibold"
          >
            <Icon icon={LuScanFace} className="text-[19px]" />
            Start Hair Scan
          </BlobButton>
          <CallLink />
        </div>

        {/* Scan-frame visual */}
        <div className="hero-anim-video relative row-start-2 mx-auto w-full max-w-[480px] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
          <div
            role="img"
            aria-label="Illustration of a hair scan revealing healthier hair"
            className="relative aspect-[6/7] overflow-hidden rounded-[2rem] border border-[#E3CC9D] bg-[#E3CC9D]/20 shadow-[0_30px_80px_-30px_rgba(78,84,38,0.45)]"
          >
            <HairRevealArt />

            {/* Corner brackets */}
            {['left-5 top-5 border-l-2 border-t-2', 'right-5 top-5 border-r-2 border-t-2', 'bottom-5 left-5 border-b-2 border-l-2', 'bottom-5 right-5 border-b-2 border-r-2'].map(
              (pos) => (
                <span key={pos} className={`absolute h-9 w-9 rounded-[6px] border-[#4E5426]/70 ${pos}`} aria-hidden="true" />
              )
            )}
          </div>

        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Section 2 */

function Problem() {
  return (
    <section className="py-10 md:py-14">
      <div className={container}>
        <AnimateOnScroll className="overflow-hidden rounded-[2rem] bg-[#4E5426] text-white">
          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-2 lg:gap-16 lg:p-10">
            <div>
              <Eyebrow index="02" light>
                Hair Fall
              </Eyebrow>
              <h2 className="mt-5 font-heading text-[30px] font-bold leading-[1.18] tracking-[-0.01em] sm:text-[38px]">
                Hair Fall Problems?{' '}
                <span className="text-[#E3CC9D]">Eclora Aesthetics has the solutions</span>
              </h2>
              <p className="mt-6 rounded-2xl border border-[#E3CC9D]/25 bg-white/[0.06] p-5 font-body text-[17px] italic leading-[1.7] text-white/90">
                Is your hair fall increasing every day? Using different products but seeing no results?
              </p>
            </div>
            <div className="flex flex-col justify-center gap-6">
              <div className="flex gap-4">
                <Icon icon={FaCircleQuestion} className="mt-1 text-[22px] text-[#E3CC9D]" />
                <p className="font-body text-[17px] leading-[1.8] text-white/80">
                  Without understanding the underlying cause, trying different treatments may not give
                  you the results you expect.
                </p>
              </div>
              <div className="h-px bg-[#E3CC9D]/20" />
              <div className="flex gap-4">
                <Icon icon={FaLightbulb} className="mt-1 text-[22px] text-[#E3CC9D]" />
                <p className="font-body text-[17px] leading-[1.8] text-white/80">
                  At Eclora Aesthetics, we help assess your hair and scalp concerns to better understand
                  the possible factors behind your hair loss and guide you towards suitable treatment
                  options.
                </p>
              </div>
              <BlobButton
                href="#start-scan"
                className="mt-2 gap-2 self-start rounded-full !bg-[#E3CC9D] px-6 py-3 font-body text-[16px] font-semibold !text-[#1E2115]"
              >
                Start Hair Scan
                <Icon icon={LuArrowRight} className="text-[18px]" />
              </BlobButton>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Section 3 */

function Steps() {
  return (
    <section className="py-10 md:py-14">
      <div className={container}>
        <AnimateOnScroll className="mx-auto max-w-[640px] text-center">
          <Eyebrow index="03">How It Works</Eyebrow>
          <h2 className="mt-5 font-heading text-[30px] font-bold leading-[1.2] tracking-[-0.01em] text-[#1E2115] sm:text-[40px]">
            Three Steps To <span className="text-[#4E5426]">Healthier Hair</span>
          </h2>
        </AnimateOnScroll>

        <div className="relative mt-8 grid gap-5 md:mt-10 md:grid-cols-3 md:gap-8">
          {/* Connector line on desktop */}
          <div
            className="pointer-events-none absolute left-[16%] right-[16%] top-[44px] hidden h-px border-t-2 border-dashed border-[#E3CC9D] md:block"
            aria-hidden="true"
          />
          {steps.map((step, i) => (
            <AnimateOnScroll key={step.title} delay={i * 120} className="relative">
              <div className="group flex h-full flex-col items-center rounded-[1.75rem] border border-[#E3CC9D]/70 bg-white p-7 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#4E5426]/40 hover:shadow-[0_24px_60px_-30px_rgba(78,84,38,0.45)]">
                <div className="relative">
                  <span className="flex h-[76px] w-[76px] items-center justify-center rounded-full bg-[#4E5426] text-[#E3CC9D] ring-8 ring-white transition-transform duration-300 group-hover:scale-105">
                    <Icon icon={step.icon} className="text-[30px]" />
                  </span>
                  <span className="absolute -right-2 -top-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#E3CC9D] font-label text-[13px] font-bold text-[#1E2115]">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-6 font-heading text-[20px] font-semibold leading-[1.3] text-[#1E2115]">
                  {step.title}
                </h3>
                <p className="mt-3 font-body text-[16px] leading-[1.75] text-[#5F6352]">{step.desc}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Section 4 */

function Benefits() {
  return (
    <section className="bg-[#E3CC9D]/15 py-10 md:py-14">
      <div className={`${container} grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16`}>
        <AnimateOnScroll className="lg:sticky lg:top-32 lg:self-start">
          <Eyebrow index="04">Your Care</Eyebrow>
          <h2 className="mt-5 font-heading text-[30px] font-bold leading-[1.2] tracking-[-0.01em] text-[#1E2115] sm:text-[40px]">
            What Will You Get at <span className="text-[#4E5426]">Eclora Aesthetics?</span>
          </h2>
          <p className="mt-5 font-body text-[17px] leading-[1.8] text-[#5F6352]">
            Every hair concern is different. At Eclora Aesthetics, we focus on understanding your
            individual needs and guiding you towards suitable treatment options.
          </p>
          <BlobButton
            href="#start-scan"
            className="mt-8 gap-2 rounded-full px-6 py-3 font-body text-[16px] font-semibold"
          >
            Start Hair Scan
            <Icon icon={LuArrowRight} className="text-[18px]" />
          </BlobButton>
        </AnimateOnScroll>

        <div className="grid gap-5 sm:grid-cols-2">
          {benefits.map((item, i) => (
            <AnimateOnScroll key={item.title} delay={i * 100}>
              <div className="group h-full rounded-[1.5rem] border border-[#E3CC9D]/70 bg-white p-6 transition-all duration-300 hover:border-[#4E5426]/40 hover:shadow-[0_20px_50px_-30px_rgba(78,84,38,0.5)] sm:p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E3CC9D]/35 text-[#4E5426] transition-colors duration-300 group-hover:bg-[#4E5426] group-hover:text-[#E3CC9D]">
                  <Icon icon={item.icon} className="text-[22px]" />
                </span>
                <h3 className="mt-5 font-heading text-[19px] font-semibold text-[#1E2115]">{item.title}</h3>
                <p className="mt-2.5 font-body text-[16px] leading-[1.75] text-[#5F6352]">{item.desc}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Section 5 */

function Difference() {
  return (
    <section className="py-10 md:py-14">
      <div className={container}>
        <AnimateOnScroll className="mx-auto max-w-[640px] text-center">
          <Eyebrow index="05">Why Eclora</Eyebrow>
          <h2 className="mt-5 font-heading text-[30px] font-bold leading-[1.2] tracking-[-0.01em] text-[#1E2115] sm:text-[40px]">
            What Makes <span className="text-[#4E5426]">Eclora Aesthetics</span> Different?
          </h2>
        </AnimateOnScroll>

        <div className="mt-8 grid gap-5 md:mt-10 sm:grid-cols-2 lg:grid-cols-4">
          {differences.map((item, i) => (
            <AnimateOnScroll key={item.title} delay={i * 100}>
              <div className="group relative h-full overflow-hidden rounded-[1.5rem] bg-[#4E5426] p-7 text-white transition-transform duration-300 hover:-translate-y-1">
                <div
                  className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#E3CC9D]/10 transition-transform duration-500 group-hover:scale-150"
                  aria-hidden="true"
                />
                <span className="font-label text-[13px] font-semibold tracking-[0.2em] text-[#E3CC9D]/60">
                  0{i + 1}
                </span>
                <Icon icon={item.icon} className="mt-5 block text-[34px] text-[#E3CC9D]" />
                <h3 className="mt-5 font-heading text-[19px] font-semibold leading-[1.3]">{item.title}</h3>
                <p className="mt-2.5 font-body text-[15.5px] leading-[1.75] text-white/75">{item.desc}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Section 6 */

function FinalCta() {
  return (
    <section className="pb-12 pt-0 md:pb-16">
      <div className={container}>
        <AnimateOnScroll animation="scale-in" className="relative overflow-hidden rounded-[2rem] border border-[#E3CC9D] bg-white">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#E3CC9D]/35 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#4E5426]/10 blur-3xl" />
          </div>

          <div className="relative grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-16 lg:p-10">
            <div>
              <p className="max-w-[720px] font-body text-[17px] leading-[1.85] text-[#5F6352]">
                At Eclora Aesthetics, we understand the unique hair concerns faced by individuals in
                India. With advanced technology and personalised treatment approaches, we provide
                scientifically guided solutions for hair loss based on your individual hair and scalp
                needs.
              </p>
              <h2 className="mt-6 font-heading text-[32px] font-bold leading-[1.15] tracking-[-0.02em] text-[#1E2115] sm:text-[44px]">
                Ready to Restore <span className="text-[#4E5426]">Your Hair?</span>
              </h2>
              <p className="mt-4 font-body text-[17px] leading-[1.75] text-[#5F6352]">
                Don&apos;t let hair loss hold you back. Experience expert care tailored to Indian hair
                problems.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <BlobButton
                href="#start-scan"
                className="gap-2 rounded-full px-8 py-4 font-body text-[16px] font-semibold"
              >
                <Icon icon={LuScanFace} className="text-[19px]" />
                Start Hair Scan
              </BlobButton>
              <CallLink className="py-3.5" />
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Footer */

function ScanFooter() {
  return (
    <footer className="bg-[#333719] pb-24 md:pb-0">
      <div className={`${container} flex flex-col gap-5 py-8 md:flex-row md:items-center md:justify-between`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={SITE.logoLight} alt={SITE.name} className="h-10 w-auto self-start object-contain" />
        <div className="flex flex-col gap-3 font-body text-[15px] text-[#E3CC9D]/75 md:items-end">
          <a href={SITE.mapUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 hover:text-[#E3CC9D]">
            <Icon icon={LuMapPin} className="mt-0.5 text-[18px]" />
            {SITE.address}
          </a>
          <a href={`tel:${SITE.phone}`} className="flex items-center gap-2 hover:text-[#E3CC9D]">
            <Icon icon={LuPhone} className="text-[18px]" />
            {SITE.phoneDisplay}
          </a>
        </div>
      </div>
      <div className="border-t border-[#E3CC9D]/15">
        <div className={`${container} flex flex-col items-center justify-between gap-2 py-4 sm:flex-row`}>
          <p className="font-body text-[14px] text-[#E3CC9D]/50">
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <a href="/hair-scan/privacy-policy" className="font-label text-[13px] font-semibold uppercase tracking-[0.14em] text-[#E3CC9D]/50 hover:text-[#E3CC9D]">
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
          <Icon icon={LuPhone} className="text-[19px]" />
          Call Now
        </a>
        <BlobButton href="#start-scan" className="gap-1.5 rounded-full py-3 font-body text-[15px] font-semibold">
          <Icon icon={LuScanFace} className="text-[18px]" />
          Start Hair Scan
        </BlobButton>
      </div>
    </div>
  );
}

export function HairScanLanding() {
  return (
    <>
      <ScanHeader />
      <main>
        <Hero />
        <Problem />
        <Steps />
        <Benefits />
        <Difference />
        <FinalCta />
      </main>
      <ScanFooter />
      <MobileCtaBar />
    </>
  );
}
