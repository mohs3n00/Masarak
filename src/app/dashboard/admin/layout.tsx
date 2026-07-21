'use client';

import React, { useState } from 'react';
import { AdminSidebar } from '@/components/dashboard/admin/AdminSidebar';
import { Search, Menu } from 'lucide-react';
import Link from 'next/link';

import { RoleGuard } from '@/features/auth/components/guards/RoleGuard';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <RoleGuard allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
      <div className="min-h-screen bg-surface" dir="rtl">
        <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Main content — offset by sidebar width */}
        <div className="flex flex-col md:pe-0 md:ps-64 min-h-screen">
          {/* Top Bar */}
          <header className="sticky top-0 z-40 h-[68px] bg-background border-b border-border px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3 flex-1 max-w-sm">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden p-2 rounded-xl text-foreground hover:bg-muted transition-colors border border-border"
                aria-label="فتح القائمة الجانبية"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="relative flex-1">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  placeholder="بحث..."
                  className="w-full ps-9 pe-4 py-2 text-sm bg-muted rounded-xl border border-transparent focus:border-border focus:bg-background outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="px-3 sm:px-4 py-2 bg-muted text-foreground text-xs sm:text-sm font-bold rounded-lg hover:bg-muted/80 transition-colors"
              >
                الرئيسية
              </Link>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
