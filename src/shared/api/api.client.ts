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

// Request interceptor to attach Authorization header
apiClient.interceptors.request.use(
  (config) => {
    const state = useAuthStore.getState();
    const accessToken = state.accessToken;
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
            .then((token) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return apiClient(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshToken = useAuthStore.getState().refreshToken;
          const res = await apiClient.post('/auth/refresh', { refreshToken });
          const newTokens = res.data;

          useAuthStore.getState().setTokens({
            accessToken: newTokens.accessToken,
            refreshToken: newTokens.refreshToken || refreshToken,
          });

          isRefreshing = false;
          processQueue(null, newTokens.accessToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
          }
          return apiClient(originalRequest);
        } catch (err: any) {
          isRefreshing = false;
          processQueue(err);
          // Only clear auth if we get a definitive authentication error from the server
          if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            useAuthStore.getState().clearAuth();
          }
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
