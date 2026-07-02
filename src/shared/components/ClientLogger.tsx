'use client';
import { useEffect, useState } from 'react';

export function ClientLogger() {
  const [log, setLog] = useState('');

  useEffect(() => {
    setTimeout(() => {
      const header = document.querySelector('header');
      if (!header) return;
      let out = '';
      let current: Element | null = header.querySelector('img') || header;
      
      while (current && current !== document as unknown as HTMLElement) {
        const style = window.getComputedStyle(current);
        const rect = current.getBoundingClientRect();
        out += `${current.tagName}.${current.className}\n`;
        out += `  rect: top=${rect.top}, y=${rect.y}, height=${rect.height}\n`;
        out += `  overflow: ${style.overflow}\n`;
        out += `  clip: ${style.clip}, clipPath: ${style.clipPath}\n`;
        out += `  transform: ${style.transform}, margin: ${style.marginTop}\n`;
        out += `  position: ${style.position}, top: ${style.top}\n`;
        current = current.parentElement;
      }
      setLog(out);
    }, 1000);
  }, []);

  return (
    <pre id="debug-log" style={{ position: 'fixed', bottom: 0, left: 0, zIndex: 99999, background: 'black', color: 'white', padding: '10px', fontSize: '10px', maxHeight: '50vh', overflow: 'auto' }}>
      {log || 'Loading...'}
    </pre>
  );
}
