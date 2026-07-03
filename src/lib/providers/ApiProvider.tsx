'use client';

import { createContext, useContext, ReactNode } from 'react';

// Keeping DataState type here since many components depend on it
export type DataState = 'default' | 'loading' | 'empty' | 'no-results' | 'error' | 'offline' | 'unauthorized' | 'forbidden' | 'slow';

interface ApiContextValue {
  isLoading: boolean;
  isError: boolean;
  errorMsg: string | null;
  dataState: DataState; 
}

const ApiContext = createContext<ApiContextValue>({
  isLoading: false,
  isError: false,
  errorMsg: null,
  dataState: 'default'
});

export const useApi = () => useContext(ApiContext);

export function ApiProvider({ children }: { children: ReactNode }) {
  // Since Design Review is removed, we default to standard application behavior.
  // In production, this would integrate with real API clients like React Query.
  
  const contextValue: ApiContextValue = {
    isLoading: false,
    isError: false,
    errorMsg: null,
    dataState: 'default',
  };

  return (
    <ApiContext.Provider value={contextValue}>
      {children}
    </ApiContext.Provider>
  );
}
