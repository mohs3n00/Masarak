import React from 'react';

interface AuthHeaderProps {
  title: string;
  description?: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ title, description }) => {
  return (
    <div className="mb-6 text-center">
      <h2 className="text-xl font-bold text-foreground">{title}</h2>
      {description && <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{description}</p>}
    </div>
  );
};
