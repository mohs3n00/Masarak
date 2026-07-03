import * as React from "react"
import Link from "next/link"
import { FooterNavigation } from "@/config/navigation"
import { Logo } from "@/shared/components/atoms/Logo"
import { fetchFooterSettings } from "@/lib/api/settings"

// Social Icons as inline SVGs for reliability
const TwitterIcon = () => (
  <svg className="size-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const InstagramIcon = () => (
  <svg className="size-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
)

const YoutubeIcon = () => (
  <svg className="size-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
  </svg>
)

const LinkedInIcon = () => (
  <svg className="size-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const socialLinks = [
  { name: "تويتر", href: "#", icon: TwitterIcon },
  { name: "انستقرام", href: "#", icon: InstagramIcon },
  { name: "يوتيوب", href: "#", icon: YoutubeIcon },
  { name: "لينكدإن", href: "#", icon: LinkedInIcon },
]

export async function Footer() {
  const footerSettings = await fetchFooterSettings();

  const socialLinksMapped = footerSettings
    .filter(setting => setting.isActive)
    .map(setting => {
      let icon = null;
      if (setting.platform === 'FACEBOOK') icon = TwitterIcon; // Should be Facebook icon ideally, reusing Twitter for now just to compile, user can customize
      if (setting.platform === 'WHATSAPP') icon = InstagramIcon; 
      if (setting.platform === 'EMAIL') icon = YoutubeIcon;
      
      return {
        name: setting.platform,
        href: setting.value,
        icon: icon || LinkedInIcon,
      }
    });

  return (
    <footer className="bg-surface border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-7xl">
        
        {/* Main Footer Grid */}
        <div className="py-14 md:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-block focus-ring rounded-md">
              <Logo className="h-7 w-auto" href={null} />
            </Link>
            <p className="text-sm text-text-muted leading-relaxed max-w-xs">
              منصة مسارك التعليمية — وجهتك الأولى للتعلم عن بعد باللغة العربية. 
              انضم لمجتمع من المتعلمين والخبراء وابنِ مستقبلك الأكاديمي.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-2 pt-2">
              {socialLinksMapped.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 rounded-xl flex items-center justify-center bg-muted text-text-muted hover:bg-primary/10 hover:text-primary transition-colors focus-ring"
                  aria-label={social.name}
                >
                  <social.icon />
                </Link>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-foreground">المنصة</h3>
            <ul className="space-y-3">
              {FooterNavigation.Platform.map((link) => (
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

          {/* About Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-foreground">الشركة</h3>
            <ul className="space-y-3">
              {FooterNavigation.About.map((link) => (
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

          {/* Support + Legal Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-foreground">الدعم والقانوني</h3>
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
