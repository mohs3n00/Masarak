'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

export function AppLayoutWrapper({ children, navbar, footer }: { children: ReactNode, navbar: ReactNode, footer: ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      {navbar}
      <main className="flex-1 flex flex-col w-full">{children}</main>
      {footer}
    </>
  );
}
