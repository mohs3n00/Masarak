import { useEffect } from 'react';

interface UseVideoShortcutsProps {
  togglePlay: () => void;
  toggleMute: () => void;
  toggleFullscreen: () => void;
  skipForward: () => void;
  skipBackward: () => void;
  adjustVolume: (delta: number) => void;
  disabled?: boolean;
}

export function useVideoShortcuts({
  togglePlay,
  toggleMute,
  toggleFullscreen,
  skipForward,
  skipBackward,
  adjustVolume,
  disabled = false,
}: UseVideoShortcutsProps) {
  useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
        return;
      }

      switch (e.code) {
        case 'Space':
        case 'KeyK':
          e.preventDefault();
          togglePlay();
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;
        case 'KeyF':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'ArrowRight':
        case 'KeyL':
          e.preventDefault();
          skipForward();
          break;
        case 'ArrowLeft':
        case 'KeyJ':
          e.preventDefault();
          skipBackward();
          break;
        case 'ArrowUp':
          e.preventDefault();
          adjustVolume(0.1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          adjustVolume(-0.1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    disabled,
    togglePlay,
    toggleMute,
    toggleFullscreen,
    skipForward,
    skipBackward,
    adjustVolume,
  ]);
}
