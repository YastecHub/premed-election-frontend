import { apiClient } from '../api/client';
import { User, RegistrationForm, AccessCodeForm, Admin, AdminLoginForm } from '../../shared/types';

export class AuthService {
  async registerUser(data: RegistrationForm): Promise<User> {
    return apiClient.post<User>('/register', data);
  }

  async registerWithVerification(formData: FormData): Promise<User> {
    return apiClient.postFormData<User>('/register-with-verification', formData);
  }

  async loginWithCode(data: AccessCodeForm): Promise<User> {
    return apiClient.post<User>('/login-with-code', data);
  }

  async verifyUser(userId: string, file: File): Promise<User> {
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('document', file);
    return apiClient.postFormData<User>('/verify', formData);
  }

  async loginAdmin(data: AdminLoginForm): Promise<Admin> {
    return apiClient.post<Admin>('/admin/login', data);
  }
}

export const authService = new AuthService();