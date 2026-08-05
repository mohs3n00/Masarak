'use client';

import { Download, FileClock, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { apiClient } from '@/shared/api/api.client';
import { useAuthStore } from '@/features/auth/store/auth.store';

type DownloadState = { ready: boolean; status?: string; url?: string; fileName?: string };

export function LessonSummaryDownloadButton({ lessonId }: { lessonId: string }) {
  const [state, setState] = useState<DownloadState | null>(null);
  const [failCount, setFailCount] = useState(0);
  const accessToken = useAuthStore((s) => s.accessToken);
  const stateRef = useRef<DownloadState | null>(null);

  const load = useCallback(async () => {
    try {
      const response = await apiClient.get<DownloadState>(`/student-learning/${lessonId}/download`);
      stateRef.current = response.data;
      setState(response.data);
      setFailCount(0);
    } catch (err) {
      console.error('[SummaryBtn] download failed:', err);
      setFailCount((c) => c + 1);
    }
  }, [lessonId]);

  useEffect(() => {
    // Wait for auth store to hydrate before making requests
    if (!accessToken) return;

    void load();

    // Poll every 10s, using ref to check latest ready state (avoids stale closure)
    const interval = setInterval(() => {
      if (!stateRef.current?.ready) void load();
    }, 10000);

    return () => clearInterval(interval);
  }, [lessonId, accessToken, load]);

  if (state?.ready && state.url) {
    return (
      <a
        href={state.url}
        download={state.fileName}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90"
      >
        <Download className="w-4 h-4" />
        تحميل ملخص المحاضرة PDF
      </a>
    );
  }

  // Show "unavailable" only after 3+ consecutive failures
  if (failCount >= 3 || state?.status === 'Failed' || state?.status === 'TranscriptUnavailable') {
    return (
      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-muted text-muted-foreground text-sm font-semibold">
        <FileClock className="w-4 h-4" />
        الملخص غير متاح لهذه المحاضرة

      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-muted text-muted-foreground text-sm font-semibold">
      <FileClock className="w-4 h-4" />
      جارٍ إنشاء ملخص المحاضرة… <RefreshCw className="w-3.5 h-3.5 animate-spin" />
    </span>
  );
}
