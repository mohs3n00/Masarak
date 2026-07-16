'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAuthStore } from '../../store/auth.store';
import { useAuthContext } from '@/lib/providers/AuthProvider';
import { AUTH_ROUTES } from '../../constants/auth.constants';

export const ProtectedGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const { isReady } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // CRITICAL: Wait until AuthProvider has finished checking the session.
    // Without this, the guard redirects to /login while /users/me is still in-flight.
    if (!mounted || !isReady) return;

    console.log(`[ProtectedGuard] checkSession finished. mounted:${mounted} isReady:${isReady} isAuthenticated:${isAuthenticated}`);

    if (!isAuthenticated) {
      const currentUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
      console.warn('[ProtectedGuard] NOT authenticated! Stack trace:');
      console.trace();
      console.warn('[ProtectedGuard] REDIRECT TO LOGIN PREVENTED FOR DEBUGGING');
      // router.replace(`${AUTH_ROUTES.LOGIN}?redirect=${encodeURIComponent(currentUrl)}`);
    }
  }, [mounted, isReady, isAuthenticated, router, pathname, searchParams]);

  // Show loading spinner while session is being verified.
  if (!mounted || !isReady) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
};
