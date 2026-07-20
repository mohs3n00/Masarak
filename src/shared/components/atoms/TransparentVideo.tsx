'use client';

import React, { useEffect, useRef } from 'react';

interface TransparentVideoProps {
  src: string;
  className?: string;
  threshold?: number;
}

export const TransparentVideo: React.FC<TransparentVideoProps> = ({
  src,
  className,
  threshold = 240,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let animId: number;

    const renderFrame = () => {
      if (video.videoWidth && video.videoHeight) {
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = frame.data;
        const len = data.length;

        for (let i = 0; i < len; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Make white / near-white pixels 100% transparent
          if (r >= threshold && g >= threshold && b >= threshold) {
            data[i + 3] = 0;
          }
        }

        ctx.putImageData(frame, 0, 0);
      }

      animId = requestAnimationFrame(renderFrame);
    };

    video.play().catch(() => {});
    animId = requestAnimationFrame(renderFrame);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [src, threshold]);

  return (
    <div className={className}>
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        crossOrigin="anonymous"
        className="hidden"
      />
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain"
      />
    </div>
  );
};
