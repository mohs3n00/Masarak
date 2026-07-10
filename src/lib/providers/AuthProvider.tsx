'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { apiClient } from '@/shared/api/api.client';
import { useAuthStore } from '@/features/auth/store/auth.store';

interface AuthContextType {
  isReady: boolean;
}

const AuthContext = createContext<AuthContextType>({ isReady: false });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { setAuth, clearAuth, setLoading, isAuthenticated } = useAuthStore();
  const [isReady, setIsReady] = React.useState(false);

  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      try {
        const { data: user } = await apiClient.get('/users/me');
        // Tokens live in HTTPOnly cookies — we don't store them in state
        setAuth(user, { accessToken: '', refreshToken: '' });
      } catch {
        // 401 means no valid session — clear any stale state
        clearAuth();
      } finally {
        setLoading(false);
        setIsReady(true);
      }
    };

    // Only fetch if we don't already have a verified session
    // (Zustand persists user across page refreshes — still verify on mount)
    checkSession();
  }, []);

  return (
    <AuthContext.Provider value={{ isReady }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
