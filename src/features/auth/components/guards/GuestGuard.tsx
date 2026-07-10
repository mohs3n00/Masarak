'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '../../store/auth.store';
import { PROTECTED_ROUTES } from '../../constants/auth.constants';

export const GuestGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isAuthenticated) {
      const redirectPath = searchParams.get('redirect') || '/';
      router.replace(redirectPath);
    }
  }, [mounted, isAuthenticated, router, searchParams]);

  if (!mounted || isAuthenticated) return null;

  return <>{children}</>;
};
