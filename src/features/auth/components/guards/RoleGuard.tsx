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
    console.log(
      `[RoleGuard] state → mounted:${mounted} isReady:${isReady} isAuthenticated:${isAuthenticated} role:${role} allowedRoles:${JSON.stringify(allowedRoles)} pathname:${pathname}`
    );

    // Wait until mounted AND AuthProvider has finished checking session
    if (!mounted || !isReady) {
      console.log('[RoleGuard] waiting — not mounted or not ready');
      return;
    }

    if (!isAuthenticated) {
      // Only redirect after isReady=true to avoid racing with AuthProvider
      const currentUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
      console.warn('[RoleGuard] NOT authenticated after isReady → redirecting to /login. pathname:', pathname);
      router.replace(`/login?redirect=${encodeURIComponent(currentUrl)}`);
    } else if (role && !allowedRoles.includes(role)) {
      console.warn('[RoleGuard] WRONG role → redirecting to /unauthorized. role:', role, 'allowed:', allowedRoles);
      router.replace('/unauthorized');
    } else {
      console.log('[RoleGuard] ✅ ACCESS GRANTED — role:', role);
    }
  // DO NOT include allowedRoles in deps — it's a static prop and causes re-runs
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, isReady, isAuthenticated, role, pathname, router, searchParams]);

  // Show spinner while AuthProvider is still checking session
  if (!mounted || !isReady) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  // After isReady, if not authenticated or wrong role — render nothing (redirect is in progress)
  if (!isAuthenticated || (role && !allowedRoles.includes(role))) {
    return null;
  }

  return <>{children}</>;
};
