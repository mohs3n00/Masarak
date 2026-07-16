import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { apiClient } from './api.client';
import { useAuthStore } from '@/features/auth/store/auth.store';
import {
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
  ServerError,
} from './error.models';

let isRefreshing = false;
let failedQueue: { resolve: (value?: unknown) => void; reject: (reason?: unknown) => void }[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const setupInterceptors = () => {
  apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const accessToken = useAuthStore.getState().accessToken;
      if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          try {
            const token = await new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            });
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          } catch (err) {
            return Promise.reject(err);
          }
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshToken = useAuthStore.getState().refreshToken;
          const baseURL = apiClient.defaults.baseURL || 'http://127.0.0.1:4000/api';
          const res = await axios.post(`${baseURL}/auth/refresh`, {}, { withCredentials: true });
          const { accessToken, refreshToken: newRefreshToken } = res.data;

          useAuthStore.getState().setTokens({
            accessToken,
            refreshToken: newRefreshToken || refreshToken
          });

          processQueue(null, accessToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          return apiClient(originalRequest);
        } catch (refreshError: unknown) {
          processQueue(refreshError as Error, null);
          useAuthStore.getState().clearAuth();
          return Promise.reject(new UnauthorizedError('Session expired. Please login again.'));
        } finally {
          isRefreshing = false;
        }
      }

      let apiError = error;
      const status = error.response?.status;
      const data = error.response?.data;
      const message = (data as Record<string, unknown>)?.message as string || error.message;

      switch (status) {
        case 401:
          apiError = new UnauthorizedError(message, data) as unknown as AxiosError;
          break;
        case 403:
          apiError = new ForbiddenError(message, data) as unknown as AxiosError;
          break;
        case 404:
          apiError = new NotFoundError(message, data) as unknown as AxiosError;
          break;
        case 422:
          apiError = new ValidationError(message, data) as unknown as AxiosError;
          break;
        case 500:
          apiError = new ServerError(message, data) as unknown as AxiosError;
          break;
        default:
          if (error.code === 'ERR_NETWORK') {
            apiError = new ServerError('لا يمكن الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت أو التأكد من تشغيل الخادم.', data) as unknown as AxiosError;
          }
          break;
      }

      return Promise.reject(apiError);
    }
  );
};
