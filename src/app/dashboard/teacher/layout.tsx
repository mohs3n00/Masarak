'use client';

import { TeacherSidebar } from '@/components/dashboard/teacher/TeacherSidebar';
import { Bell, Plus } from 'lucide-react';
import Link from 'next/link';

import { RoleGuard } from '@/features/auth/components/guards/RoleGuard';

export default function TeacherDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['TEACHER', 'ADMIN', 'SUPER_ADMIN']}>
      <div className="min-h-screen bg-surface" dir="rtl">
        <TeacherSidebar />

      <div className="flex flex-col md:ps-60 min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 h-[68px] bg-background border-b border-border px-6 flex items-center justify-between gap-4 shrink-0">
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-4 py-2 bg-muted text-foreground text-sm font-bold rounded-lg hover:bg-muted/80 transition-colors"
            >
              العودة للرئيسية
            </Link>
            <Link
              href="/dashboard/teacher/courses/create"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary-hover transition-colors"
            >
              <Plus className="w-4 h-4" />
              كورس جديد
            </Link>
            <Link
              href="/dashboard/teacher/notifications"
              className="w-10 h-10 rounded-xl flex items-center justify-center text-text-muted hover:text-foreground hover:bg-muted transition-colors relative"
            >
              <Bell className="w-5 h-5" />
            </Link>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
    </RoleGuard>
  );
}
