'use client';

import { Search, Bell, MessageSquare, Moon, Sun } from 'lucide-react';
import { studentMockData } from '@/lib/mock-data/student-dashboard';
import * as React from 'react';

export function TopNav() {
  const { profile } = studentMockData;
  const [mounted, setMounted] = React.useState(false);
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialDark = storedTheme === "dark" || (!storedTheme && systemPrefersDark) || document.documentElement.classList.contains('dark');
    setIsDark(initialDark);
  }, []);

  React.useEffect(() => {
    if (!mounted) return;
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem("theme", "light");
    }
  }, [isDark, mounted]);

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-border/50 bg-background/80 px-4 md:px-6 backdrop-blur-xl">
      {/* Search */}
      <div className="flex items-center gap-3 flex-1">
        <div className="relative w-full max-w-xs hidden md:flex items-center text-muted-foreground focus-within:text-foreground">
          <Search className="absolute start-3 h-4 w-4" />
          <input 
            type="search" 
            placeholder="ابحث عن كورس أو درس..." 
            className="h-9 w-full rounded-full border border-border/60 bg-muted/40 ps-9 pe-4 text-sm text-foreground outline-none transition-all focus:border-primary/50 focus:bg-background focus:ring-2 focus:ring-primary/10 placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        {/* Theme Toggle */}
        <button 
          onClick={() => setIsDark(!isDark)}
          className="h-9 w-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>

        {/* Messages */}
        <button className="h-9 w-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors hidden sm:flex" aria-label="Messages">
          <MessageSquare className="h-4 w-4" />
        </button>

        {/* Notifications */}
        <button className="relative h-9 w-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors hidden sm:flex" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 end-2 h-1.5 w-1.5 rounded-full bg-error ring-2 ring-background" />
        </button>

        {/* Divider */}
        <div className="h-5 w-px bg-border/60 mx-1 hidden sm:block" />

        {/* Avatar */}
        <button className="flex items-center gap-2.5 rounded-full hover:bg-muted/60 py-1 px-2 pe-3 transition-colors">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={profile.avatar} 
            alt={profile.name} 
            className="h-7 w-7 rounded-full object-cover border border-border/60 shrink-0"
          />
          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-semibold leading-none">{profile.name}</span>
            <span className="text-[10px] text-muted-foreground mt-0.5">طالب نشط</span>
          </div>
        </button>
      </div>
    </header>
  );
}
