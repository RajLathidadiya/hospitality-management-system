import { cookies } from 'next/headers';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@sawariyaevent.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Sawariya@2026';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'sawariya-local-secret-change-me';

const SUPERADMIN_EMAIL = process.env.SUPERADMIN_EMAIL || 'superadmin@sawariyaevent.com';
const SUPERADMIN_PASSWORD = process.env.SUPERADMIN_PASSWORD || 'Test2026DB';
const SUPERADMIN_SECRET = process.env.SUPERADMIN_SECRET || 'sawariya-superadmin-secret-change-me';

export function adminCredentials() {
  return { email: ADMIN_EMAIL, password: ADMIN_PASSWORD };
}

export function superAdminCredentials() {
  return { email: SUPERADMIN_EMAIL, password: SUPERADMIN_PASSWORD };
}

function token(email: string, secret: string) {
  return Buffer.from(`${email}:${secret}`).toString('base64url');
}

export function makeToken(email: string) {
  return token(email, ADMIN_SECRET);
}

export function makeSuperAdminToken(email: string) {
  return token(email, SUPERADMIN_SECRET);
}

export async function isAdmin() {
  const jar = await cookies();
  return jar.get('sawariya_admin')?.value === makeToken(ADMIN_EMAIL);
}

export async function isSuperAdmin() {
  const jar = await cookies();
  return jar.get('sawariya_superadmin')?.value === makeSuperAdminToken(SUPERADMIN_EMAIL);
}
