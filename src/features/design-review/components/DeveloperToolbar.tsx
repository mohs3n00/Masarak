'use client';

import { useDesignReviewStore, viewportWidths, ViewportSize, DataState } from '../store';
import { Monitor, Smartphone, Tablet, Moon, Sun, ArrowRightLeft, Database, X, Layout, Activity, ChevronUp, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function DeveloperToolbar() {
  const { viewport, theme, dir, dataState, hudVisible, setViewport, setTheme, setDir, setDataState, toggleHud } = useDesignReviewStore();
  const [isOpen, setIsOpen] = useState(false);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.ctrlKey) return;
      
      switch (e.key.toLowerCase()) {
        case 'd': e.preventDefault(); setTheme(theme === 'light' ? 'dark' : 'light'); break;
        case 'r': e.preventDefault(); setDir(dir === 'ltr' ? 'rtl' : 'ltr'); break;
        case 'm': e.preventDefault(); setViewport(viewport === 'responsive' ? 'mobile-390' : 'responsive'); break;
        case 'l': e.preventDefault(); setDataState('loading'); break;
        case 'e': e.preventDefault(); setDataState('empty'); break;
        case 's': e.preventDefault(); setDataState('success'); break;
        case 'x': e.preventDefault(); setDataState('error'); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [theme, dir, viewport, setTheme, setDir, setViewport, setDataState]);

  // Apply theme and direction globally for review context
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    document.documentElement.dir = dir;
  }, [theme, dir]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] pointer-events-none flex flex-col items-center">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="bg-black/90 backdrop-blur-md text-white p-3 rounded-2xl shadow-2xl border border-white/10 flex flex-wrap items-center justify-center gap-3 text-sm font-medium w-max max-w-[95vw] pointer-events-auto mb-4"
          >
            {/* Viewport Select */}
            <div className="flex items-center gap-2 bg-white/10 p-1 rounded-xl">
              <select 
                className="bg-transparent text-white outline-none cursor-pointer pl-2 pr-1 py-1 text-xs"
                value={viewport}
                onChange={(e) => setViewport(e.target.value as ViewportSize)}
              >
                {Object.keys(viewportWidths).map(v => (
                  <option key={v} value={v} className="bg-neutral-900">{v}</option>
                ))}
              </select>
              <div className="flex gap-1 pr-1">
                <button onClick={() => setViewport('mobile-390')} className={cn("p-1.5 rounded-lg hover:bg-white/20 transition-colors", viewport.includes('mobile') && "bg-white/20")}><Smartphone className="h-4 w-4" /></button>
                <button onClick={() => setViewport('tablet-1024')} className={cn("p-1.5 rounded-lg hover:bg-white/20 transition-colors", viewport.includes('tablet') && "bg-white/20")}><Tablet className="h-4 w-4" /></button>
                <button onClick={() => setViewport('responsive')} className={cn("p-1.5 rounded-lg hover:bg-white/20 transition-colors", viewport === 'responsive' && "bg-white/20")}><Monitor className="h-4 w-4" /></button>
              </div>
            </div>

            <div className="w-px h-6 bg-white/20" />

            {/* Theme Toggle */}
            <button 
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded-xl transition-colors"
            >
              {theme === 'light' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="capitalize">{theme}</span>
            </button>

            {/* Dir Toggle */}
            <button 
              onClick={() => setDir(dir === 'ltr' ? 'rtl' : 'ltr')}
              className="flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded-xl transition-colors"
            >
              <ArrowRightLeft className="h-4 w-4" />
              <span className="uppercase">{dir}</span>
            </button>

            <div className="w-px h-6 bg-white/20" />

            {/* Data State */}
            <div className="flex items-center gap-2 bg-white/10 p-1 rounded-xl px-3">
              <Database className="h-4 w-4 opacity-70" />
              <select 
                className="bg-transparent text-white outline-none cursor-pointer py-1 text-xs"
                value={dataState}
                onChange={(e) => setDataState(e.target.value as DataState)}
              >
                <option value="default" className="bg-neutral-900">Normal Data</option>
                <option value="empty" className="bg-neutral-900">Empty State</option>
                <option value="no-results" className="bg-neutral-900">No Results</option>
                <option value="loading" className="bg-neutral-900">Loading State</option>
                <option value="slow" className="bg-neutral-900">Slow Network</option>
                <option value="error" className="bg-neutral-900">Error State</option>
                <option value="offline" className="bg-neutral-900">Offline</option>
                <option value="unauthorized" className="bg-neutral-900">Unauthorized</option>
                <option value="forbidden" className="bg-neutral-900">Forbidden</option>
                <option value="success" className="bg-neutral-900">Success State</option>
                <option value="large" className="bg-neutral-900">Large Dataset</option>
                <option value="small" className="bg-neutral-900">Small Dataset</option>
              </select>
            </div>

            <div className="w-px h-6 bg-white/20" />

            {/* HUD Toggle */}
            <button 
              onClick={toggleHud}
              className={cn("flex items-center gap-2 px-3 py-2 rounded-xl transition-colors", hudVisible ? "bg-white/20 text-white" : "hover:bg-white/10 text-white/70 hover:text-white")}
            >
              <Activity className="h-4 w-4" />
              <span>HUD</span>
            </button>

          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto bg-black/90 backdrop-blur-md text-white px-5 py-2.5 rounded-full shadow-2xl border border-white/10 flex items-center gap-2.5 text-sm font-semibold hover:bg-black hover:scale-105 active:scale-95 transition-all"
      >
        <Layout className="h-4 w-4 text-primary" />
        Design Review
        {isOpen ? <ChevronDown className="h-4 w-4 ml-1 opacity-70" /> : <ChevronUp className="h-4 w-4 ml-1 opacity-70" />}
      </button>
    </div>
  );
}
