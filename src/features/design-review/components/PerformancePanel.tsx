'use client';

import { useState, useEffect } from 'react';
import { useDesignReviewStore } from '@/features/design-review/store';
import { Activity } from 'lucide-react';

export function PerformancePanel() {
  const { viewport, theme, dir, dataState, hudVisible } = useDesignReviewStore();
  const [fps, setFps] = useState(60);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsClient(true), 0);
    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrameId: number;

    const calculateFPS = (time: number) => {
      frameCount++;
      if (time - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (time - lastTime)));
        frameCount = 0;
        lastTime = time;
      }
      animationFrameId = requestAnimationFrame(calculateFPS);
    };

    animationFrameId = requestAnimationFrame(calculateFPS);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!isClient || !hudVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] bg-black/80 backdrop-blur-md border border-white/10 text-white p-2.5 flex flex-col gap-1.5 rounded-lg shadow-lg w-40 text-[10px] font-mono select-none pointer-events-none opacity-40 hover:opacity-100 transition-opacity">
      <div className="flex items-center gap-1.5 mb-0.5 border-b border-white/10 pb-1.5">
        <Activity className="h-3 w-3 text-primary" />
        <span className="font-semibold tracking-wider uppercase text-white/70">HUD</span>
      </div>
      <div className="flex justify-between">
        <span className="text-white/50">FPS</span>
        <span className={fps >= 55 ? "text-primary" : fps >= 30 ? "text-yellow-500" : "text-destructive"}>{fps}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-white/50">Viewport</span>
        <span>{viewport.split('-')[0]}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-white/50">Theme</span>
        <span className="capitalize">{theme}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-white/50">Direction</span>
        <span className="uppercase">{dir}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-white/50">Data</span>
        <span className="capitalize">{dataState}</span>
      </div>
      <div className="flex justify-between mt-1 pt-2 border-t border-white/20 text-[10px] text-white/30">
        <span>Render</span>
        <span>{'<'} 16ms</span>
      </div>
    </div>
  );
}
