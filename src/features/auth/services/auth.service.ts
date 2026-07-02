import { apiClient } from '@/shared/api/api.client';
import { AuthResponse } from '../types/auth.types';
import { 
  LoginFormData, 
  StudentRegisterFormData, 
  TeacherRegisterFormData 
} from '../schemas/auth.schemas';

class AuthService {
  async login(credentials: LoginFormData): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return data;
  }

  async registerStudent(data: StudentRegisterFormData): Promise<{ message: string, userId: string }> {
    const { data: response } = await apiClient.post<{ message: string, userId: string }>('/auth/register/student', data);
    return response;
  }

  async registerTeacher(data: TeacherRegisterFormData): Promise<{ message: string, userId: string }> {
    const { data: response } = await apiClient.post<{ message: string, userId: string }>('/auth/register/teacher', data);
    return response;
  }

  async forgotPassword(phone: string): Promise<void> {
    await apiClient.post('/auth/forgot-password', { phone });
  }

  async resetPassword(data: any): Promise<void> {
    await apiClient.post('/auth/password/reset', data);
  }

  async verifyPhone(code: string, userId?: string): Promise<void> {
    // Requires userId from context or local storage. For now we pass it dynamically or get it from cookies.
    await apiClient.post('/auth/otp/verify', {
      code,
      type: 'PHONE_VERIFICATION',
      userId
    });
  }

  async resendVerificationEmail(): Promise<void> {
    throw new Error('Not implemented.');
  }

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  }

  async refreshToken(data: any): Promise<AuthResponse> {
    const { data: responseData } = await apiClient.post<AuthResponse>('/auth/refresh');
    return responseData;
  }
}

export const authService = new AuthService();
