/**
 * Centralized utility to parse platform URLs and extract the username or display value.
 * Uses the URL as the single source of truth.
 */
export function parsePlatformUrl(platform: string, url: string): string {
  if (!url) return '';
  const trimmedUrl = url.trim();
  
  try {
    const urlObj = new URL(trimmedUrl);
    const hostname = urlObj.hostname.toLowerCase();
    const pathname = urlObj.pathname;

    switch (platform.toLowerCase()) {
      case 'facebook':
        // e.g. https://facebook.com/masarak -> masarak
        return pathname.replace(/^\//, '').split('/')[0] || trimmedUrl;

      case 'instagram':
        // e.g. https://instagram.com/masarak_platform -> @masarak_platform
        const igUser = pathname.replace(/^\//, '').split('/')[0];
        return igUser ? `@${igUser}` : trimmedUrl;

      case 'youtube':
        // e.g. https://youtube.com/@Masarak -> @Masarak
        const ytUser = pathname.replace(/^\//, '').split('/')[0];
        return ytUser ? (ytUser.startsWith('@') ? ytUser : `@${ytUser}`) : trimmedUrl;

      case 'telegram':
        // e.g. https://t.me/masarak -> @masarak
        const tgUser = pathname.replace(/^\//, '').split('/')[0];
        return tgUser ? `@${tgUser}` : trimmedUrl;

      case 'website':
        // e.g. https://masarak.net -> masarak.net
        return hostname.replace(/^www\./, '');

      case 'whatsapp':
        // e.g. https://wa.me/201234567890 -> +20 123 456 7890 (formatted)
        const waNumber = pathname.replace(/^\//, '');
        if (/^\d{10,15}$/.test(waNumber)) {
          // simple formatting for WhatsApp numbers starting with country code
          if (waNumber.startsWith('20') && waNumber.length === 12) {
            return `+20 ${waNumber.slice(2, 5)} ${waNumber.slice(5, 8)} ${waNumber.slice(8)}`;
          }
          return `+${waNumber}`;
        }
        return waNumber || trimmedUrl;

      case 'email':
        // e.g. mailto:contact@masarak.net -> contact@masarak.net
        return trimmedUrl.replace(/^mailto:/i, '');

      case 'phone':
        // e.g. tel:+201234567890 -> +20 123 456 7890
        const phone = trimmedUrl.replace(/^tel:/i, '');
        if (phone.startsWith('+20') && phone.length === 13) {
          return `+20 ${phone.slice(3, 6)} ${phone.slice(6, 9)} ${phone.slice(9)}`;
        }
        return phone;

      default:
        // Attempt generic username extraction from path
        const genericUser = pathname.replace(/^\//, '').split('/')[0];
        return genericUser || hostname.replace(/^www\./, '') || trimmedUrl;
    }
  } catch (error) {
    // If it's not a valid URL (e.g. just a username typed in), return it directly or fallback
    return trimmedUrl;
  }
}
