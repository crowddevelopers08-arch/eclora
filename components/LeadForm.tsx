'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BlobButton } from '@/components/BlobButton';

export const TREATMENT_CONCERNS = [
  'Pigmentation Treatments',
  'Laser Hair Reduction',
  'HIFU Skin Tightening',
  'Duet Exosomes Therapy',
  'Laser Toning',
  'Party Peel Facial',
  'Hair Regrowth (PRP / GFC)',
  'Body Contouring / Endolaser',
  'General Consultation',
];

const fieldClass =
  'w-full rounded-xl border border-[#E3CC9D] bg-white px-4 py-3 font-label text-[16px] text-[#1E2115] outline-none transition placeholder:text-[#8A8D80] focus:border-[#4E5426] focus:bg-white';

const labelClass =
  'mb-1.5 block font-label text-[10px] font-bold uppercase tracking-[0.16em] text-[#4E5426]';

/**
 * The consultation form. Rendered both inline (LeadFormSection) and inside the
 * popup (ConsultationModal), so ids are namespaced by `idPrefix` to keep the
 * two instances from colliding when both are in the DOM.
 */
export function LeadForm({
  idPrefix = 'lead',
  source = 'Eclora Aesthetics LP',
  stacked = false,
  onSuccess,
}: {
  idPrefix?: string;
  /** Sent with the lead so we can tell popup submissions from inline ones. */
  source?: string;
  /** One field per row — used in the narrow popup. */
  stacked?: boolean;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', concern: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const rowClass = stacked
    ? 'grid grid-cols-1 gap-5'
    : 'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2';

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    if (!form.name.trim())  { setError('Please enter your full name.'); return; }
    if (!form.email.trim()) { setError('Please enter your email address.'); return; }
    if (!form.phone.trim()) { setError('Please enter your mobile number.'); return; }
    if (!form.concern)      { setError('Please select a treatment concern.'); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          healthGoal: form.concern,
          location: '',
          source,
          pageUrl: typeof window !== 'undefined' ? window.location.href : '',
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Something went wrong. Please try again.'); return; }
      onSuccess?.();
      router.push('/thank-you');
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

      {/* Row 1 — Name + Email */}
      <div className={rowClass}>
        <div>
          <label htmlFor={`${idPrefix}-name`} className={labelClass}>Full Name</label>
          <input
            id={`${idPrefix}-name`}
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            autoComplete="name"
            required
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor={`${idPrefix}-email`} className={labelClass}>Email Address</label>
          <input
            id={`${idPrefix}-email`}
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            autoComplete="email"
            required
            className={fieldClass}
          />
        </div>
      </div>

      {/* Row 2 — Phone + Concern */}
      <div className={rowClass}>
        <div>
          <label htmlFor={`${idPrefix}-phone`} className={labelClass}>Mobile Number</label>
          <div className="flex items-center gap-1.5 rounded-xl border border-[#E3CC9D] bg-white px-4 py-3 transition focus-within:border-[#4E5426] focus-within:bg-white">
            <span className="shrink-0 font-label text-[16px] font-semibold text-[#8A8D80]">+91</span>
            <span className="shrink-0 text-[#E3CC9D]">|</span>
            <input
              id={`${idPrefix}-phone`}
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="10-digit number"
              maxLength={10}
              autoComplete="tel"
              required
              className="min-w-0 flex-1 bg-transparent font-label text-[16px] text-[#1E2115] outline-none placeholder:text-[#8A8D80]"
            />
          </div>
        </div>
        <div>
          <label htmlFor={`${idPrefix}-concern`} className={labelClass}>Treatment Concern</label>
          <div className="relative">
            <select
              id={`${idPrefix}-concern`}
              name="concern"
              value={form.concern}
              onChange={handleChange}
              required
              className={`${fieldClass} appearance-none ${form.concern ? '' : 'text-[#8A8D80]'}`}
            >
              <option value="" disabled>Select treatment concern</option>
              {TREATMENT_CONCERNS.map((c) => (
                <option key={c} value={c} className="text-[#1E2115]">{c}</option>
              ))}
            </select>
            <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[17px] text-[#8A8D80]">
              expand_more
            </span>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-center font-body text-[14px] font-semibold text-red-600">{error}</p>
      )}

      <BlobButton
        type="submit"
        disabled={loading}
        className="self-center rounded-full px-8 py-3.5 font-label text-[16px] font-bold uppercase tracking-[0.1em] sm:px-10"
      >
        {loading ? 'Submitting…' : 'Book Your Consultation Today'}
      </BlobButton>

      <p className="text-center font-body text-[13px] text-[#8A8D80] sm:text-[14px]">
        No obligation · Your details stay private
      </p>
    </form>
  );
}
