import { NextResponse } from 'next/server';
import { isSuperAdmin } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!await isSuperAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [properties, rooms, events, packages] = await Promise.all([
    prisma.property.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.room.findMany({
      where: { status: 'PENDING' },
      include: { property: { select: { id: true, name: true, slug: true } } },
      orderBy: { id: 'asc' },
    }),
    prisma.event.findMany({ where: { status: 'PENDING' }, orderBy: { createdAt: 'desc' } }),
    prisma.package.findMany({ where: { status: 'PENDING' }, orderBy: { createdAt: 'desc' } }),
  ]);

  return NextResponse.json({
    properties,
    rooms,
    events,
    packages,
    counts: {
      properties: properties.length,
      rooms: rooms.length,
      events: events.length,
      packages: packages.length,
    },
  });
}
