'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '../../store/auth.store';
import { useAuthContext } from '@/lib/providers/AuthProvider';
import { PROTECTED_ROUTES } from '../../constants/auth.constants';

/** Returns the role-specific dashboard path */
function getDashboardPath(role: string | null | undefined): string {
  if (role === 'ADMIN' || role === 'SUPER_ADMIN') return '/dashboard/admin';
  if (role === 'TEACHER') return '/dashboard/teacher';
  if (role === 'STUDENT') return '/dashboard/student';
  return PROTECTED_ROUTES.DASHBOARD;
}

const GuestGuardContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, role } = useAuthStore();
  const { isReady } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    console.log(`[GuestGuard] state → mounted:${mounted} isReady:${isReady} isAuthenticated:${isAuthenticated} role:${role}`);

    if (!mounted || !isReady) {
      console.log('[GuestGuard] waiting — not mounted or not ready');
      return;
    }

    if (isAuthenticated) {
      const redirectPath =
        searchParams.get('redirect') ||
        searchParams.get('callbackUrl') ||
        getDashboardPath(role);
      console.log('[GuestGuard] User IS authenticated → redirecting to:', redirectPath, '| role:', role);
      setRedirecting(true);
      router.replace(redirectPath);
    }
  }, [mounted, isReady, isAuthenticated, role, router, searchParams]);

  // Show spinner while AuthProvider checks session
  if (!mounted || !isReady) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  // Show spinner while redirect is in progress (prevents blank page flash)
  if (isAuthenticated || redirecting) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
};

export const GuestGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    }>
      <GuestGuardContent>{children}</GuestGuardContent>
    </Suspense>
  );
};
