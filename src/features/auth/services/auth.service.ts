import { apiClient } from '@/shared/api/api.client';
import { AuthResponse, AuthTokens } from '../types/auth.types';
import { User } from '@/types/models';

/**
 * Placeholder Auth Service
 * Simulates a future NestJS Backend
 */
class AuthService {
  async login(credentials: Record<string, unknown>): Promise<AuthResponse> {
    // MOCK IMPLEMENTATION
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: {
            id: 'mock-id-123',
            name: 'John Doe',
            email: credentials.email,
            role: 'STUDENT',
            joinedAt: new Date().toISOString(),
          } as User,
          tokens: {
            accessToken: 'mock-access-token',
            refreshToken: 'mock-refresh-token',
          },
        });
      }, 1000);
    });
    // FUTURE: const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials);
    // return data;
  }

  async register(data: Record<string, unknown>): Promise<AuthResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: {
            id: 'mock-id-123',
            name: String(data.name || ''),
            email: String(data.email || ''),
            role: String(data.role || 'STUDENT'),
            joinedAt: new Date().toISOString(),
          } as User,
          tokens: {
            accessToken: 'mock-access-token',
            refreshToken: 'mock-refresh-token',
          },
        });
      }, 1000);
    });
  }

  async logout(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  }

  async refreshToken(_refreshToken: string): Promise<AuthTokens> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          accessToken: 'new-mock-access-token',
          refreshToken: 'new-mock-refresh-token',
        });
      }, 500);
    });
  }

  async forgotPassword(_email: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  }

  async resetPassword(_data: Record<string, unknown>): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  }

  async verifyEmail(_token: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  }

  async getCurrentUser(): Promise<User> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 'mock-id-123',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'STUDENT',
          joinedAt: new Date().toISOString(),
        } as User);
      }, 1000);
    });
  }
}

export const authService = new AuthService();
