import Image from 'next/image';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  isIconOnly?: boolean;
  href?: string | null;
}

export function Logo({ className, width = 160, height = 48, isIconOnly = false, href = "/" }: LogoProps) {
  // If we had an icon-only version, we'd conditionally render it here.
  // For now, we use the provided Asset 1.svg for the primary logo.
  const src = "/logo/Asset 1.svg";

  const image = (
    <Image
      src={src}
      alt="Masarak Logo"
      width={width}
      height={height}
      className="object-contain"
      priority
    />
  );

  if (!href) {
    return <div className={cn("inline-block", className)}>{image}</div>;
  }

  return (
    <Link href={href} className={cn("inline-block hover:opacity-90 transition-opacity", className)}>
      {image}
    </Link>
  );
}
