import React from 'react';
import { cn } from '@/lib/utils';
import { AnimatedDiv } from '@/shared/components/atoms/Motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/shared/components/atoms/Avatar';
import { Star } from 'lucide-react';
import type { Testimonial } from '@/types/models';

interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
}

export function TestimonialCard({ testimonial, className }: TestimonialCardProps) {
  return (
    <AnimatedDiv variant="fadeUp" className="h-full">
      <div className={cn(
        "h-full flex flex-col p-6 rounded-2xl border border-border/50 bg-card",
        "transition-all duration-200 hover:border-border hover:shadow-sm",
        className
      )}>
        {/* Stars */}
        <div className="flex items-center gap-0.5 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-3.5 h-3.5",
                i < Math.floor(testimonial.rating)
                  ? "text-amber-500 fill-amber-500"
                  : "text-border fill-border"
              )}
            />
          ))}
        </div>

        {/* Quote */}
        <p className="text-sm text-foreground leading-relaxed flex-1 mb-5">
          &ldquo;{testimonial.content}&rdquo;
        </p>

        {/* Author */}
        <div className="flex items-center gap-3 pt-4 border-t border-border/40">
          <Avatar className="w-9 h-9 shrink-0">
            <AvatarImage src={testimonial.avatar} alt={testimonial.studentName} className="object-cover" />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
              {testimonial.studentName.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm text-foreground leading-tight">{testimonial.studentName}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">طالب في مسارك</p>
          </div>
        </div>
      </div>
    </AnimatedDiv>
  );
}
