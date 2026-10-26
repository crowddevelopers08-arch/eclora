'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

/** Re-fetches the dashboard data without a full page reload. */
export function RefreshButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => startTransition(() => router.refresh())}
      disabled={pending}
      className="inline-flex items-center gap-1.5 rounded-full border border-[#4E5426]/25 px-4 py-2 text-[14px] font-semibold text-[#4E5426] transition hover:bg-[#E3CC9D]/25 disabled:opacity-70"
    >
      <span className={`material-symbols-outlined text-[18px] ${pending ? 'animate-spin' : ''}`}>refresh</span>
      {pending ? 'Refreshing…' : 'Refresh'}
    </button>
  );
}
