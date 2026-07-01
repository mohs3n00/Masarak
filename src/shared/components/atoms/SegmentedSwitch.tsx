import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface SegmentedSwitchOption<T> {
  value: T;
  label: React.ReactNode;
}

export interface SegmentedSwitchProps<T extends string | number> {
  options: SegmentedSwitchOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function SegmentedSwitch<T extends string | number>({
  options,
  value,
  onChange,
  className,
  size = 'md',
}: SegmentedSwitchProps<T>) {
  const sizeClasses = {
    sm: 'h-8 p-1 text-xs',
    md: 'h-10 p-1 text-sm',
    lg: 'h-12 p-1.5 text-base',
  };

  const itemSizeClasses = {
    sm: 'px-2.5',
    md: 'px-3',
    lg: 'px-4',
  };

  return (
    <div
      className={cn(
        'relative inline-flex items-center rounded-xl bg-muted/50 border border-border/40',
        sizeClasses[size],
        className
      )}
    >
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <button
            key={String(option.value)}
            onClick={() => onChange(option.value)}
            className={cn(
              'relative flex h-full items-center justify-center font-semibold transition-colors z-10 whitespace-nowrap',
              itemSizeClasses[size],
              isSelected ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/80'
            )}
            type="button"
          >
            {isSelected && (
              <motion.div
                layoutId={`segmented-switch-active-${options.map(o => o.value).join('-')}`}
                className="absolute inset-0 bg-background rounded-lg shadow-sm border border-border/50"
                initial={false}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                style={{ zIndex: -1 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
