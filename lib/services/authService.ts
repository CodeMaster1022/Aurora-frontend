import { LoginCredentials, RegisterCredentials, SpeakerRegisterCredentials, AuthResponse, ApiError } from '../types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://aurora-backend-three.vercel.app/api';

class AuthService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add token to headers if it exists
    const token = this.getToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      console.log('makeRequest - endpoint:', endpoint);
      console.log('makeRequest - data:', data);

      if (!response.ok) {
        console.error('API Error:', data);
        throw new Error(data.message || 'An error occurred');
      }

      return data;
    } catch (error) {
      console.error('Network Error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    // Remove confirmPassword before sending to backend
    const { confirmPassword, ...registerData } = credentials;
    console.log('Sending user registration data:', registerData);
    return this.makeRequest<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(registerData),
    });
  }

  async registerSpeaker(credentials: SpeakerRegisterCredentials): Promise<AuthResponse> {
    // Remove confirmPassword before sending to backend
    const { confirmPassword, avatar, ...registerData } = credentials;
    
    // If there's an avatar, use FormData
    if (avatar) {
      const formData = new FormData();
      
      // Add text fields
      Object.keys(registerData).forEach(key => {
        const value = registerData[key as keyof typeof registerData];
        if (value !== undefined) {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value as string);
          }
        }
      });
      
      // Add avatar file
      formData.append('avatar', avatar);
      
      console.log('Sending speaker registration data with avatar:', formData);
      
      // For FormData, we need to send without JSON headers
      const url = `${API_BASE_URL}/auth/speaker/signup`;
      const token = this.getToken();
      
      const config: RequestInit = {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      };

      try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
          console.error('API Error:', data);
          throw new Error(data.message || 'An error occurred');
        }

        return data;
      } catch (error) {
        console.error('Network Error:', error);
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('Network error occurred');
      }
    } else {
      // No avatar, send as JSON
      console.log('Sending speaker registration data:', registerData);
      return this.makeRequest<AuthResponse>('/auth/speaker/signup', {
        method: 'POST',
        body: JSON.stringify(registerData),
      });
    }
  }

  async getCurrentUser(): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>('/auth/me', {
      method: 'GET',
    });
  }

  async logout(): Promise<{ success: boolean; message: string }> {
    return this.makeRequest<{ success: boolean; message: string }>('/auth/logout', {
      method: 'POST',
    });
  }

  async acceptTerms(): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>('/auth/accept-terms', {
      method: 'POST',
    });
  }

  // Token management
  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
