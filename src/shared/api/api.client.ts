import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiError } from './error.models';
import { useAuthStore } from '@/features/auth/store/auth.store';

const envUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const baseURL = envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
export const apiClient: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url?.includes('/auth/refresh') || originalRequest.url?.includes('/auth/login')) {
        // If refresh fails or login fails, just clear auth and let it fall through to throw ApiError
        useAuthStore.getState().clearAuth();
      } else {
        if (isRefreshing) {
          return new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject });
          })
            .then(() => {
              return apiClient(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          await apiClient.post('/auth/refresh');
          isRefreshing = false;
          processQueue(null);
          return apiClient(originalRequest);
        } catch (err: any) {
          isRefreshing = false;
          processQueue(err);
          // Only clear auth if we get a definitive authentication error from the server
          if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            useAuthStore.getState().clearAuth();
          }
          // Let it fall through so the refresh error can also be wrapped if needed, 
          // or we can just reject if we don't care about refresh error format.
          // But wait, if we fall through, `error` is the original 401 error. 
          // If we want to throw the refresh error, we should throw it.
          // Let's just return Promise.reject(err) for refresh errors since they are caught by guards anyway.
          return Promise.reject(err);
        }
      }
    }

    if (error.response) {
      const { status, data } = error.response;
      let message = 'حدث خطأ في الخادم';
      
      if (data && typeof data === 'object') {
        const errorObj = (data as any).error;
        let msg = errorObj?.message || (data as any).message;
        
        if (errorObj?.code === 'VALIDATION_ERROR' && Array.isArray(errorObj?.details) && errorObj.details.length > 0) {
          msg = errorObj.details[0];
        }

        if (Array.isArray(msg)) {
          message = msg[0];
        } else if (typeof msg === 'string') {
          message = msg;
        }
      }
      
      throw new ApiError(message, status, data);
    } else if (error.request) {
      throw new ApiError('لا يمكن الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.', 503);
    } else {
      throw new ApiError(error.message, 500);
    }
  }
);
