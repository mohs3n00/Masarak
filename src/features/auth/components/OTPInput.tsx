import React, { useState, useRef, useEffect } from 'react';

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const OTPInput: React.FC<OTPInputProps> = ({ length = 6, value, onChange, error }) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (value) {
      const valueArray = value.split('').slice(0, length);
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
    // Take only the last character in case of pasting multiple
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);

    const newValue = newOtp.join('');
    onChange(newValue);

    // Focus next input
    if (val && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      // Focus previous input on backspace if current is empty
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
    <div>
      <div className="flex justify-between gap-2" dir="ltr">
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
            className={`w-12 h-12 text-center text-xl font-semibold border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors ${
              error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
            }`}
          />
        ))}
      </div>
      {error && <p className="mt-2 text-sm text-red-600 text-right">{error}</p>}
    </div>
  );
};
