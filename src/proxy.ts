import { NextRequest, NextResponse } from 'next/server';

/**
 * Edge Middleware — Security Headers only.
 *
 * WHY we do NOT do auth redirects here:
 * The `accessToken` cookie is set by the Backend (Railway domain).
 * Vercel's Edge Middleware runs on the Vercel domain and CANNOT read
 * cookies that were set by a different domain (Railway). Therefore,
 * `request.cookies.get('accessToken')` is always undefined in production,
 * causing the middleware to wrongly redirect authenticated users to /login.
 *
 * Authentication routing is handled entirely client-side by:
 *   - RoleGuard  → protects /dashboard/* routes
 *   - GuestGuard → protects /login, /register, /choose-account
 *   - AuthProvider → validates session via /users/me (withCredentials: true)
 */
export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  // Security Headers
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), browsing-topics=()');
  response.headers.set('Content-Security-Policy', "frame-ancestors 'self';");

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
