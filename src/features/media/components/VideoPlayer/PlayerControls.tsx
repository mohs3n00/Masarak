'use client';

import React, { useRef, useCallback, useState } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, 
  RotateCcw, RotateCw, Loader2, PictureInPicture
} from 'lucide-react';
import { formatTime } from '@/features/media/utils/formatTime';
import { cn } from '@/lib/utils';

interface PlayerControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  isFullscreen: boolean;
  isPiP: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  isBuffering: boolean;
  showControls: boolean;
  onPlayPause: () => void;
  onMuteToggle: () => void;
  onFullscreenToggle: () => void;
  onPiPToggle: () => void;
  onSeek: (time: number) => void;
  onSkip: (amount: number) => void;
  onVolumeChange: (vol: number) => void;
  onRateChange: (rate: number) => void;
}

const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export function PlayerControls({
  isPlaying,
  isMuted,
  isFullscreen,
  isPiP,
  currentTime,
  duration,
  volume,
  playbackRate,
  isBuffering,
  showControls,
  onPlayPause,
  onMuteToggle,
  onFullscreenToggle,
  onPiPToggle,
  onSeek,
  onSkip,
  onVolumeChange,
  onRateChange,
}: PlayerControlsProps) {
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const timelineRef = useRef<HTMLDivElement>(null);
  const speedMenuRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoverPercent, setHoverPercent] = useState<number | null>(null);
  const [isSpeedMenuOpen, setIsSpeedMenuOpen] = useState(false);

  // Close speed menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (speedMenuRef.current && !speedMenuRef.current.contains(event.target as Node)) {
        setIsSpeedMenuOpen(false);
      }
    };
    if (isSpeedMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSpeedMenuOpen]);

  // Compute seek position from a clientX value, always LTR
  const getSeekPercent = useCallback((clientX: number): number => {
    const rect = timelineRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  }, []);

  // Mouse events for timeline
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    const percent = getSeekPercent(e.clientX);
    onSeek(percent * duration);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const percent = getSeekPercent(e.clientX);
    setHoverPercent(percent * 100);
    if (isDragging) {
      onSeek(percent * duration);
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      const percent = getSeekPercent(e.clientX);
      onSeek(percent * duration);
      setIsDragging(false);
    }
  };

  const handleMouseLeave = () => {
    setHoverPercent(null);
    if (isDragging) setIsDragging(false);
  };

  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    const touch = e.touches[0];
    const percent = getSeekPercent(touch.clientX);
    onSeek(percent * duration);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    const touch = e.touches[0];
    const percent = getSeekPercent(touch.clientX);
    setHoverPercent(percent * 100);
    onSeek(percent * duration);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setHoverPercent(null);
  };

  return (
    <div 
      className={cn(
        "absolute inset-0 flex flex-col justify-end transition-opacity duration-300 z-40",
        // Background gradient only at the bottom
        "bg-gradient-to-t from-black/90 via-black/50 to-transparent",
        showControls || isBuffering ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      dir="ltr"
    >
      {/* Centered Buffering Indicator */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {isBuffering && (
          <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-white animate-spin drop-shadow-md" />
        )}
      </div>

      {/* Controls Container */}
      <div className="px-4 pb-4 pt-12 w-full pointer-events-auto select-none">
        
        {/* Timeline */}
        <div 
          ref={timelineRef}
          className="w-full h-1.5 sm:h-2 bg-white/30 rounded-full mb-4 cursor-pointer group relative touch-none shadow-sm"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Expanded touch hit area */}
          <div className="absolute inset-y-[-12px] inset-x-0 z-10" />
          
          {/* Hover preview indicator */}
          {hoverPercent !== null && (
            <div
              className="absolute top-0 left-0 h-full bg-white/20 rounded-full pointer-events-none"
              style={{ width: `${hoverPercent}%` }}
            />
          )}

          {/* Progress fill */}
          <div 
            className="h-full bg-primary rounded-full relative pointer-events-none"
            style={{ width: `${progressPercent}%` }}
          >
            {/* Scrubber dot - always visible on mobile, hover on desktop */}
            <div 
              className={cn(
                "absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full shadow-lg transition-transform",
                isDragging ? "scale-125" : "scale-100 sm:scale-0 group-hover:scale-100"
              )}
            />
          </div>
        </div>

        {/* Bottom Controls Row */}
        <div className="flex items-center justify-between text-white gap-1">
          
          {/* Left controls */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            {/* Play/Pause */}
            <button 
              onClick={onPlayPause} 
              className="p-2 hover:text-primary transition-colors active:scale-90 touch-manipulation"
              aria-label={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
            >
              {isPlaying 
                ? <Pause className="w-5 h-5 sm:w-6 sm:h-6 fill-current" /> 
                : <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current translate-x-0.5" />
              }
            </button>

            {/* Backward 10s */}
            <button 
              onClick={() => onSkip(-10)} 
              className="p-2 hover:text-primary transition-colors active:scale-90 touch-manipulation"
              aria-label="تأخير 10 ثواني"
            >
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            
            {/* Forward 10s */}
            <button 
              onClick={() => onSkip(10)} 
              className="p-2 hover:text-primary transition-colors active:scale-90 touch-manipulation"
              aria-label="تقديم 10 ثواني"
            >
              <RotateCw className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Volume */}
            <div className="flex items-center gap-1 group/vol">
              <button 
                onClick={onMuteToggle} 
                className="p-2 hover:text-primary transition-colors active:scale-90 touch-manipulation"
                aria-label={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
              >
                {isMuted || volume === 0 
                  ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> 
                  : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                }
              </button>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                className="w-0 opacity-0 group-hover/vol:w-14 sm:group-hover/vol:w-20 group-hover/vol:opacity-100 transition-all duration-300 accent-primary cursor-pointer touch-manipulation"
                aria-label="مستوى الصوت"
              />
            </div>

            {/* Time display */}
            <div className="text-xs sm:text-sm font-mono tabular-nums ml-2 whitespace-nowrap text-white/90 drop-shadow-sm">
              <span>{formatTime(currentTime)}</span>
              <span className="text-white/40 mx-1">/</span>
              <span className="text-white/80 font-medium">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            {/* Playback Rate (Custom Dropdown for Fullscreen Compatibility) */}
            <div className="relative" ref={speedMenuRef}>
              <button 
                onClick={() => setIsSpeedMenuOpen(!isSpeedMenuOpen)}
                className={cn(
                  "px-2 py-1.5 transition-colors text-xs sm:text-sm font-bold tabular-nums rounded hover:bg-white/10 touch-manipulation",
                  isSpeedMenuOpen ? "bg-white/20 text-white" : "text-white/90 hover:text-primary"
                )}
                aria-label="سرعة التشغيل"
              >
                {playbackRate}x
              </button>

              {isSpeedMenuOpen && (
                <div className="absolute bottom-full mb-2 right-0 w-24 py-1 bg-black/95 border border-white/10 rounded-lg text-white backdrop-blur-md shadow-xl flex flex-col z-50">
                  {PLAYBACK_RATES.map((rate) => (
                    <button 
                      key={rate} 
                      onClick={() => {
                        onRateChange(rate);
                        setIsSpeedMenuOpen(false);
                      }}
                      className={cn(
                        "flex items-center justify-between w-full px-3 py-2 text-sm text-right cursor-pointer hover:bg-white/10 transition-colors",
                        playbackRate === rate ? "text-primary font-bold bg-white/5" : "text-white/90"
                      )}
                    >
                      <span dir="ltr">{rate}x</span>
                      {playbackRate === rate && <span className="text-primary text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* PiP - hidden on small phones */}
            <button 
              onClick={onPiPToggle} 
              className="p-2 hover:text-primary transition-colors hidden sm:block active:scale-90 touch-manipulation"
              aria-label="صورة داخل صورة"
              title="Picture in Picture"
            >
              <PictureInPicture className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Fullscreen */}
            <button 
              onClick={onFullscreenToggle} 
              className="p-2 hover:text-primary transition-colors active:scale-90 touch-manipulation"
              aria-label={isFullscreen ? 'تصغير' : 'تكبير الشاشة'}
            >
              {isFullscreen 
                ? <Minimize className="w-4 h-4 sm:w-5 sm:h-5" /> 
                : <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
