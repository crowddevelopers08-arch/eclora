/** Cloudinary account holding every site image. */
const CLOUD_NAME = 'liu8jcpl';

/**
 * Build a Cloudinary delivery URL for an asset public ID.
 *
 * `f_auto,q_auto` lets Cloudinary negotiate AVIF/WebP and a sane quality per
 * request — the source PNGs are up to 1.8 MB each and drop to roughly a tenth
 * of that. Pass `width` to also cap the delivered pixel width (`w_<n>`); the
 * assets are far larger than any slot they render into.
 */
export function cld(publicId: string, width?: number): string {
  const transforms = ['f_auto', 'q_auto', ...(width ? [`w_${width}`] : [])].join(',');
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${publicId}.png`;
}

/**
 * Same asset, delivered as a genuine PNG. Used for favicons and app icons, where
 * `f_auto` would negotiate WebP and browsers/OSes expect the declared type.
 */
export function cldPng(publicId: string): string {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/q_auto/${publicId}.png`;
}

/**
 * Single source of truth for Eclora Aesthetics brand details.
 * Contact details are the clinic's live ones. The social links below are still
 * placeholders — swap `instagram` / `facebook` for the real profile URLs.
 */
export const SITE = {
  name: 'Eclora Aesthetics',
  tagline: 'Advanced Skin, Hair & Body Treatments',

  phone: '+918291643775',
  phoneDisplay: '+91 82916 43775',
  whatsapp: '918291643775',
  email: 'contact@ecloraaesthetics.com',
  address: '842B, C Block, Sushant Lok Phase-1, Gurugram, Haryana',
  hours: 'Mon–Sun, 10:00 AM – 8:00 PM',
  mapUrl:
    'https://www.google.com/maps/search/?api=1&query=Eclora+Aesthetics+842B+C+Block+Sushant+Lok+Phase-1+Gurugram+Haryana',

  instagram: '#',
  facebook: '#',

  /** Wordmark, background keyed out and trimmed — derived from the eclonew-logo asset */
  logo: cld('eclora-logo', 480),
  /** Sand-tinted wordmark for dark olive surfaces (footer) */
  logoLight: cld('eclora-logo-light', 480),
  /** Circular badge — derived from the eclo-fav asset */
  favicon: cldPng('favicon-192'),
} as const;

/**
 * Brand palette — mirrors the CSS variables declared in app/globals.css.
 *
 * Two brand colours on white: every surface is either white or brand olive.
 * Sand carries borders, accents, and light-on-olive text; `tint` (sand at 20%)
 * is the only fill used for icon chips and hover states.
 */
export const COLORS = {
  /** Brand olive — hovers use this at 90% alpha, not a second shade */
  primary: '#4E5426',
  /** Brand sand */
  sand: '#E3CC9D',

  white: '#FFFFFF',
  tint: 'rgba(227, 204, 157, 0.2)',

  text: '#1E2115',
  textSecondary: '#5F6352',
  textMuted: '#8A8D80',

  border: '#E3CC9D',
  hover: 'rgba(227, 204, 157, 0.2)',
} as const;
