import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Logo } from '@/shared/components/atoms/Logo';
import { cn } from '@/lib/utils';

/**
 * AuthLayout — Masarak Design System
 *
 * Two-column layout: Form (right, RTL) + Illustration (left)
 * - No glows, no blurs, no AI effects
 * - Clean educational styling
 * - Illustration panel uses solid surface color
 * - Mobile: single column, logo at top
 */

interface AuthLayoutProps {
  children: React.ReactNode;
  illustration?: string;
  illustrationAlt?: string;
  title?: string;
  className?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  illustration,
  illustrationAlt = 'Masarak Platform',
  title,
  className,
}) => {
  return (
    <div className={cn("flex min-h-screen bg-background", className)} dir="rtl">

      {/* Form Column (right side in RTL) */}
      <main className="flex flex-col justify-center flex-1 w-full max-w-[480px] px-6 py-10 mx-auto lg:px-10 lg:mx-0">
        <div className="w-full">
          {/* Mobile Logo */}
          <div className="flex items-center justify-center mb-8 lg:hidden">
            <Link href="/" className="focus-ring rounded-md">
              <Logo width={110} height={30} href={null} />
            </Link>
          </div>

          {/* Form Content */}
          <div className="w-full">
            {children}
          </div>

          {/* Footer note */}
          <p className="mt-8 text-xs text-text-muted text-center">
            © {new Date().getFullYear()} منصة مسارك. جميع الحقوق محفوظة.
          </p>
        </div>
      </main>

      {/* Illustration Column (left side in RTL) — desktop only */}
      <aside
        className={cn(
          "hidden lg:flex lg:flex-1 flex-col",
          "bg-surface border-e border-border",
          "items-center justify-center p-12",
          "relative overflow-hidden"
        )}
        aria-hidden="true"
      >
        {/* Desktop Logo */}
        <div className="absolute top-8 start-8">
          <Link href="/" className="focus-ring rounded-md block">
            <Logo width={120} height={32} href={null} />
          </Link>
        </div>

        {/* Illustration */}
        {illustration ? (
          <div className="relative w-full max-w-md aspect-[4/3]">
            <Image
              src={illustration}
              alt={illustrationAlt}
              fill
              className="object-contain"
              priority
            />
          </div>
        ) : (
          /* Default placeholder when no illustration provided */
          <div className="flex flex-col items-center gap-6 text-center max-w-xs">
            <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Logo width={60} height={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">
                {title ?? 'مرحباً بك في مسارك'}
              </h2>
              <p className="text-text-muted text-sm leading-relaxed">
                منصة تعليمية لطلاب الثانوية العامة المصرية
              </p>
            </div>
          </div>
        )}

        {/* Bottom pattern — just a subtle grid, no glows */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
      </aside>
    </div>
  );
};
