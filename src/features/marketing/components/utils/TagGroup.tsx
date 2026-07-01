import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/shared/components/atoms/Badge';

interface TagGroupProps {
  tags: string[];
  className?: string;
}

export function TagGroup({ tags, className }: TagGroupProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {tags.map((tag, idx) => (
        <Badge key={idx} variant="secondary" className="font-normal text-xs">{tag}</Badge>
      ))}
    </div>
  );
}
