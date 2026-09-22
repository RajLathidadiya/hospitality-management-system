import { NextResponse } from 'next/server';
import { superAdminCredentials, makeSuperAdminToken } from '@/lib/auth';

export async function POST(req: Request) {
  const body = await req.json();
  const c = superAdminCredentials();

  if (
    body.email !== c.email ||
    body.password !== c.password
  ) {
    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    );
  }

  const r = NextResponse.json({ ok: true });

  r.cookies.set(
    'sawariya_superadmin',
    makeSuperAdminToken(c.email),
    {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 604800,
    }
  );

  return r;
}