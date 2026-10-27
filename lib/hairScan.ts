/**
 * Hair scan flow (/hair-scan) — questions, stages, photo views and the
 * payload shape shared by the client flow and /api/hair-scan.
 */

export type QuestionType = 'text' | 'tel' | 'single' | 'stage';

export interface ScanOption {
  id: string;
  label: string;
  description?: string;
  /** Material Symbols icon name */
  icon?: string;
}

export interface ScanQuestion {
  id: keyof ScanAnswers;
  type: QuestionType;
  question: string;
  subtext?: string;
  placeholder?: string;
  options?: ScanOption[];
}

export interface ScanAnswers {
  name?: string;
  phone?: string;
  age?: string;
  gender?: string;
  concern?: string;
  stage?: string;
}

export const SCAN_QUESTIONS: ScanQuestion[] = [
  {
    id: 'name',
    type: 'text',
    question: 'What’s your name?',
    subtext: 'Let’s make this personal.',
    placeholder: 'Enter your full name',
  },
  {
    id: 'phone',
    type: 'tel',
    question: 'Your mobile number?',
    subtext: 'The Eclora team will reach you on this number.',
    placeholder: '10-digit mobile number',
  },
  {
    id: 'age',
    type: 'single',
    question: 'What’s your age group?',
    subtext: 'Hair concerns can differ by age.',
    options: [
      { id: '18-25', label: '18 – 25', icon: 'bolt' },
      { id: '26-35', label: '26 – 35', icon: 'trending_up' },
      { id: '36-45', label: '36 – 45', icon: 'diamond' },
      { id: '46-55', label: '46 – 55', icon: 'workspace_premium' },
      { id: '55+', label: '55+', icon: 'spa' },
    ],
  },
  {
    id: 'gender',
    type: 'single',
    question: 'What’s your gender?',
    subtext: 'Helps us personalise your guidance.',
    options: [
      { id: 'male', label: 'Male', icon: 'man' },
      { id: 'female', label: 'Female', icon: 'woman' },
      { id: 'other', label: 'Other / Prefer not to say', icon: 'person' },
    ],
  },
  {
    id: 'concern',
    type: 'single',
    question: 'What’s your primary hair concern?',
    subtext: 'Select the one that bothers you most.',
    options: [
      { id: 'hairfall', label: 'Excessive Hair Fall', description: 'Noticeable shedding every day', icon: 'water_drop' },
      { id: 'thinning', label: 'Hair Thinning', description: 'Hair feels weak and fine', icon: 'line_weight' },
      { id: 'receding', label: 'Receding Hairline', description: 'Hairline moving back', icon: 'arrow_upward' },
      { id: 'bald', label: 'Bald Patches', description: 'Visible patchy areas', icon: 'radio_button_unchecked' },
      { id: 'dandruff', label: 'Dandruff / Scalp Issues', description: 'Itchy or flaky scalp', icon: 'grain' },
      { id: 'growth', label: 'Slow Hair Growth', description: 'Hair not growing as expected', icon: 'hourglass_bottom' },
    ],
  },
  {
    id: 'stage',
    type: 'stage',
    question: 'Which picture is closest to your hair right now?',
    subtext: 'Pick the one that best matches. It doesn’t have to be exact.',
  },
];

export const HAIR_STAGES = [
  { id: 'st1', label: 'Stage 1', description: 'No visible hair loss' },
  { id: 'st2', label: 'Stage 2', description: 'Slight recession at the temples' },
  { id: 'st3', label: 'Stage 3', description: 'Hairline recession with crown thinning' },
  { id: 'st4', label: 'Stage 4', description: 'Crown thinning and frontal loss' },
  { id: 'st5', label: 'Stage 5', description: 'Extensive hair loss' },
] as const;

/** Female pattern hair loss progresses as a widening centre part (Ludwig-style), not a receding hairline. */
export const FEMALE_HAIR_STAGES = [
  { id: 'st1', label: 'Stage 1', description: 'No visible hair loss' },
  { id: 'st2', label: 'Stage 2', description: 'Slight widening of the part' },
  { id: 'st3', label: 'Stage 3', description: 'Noticeably wider part' },
  { id: 'st4', label: 'Stage 4', description: 'Thinning spreading across the crown' },
  { id: 'st5', label: 'Stage 5', description: 'Extensive thinning on top' },
] as const;

const isFemale = (gender?: string | null) => gender === 'female';

export const stagesFor = (gender?: string | null) => (isFemale(gender) ? FEMALE_HAIR_STAGES : HAIR_STAGES);

export const findStage = (id?: string | null, gender?: string | null) => stagesFor(gender).find((s) => s.id === id);

export const stageImage = (id: string, gender?: string | null) =>
  isFemale(gender) ? `/hair-scan/stages/female/${id}.svg` : `/hair-scan/stages/${id}.jpeg`;

/** Photos captured in the camera step. `required: false` can be skipped. */
export const PHOTO_VIEWS = [
  {
    id: 'front',
    label: 'Front hairline',
    hint: 'Face the camera, push your hair back and keep your hairline inside the frame.',
    facing: 'user' as const,
    required: true,
  },
  {
    id: 'crown',
    label: 'Top of the head',
    hint: 'Tilt your head down or ask someone to help with the back camera so the crown is visible.',
    facing: 'environment' as const,
    required: false,
  },
];

export type PhotoViewId = (typeof PHOTO_VIEWS)[number]['id'];
export type ScanPhotos = Partial<Record<PhotoViewId, string>>;

export interface HairScanPayload {
  answers: ScanAnswers;
  /** JPEG data URLs keyed by view id */
  photos: ScanPhotos;
  pageUrl?: string;
}

/* ---------------------------------------------------------- labels */

/** `gender` picks the matching stage descriptions when labelling a stage. */
export function optionLabel(questionId: keyof ScanAnswers, value?: string, gender?: string | null): string {
  if (!value) return 'Not specified';
  if (questionId === 'stage') {
    const s = findStage(value, gender);
    return s ? `${s.label} – ${s.description}` : value;
  }
  const q = SCAN_QUESTIONS.find((x) => x.id === questionId);
  return q?.options?.find((o) => o.id === value)?.label ?? value;
}

/* ------------------------------------------------------ validation */

export function cleanPhone(raw: string): string {
  return raw.replace(/\D/g, '').replace(/^(91|0)(?=\d{10}$)/, '');
}

export function validateAnswer(q: ScanQuestion, value: string | undefined): string | null {
  const v = (value ?? '').trim();
  switch (q.type) {
    case 'text':
      if (!v) return 'Please enter your name.';
      if (!/^[a-zA-Z\s'.-]+$/.test(v)) return 'Name should contain letters only.';
      if (v.length < 2) return 'Please enter your full name.';
      return null;
    case 'tel':
      return /^[6-9]\d{9}$/.test(cleanPhone(v)) ? null : 'Please enter a valid 10-digit mobile number.';
    default:
      return v ? null : 'Please make a selection to continue.';
  }
}

/** Max size of one encoded photo accepted by the API (~1.5 MB of JPEG). */
export const MAX_PHOTO_DATA_URL_LENGTH = 2_000_000;
