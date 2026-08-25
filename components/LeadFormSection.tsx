'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const TREATMENT_CONCERNS = [
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

export function LeadFormSection() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', concern: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
          source: 'Eclora Aesthetics LP',
          pageUrl: typeof window !== 'undefined' ? window.location.href : '',
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Something went wrong. Please try again.'); return; }
      router.push('/thank-you');
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  const fieldClass =
    'w-full rounded-xl border border-[#E3CC9D] bg-white px-4 py-3 font-body text-[14px] text-[#1E2115] outline-none transition placeholder:text-[#8A8D80] focus:border-[#4E5426] focus:bg-white';

  const labelClass =
    'mb-1.5 block font-body text-[10px] font-bold uppercase tracking-[0.16em] text-[#4E5426]';

  return (
    <section
      id="consultation"
      className="bg-[#4E5426] px-4 py-8 sm:px-6 md:px-[60px] md:py-10 lg:py-12"
    >
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">

        {/* LEFT — The Eclora Standard */}
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E3CC9D]/30 bg-[#E3CC9D]/10 px-3 py-1">
            <span className="material-symbols-outlined text-[13px] text-[#E3CC9D]" style={{ fontVariationSettings: '"FILL" 1' }}>
              diamond
            </span>
            <span className="font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-[#E3CC9D] sm:text-[12px]">
              The Eclora Standard
            </span>
          </span>

          <h2 className="mt-4 font-heading text-[24px] font-extrabold leading-[1.22] text-white sm:text-[28px] md:text-[32px] lg:text-[36px]">
            Experience A New Standard Of{' '}
            <span className="text-[#E3CC9D]">Aesthetic Care</span>
          </h2>

          <p className="mt-4 font-body text-[14px] leading-[1.9] text-white/75 sm:text-[15px]">
            At Eclora Aesthetics, we combine advanced treatments with thoughtful patient care to
            create an experience that feels as exceptional as the results.
          </p>

          <p className="mt-3 font-body text-[14px] leading-[1.9] text-white/75 sm:text-[15px]">
            From the moment you walk through our doors, you&apos;ll experience a clinic focused on
            comfort, professionalism, and personalised attention.
          </p>

        </div>

        {/* RIGHT — form card */}
        <div className="rounded-[1.75rem] bg-white p-6 shadow-2xl sm:p-8">

          <div className="mb-6 text-center">
            <h3 className="font-heading text-[20px] font-extrabold leading-[1.2] text-[#1E2115] sm:text-[24px]">
              Begin Your Transformation <span className="text-[#4E5426]">Today</span>
            </h3>
            <p className="mx-auto mt-2 max-w-[420px] font-body text-[13px] leading-[1.75] text-[#5F6352] sm:text-[14px]">
              Share a few details and our team will reach out to recommend the right treatment
              plan for you.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

            {/* Row 1 — Name + Email */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <div>
                <label htmlFor="lead-name" className={labelClass}>Full Name</label>
                <input
                  id="lead-name"
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
                <label htmlFor="lead-email" className={labelClass}>Email Address</label>
                <input
                  id="lead-email"
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
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <div>
                <label htmlFor="lead-phone" className={labelClass}>Mobile Number</label>
                <div className="flex items-center gap-1.5 rounded-xl border border-[#E3CC9D] bg-white px-4 py-3 transition focus-within:border-[#4E5426] focus-within:bg-white">
                  <span className="shrink-0 font-body text-[14px] font-semibold text-[#8A8D80]">+91</span>
                  <span className="shrink-0 text-[#E3CC9D]">|</span>
                  <input
                    id="lead-phone"
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="10-digit number"
                    maxLength={10}
                    autoComplete="tel"
                    required
                    className="min-w-0 flex-1 bg-transparent font-body text-[14px] text-[#1E2115] outline-none placeholder:text-[#8A8D80]"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lead-concern" className={labelClass}>Treatment Concern</label>
                <div className="relative">
                  <select
                    id="lead-concern"
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
              <p className="text-center font-body text-[12px] font-semibold text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#4E5426] py-3.5 font-body text-[14px] font-bold uppercase tracking-[0.1em] text-white transition-colors hover:bg-[#4E5426]/90 disabled:opacity-70"
            >
              {loading ? 'Submitting…' : 'Book Your Consultation Today'}
            </button>

            <p className="text-center font-body text-[11px] text-[#8A8D80] sm:text-[12px]">
              No obligation · Your details stay private
            </p>
          </form>
        </div>

      </div>
    </section>
  );
}
