'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { apiClient } from '@/shared/api/api.client';
import { useAuthStore } from '@/features/auth/store/auth.store';

interface AuthContextType {
  isReady: boolean;
}

const AuthContext = createContext<AuthContextType>({ isReady: false });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { setAuth, clearAuth, setLoading } = useAuthStore();
  const [isReady, setIsReady] = React.useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const state = useAuthStore.getState();
      const localData = typeof window !== 'undefined' ? window.localStorage.getItem('masarak-user-data') : null;
      console.log('[DEBUG AuthProvider] Before /users/me checkSession', {
        authStoreAccessToken: state.accessToken ? state.accessToken.substring(0, 10) + '...' : null,
        authStoreRefreshToken: state.refreshToken ? state.refreshToken.substring(0, 10) + '...' : null,
        localStorageData: localData,
      });
      setLoading(true);
      try {
        const { data: user } = await apiClient.get('/users/me');
        console.log('[AuthProvider] /users/me SUCCESS → role:', user?.role);
        useAuthStore.setState({ user, role: user.role, isAuthenticated: true });
      } catch (err: any) {
        console.warn('[AuthProvider] /users/me FAILED → status:', err?.response?.status, 'message:', err?.message);
        clearAuth();
      } finally {
        setLoading(false);
        console.log('[AuthProvider] isReady = true');
        setIsReady(true);
      }
    };

    checkSession();
  }, []);

  return (
    <AuthContext.Provider value={{ isReady }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
