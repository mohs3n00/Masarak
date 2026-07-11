import { NextRequest, NextResponse } from 'next/server';

// Decode JWT payload without verifying signature (verification happens on backend)
function decodeJwtPayload(token: string): { sub: string; role: string; exp: number } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload;
  } catch {
    return null;
  }
}

const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN'];
const TEACHER_ROLES = ['TEACHER'];
const STUDENT_ROLES = ['STUDENT'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('accessToken')?.value;

  const headers = new Headers(request.headers);
  const response = NextResponse.next({
    request: { headers },
  });

  // Security Headers
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), browsing-topics=()');
  response.headers.set('Content-Security-Policy', "frame-ancestors 'self';");

  // Decode role from JWT (no signature verification needed — just routing)
  let role: string | null = null;
  let isExpired = false;

  if (token) {
    const payload = decodeJwtPayload(token);
    if (payload) {
      role = payload.role;
      isExpired = payload.exp * 1000 < Date.now();
    }
  }

  const isAuthenticated = !!role && !isExpired;

  // ── /dashboard root → redirect to role-specific dashboard ──────────────
  if (pathname === '/dashboard') {
    if (!isAuthenticated) {
      const url = new URL('/login', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url, { headers: response.headers });
    }
    if (ADMIN_ROLES.includes(role!)) {
      return NextResponse.redirect(new URL('/dashboard/admin', request.url), { headers: response.headers });
    }
    if (TEACHER_ROLES.includes(role!)) {
      return NextResponse.redirect(new URL('/dashboard/teacher', request.url), { headers: response.headers });
    }
    if (STUDENT_ROLES.includes(role!)) {
      return NextResponse.redirect(new URL('/dashboard/student', request.url), { headers: response.headers });
    }
  }

  // ── /dashboard/admin/* → requires ADMIN / SUPER_ADMIN ──────────────────
  if (pathname.startsWith('/dashboard/admin')) {
    if (!isAuthenticated) {
      const url = new URL('/login', request.url);
      // Use 'redirect' (not 'callbackUrl') so GuestGuard can read it consistently
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url, { headers: response.headers });
    }
    if (!ADMIN_ROLES.includes(role!)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url), { headers: response.headers });
    }
  }

  // ── /dashboard/teacher/* → requires TEACHER (or ADMIN) ─────────────────
  if (pathname.startsWith('/dashboard/teacher')) {
    if (!isAuthenticated) {
      const url = new URL('/login', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url, { headers: response.headers });
    }
    if (!TEACHER_ROLES.includes(role!) && !ADMIN_ROLES.includes(role!)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url), { headers: response.headers });
    }
  }

  // ── /dashboard/student/* → requires STUDENT (or ADMIN) ─────────────────
  if (pathname.startsWith('/dashboard/student')) {
    if (!isAuthenticated) {
      const url = new URL('/login', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url, { headers: response.headers });
    }
    if (!STUDENT_ROLES.includes(role!) && !ADMIN_ROLES.includes(role!)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url), { headers: response.headers });
    }
  }

  // ── Auth pages → redirect authenticated users to role-specific dashboard ─
  if (
    isAuthenticated &&
    (pathname === '/login' || pathname === '/choose-account' || pathname.startsWith('/register'))
  ) {
    // Redirect to role-specific dashboard instead of '/' to avoid re-entering the /dashboard proxy chain
    if (ADMIN_ROLES.includes(role!)) {
      return NextResponse.redirect(new URL('/dashboard/admin', request.url), { headers: response.headers });
    }
    if (TEACHER_ROLES.includes(role!)) {
      return NextResponse.redirect(new URL('/dashboard/teacher', request.url), { headers: response.headers });
    }
    if (STUDENT_ROLES.includes(role!)) {
      return NextResponse.redirect(new URL('/dashboard/student', request.url), { headers: response.headers });
    }
    return NextResponse.redirect(new URL('/', request.url), { headers: response.headers });
  }

  return response;
}

export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/:path*',
    '/login',
    '/choose-account',
    '/register/:path*',
  ],
};
