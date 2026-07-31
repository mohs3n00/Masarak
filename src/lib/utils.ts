import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function optimizeImage(url: string | null | undefined): string {
  if (!url) return '';
  if (url.includes('res.cloudinary.com') && !url.includes('q_auto')) {
    // Insert q_auto,f_auto after upload/
    return url.replace('/upload/', '/upload/q_auto,f_auto/');
  }
  return url;
}
