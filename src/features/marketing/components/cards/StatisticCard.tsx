import React from 'react';
import { cn } from '@/lib/utils';
import { AnimatedDiv } from '@/shared/components/atoms/Motion';

interface StatisticCardProps {
  value: string | number;
  label: string;
  className?: string;
}

export function StatisticCard({ value, label, className }: StatisticCardProps) {
  return (
    <AnimatedDiv variant="fadeUp" className={cn(
      "flex flex-col items-center justify-center py-8 text-center",
      className
    )}>
      <div className="text-3xl md:text-4xl font-bold text-primary mb-1.5">{value}</div>
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
    </AnimatedDiv>
  );
}
