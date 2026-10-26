export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/** Serves a stored scan photo for the admin dashboard. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const photo = await prisma.hairScanPhoto.findUnique({ where: { id }, select: { data: true, mimeType: true } });
  if (!photo) return new NextResponse('Not found', { status: 404 });
  return new NextResponse(new Uint8Array(photo.data), {
    headers: { 'Content-Type': photo.mimeType, 'Cache-Control': 'private, max-age=3600' },
  });
}
