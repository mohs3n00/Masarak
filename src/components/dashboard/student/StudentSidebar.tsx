'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Library, 
  Award, 
  Bookmark, 
  Download, 
  Calendar, 
  Bell, 
  Settings, 
  LogOut,
  Heart,
  FileText,
} from 'lucide-react';
import { Logo } from "@/shared/components/atoms/Logo"
import { cn } from '@/lib/utils';

const sidebarSections = [
  {
    title: 'التعلم',
    items: [
      { name: 'لوحة التحكم', icon: LayoutDashboard, href: '/dashboard/student' },
      { name: 'كورساتي', icon: Library, href: '/dashboard/student/courses' },
      { name: 'الشهادات', icon: Award, href: '/dashboard/student/certificates' },
      { name: 'ملاحظاتي', icon: FileText, href: '/dashboard/student/notes' },
    ]
  },
  {
    title: 'المكتبة',
    items: [
      { name: 'المفضلة', icon: Heart, href: '/dashboard/student/wishlist' },
      { name: 'المحفوظات', icon: Bookmark, href: '/dashboard/student/bookmarks' },
      { name: 'التحميلات', icon: Download, href: '/dashboard/student/downloads' },
      { name: 'التقويم', icon: Calendar, href: '/dashboard/student/calendar' },
    ]
  },
  {
    title: 'الحساب',
    items: [
      { name: 'الإشعارات', icon: Bell, href: '/dashboard/student/notifications', badge: 3 },
      { name: 'الإعدادات', icon: Settings, href: '/dashboard/student/settings' },
    ]
  }
];

export function StudentSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed start-0 top-0 z-40 h-screen w-60 border-e border-border/50 bg-card transition-transform hidden md:flex flex-col shadow-sm">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-border/50">
        <Logo width={110} height={30} href="/dashboard/student" className="flex items-center transition-opacity hover:opacity-80" />
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-5 px-3 scrollbar-hidden flex flex-col gap-6">
        {sidebarSections.map((section, idx) => (
          <div key={idx} className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-3 mb-1">
              {section.title}
            </span>
            <nav className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 group",
                      isActive
                        ? "text-primary bg-primary/8"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    )}
                  >
                    {isActive && (
                      <span className="absolute start-0 w-0.5 h-5 bg-primary rounded-e-full" />
                    )}
                    <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary" : "")} />
                    <span className="flex-1 truncate">{item.name}</span>
                    {item.badge && (
                      <span className="ms-auto bg-primary text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border/50">
        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-error hover:bg-error/8 transition-all duration-150">
          <LogOut className="h-4 w-4 shrink-0" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}
