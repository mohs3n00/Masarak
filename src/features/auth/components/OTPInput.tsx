import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
}

/**
 * OTPInput — Masarak Design System
 * Controlled component for entering verification codes.
 */
export const OTPInput: React.FC<OTPInputProps> = ({ 
  length = 6, 
  value, 
  onChange, 
  error,
  className 
}) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (value) {
      const valueArray = value.split('').slice(0, length);
      setOtp((prev) => {
        const newOtp = [...prev];
        valueArray.forEach((char, index) => {
          newOtp[index] = char;
        });
        return newOtp;
      });
    }
  }, [value, length]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value;
    if (isNaN(Number(val))) return;

    const newOtp = [...otp];
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);

    const newValue = newOtp.join('');
    onChange(newValue);

    if (val && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, length);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, idx) => {
      newOtp[idx] = char;
    });
    setOtp(newOtp);
    onChange(newOtp.join(''));
    
    const focusIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div className={className}>
      <div className="flex justify-between gap-3" dir="ltr">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            ref={(el) => { inputRefs.current[index] = el; }}
            className={cn(
              "w-12 h-14 text-center text-xl font-bold rounded-lg border transition-colors",
              "bg-input text-foreground outline-none",
              "focus:ring-2 focus:ring-offset-1 focus:ring-primary focus:border-primary",
              error 
                ? "border-error focus:ring-error focus:border-error" 
                : "border-input-border hover:border-border-strong"
            )}
          />
        ))}
      </div>
      {error && <p className="mt-2 text-sm font-medium text-error text-start">{error}</p>}
    </div>
  );
};
