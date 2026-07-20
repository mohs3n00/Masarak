import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Logo } from '@/shared/components/atoms/Logo';
import { TransparentVideo } from '@/shared/components/atoms/TransparentVideo';
import { cn } from '@/lib/utils';
import signInImage from '@/assets/images/sgin in.png';

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
  illustration?: string | any;
  illustrationAlt?: string;
  videoSrc?: string;
  title?: string;
  subtitle?: string;
  className?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  illustration = signInImage,
  illustrationAlt = 'Masarak Platform',
  videoSrc,
  title,
  subtitle = 'منصتك التعليمية الأفضل لتحقيق التفوق والنجاح بخطوات واثقة.',
  className,
}) => {
  return (
    <div className={cn("flex min-h-screen bg-background", className)} dir="rtl">

      {/* Form Column (right side in RTL) */}
      <main className="flex flex-col justify-center flex-1 w-full max-w-[480px] px-6 py-10 mx-auto lg:px-10 lg:mx-0 z-10 relative">
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

      {/* Illustration / Video Column (left side in RTL) — desktop only */}
      <aside
        className={cn(
          "hidden lg:flex lg:flex-1 flex-col",
          "bg-surface border-e border-border/50",
          "items-center justify-center p-12",
          "relative overflow-hidden"
        )}
        aria-hidden="true"
      >
        {/* Desktop Logo */}
        <div className="absolute top-8 start-8 z-20">
          <Link href="/" className="focus-ring rounded-md block">
            <Logo width={120} height={32} href={null} />
          </Link>
        </div>

        {/* Text Above Illustration */}
        <div className="z-10 text-center mb-8 mt-12 max-w-lg">
          <h2 className="text-3xl font-extrabold text-foreground mb-4">
            {title ?? 'أهلاً بك في منصة مسارك'}
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Illustration or Video */}
        {videoSrc ? (
          <div className="relative w-full max-w-xl aspect-[4/3] z-10 flex items-center justify-center p-2">
            <TransparentVideo
              src={videoSrc}
              className="w-full h-full max-w-xl aspect-[4/3] hover:scale-[1.02] transition-transform duration-500"
            />
          </div>
        ) : (
          <div className="relative w-full max-w-xl aspect-[4/3] z-10 drop-shadow-xl dark:drop-shadow-[0_20px_50px_rgba(255,255,255,0.05)]">
            <Image
              src={illustration}
              alt={illustrationAlt}
              fill
              className="object-contain hover:scale-[1.02] transition-transform duration-500"
              priority
            />
          </div>
        )}

        {/* Background glow effects for the theme */}
        <div className="absolute top-1/4 start-1/4 w-96 h-96 bg-primary/20 dark:bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 end-1/4 w-80 h-80 bg-blue-500/10 dark:bg-blue-400/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Bottom pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
      </aside>
    </div>
  );
};
