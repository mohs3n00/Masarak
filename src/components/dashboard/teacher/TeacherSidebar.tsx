'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Logo } from '@/shared/components/atoms/Logo';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { apiClient } from '@/shared/api/api.client';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, BookOpen, Users, BarChart2,
  Wallet, User, Settings, LogOut, ChevronLeft,
  Bell, Star, Calendar, Ticket, PenTool
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard/teacher', label: 'نظرة عامة', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/teacher/courses', label: 'كورساتي', icon: BookOpen },
  { href: '/dashboard/teacher/students', label: 'طلابي', icon: Users },
  { href: '/dashboard/teacher/coupons', label: 'الكوبونات', icon: Ticket },
  { href: '/dashboard/teacher/question-designer', label: 'مصمم الأسئلة', icon: PenTool },
  { href: '/dashboard/teacher/notifications', label: 'الإشعارات', icon: Bell },
  { href: '/dashboard/teacher/profile', label: 'الملف الشخصي', icon: User },
];

export function TeacherSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();

  const userInitials = user?.name
    ? user.name.split(' ').slice(0, 2).map((n: string) => n[0]).join('')
    : 'T';

  const handleLogout = async () => {
    try { await apiClient.post('/auth/logout'); } catch { /* ignore */ }
    clearAuth();
    router.push('/login');
  };

  return (
    <aside className="fixed top-0 start-0 h-screen w-60 bg-background border-e border-border flex flex-col z-50 shadow-sm" dir="rtl">
      {/* Logo */}
      <div className="h-[68px] px-5 flex items-center shrink-0 border-b border-border">
        <Logo width={100} height={28} />
        <span className="ms-2 text-[10px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">
          مدرس
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-secondary hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-primary' : 'text-text-muted')} />
              <span>{item.label}</span>
              {isActive && <ChevronLeft className="w-3 h-3 ms-auto text-primary" />}
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="p-3 border-t border-border shrink-0">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-muted/50">
          {user?.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center text-white text-xs font-bold shrink-0">
              {userInitials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground truncate">{user?.name}</p>
            <p className="text-[10px] text-text-muted">مدرس</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-error hover:bg-error/10 transition-colors"
            aria-label="تسجيل الخروج"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
