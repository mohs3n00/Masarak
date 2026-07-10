'use client';

import { ReactNode } from 'react';
import { RoleGuard } from '@/features/auth/components/guards/RoleGuard';

export default function StudentDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard allowedRoles={['STUDENT', 'TEACHER', 'ADMIN', 'SUPER_ADMIN']}>
      <div className="min-h-screen bg-background">
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </RoleGuard>
  );
}
