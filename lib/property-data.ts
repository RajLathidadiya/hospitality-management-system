import { readCollection, writeCollection } from './db';
import { properties as seedProperties } from './properties';

/**
 * Single source of truth for property inventory.
 * If an older/local build has an empty properties.json, restore the starter
 * inventory once so the public site and admin panel don't show 0 properties.
 * After data exists, all admin edits continue to use data/properties.json.
 */
export async function getProperties() {
  const data = await readCollection<any>('properties.json');
  if (data.length > 0) return data;

  const seeded = seedProperties.map((p: any) => ({
    ...p,
    id: p.id || p.slug,
    rooms: Array.isArray(p.rooms) ? p.rooms.map((r: any) => ({ ...r, id: r.id || String(r.name).toLowerCase().replace(/[^a-z0-9]+/g, '-') })) : [],
    amenities: Array.isArray(p.amenities) ? p.amenities : [],
  }));
  await writeCollection('properties.json', seeded);
  return seeded;
}
