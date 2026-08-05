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

const DEFAULT_BRANDING = [
  { platform: 'Facebook', url: 'https://facebook.com', showInFooter: true },
  { platform: 'Instagram', url: 'https://instagram.com', showInFooter: true },
  { platform: 'WhatsApp', url: 'https://whatsapp.com', showInFooter: true },
  { platform: 'YouTube', url: 'https://youtube.com', showInFooter: true },
  { platform: 'Telegram', url: 'https://telegram.org', showInFooter: true }
];

export async function Footer() {
  let brandingConfig: any[] = [];
  try {
    let envUrl = process.env.NEXT_PUBLIC_API_URL;
    if (envUrl && !envUrl.startsWith('http://') && !envUrl.startsWith('https://')) {
      envUrl = `https://${envUrl}`;
    }
    let baseUrl: string | undefined;
    if (envUrl) {
      baseUrl = envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
    }
    if (!baseUrl) {
      console.warn('⚠️ Build Warning: NEXT_PUBLIC_API_URL is undefined. Using DEFAULT_BRANDING.');
      brandingConfig = DEFAULT_BRANDING;
    } else {
      const res = await fetch(`${baseUrl}/public/platform-branding`, { next: { revalidate: 60, tags: ['platform-branding'] } });
      if (res.ok) {
        brandingConfig = await res.json();
      } else {
        brandingConfig = DEFAULT_BRANDING;
      }
    }
  } catch (error) {
    console.error('⚠️ Failed to fetch platform branding, using default fallback.', error);
    brandingConfig = DEFAULT_BRANDING;
  }

  const footerPlatforms = brandingConfig.filter(c => c.showInFooter);

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        <div className="py-12 md:py-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-right">
          
          {/* Right Col: Logo & Info */}
          <div className="space-y-4">
            <Link href="/" className="inline-block focus-ring rounded-md">
              <Logo width={160} height={50} href={null} className="w-[160px] h-[50px] object-contain" />
            </Link>
            <p className="text-sm font-medium leading-relaxed max-w-xs ml-auto">
              تم صنع هذه المنصة بهدف تهيئة الطالب لـ كامل جوانب الثانوية العامة و ما بعدها
            </p>
            <p className="text-xs font-bold pt-2">
              جميع الحقوق محفوظة © {new Date().getFullYear()}
            </p>
          </div>

          {/* Middle Col: Pages */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-primary mb-4">الصفحات</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm font-medium hover:text-primary smooth focus-ring rounded-md">الرئيسية</Link>
              </li>
              <li>
                <Link href="/help" className="text-sm font-medium hover:text-primary smooth focus-ring rounded-md">المساعدة</Link>
              </li>
              <li>
                <Link href="/register/student" className="text-sm font-medium hover:text-primary smooth focus-ring rounded-md">انشاء حساب جديد</Link>
              </li>
              <li>
                <Link href="/login" className="text-sm font-medium hover:text-primary smooth focus-ring rounded-md">تسجيل الدخول</Link>
              </li>
            </ul>
          </div>

          {/* Left Col: Social Media Links */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-primary mb-4">السوشيال ميديا</h3>
            <ul className="space-y-3">
              {footerPlatforms.map((config) => {
                const Icon = iconMap[config.platform] || Globe;
                let platformName = config.platform;
                switch (platformName) {
                  case 'Facebook': platformName = 'فيسبوك'; break;
                  case 'Instagram': platformName = 'انستجرام'; break;
                  case 'YouTube': platformName = 'يوتيوب'; break;
                  case 'Telegram': platformName = 'تليجرام'; break;
                  case 'WhatsApp': platformName = 'واتساب'; break;
                }
                
                return (
                  <li key={config.platform}>
                    <Link
                      href={config.url}
                      target="_blank"
                      className="group flex items-center gap-2 text-sm font-medium hover:text-primary smooth focus-ring rounded-md"
                    >
                      <Icon className="w-5 h-5 text-slate-400 group-hover:text-primary smooth" />
                      {platformName}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          
        </div>

      </div>
    </footer>
  )
}
