'use client';

import { useEffect } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Unhandled application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-16 sm:px-6 sm:py-24 md:grid-cols-2 lg:px-8">
      <div className="max-w-max mx-auto text-center">
        <main className="sm:flex">
          <p className="text-4xl font-extrabold text-primary sm:text-5xl">500</p>
          <div className="sm:ml-6">
            <div className="sm:border-l sm:border-gray-200 sm:pl-6">
              <h1 className="text-4xl font-extrabold text-foreground tracking-tight sm:text-5xl">
                حدث خطأ غير متوقع
              </h1>
              <p className="mt-4 text-base text-muted-foreground">
                يبدو أن هناك مشكلة في النظام. نعتذر عن هذا العطل، جرب تحديث الصفحة.
              </p>
            </div>
            <div className="mt-10 flex space-x-3 space-x-reverse justify-center sm:justify-start">
              <Button onClick={() => reset()} className="gap-2">
                <RefreshCcw className="w-4 h-4" />
                حاول مرة أخرى
              </Button>
              <Link href="/" className={buttonVariants({ variant: "outline", className: "gap-2" })}>
                <Home className="w-4 h-4" />
                العودة للرئيسية
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
