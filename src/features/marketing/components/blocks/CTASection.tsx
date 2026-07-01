import React from 'react';
import { cn } from '@/lib/utils';
import { AnimatedDiv } from '@/shared/components/atoms/Motion';
import { Button } from '@/shared/components/atoms/Button';
import Link from 'next/link';

interface CTASectionProps {
  title: string;
  description: string;
  primaryAction: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  className?: string;
}

export function CTASection({ title, description, primaryAction, secondaryAction, className }: CTASectionProps) {
  return (
    <AnimatedDiv variant="scaleIn" className={cn(
      "bg-primary text-primary-foreground rounded-[2.5rem] p-10 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-primary/20", 
      className
    )}>
      {/* Premium subtle background pattern */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-8">
        <h2 className="text-4xl md:text-6xl font-black tracking-tight">{title}</h2>
        <p className="text-xl md:text-2xl opacity-90 leading-relaxed font-medium max-w-2xl">{description}</p>
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
          <Link href={primaryAction.href} className="w-full sm:w-auto">
            <Button size="lg" variant="secondary" className="w-full h-14 px-10 text-[17px] font-black rounded-2xl shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 text-primary">
              {primaryAction.label}
            </Button>
          </Link>
          {secondaryAction && (
            <Link href={secondaryAction.href} className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full h-14 px-10 text-[17px] bg-transparent border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary font-bold rounded-2xl hover:-translate-y-1 transition-all duration-300">
                {secondaryAction.label}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </AnimatedDiv>
  );
}
