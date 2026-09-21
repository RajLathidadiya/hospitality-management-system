import { NextRequest, NextResponse } from 'next/server';

function makeToken(email: string, secret: string) {
  return btoa(`${email}:${secret}`)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // The login page must always remain accessible.
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  const email = process.env.ADMIN_EMAIL || 'admin@sawariyaevent.com';
  const secret = process.env.ADMIN_SECRET || 'sawariya-local-secret-change-me';
  const expectedToken = makeToken(email, secret);
  const token = req.cookies.get('sawariya_admin')?.value;

  if (token !== expectedToken) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/admin/login';
    loginUrl.search = '';
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
