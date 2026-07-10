import React from 'react';
import Link from 'next/link';

interface AuthFooterProps {
  question: string;
  actionText: string;
  actionHref: string;
  onActionClick?: (e: React.MouseEvent) => void;
}

export const AuthFooter: React.FC<AuthFooterProps> = ({ question, actionText, actionHref, onActionClick }) => {
  return (
    <div className="mt-6 text-center text-sm">
      <span className="text-muted-foreground">{question} </span>
      <Link href={actionHref} onClick={onActionClick} className="font-semibold text-primary hover:text-primary/80 transition-colors">
        {actionText}
      </Link>
    </div>
  );
};
