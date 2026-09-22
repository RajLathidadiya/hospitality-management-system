import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { writeCollection } from '@/lib/db';
import { getProperties } from '@/lib/property-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json(await getProperties());
  } catch (error) {
    console.error('GET /api/properties failed:', error);
    return NextResponse.json({ error: 'Could not load properties' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const list = await getProperties();
    const slug = body.slug || String(body.name || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    if (!slug) {
      return NextResponse.json({ error: 'Property name is required' }, { status: 400 });
    }

    if (list.some((item: any) => item.slug === slug)) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    }

    const item = {
      ...body,
      id: slug,
      slug,
      city: body.city || 'Udaipur',
      state: body.state || 'Rajasthan',
      rooms: Array.isArray(body.rooms) ? body.rooms : [],
      amenities: Array.isArray(body.amenities) ? body.amenities : [],
    };

    list.push(item);
    await writeCollection('properties.json', list);
    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/properties failed:', error);
    return NextResponse.json(
      { error: error?.message || 'Could not save property' },
      { status: 500 }
    );
  }
}
