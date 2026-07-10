'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAuthStore } from '../../store/auth.store';
import { AUTH_ROUTES } from '../../constants/auth.constants';

export const ProtectedGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      const currentUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
      router.replace(`${AUTH_ROUTES.LOGIN}?redirect=${encodeURIComponent(currentUrl)}`);
    }
  }, [mounted, isAuthenticated, router, pathname, searchParams]);

  if (!mounted || !isAuthenticated) return null;

  return <>{children}</>;
};
