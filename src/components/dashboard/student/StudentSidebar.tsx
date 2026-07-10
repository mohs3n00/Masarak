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
import { Badge } from '@/components/ui/badge';

const sidebarSections = [
  {
    title: 'التعلم',
    items: [
      { name: 'لوحة التحكم', icon: LayoutDashboard, href: '/dashboard/student' },
      { name: 'كورساتي', icon: Library, href: '/dashboard/student/courses' },
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
    <aside className="fixed start-0 top-0 z-40 h-screen w-64 border-e border-border bg-surface transition-transform hidden md:flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Link href="/dashboard/student" className="focus-ring rounded-md">
          <Logo width={110} height={30} className="flex items-center transition-opacity hover:opacity-80" href={null} />
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-4 scrollbar-hidden flex flex-col gap-8">
        {sidebarSections.map((section, idx) => (
          <div key={idx} className="flex flex-col gap-2">
            <span className="text-[11px] font-bold tracking-widest text-text-muted px-4 mb-1">
              {section.title}
            </span>
            <nav className="flex flex-col gap-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "relative flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-colors duration-200 group focus-ring",
                      isActive
                        ? "text-primary bg-primary/10"
                        : "text-text-muted hover:text-foreground hover:bg-muted"
                    )}
                  >
                    {isActive && (
                      <span className="absolute start-0 w-1 h-6 bg-primary rounded-e-full" />
                    )}
                    <Icon className={cn("size-5 shrink-0", isActive ? "text-primary" : "")} />
                    <span className="flex-1 truncate">{item.name}</span>
                    {item.badge && (
                      <Badge variant={isActive ? "primary" : "default"} size="sm" className="px-1.5 min-w-[20px] justify-center">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-text-muted transition-colors duration-200 hover:text-error hover:bg-error/10 focus-ring">
          <LogOut className="size-5 shrink-0" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}
