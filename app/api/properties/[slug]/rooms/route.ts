import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { getProperties } from '@/lib/property-data';
import { writeCollection } from '@/lib/db';

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { slug } = await params;
  const body = await req.json();
  const properties = await getProperties(true);
  const property = properties.find((p: any) => p.slug === slug);
  if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 });
  const roomId = body.id || body.slug || String(body.name || 'room').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  if ((property.rooms || []).some((r: any) => r.id === roomId)) return NextResponse.json({ error: 'Room already exists' }, { status: 409 });
  const room = { id: roomId, name: body.name || 'New Room', price: Number(body.price || 0), capacity: Number(body.capacity || 2), bed: body.bed || 'King Bed', size: body.size || '', image: body.image || '', status: 'PENDING' };
  property.rooms = [...(property.rooms || []), room];
  await writeCollection('properties.json', properties);
  return NextResponse.json(room, { status: 201 });
}

export async function PUT(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { slug } = await params; const body = await req.json(); const roomId = body.id;
  const properties = await getProperties(true); const property = properties.find((p: any) => p.slug === slug);
  if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 });
  const idx = (property.rooms || []).findIndex((r: any) => r.id === roomId);
  if (idx < 0) return NextResponse.json({ error: 'Room not found' }, { status: 404 });
  property.rooms[idx] = { ...property.rooms[idx], ...body, id: roomId, status: property.rooms[idx].status || 'APPROVED', price: Number(body.price ?? property.rooms[idx].price), capacity: Number(body.capacity ?? property.rooms[idx].capacity) };
  await writeCollection('properties.json', properties); return NextResponse.json(property.rooms[idx]);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { slug } = await params; const roomId = new URL(req.url).searchParams.get('roomId');
  const properties = await getProperties(true); const property = properties.find((p: any) => p.slug === slug);
  if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 });
  const before = (property.rooms || []).length; property.rooms = (property.rooms || []).filter((r: any) => r.id !== roomId);
  if (property.rooms.length === before) return NextResponse.json({ error: 'Room not found' }, { status: 404 });
  await writeCollection('properties.json', properties); return NextResponse.json({ ok: true });
}
