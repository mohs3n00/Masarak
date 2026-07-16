import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiError } from './error.models';
import { useAuthStore } from '@/features/auth/store/auth.store';

let envUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
if (envUrl && !envUrl.startsWith('http://') && !envUrl.startsWith('https://')) {
  envUrl = `https://${envUrl}`;
}
const baseURL = envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
export const apiClient: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor for logging outgoing requests
apiClient.interceptors.request.use(
  (config) => {
    const state = useAuthStore.getState();
    console.log(`[apiClient request] URL: ${config.url}`, {
      hasAccessTokenInStore: !!state.accessToken,
      hasRefreshTokenInStore: !!state.refreshToken,
      headers: config.headers,
    });
    return config;
  },
  (error) => {
    console.error('[apiClient request error]', error);
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
  (response) => {
    console.log(`[apiClient response success] URL: ${response.config.url} | Status: ${response.status}`);
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    console.warn(`[apiClient response error] URL: ${originalRequest?.url} | Status: ${error.response?.status}`, {
      message: error.message,
      data: error.response?.data,
    });

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url?.includes('/auth/refresh') || originalRequest.url?.includes('/auth/login')) {
        console.warn('[apiClient] Refresh or Login failed with 401. Triggering clearAuth (intercepted for debug).');
        useAuthStore.getState().clearAuth();
      } else {
        if (isRefreshing) {
          console.log('[apiClient] Already refreshing, queueing request...');
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

        console.log('[apiClient] Access token expired or rejected. Triggering token refresh...');
        try {
          const refreshToken = useAuthStore.getState().refreshToken;
          console.log('[apiClient] Refreshing token with body:', { refreshToken: !!refreshToken });
          await apiClient.post('/auth/refresh', { refreshToken });
          console.log('[apiClient] Token refresh SUCCESS');
          isRefreshing = false;
          processQueue(null);
          return apiClient(originalRequest);
        } catch (err: any) {
          console.error('[apiClient] Token refresh FAILED:', err.message, err.response?.data);
          isRefreshing = false;
          processQueue(err);
          if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            console.warn('[apiClient] Refresh returned auth error. Triggering clearAuth (intercepted for debug).');
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
