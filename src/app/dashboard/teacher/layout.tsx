'use client';

import React, { useState } from 'react';
import { TeacherSidebar } from '@/components/dashboard/teacher/TeacherSidebar';
import { Bell, Plus, Menu } from 'lucide-react';
import Link from 'next/link';

import { RoleGuard } from '@/features/auth/components/guards/RoleGuard';

export default function TeacherDashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <RoleGuard allowedRoles={['TEACHER', 'ADMIN', 'SUPER_ADMIN']}>
      <div className="min-h-screen bg-surface" dir="rtl">
        <TeacherSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <div className="flex flex-col lg:ps-64 min-h-screen">
          {/* Top Bar */}
          <header className="sticky top-0 z-40 h-[68px] bg-background border-b border-border px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl text-foreground hover:bg-muted transition-colors border border-border"
                aria-label="فتح القائمة الجانبية"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/"
                className="px-3 sm:px-4 py-2 bg-muted text-foreground text-xs sm:text-sm font-bold rounded-lg hover:bg-muted/80 transition-colors"
              >
                الرئيسية
              </Link>
              <Link
                href="/dashboard/teacher/courses/create"
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-bold hover:bg-primary-hover transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden xs:inline">كورس جديد</span>
              </Link>
              <Link
                href="/dashboard/teacher/notifications"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-text-muted hover:text-foreground hover:bg-muted transition-colors relative"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
