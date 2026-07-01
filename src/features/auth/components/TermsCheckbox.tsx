import React from 'react';
import Link from 'next/link';

interface TermsCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const TermsCheckbox = React.forwardRef<HTMLInputElement, TermsCheckboxProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div>
        <div className="flex items-start">
          <div className="flex h-5 items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              ref={ref}
              className={`h-4 w-4 rounded border-border text-primary focus:ring-primary ${className}`}
              {...props}
            />
          </div>
          <div className="ms-2 text-sm">
            <label htmlFor="terms" className="font-medium text-foreground">
              أوافق على{' '}
              <Link href="/terms" className="text-primary hover:text-primary-dark">
                الشروط والأحكام
              </Link>{' '}
              و{' '}
              <Link href="/privacy" className="text-primary hover:text-primary-dark">
                سياسة الخصوصية
              </Link>
            </label>
          </div>
        </div>
        {error && <p className="mt-1 text-xs text-error">{error}</p>}
      </div>
    );
  }
);

TermsCheckbox.displayName = 'TermsCheckbox';
