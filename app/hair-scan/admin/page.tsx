export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { SITE } from '@/lib/site';
import { HAIR_STAGES, SCAN_QUESTIONS, optionLabel } from '@/lib/hairScan';
import { formatDate } from './ui';

const PAGE_SIZE = 15;
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

type SearchParams = { q?: string; concern?: string; gender?: string; page?: string };

/** Midnight (IST) `daysAgo` days back, as a UTC Date. */
function istDayStart(daysAgo = 0): Date {
  const nowIst = new Date(Date.now() + IST_OFFSET_MS);
  const startIstUtc = Date.UTC(nowIst.getUTCFullYear(), nowIst.getUTCMonth(), nowIst.getUTCDate() - daysAgo);
  return new Date(startIstUtc - IST_OFFSET_MS);
}

function href(params: SearchParams, patch: Partial<SearchParams>) {
  const next = { ...params, ...patch };
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(next)) if (v) qs.set(k, v);
  const s = qs.toString();
  return s ? `/hair-scan/admin?${s}` : '/hair-scan/admin';
}

function StatCard({ label, value, hint, icon }: { label: string; value: number | string; hint?: string; icon: string }) {
  return (
    <div className="rounded-2xl border border-[#E3CC9D]/70 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="font-label text-[12px] font-semibold uppercase tracking-[0.16em] text-[#8A8D80]">{label}</span>
        <span className="material-symbols-outlined flex h-9 w-9 items-center justify-center rounded-xl bg-[#4E5426]/10 text-[20px] text-[#4E5426]">
          {icon}
        </span>
      </div>
      <p className="mt-3 font-heading text-[34px] font-bold leading-none">{value}</p>
      {hint && <p className="mt-2 text-[13px] text-[#5F6352]">{hint}</p>}
    </div>
  );
}

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const q = (sp.q ?? '').trim();
  const concern = sp.concern ?? '';
  const gender = sp.gender ?? '';
  const page = Math.max(1, Number.parseInt(sp.page ?? '1', 10) || 1);

  const where: Prisma.HairScanLeadWhereInput = {
    ...(concern && { concern }),
    ...(gender && { gender }),
    ...(q && { OR: [{ name: { contains: q, mode: 'insensitive' } }, { phone: { contains: q.replace(/\D/g, '') || q } }] }),
  };

  const since14 = istDayStart(13);
  const [total, today, week, withCrown, byConcern, recent, filteredTotal, leads] = await Promise.all([
    prisma.hairScanLead.count(),
    prisma.hairScanLead.count({ where: { createdAt: { gte: istDayStart(0) } } }),
    prisma.hairScanLead.count({ where: { createdAt: { gte: istDayStart(6) } } }),
    prisma.hairScanLead.count({ where: { photos: { some: { view: 'crown' } } } }),
    prisma.hairScanLead.groupBy({ by: ['concern'], _count: { _all: true }, orderBy: { _count: { concern: 'desc' } } }),
    prisma.hairScanLead.findMany({ where: { createdAt: { gte: since14 } }, select: { createdAt: true } }),
    prisma.hairScanLead.count({ where }),
    prisma.hairScanLead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { photos: { select: { id: true, view: true } } },
    }),
  ]);

  /* 14-day trend, bucketed by IST day. */
  const trend = Array.from({ length: 14 }, (_, i) => ({ start: istDayStart(13 - i), count: 0 }));
  for (const { createdAt } of recent) {
    for (let i = trend.length - 1; i >= 0; i--) {
      if (createdAt >= trend[i].start) {
        trend[i].count++;
        break;
      }
    }
  }
  const trendMax = Math.max(1, ...trend.map((t) => t.count));
  const concernMax = Math.max(1, ...byConcern.map((c) => c._count._all));
  const pages = Math.max(1, Math.ceil(filteredTotal / PAGE_SIZE));
  const concernOptions = SCAN_QUESTIONS.find((x) => x.id === 'concern')?.options ?? [];
  const genderOptions = SCAN_QUESTIONS.find((x) => x.id === 'gender')?.options ?? [];

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-[#E3CC9D]/70 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={SITE.logo} alt={SITE.name} className="h-9 w-auto object-contain" />
            <span className="hidden border-l border-[#E3CC9D] pl-4 font-label text-[12px] font-semibold uppercase tracking-[0.2em] text-[#4E5426] sm:inline">
              Hair Scan Admin
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1240px] px-4 py-8 sm:px-6">
        <div>
          <h1 className="font-heading text-[28px] font-bold tracking-[-0.01em] sm:text-[34px]">Hair scan leads</h1>
          <p className="mt-1 text-[15px] text-[#5F6352]">Every completed scan from the /hair-scan page, newest first.</p>
        </div>

        {/* Stats */}
        <section className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Total scans" value={total} icon="groups" />
          <StatCard label="Today" value={today} icon="today" />
          <StatCard label="Last 7 days" value={week} icon="date_range" />
          <StatCard
            label="With crown photo"
            value={withCrown}
            hint={total ? `${Math.round((withCrown / total) * 100)}% of scans` : undefined}
            icon="photo_camera"
          />
        </section>

        {/* Charts */}
        <section className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border border-[#E3CC9D]/70 bg-white p-5 shadow-sm">
            <h2 className="font-heading text-[17px] font-bold">Scans, last 14 days</h2>
            <div className="mt-5 flex h-36 items-end gap-1.5 sm:gap-2">
              {trend.map((t) => (
                <div key={t.start.toISOString()} className="group flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                  <span className="text-[11px] font-semibold text-[#5F6352]">{t.count || ''}</span>
                  <div
                    className="w-full rounded-t-md bg-[#4E5426] transition group-hover:bg-[#6B7335]"
                    style={{ height: `${Math.max(t.count ? 6 : 2, (t.count / trendMax) * 100)}%`, opacity: t.count ? 1 : 0.18 }}
                  />
                  <span className="text-[10px] text-[#8A8D80]">
                    {new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric' }).format(t.start)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-[#E3CC9D]/70 bg-white p-5 shadow-sm">
            <h2 className="font-heading text-[17px] font-bold">Primary concern</h2>
            <ul className="mt-4 grid gap-3">
              {byConcern.length === 0 && <li className="text-[14px] text-[#8A8D80]">No data yet.</li>}
              {byConcern.map((c) => (
                <li key={c.concern}>
                  <div className="flex justify-between text-[13.5px]">
                    <span>{optionLabel('concern', c.concern)}</span>
                    <span className="font-semibold">{c._count._all}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-[#E3CC9D]/30">
                    <div className="h-2 rounded-full bg-[#4E5426]" style={{ width: `${(c._count._all / concernMax) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Filters */}
        <form method="get" className="mt-8 flex flex-wrap items-end gap-3">
          <label className="grid flex-1 gap-1 sm:max-w-[320px]">
            <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#8A8D80]">Search</span>
            <input
              name="q"
              defaultValue={q}
              placeholder="Name or phone"
              className="h-11 rounded-xl border border-[#E3CC9D] bg-white px-4 text-[15px] outline-none focus:border-[#4E5426]"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#8A8D80]">Concern</span>
            <select
              name="concern"
              defaultValue={concern}
              className="h-11 rounded-xl border border-[#E3CC9D] bg-white px-3 text-[15px] outline-none focus:border-[#4E5426]"
            >
              <option value="">All</option>
              {concernOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1">
            <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#8A8D80]">Gender</span>
            <select
              name="gender"
              defaultValue={gender}
              className="h-11 rounded-xl border border-[#E3CC9D] bg-white px-3 text-[15px] outline-none focus:border-[#4E5426]"
            >
              <option value="">All</option>
              {genderOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <button className="h-11 rounded-xl bg-[#4E5426] px-6 text-[15px] font-semibold text-white transition hover:bg-[#3F451F]">
            Filter
          </button>
          {(q || concern || gender) && (
            <Link href="/hair-scan/admin" className="h-11 content-center px-2 text-[14px] font-semibold text-[#4E5426] underline">
              Clear
            </Link>
          )}
        </form>

        {/* Table */}
        <section className="mt-4 overflow-hidden rounded-2xl border border-[#E3CC9D]/70 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-[14.5px]">
              <thead className="bg-[#FBF8F1] text-[12px] uppercase tracking-[0.12em] text-[#8A8D80]">
                <tr>
                  {['Date', 'Lead', 'Concern', 'Stage', 'Profile', 'Photos', ''].map((h, i) => (
                    <th key={i} className="px-4 py-3 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3CC9D]/40">
                {leads.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-14 text-center text-[#8A8D80]">
                      {total === 0
                        ? 'No hair scans yet. They will appear here as soon as someone submits.'
                        : 'No leads match these filters.'}
                    </td>
                  </tr>
                )}
                {leads.map((l) => {
                  const stage = HAIR_STAGES.find((s) => s.id === l.stage);
                  const front = l.photos.find((p) => p.view === 'front');
                  return (
                    <tr key={l.id} className="transition hover:bg-[#FBF8F1]">
                      <td className="whitespace-nowrap px-4 py-3.5 text-[#5F6352]">{formatDate(l.createdAt)}</td>
                      <td className="px-4 py-3.5">
                        <Link href={`/hair-scan/admin/leads/${l.id}`} className="flex items-center gap-3">
                          {front ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={`/api/admin/photos/${front.id}`}
                              alt=""
                              className="h-10 w-10 rounded-full border border-[#E3CC9D] object-cover"
                            />
                          ) : (
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E3CC9D]/40 font-semibold text-[#4E5426]">
                              {l.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                          <span>
                            <span className="block font-semibold">{l.name}</span>
                            <span className="block text-[13px] text-[#5F6352]">{l.phone}</span>
                          </span>
                        </Link>
                      </td>
                      <td className="px-4 py-3.5">{optionLabel('concern', l.concern)}</td>
                      <td className="whitespace-nowrap px-4 py-3.5">{stage ? stage.label : l.stage}</td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-[#5F6352]">
                        {optionLabel('age', l.age)} · {optionLabel('gender', l.gender).split(' /')[0]}
                      </td>
                      <td className="px-4 py-3.5">{l.photos.length}</td>
                      <td className="px-4 py-3.5 text-right">
                        <Link href={`/hair-scan/admin/leads/${l.id}`} className="font-semibold text-[#4E5426] underline-offset-2 hover:underline">
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {pages > 1 && (
            <div className="flex items-center justify-between border-t border-[#E3CC9D]/40 px-4 py-3 text-[14px]">
              <span className="text-[#5F6352]">
                Page {page} of {pages} · {filteredTotal} lead{filteredTotal === 1 ? '' : 's'}
              </span>
              <div className="flex gap-2">
                {page > 1 && (
                  <Link
                    href={href(sp, { page: String(page - 1) })}
                    className="rounded-lg border border-[#E3CC9D] px-3 py-1.5 font-semibold text-[#4E5426] hover:bg-[#E3CC9D]/25"
                  >
                    Previous
                  </Link>
                )}
                {page < pages && (
                  <Link
                    href={href(sp, { page: String(page + 1) })}
                    className="rounded-lg border border-[#E3CC9D] px-3 py-1.5 font-semibold text-[#4E5426] hover:bg-[#E3CC9D]/25"
                  >
                    Next
                  </Link>
                )}
              </div>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
