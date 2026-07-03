import React, { useEffect, useState } from 'react';

interface DynamicWatermarkProps {
  studentName: string;
  studentId: string;
  studentPhone: string;
  sessionId: string;
}

export function DynamicWatermark({ studentName, studentId, studentPhone, sessionId }: DynamicWatermarkProps) {
  // We use percentages for position to ensure it stays within the video container bounds
  const [position, setPosition] = useState({ top: 10, left: 10 });

  useEffect(() => {
    const moveWatermark = () => {
      // Keep watermark within safe bounds (10% to 80% to prevent overflowing)
      const maxTop = 80;
      const maxLeft = 80;
      
      setPosition({
        top: Math.max(5, Math.floor(Math.random() * maxTop)),
        left: Math.max(5, Math.floor(Math.random() * maxLeft)),
      });
    };

    // Move immediately and then every 20 seconds
    moveWatermark();
    const intervalId = setInterval(moveWatermark, 20000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      className="absolute z-50 pointer-events-none select-none transition-all duration-[3000ms] ease-in-out"
      style={{
        top: `${position.top}%`,
        left: `${position.left}%`,
        // Make it semi-transparent so it doesn't distract completely but remains visible
        opacity: 0.45, 
      }}
    >
      <div className="flex flex-col bg-black/30 backdrop-blur-sm p-3 rounded-xl border border-white/10 text-white shadow-xl shadow-black/50 transform -rotate-12">
        <span className="font-bold text-sm md:text-base leading-tight drop-shadow-md">
          {studentName}
        </span>
        <span className="text-xs md:text-sm font-mono tracking-wider text-white/80 mt-1">
          {studentPhone} • {studentId}
        </span>
        <span className="text-[10px] md:text-xs text-white/50 mt-2 font-mono">
          SESSION: {sessionId}
        </span>
      </div>
    </div>
  );
}
