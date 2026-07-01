"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MainNavigation } from "@/config/navigation"
import { Button } from "../atoms/Button"
import { Logo } from "../atoms/Logo"
import { 
  DropdownMenu as Dropdown, 
  DropdownMenuTrigger as DropdownTrigger, 
  DropdownMenuContent as DropdownContent, 
  DropdownMenuItem, 
} from "../molecules/Dropdown"
import { SegmentedSwitch } from "../atoms/SegmentedSwitch"
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerClose } from "../organisms/Drawer"
import { 
  Menu, Moon, Sun, Languages, X, 
  LogIn, UserPlus, ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"

export function Navbar() {
  const pathname = usePathname()
  const [isDark, setIsDark] = React.useState(false)
  const [lang, setLang] = React.useState<"en" | "ar">("ar")
  const [isScrolled, setIsScrolled] = React.useState(false)

  // Handle scroll effect
  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Handle Theme Toggle
  React.useEffect(() => {
    if (isDark) document.documentElement.classList.add("dark")
    else document.documentElement.classList.remove("dark")
  }, [isDark])

  // Handle Language Toggle
  React.useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = lang
  }, [lang])

  const isRTL = lang === "ar"

  return (
    <header
      className={cn(
        "sticky top-0 inset-x-0 w-full z-[100] transition-all duration-300 shrink-0 h-[80px]",
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-background/40 backdrop-blur-md border-b border-transparent"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl h-full">
        <div className="flex h-full items-center justify-between gap-4 sm:gap-8">

          {/* Logo */}
          <div className="flex items-center shrink-0">
            <Logo width={120} height={32} className="flex items-center outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md" />
          </div>

          {/* Center Navigation — Desktop */}
          <nav className="hidden lg:flex items-center justify-center gap-1.5 flex-1">
            {MainNavigation.map((route) => {
              const isActive = pathname === route.href
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "relative flex items-center justify-center px-4 py-2.5 rounded-full text-[15px] font-bold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {route.label}
                </Link>
              )
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">

            {/* Theme + Language Dropdown */}
            {/* Theme & Language Toggles (Hidden on Mobile) */}
            <div className="hidden lg:flex items-center gap-3 bg-muted/30 p-1.5 rounded-2xl border border-border/50">
              <SegmentedSwitch
                size="sm"
                value={isDark ? 'dark' : 'light'}
                onChange={(v) => setIsDark(v === 'dark')}
                options={[
                  { value: 'light', label: <Sun className="w-3.5 h-3.5" /> },
                  { value: 'dark', label: <Moon className="w-3.5 h-3.5" /> },
                ]}
              />
              <div className="w-px h-4 bg-border/50" />
              <SegmentedSwitch
                size="sm"
                value={lang}
                onChange={(v) => setLang(v as 'en' | 'ar')}
                options={[
                  { value: 'ar', label: 'ع' },
                  { value: 'en', label: 'EN' },
                ]}
              />
            </div>

            {/* Auth Buttons — Desktop */}
            <div className="hidden sm:flex items-center gap-3">
              <Link href="/login" className="flex">
                <Button
                  variant="ghost"
                  className="rounded-full px-5 font-bold text-[15px] text-muted-foreground hover:text-foreground hover:bg-muted h-10"
                >
                  {lang === 'ar' ? 'تسجيل دخول' : 'Log in'}
                </Button>
              </Link>
              <Link href="/register" className="flex">
                <Button
                  className="rounded-full px-6 font-bold text-[15px] h-10 shadow-md hover:shadow-lg transition-all"
                >
                  {lang === 'ar' ? 'ابدأ مجاناً' : 'Sign up'}
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <Drawer>
              <DrawerTrigger render={
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="lg:hidden rounded-full w-10 h-10 text-foreground hover:bg-muted"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">القائمة</span>
                </Button>
              } />
              <DrawerContent 
                side={isRTL ? "right" : "left"} 
                className="w-[85vw] max-w-[340px] border-s border-border bg-background flex flex-col p-0"
              >
                {/* Drawer Header */}
                <DrawerHeader className="px-6 py-5 border-b border-border flex items-center justify-between">
                  <Logo width={100} height={28} />
                  <DrawerClose render={
                    <button className="w-8 h-8 rounded-full flex items-center justify-center bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                      <X className="h-4 w-4" />
                    </button>
                  } />
                </DrawerHeader>

                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
                  {MainNavigation.map((route) => (
                    <DrawerClose key={route.href} render={
                      <Link
                        href={route.href}
                        className={cn(
                          "flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-bold transition-all duration-200 group",
                          pathname === route.href
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-muted"
                        )}
                      >
                        <span>{route.label}</span>
                        <ChevronRight className={cn(
                          "h-5 w-5 text-muted-foreground group-hover:text-foreground transition-all",
                          isRTL && "rotate-180"
                        )} />
                      </Link>
                    } />
                  ))}
                </div>

                {/* Drawer Footer: Auth Buttons + Settings */}
                <div className="p-6 border-t border-border space-y-4 bg-muted/10">
                  <div className="flex flex-col gap-3">
                    <DrawerClose render={
                      <Link href="/login" className="w-full">
                        <Button variant="outline" className="w-full rounded-xl font-bold text-[15px] h-12 gap-2 bg-background">
                          <LogIn className="w-5 h-5" />
                          {lang === 'ar' ? 'تسجيل دخول' : 'Log in'}
                        </Button>
                      </Link>
                    } />
                    <DrawerClose render={
                      <Link href="/register" className="w-full">
                        <Button className="w-full rounded-xl font-bold text-[15px] h-12 gap-2 shadow-md">
                          <UserPlus className="w-5 h-5" />
                          {lang === 'ar' ? 'إنشاء حساب' : 'Sign up'}
                        </Button>
                      </Link>
                    } />
                  </div>

                  {/* Quick Settings */}
                  <div className="flex items-center justify-between gap-4 pt-4 border-t border-border">
                    <span className="text-sm text-muted-foreground font-bold">
                      {lang === 'ar' ? 'الإعدادات' : 'Settings'}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsDark(!isDark)}
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-background border border-border text-foreground hover:bg-muted transition-colors shadow-sm"
                        aria-label="Toggle theme"
                      >
                        {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                      </button>
                      <button
                        onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-background border border-border text-foreground hover:bg-muted transition-colors text-sm font-black shadow-sm"
                        aria-label="Toggle language"
                      >
                        {lang === 'ar' ? 'EN' : 'ع'}
                      </button>
                    </div>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>

          </div>
        </div>
      </div>
    </header>
  )
}
