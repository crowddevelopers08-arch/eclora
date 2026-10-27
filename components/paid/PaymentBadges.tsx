import { FaLock } from 'react-icons/fa6';
import { SiAmericanexpress, SiVisa } from 'react-icons/si';

/**
 * Accepted-payment strip with a secure-checkout note.
 * Logos are inline (react-icons + small SVGs) so there are no extra image requests.
 */

function Circles({ left, right, overlap, label }: { left: string; right: string; overlap: string; label: string }) {
  return (
    <svg viewBox="0 0 48 30" className="h-7 w-auto" role="img" aria-label={label}>
      <circle cx="17" cy="15" r="13" fill={left} />
      <circle cx="31" cy="15" r="13" fill={right} />
      <path d="M24 4.1a13 13 0 0 1 0 21.8a13 13 0 0 1 0-21.8z" fill={overlap} />
    </svg>
  );
}

const BADGES = [
  {
    name: 'RuPay',
    logo: (
      <span className="flex items-center font-body text-[19px] font-extrabold italic tracking-tight text-[#1B3F8B]">
        RuPay
        <svg viewBox="0 0 12 16" className="ml-0.5 h-4 w-auto" aria-hidden="true">
          <path d="M1 1l6 7-6 7z" fill="#F37021" />
          <path d="M5 1l6 7-6 7z" fill="#1B9447" />
        </svg>
      </span>
    ),
  },
  { name: 'Visa', logo: <SiVisa className="h-6 w-auto text-[#1A1F71]" aria-label="Visa" /> },
  {
    name: 'UPI',
    logo: (
      <span className="flex items-center font-body text-[21px] font-extrabold italic tracking-tight text-[#6D6E70]">
        UPI
        <svg viewBox="0 0 12 16" className="ml-0.5 h-4 w-auto" aria-hidden="true">
          <path d="M1 1l6 7-6 7z" fill="#1B9447" />
          <path d="M5 1l6 7-6 7z" fill="#F37021" />
        </svg>
      </span>
    ),
  },
  { name: 'Maestro', logo: <Circles left="#EB001B" right="#00A2E5" overlap="#7375CF" label="Maestro" /> },
  { name: 'Mastercard', logo: <Circles left="#EB001B" right="#F79E1B" overlap="#FF5F00" label="Mastercard" /> },
  {
    name: 'American Express',
    logo: (
      <span className="flex h-8 w-10 items-center justify-center rounded-[4px] bg-[#2E77BC]">
        <SiAmericanexpress className="h-7 w-7 text-white" aria-label="American Express" />
      </span>
    ),
  },
];

/** `paymentEnabled` comes from the server (PAYMENT_ENABLED reads server-only env). */
export function PaymentBadges({ className = '', paymentEnabled = false }: { className?: string; paymentEnabled?: boolean }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <ul className="grid w-full max-w-[600px] grid-cols-3 gap-1.5 rounded-2xl bg-white p-1.5 shadow-sm sm:grid-cols-6 sm:gap-2 sm:p-2" aria-label="Accepted payment methods">
        {BADGES.map((b) => (
          <li
            key={b.name}
            title={b.name}
            className="flex h-11 items-center justify-center overflow-hidden rounded-xl border border-[#E3CC9D]/50 bg-white px-1.5 sm:h-12 sm:px-2"
          >
            {b.logo}
          </li>
        ))}
      </ul>
      <p className="mt-3 flex items-start justify-center gap-2 text-left font-body text-[13.5px] leading-[1.5] text-[#5F6352] sm:text-[14px]">
        <FaLock className="mt-[3px] flex-shrink-0 text-[14px] text-[#4E5426]" aria-hidden="true" />
        {paymentEnabled
          ? 'Secure payment via Razorpay · Pick your slot right after'
          : 'Your details are safe with us · We’ll confirm your slot on WhatsApp'}
      </p>
    </div>
  );
}
