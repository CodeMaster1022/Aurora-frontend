import { authService } from './authService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Speaker {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  avatar?: string;
  bio?: string;
  rating?: number;
}

export interface Session {
  _id: string;
  title: string;
  speaker: Speaker | string;
  learner: string;
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  topic?: string;
  topics?: string[];
  icebreaker?: string;
  meetingLink?: string;
  notes?: string;
}

export interface Review {
  _id: string;
  session: string | Session;
  from: string;
  to: string | Speaker;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface LearnerProfile {
  _id: string;
  totalSessions: number;
  completedSessions: number;
  upcomingSessions: number;
}

class LearnerService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = authService.getToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
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
  }

  // Get learner dashboard data
  async getDashboard(): Promise<{
    success: boolean;
    data: {
      upcomingSessions: Session[];
      pastSessions: Session[];
      profile: LearnerProfile;
    };
  }> {
    return this.makeRequest<{
      success: boolean;
      data: {
        upcomingSessions: Session[];
        pastSessions: Session[];
        profile: LearnerProfile;
      };
    }>('/learner/dashboard');
  }

  // Get session details
  async getSession(sessionId: string): Promise<{
    success: boolean;
    data: { session: Session };
  }> {
    return this.makeRequest<{
      success: boolean;
      data: { session: Session };
    }>(`/learner/sessions/${sessionId}`);
  }

  // Rate and review a completed session
  async rateSession(
    sessionId: string,
    rating: number,
    comment: string
  ): Promise<{ success: boolean; data: { review: Review } }> {
    return this.makeRequest<{ success: boolean; data: { review: Review } }>(
      `/learner/sessions/${sessionId}/review`,
      {
        method: 'POST',
        body: JSON.stringify({ rating, comment }),
      }
    );
  }

  // Update learner profile
  async updateProfile(profileData: {
    firstname?: string;
    lastname?: string;
    bio?: string;
  }): Promise<{
    success: boolean;
    data: { user: any };
  }> {
    return this.makeRequest<{ success: boolean; data: { user: any } }>(
      '/learner/profile',
      {
        method: 'PUT',
        body: JSON.stringify(profileData),
      }
    );
  }

  // Get all speakers with search and filters
  async getSpeakers(search?: string, topic?: string): Promise<{
    success: boolean;
    data: {
      speakers: any[];
      count: number;
    };
  }> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (topic) params.append('topic', topic);
    
    const queryString = params.toString();
    return this.makeRequest<{
      success: boolean;
      data: {
        speakers: any[];
        count: number;
      };
    }>(`/speakers${queryString ? `?${queryString}` : ''}`);
  }

  // Get speaker profile by ID
  async getSpeakerProfile(speakerId: string): Promise<{
    success: boolean;
    data: {
      speaker: any;
      reviews: Review[];
    };
  }> {
    return this.makeRequest<{
      success: boolean;
      data: {
        speaker: any;
        reviews: Review[];
      };
    }>(`/speakers/${speakerId}`);
  }

  // Upload avatar
  async uploadAvatar(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('avatar', file);

    const url = `${API_BASE_URL}/learner/avatar`;
    const token = authService.getToken();

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

      return data.data.avatarUrl;
    } catch (error) {
      console.error('Network Error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  // Book a session with a speaker
  async bookSession(bookingData: {
    speakerId: string;
    title: string;
    date: string;
    time: string;
    topics?: string[];
  }): Promise<{ success: boolean; data: { session: Session } }> {
    return this.makeRequest<{ success: boolean; data: { session: Session } }>(
      '/learner/book-session',
      {
        method: 'POST',
        body: JSON.stringify(bookingData),
      }
    );
  }
}

export const learnerService = new LearnerService();

