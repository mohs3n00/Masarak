import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/components/atoms/Button';

interface SocialLinks {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
}

interface SocialButtonsProps {
  links: SocialLinks;
  className?: string;
}

export function SocialButtons({ links, className }: SocialButtonsProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {links.facebook && (
        <Link href={links.facebook} target="_blank" rel="noopener noreferrer">
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full">
            <span className="sr-only">Facebook</span>
            FB
          </Button>
        </Link>
      )}
      {links.twitter && (
        <Link href={links.twitter} target="_blank" rel="noopener noreferrer">
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full">
            <span className="sr-only">Twitter</span>
            TW
          </Button>
        </Link>
      )}
      {links.linkedin && (
        <Link href={links.linkedin} target="_blank" rel="noopener noreferrer">
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full">
            <span className="sr-only">LinkedIn</span>
            IN
          </Button>
        </Link>
      )}
    </div>
  );
}
