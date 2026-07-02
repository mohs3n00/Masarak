'use client';

import { ReactNode } from 'react';
import { useApi } from '@/lib/providers/ApiProvider';
import { AlertCircle, WifiOff, Loader2 } from 'lucide-react';
import { EmptyState } from '@/shared/components/molecules/EmptyState';

interface DataStateWrapperProps {
  children?: ReactNode;
  loadingSkeleton?: ReactNode;
  emptyMessage?: string;
  emptyType?: 'search' | 'folder' | 'document' | 'favorites' | 'downloads' | 'notifications' | 'bookmarks';
  className?: string;
}

export function DataStateWrapper({ 
  children, 
  loadingSkeleton, 
  emptyMessage = "No items found.",
  emptyType = 'folder',
  className
}: DataStateWrapperProps) {
  const { dataState, isLoading, isError, errorMsg } = useApi();

  if (isLoading) {
    if (loadingSkeleton) return <>{loadingSkeleton}</>;
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground w-full h-full min-h-[300px]">
        <Loader2 className="h-10 w-10 animate-spin mb-6 text-primary opacity-80" />
        <p className="text-sm font-bold tracking-wide">Loading...</p>
        {dataState === 'slow' && <p className="text-xs mt-2 text-orange-500 font-medium">Simulating slow network...</p>}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center w-full h-full min-h-[300px] border border-destructive/20 bg-destructive/5 rounded-3xl backdrop-blur-sm">
        {dataState === 'offline' ? <WifiOff className="h-12 w-12 text-destructive mb-6 opacity-80" /> : <AlertCircle className="h-12 w-12 text-destructive mb-6 opacity-80" />}
        <h3 className="text-xl font-bold font-heading text-foreground mb-2">Unable to load data</h3>
        <p className="text-sm text-text-secondary max-w-sm mb-8 leading-relaxed">{errorMsg}</p>
        <button className="bg-destructive text-destructive-foreground px-8 py-3 rounded-full text-sm font-bold hover:bg-destructive/90 transition-colors shadow-md">
          Try Again
        </button>
      </div>
    );
  }

  if (dataState === 'empty' || dataState === 'no-results') {
    let emptyIcon = null;
    const finalType = dataState === 'no-results' ? 'search' : emptyType;
    
    if (finalType === 'search') {
      emptyIcon = <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
    } else {
      emptyIcon = <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14zm0 0V9a2 2 0 012-2h14" /></svg>;
    }

    return (
      <EmptyState 
        icon={emptyIcon}
        title={dataState === 'no-results' ? 'No Results Found' : 'Nothing Here Yet'}
        description={emptyMessage}
        className={className}
      />
    );
  }

  return <>{children}</>;
}
