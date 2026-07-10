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
  className?: string;
  hideWhenAuth?: boolean;
}

/**
 * CTASection — Clean educational CTA block.
 * No blur, no glows, no AI effects.
 * Solid color, readable text, clear actions.
 */
export function CTASection({ title, description, primaryAction, secondaryAction, className, hideWhenAuth = true }: CTASectionProps) {
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
      "bg-primary rounded-2xl p-10 md:p-16 text-center",
      className
    )}>
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-6">
        <h2 className="text-3xl md:text-4xl font-black text-primary-foreground leading-tight">
          {title}
        </h2>
        <p className="text-lg text-primary-foreground/85 leading-relaxed max-w-xl">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
          <Link href={primaryAction.href} className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full bg-white text-primary hover:bg-white/90 active:bg-white/80 font-bold shadow-sm"
            >
              {primaryAction.label}
            </Button>
          </Link>
          {secondaryAction && (
            <Link href={secondaryAction.href} className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full bg-transparent text-primary-foreground border-2 border-primary-foreground/30 hover:bg-primary-foreground/10 font-bold"
              >
                {secondaryAction.label}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
