import { apiClient } from '../api/client';
import { User, Admin, Candidate } from '../../shared/types';

export class AdminService {
  async getPendingUsers(): Promise<User[]> {
    return apiClient.get<User[]>('/admin/pending');
  }

  async approveUser(userId: string): Promise<User> {
    return apiClient.post<User>('/admin/approve', { userId });
  }

  async rejectUser(userId: string): Promise<User> {
    return apiClient.post<User>('/admin/reject', { userId });
  }

  async getAdmins(): Promise<Admin[]> {
    return apiClient.get<Admin[]>('/admins');
  }

  async createAdmin(data: { username: string; password: string; role: 'moderator' | 'super_admin' }): Promise<Admin> {
    return apiClient.post<Admin>('/admin/create', data);
  }

  async addCandidate(data: { name: string; position: string; photoUrl: string; manifesto: string; color: string }): Promise<Candidate> {
    return apiClient.post<Candidate>('/candidates', data);
  }

  async deleteCandidate(id: string): Promise<void> {
    return apiClient.delete<void>(`/candidates/${id}`);
  }
}

export const adminService = new AdminService();