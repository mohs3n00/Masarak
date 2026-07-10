import React from 'react';
import { Construction } from 'lucide-react';

interface ComingSoonPageProps {
  title: string;
  description?: string;
  icon?: React.ElementType;
}

export function ComingSoonPage({ title, description, icon: Icon }: ComingSoonPageProps) {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-warning/10 flex items-center justify-center">
          {Icon ? (
            <Icon className="w-10 h-10 text-warning" />
          ) : (
            <Construction className="w-10 h-10 text-warning" />
          )}
        </div>
        <div>
          <h1 className="text-2xl font-black text-foreground">{title}</h1>
          <p className="text-text-muted mt-2 max-w-sm">
            {description || 'هذه الميزة قيد التطوير حالياً وستكون متاحة قريباً.'}
          </p>
        </div>
        <div className="px-4 py-2 rounded-xl bg-warning/10 border border-warning/20">
          <p className="text-sm font-bold text-warning">🚧 قيد التطوير</p>
        </div>
      </div>
    </div>
  );
}
