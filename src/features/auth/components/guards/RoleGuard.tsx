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
    console.log(`[RoleGuard] state → mounted:${mounted} isReady:${isReady} isAuthenticated:${isAuthenticated} role:${role} allowedRoles:${allowedRoles}`);

    if (!mounted || !isReady) {
      console.log('[RoleGuard] waiting — not mounted or not ready');
      return;
    }

    if (!isAuthenticated) {
      const currentUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
      console.warn('[RoleGuard] NOT authenticated → redirecting to /login, redirect:', currentUrl);
      window.location.href = `/login?redirect=${encodeURIComponent(currentUrl)}`;
    } else if (role && !allowedRoles.includes(role)) {
      console.warn('[RoleGuard] WRONG role → redirecting to /unauthorized. role:', role, 'allowed:', allowedRoles);
      window.location.href = '/unauthorized';
    } else {
      console.log('[RoleGuard] ✅ ACCESS GRANTED — role:', role);
    }
  }, [mounted, isReady, isAuthenticated, role, allowedRoles, router, pathname, searchParams]);

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
