import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { slug } = await params;
  const body = await req.json();
  const property = await prisma.property.findUnique({ where: { slug } });

  if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 });

  const roomId =
    body.id ||
    body.slug ||
    String(body.name || 'room')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const existing = await prisma.room.findUnique({
    where: { propertyId_id: { propertyId: property.id, id: roomId } },
  });

  if (existing) return NextResponse.json({ error: 'Room already exists' }, { status: 409 });

  const room = await prisma.room.create({
    data: {
      propertyId: property.id,
      id: roomId,
      name: body.name || 'New Room',
      price: Number(body.price || 0),
      capacity: Number(body.capacity || 2),
      bed: body.bed || 'King Bed',
      size: body.size || '',
      image: body.image || '',
      status: 'PENDING',
    },
  });

  return NextResponse.json(room, { status: 201 });
}

export async function PUT(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { slug } = await params;
  const body = await req.json();
  const roomId = body.id;
  if (!roomId) return NextResponse.json({ error: 'Room id is required' }, { status: 400 });

  const property = await prisma.property.findUnique({ where: { slug } });
  if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 });

  const existing = await prisma.room.findUnique({
    where: { propertyId_id: { propertyId: property.id, id: roomId } },
  });
  if (!existing) return NextResponse.json({ error: 'Room not found' }, { status: 404 });

  const room = await prisma.room.update({
    where: { propertyId_id: { propertyId: property.id, id: roomId } },
    data: {
      name: body.name ?? existing.name,
      price: Number(body.price ?? existing.price),
      capacity: Number(body.capacity ?? existing.capacity),
      bed: body.bed ?? existing.bed,
      size: body.size ?? existing.size,
      image: body.image ?? existing.image,
      // Keep the current approval state when editing an existing room.
      status: existing.status,
    },
  });

  return NextResponse.json(room);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { slug } = await params;
  const roomId = new URL(req.url).searchParams.get('roomId');
  if (!roomId) return NextResponse.json({ error: 'Room id is required' }, { status: 400 });

  const property = await prisma.property.findUnique({ where: { slug } });
  if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 });

  const existing = await prisma.room.findUnique({
    where: { propertyId_id: { propertyId: property.id, id: roomId } },
  });
  if (!existing) return NextResponse.json({ error: 'Room not found' }, { status: 404 });

  await prisma.room.delete({
    where: { propertyId_id: { propertyId: property.id, id: roomId } },
  });

  return NextResponse.json({ ok: true });
}
