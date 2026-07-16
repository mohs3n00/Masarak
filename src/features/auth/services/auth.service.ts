import { apiClient } from '@/shared/api/api.client';
import { AuthResponse } from '../types/auth.types';
import { 
  LoginFormData, 
  StudentRegisterFormData, 
  TeacherRegisterFormData 
} from '../schemas/auth.schemas';

class AuthService {
  async login(credentials: LoginFormData): Promise<{ user: any; tokens: any }> {
    const { data } = await apiClient.post('/auth/login', credentials);
    return { user: data.user, tokens: data.tokens };
  }

  async getProfile(): Promise<any> {
    const { data } = await apiClient.get('/users/me');
    return data;
  }

  async registerStudent(data: StudentRegisterFormData): Promise<{ message: string, userId: string }> {
    const { confirmPassword, ...payload } = data;
    const { data: response } = await apiClient.post<{ message: string, userId: string }>('/auth/register/student', payload);
    return response;
  }

  async registerTeacher(data: TeacherRegisterFormData): Promise<{ message: string, userId: string }> {
    const { confirmPassword, ...payload } = data;
    const { data: response } = await apiClient.post<{ message: string, userId: string }>('/auth/register/teacher', payload);
    return response;
  }

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post('/auth/forgot-password', { email });
  }

  async verifyResetCode(email: string, code: string): Promise<void> {
    await apiClient.post('/auth/verify-reset-code', { email, code });
  }

  async resetPassword(data: any): Promise<void> {
    const { confirmPassword, ...payload } = data;
    await apiClient.post('/auth/password/reset', payload);
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
