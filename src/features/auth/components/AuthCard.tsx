import React from 'react';
import { cn } from '@/lib/utils';

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export const AuthCard: React.FC<AuthCardProps> = ({ children, className = '' }) => {
  return (
    <div className={cn(
      "w-full max-w-[480px] flex flex-col gap-6",
      className
    )}>
      {children}
    </div>
  );
};
