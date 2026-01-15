import { ApiError } from '../../shared/types';

const VITE_API = (import.meta as any).env?.VITE_API_URL;
const API_BASE = VITE_API || 'https://premed-election-backend.onrender.com';
const API_URL = `${API_BASE.replace(/\/$/, '')}/api`;

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.message || 'Request failed') as ApiError;
      error.code = errorData.code;
      error.status = response.status;
      throw error;
    }
    return response.json();
  }

  private handleFetchError(error: unknown, defaultMessage: string): never {
    if (error instanceof TypeError) {
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('Unable to connect to server. Please check your internet connection and try again.');
      }
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(defaultMessage);
  }

  async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`);
      return this.handleResponse<T>(response);
    } catch (error) {
      this.handleFetchError(error, `Failed to fetch ${endpoint}`);
    }
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data ? JSON.stringify(data) : undefined
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      this.handleFetchError(error, `Failed to post to ${endpoint}`);
    }
  }

  async postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        body: formData
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      this.handleFetchError(error, `Failed to post form data to ${endpoint}`);
    }
  }

  async delete<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE'
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      this.handleFetchError(error, `Failed to delete ${endpoint}`);
    }
  }
}

export const apiClient = new ApiClient(API_URL);