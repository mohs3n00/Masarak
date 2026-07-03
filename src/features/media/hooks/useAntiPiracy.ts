import { useEffect, useState } from 'react';

interface AntiPiracyResult {
  isDevToolsOpen: boolean;
  isWindowBlurred: boolean;
  warningsCount: number;
}

export function useAntiPiracy(enabled: boolean = true): AntiPiracyResult {
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);
  const [isWindowBlurred, setIsWindowBlurred] = useState(false);
  const [warningsCount, setWarningsCount] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    // 1. Check for Window Blur (Loss of Focus usually means screen sharing app or other window)
    const handleBlur = () => {
      setIsWindowBlurred(true);
      setWarningsCount((prev) => prev + 1);
    };

    const handleFocus = () => {
      setIsWindowBlurred(false);
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    // 2. Prevent Common DevTools Shortcuts (F12, Ctrl+Shift+I, etc.)
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12') {
        e.preventDefault();
      }
      // Ctrl+Shift+I (Windows/Linux) or Cmd+Opt+I (Mac)
      if ((e.ctrlKey && e.shiftKey && e.key === 'I') || (e.metaKey && e.altKey && e.key === 'i')) {
        e.preventDefault();
      }
      // Ctrl+Shift+J (Windows/Linux) or Cmd+Opt+J (Mac)
      if ((e.ctrlKey && e.shiftKey && e.key === 'J') || (e.metaKey && e.altKey && e.key === 'j')) {
        e.preventDefault();
      }
      // Ctrl+U (View Source)
      if (e.ctrlKey && e.key === 'U') {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // 3. DevTools Detection (Heuristics)
    let devToolsInterval: NodeJS.Timeout;
    
    const checkDevTools = () => {
      // Threshold for difference between outer and inner window dimensions
      const threshold = 160; 
      
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;

      // If the difference is large, devtools are likely open docked to the side or bottom
      if (widthDiff > threshold || heightDiff > threshold) {
        setIsDevToolsOpen(true);
      } else {
        setIsDevToolsOpen(false);
      }
    };

    devToolsInterval = setInterval(checkDevTools, 1000);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(devToolsInterval);
    };
  }, [enabled]);

  return { isDevToolsOpen, isWindowBlurred, warningsCount };
}
