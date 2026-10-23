/**
 * Hero illustration for /hair-scan: a man with advanced hair loss; the scan
 * line sweeps over him, then back up revealing the same man with full hair.
 *
 * Two identical figures are stacked and only the hair differs. The "after"
 * layer is unclipped from the bottom in step with the scan line (both driven by the
 * hs-reveal / hs-reveal-line keyframes in globals.css, same duration).
 */

const SKIN = '#EDC09B';
const SKIN_SHADE = '#D9A57E';
const HAIR = '#2E2118';
const HAIR_LIGHT = '#5A4130';

function Figure({ id, hair }: { id: string; hair: 'before' | 'after' }) {
  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={hair === 'after' ? '#F3EEDD' : '#F6EEDD'} />
          <stop offset="100%" stopColor={hair === 'after' ? '#E2DABB' : '#EADCC0'} />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Backdrop */}
      <rect width="400" height="500" fill={`url(#${id}-bg)`} />
      <circle cx="200" cy="215" r="165" fill="#E3CC9D" opacity="0.35" />
      <circle cx="200" cy="200" r="150" fill={`url(#${id}-glow)`} />

      {/* Neck */}
      <path d="M170 290 L170 380 L200 432 L230 380 L230 290 Z" fill={SKIN_SHADE} />

      {/* Shirt */}
      <path d="M40 500 C48 420 108 388 165 372 L200 428 L235 372 C292 388 352 420 360 500 Z" fill="#4E5426" />
      <path d="M165 368 L200 428 L180 446 L148 380 Z" fill="#E3CC9D" />
      <path d="M235 368 L200 428 L220 446 L252 380 Z" fill="#E3CC9D" />
      <path d="M100 430 C120 445 130 470 132 500" stroke="#3F451F" strokeWidth="3" fill="none" opacity="0.5" />
      <path d="M300 430 C280 445 270 470 268 500" stroke="#3F451F" strokeWidth="3" fill="none" opacity="0.5" />

      {/* Ears */}
      <ellipse cx="126" cy="226" rx="15" ry="25" fill={SKIN_SHADE} />
      <ellipse cx="274" cy="226" rx="15" ry="25" fill={SKIN_SHADE} />
      <path d="M124 214 Q118 226 126 238" stroke="#C98F68" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M276 214 Q282 226 274 238" stroke="#C98F68" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Head */}
      <path
        d="M200 92 C250 92 278 130 278 190 C278 230 274 262 262 288 C248 318 226 334 200 334 C174 334 152 318 138 288 C126 262 122 230 122 190 C122 130 150 92 200 92 Z"
        fill={SKIN}
      />

      {/* Stubble */}
      <path
        d="M138 262 C146 306 172 332 200 332 C228 332 254 306 262 262 C254 292 232 312 200 312 C168 312 146 292 138 262 Z"
        fill="#3B2A1E"
        opacity="0.13"
      />

      {/* Face */}
      <path d="M148 190 Q165 181 183 187" stroke="#3B2A1E" strokeWidth="5.5" fill="none" strokeLinecap="round" />
      <path d="M217 187 Q235 181 252 190" stroke="#3B2A1E" strokeWidth="5.5" fill="none" strokeLinecap="round" />
      <ellipse cx="166" cy="208" rx="5.5" ry="6" fill="#2B211A" />
      <ellipse cx="234" cy="208" rx="5.5" ry="6" fill="#2B211A" />
      <circle cx="168" cy="206" r="1.6" fill="#FFFFFF" />
      <circle cx="236" cy="206" r="1.6" fill="#FFFFFF" />
      <path d="M201 208 L194 248 Q200 255 209 249" stroke="#C98F68" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <ellipse cx="160" cy="250" rx="13" ry="7" fill="#E59F86" opacity="0.35" />
      <ellipse cx="240" cy="250" rx="13" ry="7" fill="#E59F86" opacity="0.35" />
      <path d="M180 280 Q200 296 220 280" stroke="#9C5B4A" strokeWidth="4.5" fill="none" strokeLinecap="round" />

      {hair === 'before' ? (
        <g>
          {/* Horseshoe pattern: hair only at the sides, bare crown */}
          <path d="M123 158 C116 186 118 216 125 240 L137 237 C134 212 134 188 141 164 Z" fill={HAIR} />
          <path d="M277 158 C284 186 282 216 275 240 L263 237 C266 212 266 188 259 164 Z" fill={HAIR} />
          <ellipse cx="180" cy="120" rx="30" ry="12" fill="#FFFFFF" opacity="0.4" transform="rotate(-16 180 120)" />
          <ellipse cx="214" cy="108" rx="9" ry="4" fill="#FFFFFF" opacity="0.35" transform="rotate(-8 214 108)" />
          {/* A few sparse strands */}
          <path d="M196 100 q3 -9 8 -12" stroke={HAIR} strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.55" />
          <path d="M206 99 q2 -8 7 -10" stroke={HAIR} strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.45" />
        </g>
      ) : (
        <g>
          {/* Full hair with a soft quiff */}
          <path
            d="M126 234 C112 190 114 128 150 98 C176 74 232 68 264 92 C292 114 292 176 274 234 L264 232 C262 202 262 180 256 163 C232 152 206 158 182 146 C166 153 151 157 144 165 C138 182 137 206 136 232 Z"
            fill={HAIR}
          />
          <path d="M156 110 C182 90 226 86 254 102" stroke={HAIR_LIGHT} strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M166 128 C192 110 230 110 256 124" stroke={HAIR_LIGHT} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.8" />
          <path d="M150 140 C162 128 176 124 190 126" stroke={HAIR_LIGHT} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
        </g>
      )}
    </svg>
  );
}

function Photo({ src }: { src: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" className="h-full w-full object-cover object-top" draggable={false} aria-hidden="true" />
  );
}

export function HairRevealArt() {
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0">
        <Photo src="/hair-scan/download-1.png" />
      </div>
      <div className="hs-reveal absolute inset-0">
        <Photo src="/hair-scan/download-2.png" />
      </div>

      {/* Scan line, in step with the reveal */}
      <div className="hs-reveal-line pointer-events-none absolute inset-x-5" aria-hidden="true" />

      {/* Status chip */}
      <div className="absolute inset-x-0 bottom-6 flex justify-center">
        <span className="relative inline-flex h-9 min-w-[170px] items-center justify-center rounded-full bg-[#1E2115]/80 px-4 font-label text-[12px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
          <span className="hs-status-a absolute inset-0 flex items-center justify-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#E3CC9D]" />
            Scanning…
          </span>
          <span className="hs-status-b absolute inset-0 flex items-center justify-center gap-2 text-[#E3CC9D]">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            Healthier Hair
          </span>
        </span>
      </div>
    </div>
  );
}
