import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiError } from './error.models';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const { status, data } = error.response;
      let message = 'حدث خطأ في الخادم';
      
      if (data && typeof data === 'object' && 'message' in data) {
        const msg = (data as any).message;
        if (Array.isArray(msg)) {
          message = msg[0]; // Get the first validation error
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
