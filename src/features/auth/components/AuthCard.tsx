import React from 'react';
import { cn } from '@/lib/utils';

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export const AuthCard: React.FC<AuthCardProps> = ({ children, className = '' }) => {
  return (
    <div className={cn(
      "w-full bg-card border border-border/50 rounded-[2rem] p-8 md:p-10 shadow-xl shadow-black/5 flex flex-col gap-6",
      className
    )}>
      {children}
    </div>
  );
};
