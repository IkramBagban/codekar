const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

interface User {
  id: number;
  email: string;
  name: string;
}

interface AuthResponse {
  user: User;
  token: string;
  token_type: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

class ApiService {
  private baseUrl = API_URL;

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = localStorage.getItem('token');
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(credentials: RegisterCredentials): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>('/api/v1/users/me');
  }

  async getUsers(skip = 0, limit = 100): Promise<ApiResponse<User[]>> {
    return this.request<User[]>(`/api/v1/users/?skip=${skip}&limit=${limit}`);
  }

  async getUserById(userId: number): Promise<ApiResponse<User>> {
    return this.request<User>(`/api/v1/users/${userId}`);
  }
}

export const api = new ApiService();
export type { User, AuthResponse };
