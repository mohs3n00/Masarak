import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayoutWrapper } from "@/shared/components/AppLayoutWrapper";
import { Navbar } from "@/shared/components/organisms/Navbar";
import { Footer } from "@/shared/components/organisms/Footer";
import "./globals.css";
import { ApiProvider } from '@/lib/providers/ApiProvider';
import { AuthProvider } from '@/lib/providers/AuthProvider';
import { SupportChatWidget } from '@/features/support/components/SupportChatWidget';

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["latin", "arabic"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "منصة مسارك | للثانوية العامة",
  description: "المنصة التعليمية الأولى لطلاب الثانوية العامة في مصر.",
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
              <AppLayoutWrapper navbar={<Navbar />} footer={<Footer />}>{children}</AppLayoutWrapper>
              <SupportChatWidget />
            </TooltipProvider>
          </AuthProvider>
        </ApiProvider>
      </body>
    </html>
  );
}
