import { readCollection, writeCollection } from './db';
import { properties as seedProperties } from './properties';

export async function getProperties(includeUnpublished = false) {
  const data = await readCollection<any>('properties.json', [], { includeUnpublished });
  if (data.length > 0) return data;
  if (includeUnpublished) {
    const seeded = seedProperties.map((p: any) => ({
      ...p,
      id: p.id || p.slug,
      status: p.status || 'APPROVED',
      rooms: Array.isArray(p.rooms) ? p.rooms.map((r: any) => ({ ...r, id: r.id || String(r.name).toLowerCase().replace(/[^a-z0-9]+/g, '-'), status: r.status || 'APPROVED' })) : [],
      amenities: Array.isArray(p.amenities) ? p.amenities : [],
    }));
    await writeCollection('properties.json', seeded);
    return seeded;
  }
  return [];
}
