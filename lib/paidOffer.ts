import type { VideoSource } from '@/components/paid/VideoFrame';

/**
 * Shared data for the paid funnel: /skin-hair-consultation (landing) and
 * /skin-hair-consultation/checkout.
 *
 * Payment config lives in env (server only — never NEXT_PUBLIC):
 *  - RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET  API keys
 *  - RAZORPAY_CONSULTATION_AMOUNT           price in rupees, e.g. 999
 *  - RAZORPAY_WEBHOOK_SECRET                for /api/razorpay/webhook
 *
 * OFFER_PRICE and PAYMENT_ENABLED read those env vars, so they are only
 * meaningful on the server. Client components get them as props.
 *
 * TODO before launch: CLIENT_VIDEOS need a YouTube id or MP4 URL each.
 */

export const CHECKOUT_HREF = '/skin-hair-consultation/checkout';

/** Consultation price in rupees, or null when RAZORPAY_CONSULTATION_AMOUNT is unset/invalid. */
export function consultationPrice(): number | null {
  const rupees = Number(process.env.RAZORPAY_CONSULTATION_AMOUNT);
  return Number.isFinite(rupees) && rupees > 0 ? rupees : null;
}

export const OFFER_PRICE = consultationPrice();

/** Keys and a price are all set, so checkout can open Razorpay. */
export const PAYMENT_ENABLED =
  Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) && OFFER_PRICE !== null;

export const OFFER_ITEMS: { label: string; value: number }[] = [
  { label: '1:1 Skin & Hair Consultation', value: 1500 },
  { label: 'Skin & Hair Concern Assessment', value: 500 },
  { label: 'Treatment Suitability Guidance', value: 500 },
  { label: 'Personalised Treatment Plan', value: 1000 },
  { label: 'Advanced Treatment Recommendation', value: 500 },
  { label: 'Skin & Scalp Analysis', value: 500 },
  { label: 'Personalised Skin Care Guidance', value: 500 },
  { label: 'Follow-up & Treatment Guidance', value: 1000 },
];

export const TOTAL_VALUE = OFFER_ITEMS.reduce((sum, item) => sum + item.value, 0);

export const SAVINGS = OFFER_PRICE !== null ? TOTAL_VALUE - OFFER_PRICE : null;

export const CLIENT_VIDEOS: VideoSource[] = [
  { title: 'Client story 1', youtubeId: '', videoUrl: '' },
  { title: 'Client story 2', youtubeId: '', videoUrl: '' },
  { title: 'Client story 3', youtubeId: '', videoUrl: '' },
  { title: 'Client story 4', youtubeId: '', videoUrl: '' },
];

export const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;
