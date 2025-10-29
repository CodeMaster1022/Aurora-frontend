export interface User {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: 'learner' | 'admin' | 'moderator' | 'speaker';
  status: 'review' | 'failed' | 'success';
  lastLogin?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  interests?: string[];
  meetingPreference?: string;
  avatar?: string;
  bio?: string;
  age?: number;
  cost?: number;
  availability?: Array<{
    day: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  }>;
  termsAccepted?: boolean;
  termsAcceptedAt?: string;
  privacyAccepted?: boolean;
  privacyAcceptedAt?: string;
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
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: 'learner' | 'admin' | 'moderator' | 'speaker';
  termsAccepted?: boolean;
  privacyAccepted?: boolean;
}

export interface SpeakerRegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  interests?: string[];
  meetingPreference?: string;
  age?: number;
  cost?: number;
  avatar?: File;
  termsAccepted?: boolean;
  privacyAccepted?: boolean;
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
