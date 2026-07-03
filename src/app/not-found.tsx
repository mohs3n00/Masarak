import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-16 sm:px-6 sm:py-24 md:grid-cols-2 lg:px-8">
      <div className="max-w-max mx-auto text-center">
        <main className="sm:flex">
          <p className="text-4xl font-extrabold text-primary sm:text-5xl">404</p>
          <div className="sm:ml-6">
            <div className="sm:border-l sm:border-gray-200 sm:pl-6">
              <h1 className="text-4xl font-extrabold text-foreground tracking-tight sm:text-5xl">
                الصفحة غير موجودة
              </h1>
              <p className="mt-4 text-base text-muted-foreground">
                عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها. ربما تم نقلها أو حذفها.
              </p>
            </div>
            <div className="mt-10 flex space-x-3 space-x-reverse justify-center sm:justify-start">
              <Link href="/" className={buttonVariants({ className: "gap-2" })}>
                <Home className="w-4 h-4" />
                العودة للرئيسية
              </Link>
              <Link href="/courses" className={buttonVariants({ variant: "outline", className: "gap-2" })}>
                <Search className="w-4 h-4" />
                تصفح الكورسات
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
