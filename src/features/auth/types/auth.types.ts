import { User } from '@/types/models';

export type AuthRole = 'VISITOR' | 'STUDENT' | 'TEACHER' | 'ADMIN' | 'SUPER_ADMIN';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  user: User | null;
  role: AuthRole;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  sessionExpiresAt: Date | null;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface RefreshResponse {
  tokens: AuthTokens;
}
