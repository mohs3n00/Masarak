'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { FloatingDock } from './organisms/FloatingDock';

export function AppLayoutWrapper({ children, navbar, footer }: { children: ReactNode, navbar: ReactNode, footer: ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard/admin') || pathname.startsWith('/dashboard/teacher');

  return (
    <>
      {!isDashboard && navbar}
      <main className="flex-1 flex flex-col w-full">{children}</main>
      {!isDashboard && <FloatingDock />}
      {!isDashboard && footer}
    </>
  );
}
