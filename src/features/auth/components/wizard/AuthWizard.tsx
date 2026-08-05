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
  const progressPercentage = Math.round(((currentStep + 1) / totalSteps) * 100);
  const stepTitles = ["الخطوة الأولى", "الخطوة الثانية", "الخطوة الثالثة", "الخطوة الرابعة"];
  
  return (
    <div className="flex flex-col w-full">
      {/* Progress Bar (Bassthalk style) */}
      <div className="w-full mb-10 flex flex-col gap-2">
        <div className="flex justify-between items-center text-sm font-bold text-foreground">
          <span>{stepTitles[currentStep] || `الخطوة ${currentStep + 1}`}</span>
          <span className="text-text-muted">{progressPercentage}%</span>
        </div>
        <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <AuthHeader title={title} description={description} />
      
      {children}
    </div>
  );
}
