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

  /** Wordmark, background keyed out and trimmed — derived from /eclonew-logo.png */
  logo: '/eclora-logo.png',
  /** Sand-tinted wordmark for dark olive surfaces (footer) */
  logoLight: '/eclora-logo-light.png',
  /** Circular badge — derived from /eclo-fav.png */
  favicon: '/favicon-192.png',
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
