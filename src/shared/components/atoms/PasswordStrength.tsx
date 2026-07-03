import React from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordStrengthProps {
  password?: string;
  className?: string;
}

export function PasswordStrength({ password = '', className }: PasswordStrengthProps) {
  const requirements = [
    { regex: /.{8,}/, text: '8 أحرف على الأقل' },
    { regex: /[A-Z]/, text: 'حرف كبير واحد على الأقل' },
    { regex: /[a-z]/, text: 'حرف صغير واحد على الأقل' },
    { regex: /[0-9]/, text: 'رقم واحد على الأقل' },
    { regex: /[^A-Za-z0-9]/, text: 'رمز خاص واحد على الأقل (@$!%*?&)' },
  ];

  const strengthScore = requirements.filter((req) => req.regex.test(password)).length;

  const getStrengthLabel = () => {
    if (password.length === 0) return 'قوة كلمة المرور';
    if (strengthScore <= 1) return 'ضعيفة جداً';
    if (strengthScore === 2) return 'ضعيفة';
    if (strengthScore === 3) return 'مقبولة';
    if (strengthScore === 4) return 'قوية';
    return 'قوية جداً';
  };

  const getStrengthColor = () => {
    if (password.length === 0) return 'bg-muted';
    if (strengthScore <= 2) return 'bg-red-500';
    if (strengthScore === 3) return 'bg-yellow-500';
    if (strengthScore === 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  return (
    <div className={cn('w-full flex flex-col gap-2 mt-2', className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{getStrengthLabel()}</span>
      </div>
      <div className="flex gap-1 h-1.5 w-full bg-muted rounded-full overflow-hidden">
        {[1, 2, 3, 4, 5].map((index) => (
          <div
            key={index}
            className={cn(
              'h-full flex-1 transition-colors duration-300',
              password.length > 0 && index <= strengthScore ? getStrengthColor() : 'bg-transparent'
            )}
          />
        ))}
      </div>
      <ul className="flex flex-col gap-1.5 mt-2">
        {requirements.map((req, index) => {
          const isMet = req.regex.test(password);
          return (
            <li
              key={index}
              className={cn(
                'flex items-center gap-2 text-xs transition-colors duration-300',
                isMet ? 'text-green-600' : 'text-muted-foreground'
              )}
            >
              {isMet ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5 opacity-50" />}
              <span>{req.text}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
