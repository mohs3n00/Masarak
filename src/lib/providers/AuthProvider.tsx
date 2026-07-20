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
      console.log('[AuthProvider] checkSession START');
      setLoading(true);
      try {
        const { data: user } = await apiClient.get('/users/me');
        console.log('[AuthProvider] /users/me SUCCESS → role:', user?.role);
        useAuthStore.setState({ user, role: user.role, isAuthenticated: true });
      } catch (err: any) {
        console.warn('[AuthProvider] /users/me FAILED →', err?.response?.status, err?.message);
        clearAuth();
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
          window.location.href = '/login?expired=1';
        }
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
