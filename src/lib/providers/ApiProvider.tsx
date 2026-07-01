'use client';

import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useDesignReviewStore, DataState } from '@/features/design-review/store';

interface ApiContextValue {
  isLoading: boolean;
  isError: boolean;
  errorMsg: string | null;
  dataState: DataState; // Exposed for components that want to branch logic
}

const ApiContext = createContext<ApiContextValue>({
  isLoading: false,
  isError: false,
  errorMsg: null,
  dataState: 'default'
});

export const useApi = () => useContext(ApiContext);

export function ApiProvider({ children }: { children: ReactNode }) {
  // If we are in dev mode, we subscribe to the Design Review store.
  // In production, this would use a real API client (e.g., SWR, React Query).
  
  const [isClient, setIsClient] = useState(false);
  
  // Safe extraction of store value that avoids hydration mismatch
  const storeState = useDesignReviewStore((state) => state.dataState);

  useEffect(() => {
    const t = setTimeout(() => setIsClient(true), 0);
    return () => clearTimeout(t);
  }, []);

  // In production or before hydration, default to normal data
  const effectiveDataState = (process.env.NODE_ENV === 'development' && isClient) ? storeState : 'default';

  const contextValue: ApiContextValue = {
    isLoading: effectiveDataState === 'loading' || effectiveDataState === 'slow',
    isError: ['error', 'offline', 'unauthorized', 'forbidden'].includes(effectiveDataState),
    errorMsg: effectiveDataState === 'offline' ? 'No internet connection' 
            : effectiveDataState === 'unauthorized' ? 'Please log in again'
            : effectiveDataState === 'forbidden' ? 'You do not have permission to view this'
            : effectiveDataState === 'error' ? 'An unexpected error occurred' : null,
    dataState: effectiveDataState,
  };

  return (
    <ApiContext.Provider value={contextValue}>
      {children}
    </ApiContext.Provider>
  );
}
