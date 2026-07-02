import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Logo } from '@/shared/components/atoms/Logo';

interface AuthLayoutProps {
  children: React.ReactNode;
  illustration?: string;
  illustrationAlt?: string;
  title?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  illustration = '/images/auth/login-illustration.png', 
  illustrationAlt = 'Authentication Illustration',
  title
}) => {
  return (
    <div className="flex min-h-screen bg-background" dir="rtl">
      {/* Right Column: Form (since RTL, right is where the form should visually be or we use flex-row-reverse) */}
      <div className="flex flex-col justify-center flex-1 w-full max-w-md px-6 py-12 mx-auto lg:px-8 xl:max-w-lg z-10">
        <div className="w-full">
          {/* Mobile Logo */}
          <div className="flex items-center justify-center mb-8 lg:hidden">
            <Link href="/" className="flex items-center gap-2">
              <Logo width={120} height={35} />
            </Link>
          </div>
          
          <div className="w-full">
            {children}
          </div>

          {/* Bottom footnote */}
          <p className="mt-8 text-xs text-muted-foreground text-center relative z-10">
            © {new Date().getFullYear()} منصة مسارك. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>

      {/* Left Column: Illustration (Since RTL, it goes to the left) */}
      <div className="hidden lg:flex lg:flex-1 relative bg-primary/5 border-r border-border/50 overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,212,110,0.1)_0%,transparent_70%)] pointer-events-none" />
        
        {/* Desktop Logo */}
        <div className="absolute top-8 right-8 z-10">
          <Link href="/" className="flex items-center gap-2">
            <Logo width={140} height={40} />
          </Link>
        </div>

        {/* Illustration */}
        <div className="relative z-10 w-full max-w-2xl aspect-square flex items-center justify-center">
          {/* Fallback to a placeholder if image is missing, you should place actual SVGs in public/images/auth/ */}
          <div className="w-full h-full bg-primary/10 rounded-full animate-pulse blur-3xl absolute opacity-50" />
          {/* For now, we use an image tag assuming the user will place images, or we can use a CSS shape */}
          <Image
            src={illustration}
            alt={illustrationAlt}
            fill
            className="object-contain drop-shadow-2xl z-10"
            priority
          />
        </div>
      </div>
    </div>
  );
};
