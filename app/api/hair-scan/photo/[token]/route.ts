export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/** Photo link written into the TeleCRM lead. The token is a random UUID, not the row id. */
export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const photo = await prisma.hairScanPhoto.findUnique({ where: { token }, select: { data: true, mimeType: true } });
  if (!photo) return new NextResponse('Not found', { status: 404 });
  return new NextResponse(new Uint8Array(photo.data), {
    headers: {
      'Content-Type': photo.mimeType,
      'Cache-Control': 'private, max-age=3600',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}
