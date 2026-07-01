import React from 'react';
import { FileIcon, SearchIcon, FolderOpenIcon, StarIcon, DownloadIcon, BellIcon, BookmarkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/components/atoms/Button';

export type EmptyStateType = 'search' | 'folder' | 'document' | 'favorites' | 'downloads' | 'notifications' | 'bookmarks';

interface EmptyStateProps {
  type?: EmptyStateType;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const icons = {
  search: SearchIcon,
  folder: FolderOpenIcon,
  document: FileIcon,
  favorites: StarIcon,
  downloads: DownloadIcon,
  notifications: BellIcon,
  bookmarks: BookmarkIcon,
};

export function EmptyState({
  type = 'document',
  title,
  description,
  actionLabel,
  onAction,
  className
}: EmptyStateProps) {
  const Icon = icons[type];

  return (
    <div className={cn(
      "w-full flex flex-col items-center justify-center py-16 px-4 text-center rounded-3xl border border-border border-dashed bg-card/30 backdrop-blur-sm shadow-sm",
      className
    )}>
      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6 text-muted-foreground shadow-inner">
        <Icon className="w-10 h-10 opacity-50" />
      </div>
      <h3 className="text-xl font-bold font-heading mb-2">{title}</h3>
      <p className="text-text-secondary max-w-md mx-auto mb-8 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="lg" className="rounded-full shadow-md font-bold px-8">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
