import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_ROUTES, PROTECTED_ROUTES } from './features/auth/constants/auth.constants';

// This middleware is a first layer of defense.
// We only check if the accessToken exists in cookies if we decide to store it there.
// For Zustand with localStorage, the server won't have access to the tokens in middleware easily 
// unless we sync it to cookies.
// Since we are using Zustand (localStorage), we rely on Client Guards for protection.
// However, we set up this middleware as a placeholder for future HttpOnly Cookie implementation.

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Assume token is stored in cookie for server-side auth check
  // const token = request.cookies.get('accessToken')?.value;

  // Example protection logic (disabled until cookie auth is implemented):
  /*
  const isAuthRoute = Object.values(AUTH_ROUTES).includes(pathname as any);
  const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/profile');

  if (isProtectedRoute && !token) {
    const url = request.nextUrl.clone();
    url.pathname = AUTH_ROUTES.LOGIN;
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && token && pathname !== AUTH_ROUTES.SUCCESS) {
    const url = request.nextUrl.clone();
    url.pathname = PROTECTED_ROUTES.DASHBOARD;
    return NextResponse.redirect(url);
  }
  */

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|svgs).*)'],
};
