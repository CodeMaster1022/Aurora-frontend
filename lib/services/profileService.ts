import axios from 'axios';
import { ProfileFormData, ProfileResponse, Profile } from '../types/profile';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://natalia3-backend.vercel.app/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const profileService = {
  // Get user profile
  getProfile: async (): Promise<ProfileResponse> => {
    const response = await api.get('/profile');
    return response.data;
  },

  // Create new profile
  createProfile: async (profileData: ProfileFormData): Promise<ProfileResponse> => {
    const response = await api.post('/profile', profileData);
    return response.data;
  },

  // Update existing profile
  updateProfile: async (profileData: ProfileFormData): Promise<ProfileResponse> => {
    const response = await api.put('/profile', profileData);
    return response.data;
  },

  // Upload profile photo
  uploadPhoto: async (file: File): Promise<{ success: boolean; data: { photoUrl: string } }> => {
    const formData = new FormData();
    formData.append('photo', file);
    
    const response = await api.post('/profile/upload-photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete profile
  deleteProfile: async (): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete('/profile');
    return response.data;
  },
}; 