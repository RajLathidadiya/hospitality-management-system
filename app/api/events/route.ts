import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { readCollection, writeCollection } from '@/lib/db';
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(await readCollection('events.json', [], { includeUnpublished: await isAdmin() }));
}

export async function POST(req: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const b = await req.json();
  const l = await readCollection<any>('events.json', [], { includeUnpublished: true });
  const slug = b.slug || String(b.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  if (!slug) return NextResponse.json({ error: 'Event title is required' }, { status: 400 });
  if (l.some((x: any) => x.slug === slug)) return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
  const x = { ...b, id: slug, slug, status: 'PENDING', services: b.services || [] };
  l.push(x);
  await writeCollection('events.json', l);
  return NextResponse.json(x, { status: 201 });
}
