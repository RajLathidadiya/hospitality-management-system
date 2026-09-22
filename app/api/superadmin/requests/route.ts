import { NextResponse } from 'next/server';
import { isSuperAdmin } from '@/lib/auth';
import { prisma } from '@/lib/db';
export const dynamic = 'force-dynamic';
export async function GET() {
  if (!await isSuperAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const [properties, events, packages] = await Promise.all([
    prisma.property.findMany({ where: { status: 'PENDING' }, include: { rooms: { where: { status: 'PENDING' } } }, orderBy: { createdAt: 'desc' } }),
    prisma.event.findMany({ where: { status: 'PENDING' }, orderBy: { createdAt: 'desc' } }),
    prisma.package.findMany({ where: { status: 'PENDING' }, orderBy: { createdAt: 'desc' } }),
  ]);
  return NextResponse.json({ properties, events, packages, counts: { properties: properties.length, events: events.length, packages: packages.length, rooms: properties.reduce((n, p) => n + p.rooms.length, 0) } });
}
