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
  LayoutDashboard, LogOut, User, ChevronDown, Search
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/features/auth/store/auth.store"
import { apiClient } from "@/shared/api/api.client"

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mounted, setMounted] = React.useState(false)
  const [isDark, setIsDark] = React.useState(false)

  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const clearAuth = useAuthStore((state) => state.clearAuth)

  React.useEffect(() => {
    setMounted(true)
    const storedTheme = localStorage.getItem("theme")
    const initialDark = storedTheme === "dark"
    setIsDark(initialDark)

    if (initialDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  React.useEffect(() => {
    if (!mounted) return
    if (isDark) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }, [isDark, mounted])

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
    <div className="fixed top-4 inset-x-4 z-[100] flex justify-center pointer-events-none">
      <header
        className={cn(
          "w-full max-w-7xl h-[72px] pointer-events-auto",
          "bg-primary rounded-full shadow-lg border border-primary/20",
          "flex items-center px-6 transition-all duration-300"
        )}
      >
        <div className="flex h-full w-full items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center shrink-0 brightness-0 invert">
            <Logo width={120} height={32} />
          </div>

          {/* Theme Toggle & Search */}
          <div className="hidden lg:flex items-center gap-3 mr-4">
            <button
              onClick={() => setIsDark(!isDark)}
              className="text-white hover:text-white/80 transition-colors"
            >
              {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
            <div className="relative">
              <input 
                type="text" 
                placeholder="ابحث في الموقع" 
                className="bg-white/10 backdrop-blur-md text-white placeholder:text-white/70 border border-white/20 rounded-full h-10 px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 w-64"
              />
              <Search className="w-4 h-4 text-white/70 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 mx-auto">
            {MainNavigation.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "px-4 py-2 rounded-full text-[15px] font-bold transition-colors smooth",
                  pathname === route.href
                    ? "text-primary bg-white"
                    : "text-white/90 hover:bg-white/10 hover:text-white"
                )}
              >
                {route.label}
              </Link>
            ))}
          </nav>

          {/* Spacer for mobile */}
          <div className="flex-1 lg:hidden" />

          {/* Right Actions (Auth) */}
          <div className="flex items-center gap-3 shrink-0">
            {isAuthenticated && user ? (
              <Dropdown>
                <DropdownTrigger render={
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white border border-white/20">
                    {user.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-white/30" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-white text-primary flex items-center justify-center text-xs font-bold">
                        {userInitials}
                      </div>
                    )}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                } />
                <DropdownContent align="end" className="w-56 mt-2 p-1">
                  <DropdownMenuItem>
                    <button onClick={() => router.push(dashboardHref)} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-muted transition-colors text-foreground group text-start">
                      <LayoutDashboard className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-sm">لوحة التحكم</span>
                    </button>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-error/10 text-error transition-colors">
                      <LogOut className="w-4 h-4" />
                      <span className="font-semibold text-sm">تسجيل الخروج</span>
                    </button>
                  </DropdownMenuItem>
                </DropdownContent>
              </Dropdown>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link href="/login">
                  <Button className="bg-slate-800 text-white hover:bg-slate-700 rounded-full font-bold h-10 px-6">
                    تسجيل الدخول
                  </Button>
                </Link>
                <Link href="/choose-account">
                  <Button className="bg-white text-primary hover:bg-gray-100 rounded-full font-bold h-10 px-6">
                    حساب جديد
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Trigger */}
            <Drawer>
              <DrawerTrigger render={
                <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-white/10 rounded-full">
                  <Menu className="size-6" />
                </Button>
              } />
              <DrawerContent side="right" className="w-[80vw] max-w-[320px] bg-background p-0">
                <DrawerHeader className="px-5 py-4 border-b border-border flex items-center justify-between">
                  <Logo width={96} height={26} />
                  <DrawerClose render={<button className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center"><X className="size-4" /></button>} />
                </DrawerHeader>
                <nav className="p-4 space-y-2">
                  {MainNavigation.map((route) => (
                    <DrawerClose key={route.href} render={
                      <Link href={route.href} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted font-semibold">
                        {route.label}
                      </Link>
                    } />
                  ))}
                  <div className="pt-4 border-t border-border flex flex-col gap-3">
                    <Link href="/login"><Button className="w-full bg-slate-800">تسجيل الدخول</Button></Link>
                    <Link href="/choose-account"><Button className="w-full">حساب جديد</Button></Link>
                  </div>
                </nav>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </header>
    </div>
  )
}
