'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, GraduationCap, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'الرئيسية', href: '/', icon: Home },
  { label: 'الكورسات', href: '/courses', icon: BookOpen },
  { label: 'المعلمون', href: '/teachers', icon: GraduationCap },
  { label: 'المجتمع', href: '/community', icon: Compass },
];

export function FloatingDock() {
  const pathname = usePathname();

  // Pages where floating dock should NOT appear
  const isHiddenPage = React.useMemo(() => {
    if (!pathname) return false;
    
    // Hidden in video player, checkout, auth pages, or dashboard course pages
    if (pathname.includes('/player') || pathname.includes('/checkout')) return true;
    if (pathname.startsWith('/dashboard/student/course/')) return true;
    if (pathname.startsWith('/dashboard/teacher/courses/')) return true;
    if (pathname.startsWith('/login') || pathname.startsWith('/register')) return true;
    if (pathname.startsWith('/forgot-password') || pathname.startsWith('/reset-password')) return true;

    return false;
  }, [pathname]);

  if (isHiddenPage) return null;

  return (
    <div 
      className="hidden lg:flex fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
      aria-label="شريط الملاحة العائم"
    >
      <nav className="flex items-center gap-1 sm:gap-2 px-3 py-2 rounded-full bg-card/85 dark:bg-slate-900/85 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-2xl shadow-black/20 ring-1 ring-black/5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm transition-all duration-300 font-semibold select-none",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-[1.03]"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
              )}
            >
              <Icon className={cn("w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform duration-300", isActive && "scale-110")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
