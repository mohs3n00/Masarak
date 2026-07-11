'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '../../store/auth.store';
import { useAuthContext } from '@/lib/providers/AuthProvider';
import { PROTECTED_ROUTES } from '../../constants/auth.constants';

export const GuestGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const { isReady } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    console.log(`[GuestGuard] state → mounted:${mounted} isReady:${isReady} isAuthenticated:${isAuthenticated}`);

    if (!mounted || !isReady) {
      console.log('[GuestGuard] waiting — not mounted or not ready');
      return;
    }

    if (isAuthenticated) {
      const redirectPath = searchParams.get('redirect') || PROTECTED_ROUTES.DASHBOARD;
      console.log('[GuestGuard] User IS authenticated → redirecting to:', redirectPath);
      window.location.href = redirectPath;
    }
  }, [mounted, isReady, isAuthenticated, router, searchParams]);

  if (!mounted || !isReady) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) return null;

  return <>{children}</>;
};
