import { cookies } from 'next/headers';

const EMAIL = process.env.ADMIN_EMAIL || 'admin@sawariyaevent.com';
const PASSWORD = process.env.ADMIN_PASSWORD || 'Sawariya@2026';

const SUPERADMIN_EMAIL =
  process.env.SUPERADMIN_EMAIL || 'superadmin@sawariyaevent.com';

const SUPERADMIN_PASSWORD =
  process.env.SUPERADMIN_PASSWORD || 'SuperAdmin@2026';

const SECRET =
  process.env.ADMIN_SECRET || 'sawariya-local-secret-change-me';

export function adminCredentials() {
  return {
    email: EMAIL,
    password: PASSWORD,
  };
}

export function superAdminCredentials() {
  return {
    email: SUPERADMIN_EMAIL,
    password: SUPERADMIN_PASSWORD,
  };
}

export function makeToken(email: string) {
  return Buffer.from(`${email}:${SECRET}`).toString('base64url');
}

export async function isAdmin() {
  const jar = await cookies();

  return (
    jar.get('sawariya_admin')?.value ===
    makeToken(EMAIL)
  );
}

export async function isSuperAdmin() {
  const jar = await cookies();

  return (
    jar.get('sawariya_superadmin')?.value ===
    makeToken(SUPERADMIN_EMAIL)
  );
}