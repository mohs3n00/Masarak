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

import authIllustration from '@/assets/images/auth-illustration.png';

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  className,
  illustration,
  illustrationAlt = 'Masarak Auth Illustration',
}) => {
  return (
    <div className={cn("min-h-screen flex flex-col lg:flex-row bg-background pt-24 lg:pt-32", className)} dir="rtl">
      
      {/* Right Column (Form) */}
      <div className="flex-1 flex flex-col items-center p-6 md:p-8 lg:p-12 z-10 relative">
        
        {/* Top bar (Back button) */}
        <div className="w-full flex justify-end mb-8 md:mb-12">
          <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold bg-muted/50 text-foreground hover:bg-muted rounded-full transition-colors">
            الرجوع للرئيسية
            <span className="text-xl leading-none -translate-y-0.5">&rarr;</span>
          </Link>
        </div>

        <div className="w-full max-w-md flex flex-col items-center justify-center flex-1">
          <div className="mb-8 w-full flex justify-center">
            <Logo width={180} height={48} href={null} />
          </div>
          
          <div className="w-full flex justify-center">
            {children}
          </div>

          <div className="mt-12 text-xs text-text-muted text-center w-full">
            © {new Date().getFullYear()} منصة مسارك. جميع الحقوق محفوظة.
          </div>
        </div>
      </div>

      {/* Left Column (Illustration) */}
      <div className="hidden lg:flex w-1/2 p-6 md:p-8 pb-12 bg-background sticky top-32 h-[calc(100vh-8rem)]">
        <div className="relative w-full h-full rounded-[40px] overflow-hidden shadow-sm">
          {illustration && (
            <Image
              src={illustration} 
              alt={illustrationAlt}
              fill
              style={{ objectFit: 'cover' }}
              className="z-10"
              priority
            />
          )}
        </div>
      </div>
      
    </div>
  );
};
