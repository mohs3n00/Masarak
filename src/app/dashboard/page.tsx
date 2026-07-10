'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { AUTH_ROLES, PROTECTED_ROUTES } from '@/features/auth/constants/auth.constants';
import { useAuthContext } from '@/lib/providers/AuthProvider';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const { isReady } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) return;

    if (!isAuthenticated || !user) {
      router.replace('/login');
      return;
    }

    if (user.role === AUTH_ROLES.ADMIN || user.role === AUTH_ROLES.SUPER_ADMIN) {
      router.replace('/dashboard/admin');
    } else if (user.role === AUTH_ROLES.TEACHER) {
      router.replace('/dashboard/teacher');
    } else if (user.role === AUTH_ROLES.STUDENT) {
      router.replace('/dashboard/student');
    } else {
      router.replace('/login');
    }
  }, [isReady, isAuthenticated, user, router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
    </div>
  );
}