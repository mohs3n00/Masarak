import React from 'react';
import Image, { StaticImageData } from 'next/image';
import { cn } from '@/lib/utils';
import { AnimatedDiv } from '@/shared/components/atoms/Motion';

interface HeroImageProps {
  src: string | StaticImageData;
  alt: string;
  className?: string;
}

export function HeroImage({ src, alt, className }: HeroImageProps) {
  return (
    <AnimatedDiv variant="scaleIn" className={cn("relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl shadow-primary/5 border border-border/50", className)}>
      <Image src={src} alt={alt} fill className="object-cover" priority />
    </AnimatedDiv>
  );
}
