export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { HAIR_STAGES, PHOTO_VIEWS, optionLabel, stageImage } from '@/lib/hairScan';
import { formatDate } from '../../ui';

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#8A8D80]">{label}</dt>
      <dd className="mt-1 text-[16px] font-medium">{value}</dd>
    </div>
  );
}

function Sync({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold ${
        ok ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'
      }`}
    >
      <span className="material-symbols-outlined text-[14px]">{ok ? 'check_circle' : 'error'}</span>
      {label}
    </span>
  );
}

export default async function LeadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await prisma.hairScanLead.findUnique({
    where: { id },
    include: { photos: { select: { id: true, view: true, driveUrl: true } } },
  });
  if (!lead) notFound();

  const stage = HAIR_STAGES.find((s) => s.id === lead.stage);

  return (
    <main className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6">
      <Link href="/hair-scan/admin" className="inline-flex items-center gap-1 text-[14px] font-semibold text-[#4E5426] hover:underline">
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        All leads
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-[30px] font-bold tracking-[-0.01em]">{lead.name}</h1>
          <p className="mt-1 text-[14px] text-[#5F6352]">Submitted {formatDate(lead.createdAt)} IST</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`tel:+91${lead.phone}`}
            className="inline-flex items-center gap-2 rounded-full bg-[#4E5426] px-5 py-2.5 text-[15px] font-semibold text-white transition hover:bg-[#3F451F]"
          >
            <span className="material-symbols-outlined text-[18px]">call</span>
            {lead.phone}
          </a>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <div className="grid content-start gap-5">
          <section className="rounded-2xl border border-[#E3CC9D]/70 bg-white p-6 shadow-sm">
            <h2 className="font-heading text-[18px] font-bold">Scan answers</h2>
            <dl className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field label="Age group" value={optionLabel('age', lead.age)} />
              <Field label="Gender" value={optionLabel('gender', lead.gender)} />
              <Field label="Primary concern" value={optionLabel('concern', lead.concern)} />
              {lead.lifestyle && <Field label="Lifestyle" value={optionLabel('lifestyle' as never, lead.lifestyle)} />}
              <Field
                label="Hair stage"
                value={
                  <span className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={stageImage(lead.stage)} alt="" className="h-14 w-14 rounded-lg border border-[#E3CC9D] object-cover" />
                    <span>
                      {stage?.label ?? lead.stage}
                      {stage && <span className="block text-[13px] font-normal text-[#5F6352]">{stage.description}</span>}
                    </span>
                  </span>
                }
              />
              <Field
                label="Submitted from"
                value={<span className="break-all text-[14px] font-normal text-[#5F6352]">{lead.pageUrl || '—'}</span>}
              />
            </dl>
            <div className="mt-6 flex flex-wrap gap-2 border-t border-[#E3CC9D]/40 pt-4">
              <Sync ok={lead.crmSynced} label="TeleCRM" />
            </div>
          </section>

        </div>

        <aside className="grid content-start gap-5">
          <section className="rounded-2xl border border-[#E3CC9D]/70 bg-white p-6 shadow-sm">
            <h2 className="font-heading text-[18px] font-bold">Scan photos</h2>
            <div className="mt-4 grid gap-5">
              {PHOTO_VIEWS.map((v) => {
                const photo = lead.photos.find((p) => p.view === v.id);
                return (
                  <figure key={v.id}>
                    <figcaption className="mb-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#8A8D80]">
                      {v.label}
                    </figcaption>
                    {photo ? (
                      <a href={`/api/admin/photos/${photo.id}`} target="_blank" rel="noreferrer">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`/api/admin/photos/${photo.id}`} alt={v.label} className="w-full rounded-xl border border-[#E3CC9D] object-cover" />
                      </a>
                    ) : (
                      <div className="flex h-28 items-center justify-center rounded-xl border border-dashed border-[#E3CC9D] text-[14px] text-[#8A8D80]">
                        Not provided
                      </div>
                    )}
                    {photo?.driveUrl && (
                      <a
                        href={photo.driveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block text-[13px] font-semibold text-[#4E5426] underline"
                      >
                        Open Drive copy
                      </a>
                    )}
                  </figure>
                );
              })}
            </div>
          </section>

        </aside>
      </div>
    </main>
  );
}
