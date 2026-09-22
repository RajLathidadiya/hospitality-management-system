import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { getProperties } from '@/lib/property-data';
import { readCollection, writeCollection } from '@/lib/db';
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(await getProperties(await isAdmin()));
}

export async function POST(req: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const b = await req.json();
  const l = await getProperties(true);
  const slug = b.slug || String(b.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  if (!slug) return NextResponse.json({ error: 'Property name is required' }, { status: 400 });
  if (l.some((x: any) => x.slug === slug)) return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
  const x = { ...b, id: slug, slug, status: 'PENDING', rooms: Array.isArray(b.rooms) ? b.rooms.map((r: any) => ({ ...r, status: 'PENDING' })) : [], amenities: b.amenities || [] };
  l.push(x);
  await writeCollection('properties.json', l);
  return NextResponse.json(x, { status: 201 });
}
