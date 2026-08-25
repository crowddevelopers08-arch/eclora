import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { BeforeAfterSection } from '@/components/BeforeAfterSection';
import { WhyChooseSection } from '@/components/WhyChooseSection';
import { TreatmentsSection } from '@/components/TreatmentsSection';
import { LeadFormSection } from '@/components/LeadFormSection';
import { JourneySection } from '@/components/JourneySection';
import { WhoCanBenefitSection } from '@/components/WhoCanBenefitSection';
import { TestimonialVideoSection } from '@/components/TestimonialVideoSection';
import { FAQSection } from '@/components/FAQSection';
import { FinalCtaSection } from '@/components/FinalCtaSection';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <BeforeAfterSection />
        <WhyChooseSection />
        <TreatmentsSection />
        <LeadFormSection />
        <JourneySection />
        <WhoCanBenefitSection />
        <TestimonialVideoSection />
        <FAQSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </>
  );
}
