'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/components/atoms/Button';
import Link from 'next/link';
import { useAuthStore } from '@/features/auth/store/auth.store';

interface CTASectionProps {
  title: string;
  description: string;
  primaryAction: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  imageSrc?: string | any;
  className?: string;
  hideWhenAuth?: boolean;
}

/**
 * CTASection — Clean educational CTA block.
 * No blur, no glows, no AI effects.
 * Solid color, readable text, clear actions.
 */
export function CTASection({ title, description, primaryAction, secondaryAction, imageSrc, className, hideWhenAuth = true }: CTASectionProps) {
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (hideWhenAuth && mounted && isAuthenticated) {
    return null;
  }

  return (
    <section className={cn(
      "bg-primary rounded-2xl overflow-hidden shadow-xl",
      className
    )}>
      <div className="flex flex-col md:flex-row items-center">
        {/* Right Side: Text Content (RTL) */}
        <div className="flex-1 p-10 md:p-16 text-right flex flex-col items-start gap-6">
          <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
            {title}
          </h2>
          <p className="text-lg text-white/90 leading-relaxed max-w-xl font-medium">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
            <Link href={primaryAction.href} className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white font-bold shadow-md rounded-xl px-8"
              >
                {primaryAction.label}
              </Button>
            </Link>
            {secondaryAction && (
              <Link href={secondaryAction.href} className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full bg-transparent text-white border-2 border-white/30 hover:bg-white/10 font-bold rounded-xl px-8"
                >
                  {secondaryAction.label}
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Left Side: Image (RTL) */}
        {imageSrc && (
          <div className="flex-1 relative w-full h-[300px] md:h-[400px] flex items-end justify-start pointer-events-none">
            <div className="relative w-full h-full opacity-40 [mask-image:linear-gradient(to_right,black_30%,transparent_90%)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={typeof imageSrc === 'string' ? imageSrc : imageSrc.src}
                alt="CTA Image" 
                className="w-full h-full object-contain object-left mix-blend-multiply contrast-125"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
