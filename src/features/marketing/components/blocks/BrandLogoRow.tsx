import React from 'react';
import { cn } from '@/lib/utils';
import { AnimatedDiv } from '@/shared/components/atoms/Motion';

interface BrandLogoRowProps {
  logos: React.ReactNode[];
  className?: string;
}

export function BrandLogoRow({ logos, className }: BrandLogoRowProps) {
  return (
    <AnimatedDiv variant="fadeIn" className={cn("w-full overflow-hidden opacity-50 grayscale hover:grayscale-0 transition-all duration-500", className)}>
      <div className="flex items-center justify-center flex-wrap gap-8 md:gap-16">
        {logos.map((logo, i) => (
          <div key={i} className="flex items-center justify-center min-w-[120px]">
            {logo}
          </div>
        ))}
      </div>
    </AnimatedDiv>
  );
}
