import type { Metadata } from 'next';
import { HairScanLanding } from '@/components/HairScanLanding';
import { HairScanFlow } from '@/components/hair-scan/HairScanFlow';

export const metadata: Metadata = {
  title: 'Hair Fall Treatment in Gurugram | Eclora Aesthetics',
  description:
    'Eclora Aesthetics helps assess your hair and scalp concerns and guides you towards suitable treatment options such as PRP and GFC, with personalised care in Gurugram.',
};

export default function HairScanPage() {
  return (
    <>
      <HairScanLanding />
      <HairScanFlow />
    </>
  );
}
