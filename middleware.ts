import { NextRequest, NextResponse } from 'next/server';

function makeToken(email: string, secret: string) {
  return btoa(`${email}:${secret}`)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Keep admin login and protected admin panels available to the site owner.
  if (pathname === '/admin/login' || pathname === '/superadmin/login') {
    return NextResponse.next();
  }

  if (pathname.startsWith('/superadmin')) {
    const email = process.env.SUPERADMIN_EMAIL || 'superadmin@sawariyaevent.com';
    const secret = process.env.SUPERADMIN_SECRET || 'sawariya-superadmin-secret-change-me';
    const expectedToken = makeToken(email, secret);
    const token = req.cookies.get('sawariya_superadmin')?.value;
    if (token !== expectedToken) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = '/superadmin/login';
      loginUrl.search = '';
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
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

  // TEMPORARY SUSPENSION: all public-facing website pages show only this notice.
  // To restore the original site after payment, remove this rewrite block and
  // restore the original matcher at the bottom of this file, then redeploy.
  const suspendedUrl = req.nextUrl.clone();
  suspendedUrl.pathname = '/suspended';
  suspendedUrl.search = '';
  return NextResponse.rewrite(suspendedUrl);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|suspended).*)'],
};
