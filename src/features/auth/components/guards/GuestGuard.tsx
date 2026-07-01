import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/auth.store';
import { PROTECTED_ROUTES } from '../../constants/auth.constants';

export const GuestGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isAuthenticated) {
      router.replace(PROTECTED_ROUTES.DASHBOARD);
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted || isAuthenticated) return null;

  return <>{children}</>;
};
