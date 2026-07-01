import React from 'react';
import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  rating: number;
  className?: string;
}

export function RatingStars({ rating, className }: RatingStarsProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className={cn("flex items-center gap-0.5 text-warning", className)}>
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < fullStars) {
          return <Star key={i} className="w-4 h-4 fill-current" />;
        }
        if (i === fullStars && hasHalfStar) {
          return <StarHalf key={i} className="w-4 h-4 fill-current" />;
        }
        return <Star key={i} className="w-4 h-4 text-muted-foreground opacity-30" />;
      })}
    </div>
  );
}
