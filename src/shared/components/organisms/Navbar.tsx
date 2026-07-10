"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { MainNavigation } from "@/config/navigation"
import { Button } from "@/shared/components/atoms/Button"
import { Logo } from "@/shared/components/atoms/Logo"
import {
  DropdownMenu as Dropdown,
  DropdownMenuTrigger as DropdownTrigger,
  DropdownMenuContent as DropdownContent,
  DropdownMenuItem,
} from "@/shared/components/molecules/Dropdown"
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerClose } from "@/shared/components/organisms/Drawer"
import {
  Menu, Moon, Sun, X,
  LogIn, UserPlus, ChevronRight,
  LayoutDashboard, LogOut, User, ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/features/auth/store/auth.store"
import { apiClient } from "@/shared/api/api.client"

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isDark, setIsDark] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)

  const { user, isAuthenticated, clearAuth } = useAuthStore()

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  React.useEffect(() => {
    if (isDark) document.documentElement.classList.add("dark")
    else document.documentElement.classList.remove("dark")
  }, [isDark])

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout')
    } catch {
      // ignore — cookie will expire
    } finally {
      clearAuth()
      router.push('/login')
    }
  }

  const dashboardHref = React.useMemo(() => {
    if (!user) return '/dashboard'
    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') return '/dashboard/admin'
    if (user.role === 'TEACHER') return '/dashboard/teacher'
    return '/dashboard/student'
  }, [user])

  const userInitials = React.useMemo(() => {
    if (!user?.name) return '?'
    return user.name.split(' ').slice(0, 2).map((n: string) => n[0]).join('')
  }, [user])

  return (
    <header
      className={cn(
        "sticky top-0 inset-x-0 z-[100] w-full h-[68px] shrink-0",
        "transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm"
          : "bg-background border-b border-transparent"
      )}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl h-full">
        <div className="flex h-full items-center justify-between gap-4">

          {/* Logo */}
          <div className="flex items-center shrink-0">
            <Logo
              width={110}
              height={30}
              className="outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
            />
          </div>

          {/* Center Navigation — Desktop */}
          <nav className="hidden lg:flex items-center justify-center gap-1 flex-1" aria-label="القائمة الرئيسية">
            {MainNavigation.map((route) => {
              const isActive = pathname === route.href
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "relative flex items-center justify-center px-4 h-9 rounded-lg",
                    "text-[15px] font-semibold transition-colors duration-200",
                    "outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    isActive
                      ? "text-primary bg-primary/8"
                      : "text-text-secondary hover:text-foreground hover:bg-muted"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {route.label}
                </Link>
              )
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 shrink-0">

            {/* Theme Toggle */}
            <div className="hidden lg:flex items-center gap-1">
              <button
                onClick={() => setIsDark(!isDark)}
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  "text-text-muted hover:text-foreground hover:bg-muted",
                  "transition-all duration-200",
                  "outline-none focus-visible:ring-2 focus-visible:ring-primary"
                )}
                aria-label={isDark ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"}
              >
                <span className="relative w-5 h-5 flex items-center justify-center">
                  <Sun
                    className={cn(
                      "absolute size-[18px] transition-all duration-300",
                      isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"
                    )}
                    aria-hidden="true"
                  />
                  <Moon
                    className={cn(
                      "absolute size-[18px] transition-all duration-300",
                      isDark ? "opacity-0 rotate-90 scale-75" : "opacity-100 rotate-0 scale-100"
                    )}
                    aria-hidden="true"
                  />
                </span>
              </button>
              <div className="w-px h-6 bg-border mx-1" aria-hidden="true" />
            </div>

            {/* Auth Buttons — Desktop */}
            <div className="hidden sm:flex items-center gap-2">
              {isAuthenticated && user ? (
                /* Authenticated User Menu */
                <Dropdown>
                  <DropdownTrigger render={
                    <button
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-xl",
                        "border border-border hover:border-primary/40",
                        "bg-background hover:bg-muted transition-all duration-200",
                        "outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      )}
                    >
                      {/* Avatar */}
                      {user.avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover border border-border"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                          {userInitials}
                        </div>
                      )}
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-semibold text-foreground leading-tight max-w-[120px] truncate">
                          {user.name}
                        </span>
                        <span className="text-[10px] text-text-muted capitalize">
                          {user.role === 'SUPER_ADMIN' ? 'مدير عام' : user.role === 'ADMIN' ? 'مسؤول' : user.role === 'TEACHER' ? 'مدرس' : 'طالب'}
                        </span>
                      </div>
                      <ChevronDown className="w-4 h-4 text-text-muted" />
                    </button>
                  } />
                  <DropdownContent align="end" className="w-56 mt-2 p-1">
                    {user.role !== 'STUDENT' && (
                      <Link href={dashboardHref} onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))}>
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors text-foreground group">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <LayoutDashboard className="w-4 h-4" />
                          </div>
                          <span className="font-semibold text-sm">لوحة التحكم</span>
                        </div>
                      </Link>
                    )}
                    {user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN' && (
                      <DropdownMenuItem>
                        <Link href={user.role === 'STUDENT' ? '/dashboard/student' : '/dashboard/teacher/profile'} className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-muted transition-colors">
                          <User className="w-4 h-4 text-text-muted" />
                          <span className="font-semibold text-sm">الملف الشخصي</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <div className="border-t border-border my-1" />
                    <DropdownMenuItem>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-error/10 text-error transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="font-semibold text-sm">تسجيل الخروج</span>
                      </button>
                    </DropdownMenuItem>
                  </DropdownContent>
                </Dropdown>
              ) : (
                /* Guest Buttons */
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="font-semibold text-text-secondary">
                      <LogIn className="w-4 h-4 ml-1" />
                      تسجيل الدخول
                    </Button>
                  </Link>
                  <Link href="/choose-account">
                    <Button size="sm" className="font-semibold">
                      إنشاء حساب
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu */}
            <Drawer>
              <DrawerTrigger render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  aria-label="فتح القائمة"
                >
                  <Menu className="size-5" />
                </Button>
              } />
              <DrawerContent
                side="right"
                className="w-[80vw] max-w-[320px] border-s border-border bg-background flex flex-col p-0"
              >
                {/* Drawer Header */}
                <DrawerHeader className="px-5 py-4 border-b border-border flex items-center justify-between">
                  <Logo width={96} height={26} />
                  <DrawerClose render={
                    <button
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center",
                        "bg-muted text-text-muted hover:text-foreground",
                        "transition-colors duration-200"
                      )}
                      aria-label="إغلاق القائمة"
                    >
                      <X className="size-4" />
                    </button>
                  } />
                </DrawerHeader>

                {/* User Info (Mobile — if authenticated) */}
                {isAuthenticated && user && (
                  <div className="px-5 py-4 border-b border-border flex items-center gap-3">
                    {user.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                        {userInitials}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-sm text-foreground">{user.name}</p>
                      <p className="text-xs text-text-muted">
                        {user.role === 'SUPER_ADMIN' ? 'مدير عام' : user.role === 'ADMIN' ? 'مسؤول' : user.role === 'TEACHER' ? 'مدرس' : 'طالب'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label="قائمة الهاتف">
                  {MainNavigation.map((route) => (
                    <DrawerClose key={route.href} render={
                      <Link
                        href={route.href}
                        className={cn(
                          "flex items-center justify-between px-4 py-3 rounded-lg",
                          "text-base font-semibold transition-colors duration-200",
                          pathname === route.href
                            ? "bg-primary/8 text-primary"
                            : "text-foreground hover:bg-muted"
                        )}
                        aria-current={pathname === route.href ? "page" : undefined}
                      >
                        <span>{route.label}</span>
                        <ChevronRight
                          className={cn(
                            "size-4 text-text-muted",
                            "rotate-180"
                          )}
                          aria-hidden="true"
                        />
                      </Link>
                    } />
                  ))}
                </nav>
                {/* Drawer Footer */}
                <div className="p-4 border-t border-border space-y-3 bg-surface">
                  {isAuthenticated && user ? (
                    <>
                      {user.role !== 'STUDENT' && (
                        <DrawerClose render={
                          <Link href={dashboardHref} className="w-full block">
                            <Button variant="outline" className="w-full gap-2">
                              <LayoutDashboard className="size-4" aria-hidden="true" />
                              لوحة التحكم
                            </Button>
                          </Link>
                        } />
                      )}
                      {user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN' && (
                        <DrawerClose render={
                          <Link href={user.role === 'STUDENT' ? '/dashboard/student' : '/dashboard/teacher/profile'} className="w-full block">
                            <Button variant="outline" className="w-full gap-2">
                              <User className="size-4" aria-hidden="true" />
                              الملف الشخصي
                            </Button>
                          </Link>
                        } />
                      )}
                      <Button
                        variant="ghost"
                        className="w-full gap-2 text-error hover:bg-error/10"
                        onClick={handleLogout}
                      >
                        <LogOut className="size-4" aria-hidden="true" />
                        تسجيل الخروج
                      </Button>
                    </>
                  ) : (
                    <>
                      <DrawerClose render={
                        <Link href="/login" className="w-full block">
                          <Button variant="outline" className="w-full gap-2">
                            <LogIn className="size-4" aria-hidden="true" />
                            تسجيل الدخول
                          </Button>
                        </Link>
                      } />
                      <DrawerClose render={
                        <Link href="/choose-account" className="w-full block">
                          <Button className="w-full gap-2">
                            <UserPlus className="size-4" aria-hidden="true" />
                            إنشاء حساب
                          </Button>
                        </Link>
                      } />
                    </>
                  )}

                  {/* Quick Settings Row */}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <span className="text-sm text-text-muted font-semibold">
                      المظهر
                    </span>
                    <button
                      onClick={() => setIsDark(!isDark)}
                      className="w-9 h-9 rounded-lg flex items-center justify-center bg-background border border-border text-text-muted hover:text-foreground transition-colors"
                      aria-label={isDark ? "الوضع الفاتح" : "الوضع الداكن"}
                    >
                      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
                    </button>
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
