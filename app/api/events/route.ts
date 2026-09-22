import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { readCollection, writeCollection } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json(await readCollection('events.json'));
  } catch (error) {
    console.error('GET /api/events failed:', error);
    return NextResponse.json({ error: 'Could not load events' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const list = await readCollection<any>('events.json');
    const slug = body.slug || String(body.title || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    if (!slug) {
      return NextResponse.json({ error: 'Event title is required' }, { status: 400 });
    }

    if (list.some((item: any) => item.slug === slug)) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    }

    const item = {
      ...body,
      id: slug,
      slug,
      services: Array.isArray(body.services) ? body.services : [],
    };

    list.push(item);
    await writeCollection('events.json', list);
    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/events failed:', error);
    return NextResponse.json(
      { error: error?.message || 'Could not save event' },
      { status: 500 }
    );
  }
}
