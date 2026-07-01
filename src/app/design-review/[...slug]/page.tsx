'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import { DesignReviewLayout } from '@/features/design-review/components/DesignReviewLayout';
import { reviewRegistry } from '@/features/design-review/registry';
import { componentMap } from '@/features/design-review/componentMap';

export default function DynamicDesignReviewPage({ params }: { params: { slug: string[] } }) {
  // slug is an array of path segments. We join them back with '-' to match the registry paths if needed.
  // Wait, in registry, path is like "/design-review/student-dashboard".
  // The slug for this would be ['student-dashboard'].
  const pathSlug = params.slug.join('-');
  const registryEntry = reviewRegistry.find(r => r.path === `/design-review/${pathSlug}`);

  if (!registryEntry) {
    notFound();
  }

  const Component = componentMap[pathSlug];

  if (!Component) {
    return (
      <DesignReviewLayout title={registryEntry.title} description={registryEntry.category}>
        <div className="flex flex-col items-center justify-center p-12 text-center h-[50vh]">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-muted-foreground">?</span>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">عذراً، هذه الصفحة غير مكتملة بعد</h2>
          <p className="text-muted-foreground">لم يتم العثور على المكون الفعلي لهذه الصفحة.</p>
        </div>
      </DesignReviewLayout>
    );
  }

  return (
    <DesignReviewLayout title={registryEntry.title} description={registryEntry.category}>
      <Component />
    </DesignReviewLayout>
  );
}
