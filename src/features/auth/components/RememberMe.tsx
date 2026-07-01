import React from 'react';

type RememberMeProps = React.InputHTMLAttributes<HTMLInputElement>;

export const RememberMe = React.forwardRef<HTMLInputElement, RememberMeProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="flex items-center">
        <input
          id="remember-me"
          name="remember-me"
          type="checkbox"
          ref={ref}
          className={`h-4 w-4 rounded border-border text-primary focus:ring-primary ${className}`}
          {...props}
        />
        <label htmlFor="remember-me" className="ms-2 block text-sm text-foreground">
          تذكرني
        </label>
      </div>
    );
  }
);

RememberMe.displayName = 'RememberMe';
