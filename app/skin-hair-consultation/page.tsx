import type { Metadata } from 'next';
import { PaidLanding } from '@/components/PaidLanding';

export const metadata: Metadata = {
  title: 'Skin & Hair Consultation in Gurugram | Eclora Aesthetics',
  description:
    'Understand your skin and hair concerns and explore suitable treatment options with personalised care at Eclora Aesthetics, Gurugram.',
};

export default function SkinHairConsultationPage() {
  return <PaidLanding />;
}
