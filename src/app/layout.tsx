import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayoutWrapper } from "@/shared/components/AppLayoutWrapper";
import "./globals.css";
import { ApiProvider } from '@/lib/providers/ApiProvider';
import { AuthProvider } from '@/lib/providers/AuthProvider';
import { GlobalDevButton } from '@/features/design-review/components/GlobalDevButton';

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["latin", "arabic"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Masarak | Educational Platform",
  description: "A large-scale educational SaaS platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <ApiProvider>
          <AuthProvider>
            <TooltipProvider>
              <AppLayoutWrapper>{children}</AppLayoutWrapper>
            </TooltipProvider>
            <GlobalDevButton />
          </AuthProvider>
        </ApiProvider>
      </body>
    </html>
  );
}
