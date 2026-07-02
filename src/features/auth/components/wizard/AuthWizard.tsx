import React from 'react';
import { cn } from '@/lib/utils';
import { AuthHeader } from '../AuthHeader';

export interface AuthWizardProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  description: string;
  children: React.ReactNode;
}

export function AuthWizard({
  currentStep,
  totalSteps,
  title,
  description,
  children
}: AuthWizardProps) {
  return (
    <div className="flex flex-col w-full">
      <AuthHeader title={title} description={description} />
      
      {/* Progress Dots */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
              currentStep === i 
                ? "w-8 bg-primary" 
                : currentStep > i 
                  ? "w-4 bg-primary/40" 
                  : "w-4 bg-muted"
            )}
          />
        ))}
      </div>

      {children}
    </div>
  );
}
