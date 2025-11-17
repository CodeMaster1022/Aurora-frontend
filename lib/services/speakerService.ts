import { authService } from './authService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://aurora-backend-three.vercel.app/api';

export interface Learner {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  avatar?: string;
}

export interface Session {
  _id: string;
  title: string;
  learner: Learner | string;
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  topic?: string;
  topics?: string[];
  icebreaker?: string;
  meetingLink?: string;
}

export interface ReviewUser {
  _id: string;
  firstname: string;
  lastname: string;
}

export interface Review {
  _id: string;
  session: string;
  from: ReviewUser | string;
  to: ReviewUser | string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface SpeakerAvailability {
  day: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface SpeakerProfile {
  _id: string;
  bio?: string;
  location?: string;
  age?: number;
  cost?: number;
  availability: SpeakerAvailability[];
  totalSessions: number;
  completedSessions: number;
  rating: number;
  reviewsCount: number;
}

class SpeakerService {
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

  // Get speaker dashboard data
  async getDashboard(): Promise<{
    success: boolean;
    data: {
      upcomingSessions: Session[];
      pastSessions: Session[];
      reviews: Review[];
      profile: SpeakerProfile;
    };
  }> {
    return this.makeRequest<{
      success: boolean;
      data: {
        upcomingSessions: Session[];
        pastSessions: Session[];
        reviews: Review[];
        profile: SpeakerProfile;
      };
    }>('/speaker/dashboard');
  }

  // Update speaker profile
  async updateProfile(profileData: {
    bio?: string;
    age?: number;
    cost?: number;
    location?: string;
    timezone?: string;
    availability?: SpeakerAvailability[];
  }): Promise<{
    success: boolean;
    message: string;
    data: { user: any };
  }> {
    return this.makeRequest<{
      success: boolean;
      message: string;
      data: { user: any };
    }>('/speaker/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Update interests
  async updateInterests(interests: string[]): Promise<{ success: boolean }> {
    return this.makeRequest<{ success: boolean }>('/speaker/interests', {
      method: 'PUT',
      body: JSON.stringify({ interests }),
    });
  }

  // Update availability
  async updateAvailability(
    availability: SpeakerAvailability[]
  ): Promise<{ success: boolean }> {
    return this.makeRequest<{ success: boolean }>('/speaker/availability', {
      method: 'PUT',
      body: JSON.stringify({ availability }),
    });
  }

  // Upload avatar
  async uploadAvatar(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('avatar', file);

    const url = `${API_BASE_URL}/speaker/avatar`;
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

  // Rate and review a learner after completing a session
  async rateLearner(
    sessionId: string,
    rating: number,
    comment: string
  ): Promise<{ success: boolean; data: { review: Review } }> {
    return this.makeRequest<{ success: boolean; data: { review: Review } }>(
      `/speaker/sessions/${sessionId}/review`,
      {
        method: 'POST',
        body: JSON.stringify({ rating, comment }),
      }
    );
  }

  // Get a random YouTube gift song (no repeats)
  async getGiftSong(): Promise<{
    success: boolean;
    data: {
      url: string;
      videoId: string;
      title: string;
    };
  }> {
    return this.makeRequest<{
      success: boolean;
      data: {
        url: string;
        videoId: string;
        title: string;
      };
    }>('/speaker/gift-song');
  }

  // Google Calendar OAuth methods
  async getCalendarAuthUrl(): Promise<{
    success: boolean;
    data: { authUrl: string };
  }> {
    return this.makeRequest<{
      success: boolean;
      data: { authUrl: string };
    }>('/speaker/calendar/auth-url');
  }

  async getCalendarStatus(): Promise<{
    success: boolean;
    data: {
      connected: boolean;
      expiresAt: string | null;
      timezone: string | null;
    };
  }> {
    return this.makeRequest<{
      success: boolean;
      data: {
        connected: boolean;
        expiresAt: string | null;
        timezone: string | null;
      };
    }>('/speaker/calendar/status');
  }

  async disconnectCalendar(): Promise<{
    success: boolean;
    message: string;
    data: { user: any };
  }> {
    return this.makeRequest<{
      success: boolean;
      message: string;
      data: { user: any };
    }>('/speaker/calendar/disconnect', {
      method: 'POST',
    });
  }

  // Cancel a scheduled session
  async cancelSession(
    sessionId: string,
    reason?: string
  ): Promise<{ success: boolean; message: string; data: { session: any } }> {
    return this.makeRequest<{ success: boolean; message: string; data: { session: any } }>(
      `/speaker/sessions/${sessionId}/cancel`,
      {
        method: 'PUT',
        body: JSON.stringify({ reason }),
      }
    );
  }

  // Get available topics (public endpoint)
  async getTopics(): Promise<{ success: boolean; data: { topics: string[] } }> {
    return this.makeRequest<{ success: boolean; data: { topics: string[] } }>(
      '/speakers/topics'
    );
  }
}

export const speakerService = new SpeakerService();

