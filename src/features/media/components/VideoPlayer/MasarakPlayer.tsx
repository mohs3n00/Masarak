'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import screenfull from 'screenfull';
import { PlayerControls } from './PlayerControls';
import { useVideoShortcuts } from '../../hooks/useVideoShortcuts';
import { useAntiPiracy } from '../../hooks/useAntiPiracy';
import { DynamicWatermark } from './DynamicWatermark';
import { mediaSecurity, PlaybackSession } from '../../services/mediaSecurityService';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';
import type { OnProgressProps } from 'react-player/base';
import { apiClient } from '@/shared/api/api.client';

// Dynamic import for SSR safety (react-player needs browser APIs)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false }) as any;

export interface StudentAuthContext {
  studentId: string;
  studentName: string;
  studentPhone: string;
}

interface MasarakPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  onProgress?: (progressData: { playedSeconds: number; playedPercentage: number }) => void;
  onEnded?: () => void;
  className?: string;
  lessonId?: string;
  videoId?: string;
  initialDuration?: number;
  studentAuth?: StudentAuthContext;
  onDurationReady?: (duration: number) => void;
}

export function MasarakPlayer({
  src,
  poster,
  autoPlay = false,
  onProgress,
  onEnded,
  className,
  lessonId,
  videoId,
  initialDuration = 0,
  studentAuth,
  onDurationReady
}: MasarakPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);

  // Security & Session State
  const [session, setSession] = useState<PlaybackSession | null>(null);
  const [isInitializingSession, setIsInitializingSession] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);

  // Anti Piracy Hooks
  const { isDevToolsOpen, isWindowBlurred } = useAntiPiracy(!!studentAuth);

  // Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPiP, setIsPiP] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const [showControls, setShowControls] = useState(true);

  const controlsTimeoutRef = useRef<NodeJS.Timeout>(null);

  const resetControlsTimeout = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying && !isWindowBlurred) {
      controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 2500);
    }
  }, [isPlaying, isWindowBlurred]);

  useEffect(() => {
    const handleMouseMove = () => resetControlsTimeout();
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', () => { if (isPlaying) setShowControls(false); });
    }
    return () => {
      if (container) container.removeEventListener('mousemove', handleMouseMove);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [resetControlsTimeout, isPlaying]);

  // Request secure playback session
  useEffect(() => {
    if (!studentAuth || !lessonId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSession({ playbackUrl: src, sessionId: 'UNSECURE_LOCAL', expiresAt: Infinity });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsBuffering(true);
      return;
    }

    const initSession = async () => {
      setIsInitializingSession(true);
      setSessionError(null);
      try {
        const result = await mediaSecurity.requestPlaybackSession(
          { studentId: studentAuth.studentId, lessonId, deviceToken: 'mock-device-tok' },
          src
        );
        setSession(result);
        setIsBuffering(true);
      } catch {
        setSessionError('تعذر التحقق من صلاحيات التشغيل. الرجاء المحاولة لاحقاً.');
      } finally {
        setIsInitializingSession(false);
      }
    };

    initSession();
  }, [src, lessonId, studentAuth]);

  // Pause when blur/devtools detected
  useEffect(() => {
    if ((isWindowBlurred || isDevToolsOpen) && isPlaying) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsPlaying(false);
    }
  }, [isWindowBlurred, isDevToolsOpen, isPlaying]);

  // Heartbeat
  useEffect(() => {
    if (!session || !isPlaying) return;
    const interval = setInterval(() => {
      const time = playerRef.current?.getCurrentTime?.() ?? currentTime;
      mediaSecurity.sendHeartbeat(session.sessionId, time, 'playing');
    }, 10000);
    return () => clearInterval(interval);
  }, [session, isPlaying, currentTime]);

  // Fullscreen sync
  useEffect(() => {
    const handleChange = () => setIsFullscreen(screenfull.isFullscreen);
    if (screenfull.isEnabled) screenfull.on('change', handleChange);
    return () => { if (screenfull.isEnabled) screenfull.off('change', handleChange); };
  }, []);

  const togglePlay = useCallback(() => {
    if (isWindowBlurred || isDevToolsOpen) return;
    setIsPlaying(prev => !prev);
    resetControlsTimeout();
  }, [resetControlsTimeout, isWindowBlurred, isDevToolsOpen]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      if (!prev && volume === 0) setVolume(0.5);
      return !prev;
    });
  }, [volume]);

  const adjustVolume = useCallback((delta: number) => {
    setVolume(prev => {
      const newVol = Math.max(0, Math.min(1, prev + delta));
      setIsMuted(newVol === 0);
      return newVol;
    });
  }, []);

  const skipAmount = useCallback((amount: number) => {
    if (!playerRef.current || isWindowBlurred || isDevToolsOpen) return;
    const time = playerRef.current.getCurrentTime() ?? 0;
    playerRef.current.seekTo(time + amount, 'seconds');
    resetControlsTimeout();
  }, [resetControlsTimeout, isWindowBlurred, isDevToolsOpen]);

  const seekTo = useCallback((time: number) => {
    if (!playerRef.current || isWindowBlurred || isDevToolsOpen) return;
    playerRef.current.seekTo(time, 'seconds');
  }, [isWindowBlurred, isDevToolsOpen]);

  const changeRate = useCallback((rate: number) => setPlaybackRate(rate), []);

  const toggleFullscreen = useCallback(() => {
    if (screenfull.isEnabled && containerRef.current) {
      screenfull.toggle(containerRef.current);
    }
  }, []);

  const togglePiP = useCallback(() => setIsPiP(prev => !prev), []);

  useVideoShortcuts({
    togglePlay,
    toggleMute,
    toggleFullscreen,
    skipForward: () => skipAmount(10),
    skipBackward: () => skipAmount(-10),
    adjustVolume,
  });

  const handleProgress = useCallback((state: OnProgressProps) => {
    setCurrentTime(state.playedSeconds);
    if (duration > 0 && onProgress) {
      onProgress({ playedSeconds: state.playedSeconds, playedPercentage: state.played * 100 });
    }
  }, [duration, onProgress]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative bg-black rounded-xl overflow-hidden w-full aspect-video shadow-xl",
        className
      )}
      onDoubleClick={toggleFullscreen}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Session loading */}
      {isInitializingSession && (
        <div className="absolute inset-0 z-40 bg-black/80 flex flex-col items-center justify-center text-white">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-bold text-sm">جاري تجهيز بيئة التشغيل الآمنة...</p>
        </div>
      )}

      {/* Session error */}
      {sessionError && (
        <div className="absolute inset-0 z-40 bg-black/90 flex flex-col items-center justify-center text-white p-6 text-center">
          <AlertCircle className="w-16 h-16 text-destructive mb-4" />
          <h3 className="text-xl font-bold mb-2">خطأ في حماية الفيديو</h3>
          <p className="text-muted-foreground text-sm">{sessionError}</p>
        </div>
      )}

      {/* Anti-piracy warning overlay */}
      {(isWindowBlurred || isDevToolsOpen) && studentAuth && (
        <div className="absolute inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center text-white p-6 text-center">
          <AlertCircle className="w-14 h-14 text-yellow-400 mb-4 animate-pulse" />
          <h3 className="text-xl font-bold text-yellow-400 mb-2">
            {isDevToolsOpen ? 'تم اكتشاف أدوات المطور' : 'تم إيقاف الفيديو مؤقتاً'}
          </h3>
          <p className="text-white/70 max-w-sm text-sm leading-relaxed">
            {isDevToolsOpen
              ? 'يُمنع استخدام أدوات المطورين لضمان حماية المحتوى. أغلق الأدوات للمتابعة.'
              : 'فقد المتصفح التركيز. انقر هنا للعودة للمشاهدة.'}
          </p>
        </div>
      )}

      {/* Dynamic Watermark */}
      {session && studentAuth && !isWindowBlurred && !isDevToolsOpen && (
        <DynamicWatermark
          studentName={studentAuth.studentName}
          studentPhone={studentAuth.studentPhone}
          studentId={studentAuth.studentId}
          sessionId={session.sessionId}
        />
      )}

      {/* ReactPlayer (pointer-events-none so our overlay captures clicks) */}
      <div
        className={cn(
          "w-full h-full",
          (isWindowBlurred || isDevToolsOpen) && "blur-xl pointer-events-none"
        )}
      >
        {session?.playbackUrl && (
          <ReactPlayer
            ref={playerRef}
            url={session.playbackUrl}
            width="100%"
            height="100%"
            playing={isPlaying}
            volume={volume}
            muted={isMuted}
            playbackRate={playbackRate}
            pip={isPiP}
            progressInterval={500}
            onReady={() => setIsBuffering(false)}
            onBuffer={() => setIsBuffering(true)}
            onBufferEnd={() => setIsBuffering(false)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => {
              setIsPlaying(false);
              if (session) mediaSecurity.sendHeartbeat(session.sessionId, currentTime, 'paused');
            }}
            onEnded={() => {
              setIsPlaying(false);
              setShowControls(true);
              onEnded?.();
              if (session) mediaSecurity.sendHeartbeat(session.sessionId, duration, 'ended');
            }}
            onProgress={handleProgress}
            onDuration={(dur: number) => {
              setDuration(dur);
              onDurationReady?.(dur);
              // Smart Fallback: If the database duration is 0, send the real duration back to save it permanently
              if (initialDuration === 0 && dur > 0 && videoId) {
                apiClient.patch(`/student/video/${videoId}/duration`, { duration: dur })
                  .catch(console.error);
              }
            }}
            config={{
              youtube: {
                playerVars: {
                  showinfo: 0,
                  controls: 0,
                  rel: 0,
                  modestbranding: 1,
                  iv_load_policy: 3,
                  disablekb: 1,
                }
              },
              file: {
                attributes: { controlsList: 'nodownload', disablePictureInPicture: false }
              }
            }}
          />
        )}
      </div>

      {/* Click overlay to capture play/pause (prevents YouTube iframe stealing focus) */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={togglePlay}
      />

      <PlayerControls
        isPlaying={isPlaying}
        isMuted={isMuted}
        isFullscreen={isFullscreen}
        isPiP={isPiP}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        playbackRate={playbackRate}
        isBuffering={isBuffering}
        showControls={showControls && !isWindowBlurred && !isDevToolsOpen}
        onPlayPause={togglePlay}
        onMuteToggle={toggleMute}
        onFullscreenToggle={toggleFullscreen}
        onPiPToggle={togglePiP}
        onSeek={seekTo}
        onSkip={skipAmount}
        onVolumeChange={(vol) => { setVolume(vol); setIsMuted(vol === 0); }}
        onRateChange={changeRate}
      />
    </div>
  );
}
