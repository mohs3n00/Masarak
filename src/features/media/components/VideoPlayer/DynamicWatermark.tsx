'use client';

import React, { useEffect, useState, useRef } from 'react';

export interface DynamicWatermarkProps {
  studentName?: string;
  studentId: string;
  studentPhone?: string;
  sessionId: string;
  email?: string;
  courseId?: string;
  courseName?: string;
  advancedPatternMode?: boolean;
}

export function DynamicWatermark({
  studentId,
  studentPhone = '01012345678',
  courseId,
  courseName,
  advancedPatternMode = false,
}: DynamicWatermarkProps) {
  const [mountKey, setMountKey] = useState(0);
  
  const rootRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<HTMLDivElement | null>(null);

  const phoneText = studentPhone || '01012345678';
  const courseText = courseName || courseId || 'دورة مسارك التعليمية';

  // GPU-accelerated direct DOM movement without React re-renders every 5-8 seconds
  useEffect(() => {
    if (advancedPatternMode) return;

    const el = instanceRef.current;
    if (!el) return;

    // Initial starting coordinates
    el.style.left = '10%';
    el.style.top = '15%';
    el.style.transform = 'rotate(-2deg)';

    // Instant position jump every 4 to 6 seconds without any sliding animation
    const randomDuration = 4000 + Math.floor(Math.random() * 2000);
      
    const moveInterval = setInterval(() => {
      if (!el) return;
      // Bounding: X between 5% and 75% to prevent escaping viewport
      const newX = 5 + Math.random() * 70;
      // Bounding: Y between 5% and 72% to never overlap player controls
      const newY = 5 + Math.random() * 67;
      // Rotation between -5 and +5 degrees
      const newRot = -5 + Math.random() * 10;

      el.style.left = `${newX.toFixed(1)}%`;
      el.style.top = `${newY.toFixed(1)}%`;
      el.style.transform = `rotate(${newRot.toFixed(1)}deg)`;
    }, randomDuration);

    return () => clearInterval(moveInterval);
  }, [advancedPatternMode, mountKey]);

  // Anti-Tampering: MutationObserver detects removal or CSS modification by DevTools scripts
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !root.parentElement) return;

    const parent = root.parentElement;

    const observer = new MutationObserver((mutations) => {
      let tampered = false;
      for (const m of mutations) {
        // Did someone remove our watermark node?
        if (m.type === 'childList') {
          m.removedNodes.forEach((node) => {
            if (node === root || root.contains(node)) {
              tampered = true;
            }
          });
        }
        // Did someone try hiding it by modifying style/class/hidden attributes?
        if (m.type === 'attributes' && m.target instanceof HTMLElement) {
          if (m.target === root || root.contains(m.target)) {
            const style = window.getComputedStyle(m.target);
            if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
              tampered = true;
            }
          }
        }
      }
      if (tampered) {
        // Immediately respawn the entire forensic watermark component
        setMountKey((prev) => prev + 1);
      }
    });

    observer.observe(parent, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class', 'hidden'],
    });

    return () => observer.disconnect();
  }, [mountKey]);

  // Advanced Pattern Mode: Drifting diagonal pattern with ultra-low opacity (0.06)
  if (advancedPatternMode) {
    const repeatPattern = `${phoneText} • ${courseText} • `;
    return (
      <div
        key={mountKey}
        ref={rootRef}
        className="absolute inset-0 z-[9999] pointer-events-none select-none overflow-hidden flex items-center justify-center"
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        <div
          className="w-[200%] h-[200%] flex flex-wrap content-start transform -rotate-[25deg] text-white font-mono leading-loose"
          style={{
            fontSize: '13px',
            fontWeight: 300,
            opacity: 0.06,
            letterSpacing: '0.5px',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
            animation: 'drift-pattern 25s linear infinite alternate',
          }}
        >
          {Array.from({ length: 150 }).map((_, idx) => (
            <span key={idx} className="whitespace-nowrap px-8 py-4">
              {repeatPattern}
            </span>
          ))}
        </div>
        <style jsx>{`
          @keyframes drift-pattern {
            0% { transform: translate(-5%, -5%) rotate(-25deg); }
            100% { transform: translate(-15%, -15%) rotate(-25deg); }
          }
        `}</style>
      </div>
    );
  }

  // Standard Single Instance dynamic forensic watermark
  return (
    <div
      key={mountKey}
      ref={rootRef}
      className="absolute inset-0 z-[9999] pointer-events-none select-none overflow-hidden"
      style={{ pointerEvents: 'none', userSelect: 'none' }}
    >
      <div
        ref={instanceRef}
        className="absolute z-[9999] pointer-events-none select-none flex flex-col items-start leading-tight whitespace-nowrap text-white"
        style={{
          fontSize: '13px',
          fontWeight: 300,
          opacity: 0.16, // Strictly within required 0.12-0.18 range
          letterSpacing: '0.5px',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
          left: '10%',
          top: '15%',
          transform: 'rotate(-2deg)',
        }}
      >
        <span className="block select-none pointer-events-none font-mono font-bold">
          {phoneText}
        </span>
        <span className="block select-none pointer-events-none font-sans text-[12px] mt-0.5 opacity-90">
          {courseText}
        </span>
      </div>
    </div>
  );
}
