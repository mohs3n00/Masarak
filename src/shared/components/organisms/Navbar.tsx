"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
  LogIn, UserPlus, ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Navbar — Masarak Design System
 *
 * - Solid background (no backdrop-blur)
 * - Modern icon-only toggles for Theme
 * - Clean educational styling (no AI/SaaS effects)
 * - RTL-first, mobile-first
 * - All links point to valid routes
 */

export function Navbar() {
  const pathname = usePathname()
  const [isDark, setIsDark] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  React.useEffect(() => {
    if (isDark) document.documentElement.classList.add("dark")
    else document.documentElement.classList.remove("dark")
  }, [isDark])

  React.useEffect(() => {
    if (isDark) document.documentElement.classList.add("dark")
    else document.documentElement.classList.remove("dark")
  }, [isDark])

  return (
    <header
      className={cn(
        "sticky top-0 inset-x-0 z-[100] w-full h-[68px] shrink-0",
        "transition-shadow duration-200",
        isScrolled
          ? "bg-background border-b border-border shadow-sm"
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

            {/* Theme & Language Toggles (Desktop) */}
            <div className="hidden lg:flex items-center gap-1">
              {/* Theme Toggle */}
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

              </button>

              <div className="w-px h-6 bg-border mx-1" aria-hidden="true" />
            </div>

            {/* Auth Buttons — Desktop */}
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="font-semibold text-text-secondary">
                  تسجيل الدخول
                </Button>
              </Link>
              <Link href="/choose-account">
                <Button size="sm" className="font-semibold">
                  إنشاء حساب
                </Button>
              </Link>
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

                  {/* Quick Settings Row */}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <span className="text-sm text-text-muted font-semibold">
                      الإعدادات
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsDark(!isDark)}
                        className="w-9 h-9 rounded-lg flex items-center justify-center bg-background border border-border text-text-muted hover:text-foreground transition-colors"
                        aria-label={isDark ? "الوضع الفاتح" : "الوضع الداكن"}
                      >
                        {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
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
