import type { Metadata } from 'next';
import { RatingPicker } from '@/components/review/RatingPicker';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: `Share Your Review | ${SITE.name}`,
  description: `Tell us about your experience at ${SITE.name}.`,
  robots: { index: false, follow: false },
};

export default function ReviewPage() {
  return (
    <div className="review-shell flex min-h-screen flex-col items-center justify-center p-4 sm:p-6">
      <div className="mx-auto w-full max-w-[460px] rounded-[28px] bg-[var(--r-card)] px-5 py-8 shadow-[0_40px_80px_-40px_rgba(20,22,10,0.75)] sm:px-9 sm:py-10">
        <div className="flex flex-col items-center">
          <img src={SITE.logo} alt={SITE.name} className="h-14 w-auto object-contain sm:h-16" />
        </div>
        <div className="mt-7">
          <RatingPicker />
        </div>
      </div>
    </div>
  );
}
