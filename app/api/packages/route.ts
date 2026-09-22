import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { readCollection, writeCollection } from '@/lib/db';
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(await readCollection('packages.json', [], { includeUnpublished: await isAdmin() }));
}

export async function POST(req: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const packages = await readCollection<any>('packages.json', [], { includeUnpublished: true });
  const slug = body.slug || String(body.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  if (!slug) return NextResponse.json({ error: 'Package title is required' }, { status: 400 });
  if (packages.some((item: any) => item.slug === slug)) return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
  const item = { ...body, id: slug, slug, status: 'PENDING' };
  packages.push(item);
  await writeCollection('packages.json', packages);
  return NextResponse.json(item, { status: 201 });
}
