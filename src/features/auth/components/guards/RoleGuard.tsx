'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAuthStore } from '../../store/auth.store';
import { useAuthContext } from '@/lib/providers/AuthProvider';
import { AuthRole } from '../../types/auth.types';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: AuthRole[];
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, role } = useAuthStore();
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
    // Without this, the guard redirects to /login while /users/me is still in-flight,
    // causing the "flash redirect back to home" bug.
    if (!mounted || !isReady) return;

    if (!isAuthenticated) {
      const currentUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
      router.replace(`/login?redirect=${encodeURIComponent(currentUrl)}`);
    } else if (role && !allowedRoles.includes(role)) {
      router.replace('/unauthorized');
    }
  }, [mounted, isReady, isAuthenticated, role, allowedRoles, router, pathname, searchParams]);

  // Show loading spinner while session is being verified — never redirect prematurely.
  if (!mounted || !isReady) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || (role && !allowedRoles.includes(role))) {
    return null;
  }

  return <>{children}</>;
};
