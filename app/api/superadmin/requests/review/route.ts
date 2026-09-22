import { NextResponse } from 'next/server';
import { isSuperAdmin } from '@/lib/auth';
import { prisma } from '@/lib/db';
export async function POST(req: Request) {
  if (!await isSuperAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const b = await req.json(); const action = b.action === 'reject' ? 'REJECTED' : 'APPROVED';
  try {
    if (b.type === 'property') await prisma.property.update({ where: { id: String(b.id) }, data: { status: action } });
    else if (b.type === 'event') await prisma.event.update({ where: { id: String(b.id) }, data: { status: action } });
    else if (b.type === 'package') await prisma.package.update({ where: { id: String(b.id) }, data: { status: action } });
    else if (b.type === 'room') await prisma.room.update({ where: { propertyId_id: { propertyId: String(b.propertyId), id: String(b.id) } }, data: { status: action } });
    else return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });
    return NextResponse.json({ ok: true, status: action });
  } catch { return NextResponse.json({ error: 'Request item not found' }, { status: 404 }); }
}
