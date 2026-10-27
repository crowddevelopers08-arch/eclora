import type { Metadata } from 'next';
import { CheckoutPage } from '@/components/paid/CheckoutPage';

export const metadata: Metadata = {
  title: 'Book Your Skin & Hair Consultation | Eclora Aesthetics',
  description: 'Start your skin and hair care journey with a personalised consultation at Eclora Aesthetics, Gurugram.',
  robots: { index: false, follow: false },
};

export default function SkinHairCheckoutPage() {
  return <CheckoutPage />;
}
