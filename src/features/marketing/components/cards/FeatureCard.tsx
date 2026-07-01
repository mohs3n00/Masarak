import React from 'react';
import { cn } from '@/lib/utils';
import { AnimatedDiv } from '@/shared/components/atoms/Motion';
import * as Icons from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  iconName: string;
  className?: string;
}

export function FeatureCard({ title, description, iconName, className }: FeatureCardProps) {
  /* @ts-expect-error Typescript complains about IconComponent type but it's valid Lucide icon */
  const Icon = Icons[iconName] || Icons.Circle;

  return (
    <AnimatedDiv variant="fadeUp" className="h-full">
      <div className={cn(
        "h-full p-6 rounded-2xl border border-border/50 bg-card group",
        "transition-all duration-200 hover:border-primary/25 hover:shadow-sm",
        className
      )}>
        {/* Icon */}
        <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center text-primary mb-4 transition-colors duration-200 group-hover:bg-primary/15">
          <Icon className="w-5 h-5" strokeWidth={1.75} />
        </div>
        {/* Text */}
        <h3 className="font-semibold text-[15px] text-foreground mb-1.5 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </AnimatedDiv>
  );
}
