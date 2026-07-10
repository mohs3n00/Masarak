'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAuthStore } from '../../store/auth.store';
import { AuthRole } from '../../types/auth.types';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: AuthRole[];
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, role } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (!isAuthenticated) {
        const currentUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
        router.replace(`/login?redirect=${encodeURIComponent(currentUrl)}`);
      } else if (role && !allowedRoles.includes(role)) {
        router.replace('/unauthorized');
      }
    }
  }, [mounted, isAuthenticated, role, allowedRoles, router, pathname, searchParams]);

  if (!mounted || !isAuthenticated || (role && !allowedRoles.includes(role))) {
    return null;
  }

  return <>{children}</>;
};
