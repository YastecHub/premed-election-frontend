import { apiClient } from '../api/client';
import { Category, CategoryForm } from '../../shared/types';

export class CategoryService {
  async getCategories(): Promise<Category[]> {
    return apiClient.get<Category[]>('/categories');
  }

  async createCategory(data: CategoryForm): Promise<Category> {
    return apiClient.post<Category>('/categories', data);
  }

  async updateCategory(id: string, data: CategoryForm): Promise<Category> {
    return apiClient.post<Category>(`/categories/${id}`, data);
  }

  async deleteCategory(id: string): Promise<void> {
    return apiClient.delete<void>(`/categories/${id}`);
  }
}

export const categoryService = new CategoryService();