'use client';

import { ReactNode, useState } from 'react';
import { RoleGuard } from '@/features/auth/components/guards/RoleGuard';
import { StudentSidebar } from '@/components/dashboard/student/StudentSidebar';
import { TopNav } from '@/components/dashboard/student/TopNav';
import { Menu } from 'lucide-react';

export default function StudentDashboardLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <RoleGuard allowedRoles={['STUDENT', 'TEACHER', 'ADMIN', 'SUPER_ADMIN']}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950" dir="rtl">
        {/* We can pass isOpen to StudentSidebar if we update it, but for now it's hidden md:flex */}
        <StudentSidebar />

        <div className="flex flex-col md:ps-64 min-h-screen">
          <TopNav />
          <main className="flex-1 p-4 md:p-8 w-full">
            {children}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
