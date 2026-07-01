import { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { DeveloperToolbar } from '@/features/design-review/components/DeveloperToolbar';
import { ViewportWrapper } from '@/features/design-review/components/ViewportWrapper';
import { PerformancePanel } from '@/features/design-review/components/PerformancePanel';

export default function DesignReviewLayout({ children }: { children: ReactNode }) {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  return (
    <div className="h-screen w-screen bg-neutral-900 flex flex-col font-sans overflow-hidden">
      <PerformancePanel />
      <div className="flex-1 w-full h-full relative overflow-hidden flex items-center justify-center p-0 md:p-4">
        <ViewportWrapper>
          {children}
        </ViewportWrapper>
      </div>
      <DeveloperToolbar />
    </div>
  );
}
