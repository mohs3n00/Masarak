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
    <AnimatedDiv variant="scaleIn" className={cn("relative w-full flex items-center justify-center", className)}>
      <Image src={src} alt={alt} fill className="object-contain drop-shadow-2xl" priority />
    </AnimatedDiv>
  );
}
