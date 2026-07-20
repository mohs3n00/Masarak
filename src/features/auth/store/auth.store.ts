import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, AuthTokens } from '../types/auth.types';
import { User } from '@/types/models';
import { AUTH_ROLES, AUTH_STORAGE_KEYS } from '../constants/auth.constants';

interface AuthActions {
  setAuth: (user: User, tokens: AuthTokens) => void;
  updateUser: (user: Partial<User>) => void;
  setTokens: (tokens: AuthTokens) => void;
  clearAuth: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  role: AUTH_ROLES.VISITOR,
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  error: null,
  sessionExpiresAt: null,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,

      setAuth: (user, tokens) => {
        if (typeof window !== 'undefined' && tokens?.accessToken) {
          document.cookie = `accessToken=${tokens.accessToken}; path=/; max-age=604800; SameSite=Lax`;
          document.cookie = `access_token=${tokens.accessToken}; path=/; max-age=604800; SameSite=Lax`;
        }
        set({
          user,
          role: user.role,
          isAuthenticated: true,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          error: null,
        });
      },

      updateUser: (updatedUser) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
          role: updatedUser.role ?? state.role,
        })),

      setTokens: (tokens) => {
        if (typeof window !== 'undefined' && tokens?.accessToken) {
          document.cookie = `accessToken=${tokens.accessToken}; path=/; max-age=604800; SameSite=Lax`;
          document.cookie = `access_token=${tokens.accessToken}; path=/; max-age=604800; SameSite=Lax`;
        }
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        });
      },

      clearAuth: () => {
        set({
          ...initialState,
        });
        if (typeof window !== 'undefined') {
          window.localStorage.clear();
          document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          document.cookie = 'jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
      },

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error, isLoading: false }),
    }),
    {
      name: AUTH_STORAGE_KEYS.USER_DATA,
      partialize: (state) => ({
        user: state.user,
        role: state.role,
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
