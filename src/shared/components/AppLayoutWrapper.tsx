'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/shared/components/organisms/Navbar';
import { Footer } from '@/shared/components/organisms/Footer';

export function AppLayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDesignReview = pathname?.startsWith('/design-review');

  if (isDesignReview) {
    return <main className="flex-1 flex flex-col w-full h-full">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col w-full">{children}</main>
      <Footer />
    </>
  );
}
