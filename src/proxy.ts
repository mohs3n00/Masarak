import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
};

const PROTECTED_ROUTES = {
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Create headers object to append security headers
  const headers = new Headers(request.headers);
  const response = NextResponse.next({
    request: {
      headers,
    },
  });

  // 1. Apply Security Headers
  // Strict Transport Security (HSTS)
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  
  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  
  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions Policy
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), browsing-topics=()');

  // Basic CSP (Relaxed for dev/Next.js inline scripts, but restricts frame-ancestors)
  // We use frame-ancestors 'none' to block iframe embedding entirely
  response.headers.set(
    'Content-Security-Policy',
    "frame-ancestors 'self';"
  );

  // 2. Authentication Route Protection
  const token = request.cookies.get('accessToken')?.value;

  const isAuthRoute = Object.values(AUTH_ROUTES).includes(pathname);
  const isProtectedRoute = pathname.startsWith(PROTECTED_ROUTES.DASHBOARD) || pathname.startsWith(PROTECTED_ROUTES.PROFILE);

  // Redirect unauthenticated users from protected routes to login
  if (isProtectedRoute && !token) {
    const url = request.nextUrl.clone();
    url.pathname = AUTH_ROUTES.LOGIN;
    // Save original url to redirect back after login
    url.searchParams.set('callbackUrl', encodeURI(request.nextUrl.pathname));
    return NextResponse.redirect(url, { headers: response.headers });
  }

  // Redirect authenticated users away from auth routes (login/register)
  if (isAuthRoute && token) {
    const url = request.nextUrl.clone();
    url.pathname = PROTECTED_ROUTES.DASHBOARD;
    return NextResponse.redirect(url, { headers: response.headers });
  }

  return response;
}

export const config = {
  // Apply middleware to all routes except API, static assets, and images
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|svgs).*)',
  ],
};
