import * as React from "react"
import Link from "next/link"
import { FooterNavigation } from "@/config/navigation"
import { Logo } from "@/shared/components/atoms/Logo"
import { FaFacebook, FaInstagram, FaYoutube, FaTelegram, FaWhatsapp } from 'react-icons/fa';
import { Globe, Mail, Phone } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Facebook: FaFacebook,
  Instagram: FaInstagram,
  YouTube: FaYoutube,
  Telegram: FaTelegram,
  WhatsApp: FaWhatsapp,
  Website: Globe,
  Email: Mail,
  Phone: Phone,
};

export async function Footer() {
  let brandingConfig: any[] = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/platform-branding`, { next: { revalidate: 60 } });
    if (res.ok) {
      brandingConfig = await res.json();
    }
  } catch (error) {
    console.error('Failed to fetch platform branding', error);
  }

  const footerPlatforms = brandingConfig.filter(c => c.showInFooter);

  return (
    <footer className="bg-surface border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-7xl">
        
        {/* Main Footer Grid */}
        <div className="py-14 md:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-block focus-ring rounded-md">
              <Logo width={180} height={60} href={null} className="w-[180px] h-[60px]" />
            </Link>
            <p className="text-sm text-text-muted leading-relaxed max-w-xs">
              منصة مسارك التعليمية — وجهتك الأولى للتعلم عن بعد باللغة العربية. 
              انضم لمجتمع من المتعلمين والخبراء وابنِ مستقبلك الأكاديمي.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-2 pt-2">
              {footerPlatforms.map((config) => {
                const Icon = iconMap[config.platform] || Globe;
                return (
                  <Link
                    key={config.platform}
                    href={config.url}
                    target="_blank"
                    className="w-10 h-10 rounded-xl flex items-center justify-center bg-muted text-text-muted hover:bg-primary/10 hover:text-primary transition-colors focus-ring"
                    aria-label={config.platform}
                  >
                    <Icon className="w-4 h-4" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-foreground">روابط سريعة</h3>
            <ul className="space-y-3">
              {FooterNavigation.QuickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-text-muted hover:text-primary transition-colors focus-ring rounded-md"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-foreground">الدعم</h3>
            <ul className="space-y-3">
              {FooterNavigation.Support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-text-muted hover:text-primary transition-colors focus-ring rounded-md"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-foreground">الشروط والقوانين</h3>
            <ul className="space-y-3">
              {FooterNavigation.Legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-text-muted hover:text-primary transition-colors focus-ring rounded-md"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted order-2 sm:order-1 font-medium">
            © {new Date().getFullYear()} منصة مسارك. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-4 order-1 sm:order-2">
            <Link href="/privacy" className="text-xs font-medium text-text-muted hover:text-foreground transition-colors focus-ring rounded-sm">
              الخصوصية
            </Link>
            <span className="w-1 h-1 rounded-full bg-border" />
            <Link href="/terms" className="text-xs font-medium text-text-muted hover:text-foreground transition-colors focus-ring rounded-sm">
              الشروط
            </Link>
            <span className="w-1 h-1 rounded-full bg-border" />
            <Link href="/cookies" className="text-xs font-medium text-text-muted hover:text-foreground transition-colors focus-ring rounded-sm">
              الكوكيز
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
