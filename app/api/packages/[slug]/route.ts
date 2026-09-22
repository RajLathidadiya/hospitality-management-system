import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { readCollection, writeCollection } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { slug } = await params;
  const body = await req.json();

  const packages = await readCollection<any>('packages.json', [], { includeUnpublished: true });
  const index = packages.findIndex((item: any) => item.slug === slug);

  if (index === -1) {
    return NextResponse.json(
      { error: 'Package not found' },
      { status: 404 }
    );
  }

  const updated = {
    ...packages[index],
    ...body,
    id: packages[index].id,
    slug: packages[index].slug,
  };

  packages[index] = updated;

  await writeCollection('packages.json', packages);

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { slug } = await params;

  const packages = await readCollection<any>('packages.json', [], { includeUnpublished: true });
  const filtered = packages.filter((item: any) => item.slug !== slug);

  if (filtered.length === packages.length) {
    return NextResponse.json(
      { error: 'Package not found' },
      { status: 404 }
    );
  }

  await writeCollection('packages.json', filtered);

  return NextResponse.json({ success: true });
}