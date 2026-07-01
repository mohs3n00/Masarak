import React from 'react';
import { Logo } from '@/shared/components/atoms/Logo';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div 
      className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden" 
      dir="rtl"
    >
      {/* Subtle Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_top,rgba(0,212,110,0.06)_0%,transparent_70%)]" />
      </div>

      {/* Logo */}
      <div className="mb-8 relative z-10">
        <Logo width={140} height={40} />
      </div>

      {/* Card Container */}
      <div className="w-full max-w-md relative z-10 px-4 sm:px-0">
        {children}
      </div>

      {/* Bottom footnote */}
      <p className="mt-8 text-xs text-muted-foreground text-center relative z-10">
        © {new Date().getFullYear()} منصة مسارك. جميع الحقوق محفوظة.
      </p>
    </div>
  );
};
