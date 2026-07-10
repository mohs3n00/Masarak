import React, { useRef, useLayoutEffect } from 'react';
import { cn } from '@/lib/utils';

export interface AutoFitTextProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  minFontSize?: number; // in rem
  maxFontSize?: number; // in rem
  step?: number;
  textClassName?: string;
  align?: 'center' | 'start' | 'end';
}

export function AutoFitText({
  text,
  minFontSize = 1.0,
  maxFontSize = 3.0,
  step = 0.05,
  align = 'center',
  textClassName,
  className,
  ...props
}: AutoFitTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const textEl = textRef.current;
    if (!container || !textEl) return;

    // Reset to max font size
    textEl.style.fontSize = `${maxFontSize}rem`;

    let currentSize = maxFontSize;

    // We measure if textEl's scrollHeight exceeds container's clientHeight or width.
    // For this to work, the container MUST have a max-width and max-height set,
    // so it doesn't grow infinitely with the text.
    while (
      (textEl.scrollHeight > container.clientHeight || textEl.scrollWidth > container.clientWidth) &&
      currentSize > minFontSize
    ) {
      currentSize -= step;
      textEl.style.fontSize = `${currentSize}rem`;
    }
  }, [text, minFontSize, maxFontSize, step]);

  return (
    <div
      ref={containerRef}
      className={cn("w-fit max-w-full h-fit max-h-full flex items-center overflow-hidden", 
        align === 'start' ? 'justify-start' : align === 'end' ? 'justify-end' : 'justify-center',
        className)}
      {...props}
    >
      <p
        ref={textRef}
        className={cn("whitespace-pre-wrap break-words leading-snug", `text-${align}`, textClassName)}
        dir="auto"
      >
        {text}
      </p>
    </div>
  );
}
