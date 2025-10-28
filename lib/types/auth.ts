export interface User {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: 'user' | 'admin' | 'moderator';
  status: 'review' | 'failed' | 'success';
  lastLogin?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  firstname?: string;
  fullName?: string;
  lastname?: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: 'user' | 'admin' | 'moderator' | 'speaker';
}

export interface SpeakerRegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  interests?: string[];
  meetingPreference?: string;
  avatar?: File;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Array<{
    msg: string;
    param: string;
    location: string;
  }>;
}
