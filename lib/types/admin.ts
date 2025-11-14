import { User } from './auth';

export interface AdminAnalytics {
  userMetrics: {
    totalUsers: number;
    activeUsers: number;
    newUsersThisMonth: number;
    roleBreakdown: Record<string, number>;
  };
  sessionMetrics: {
    totalSessions: number;
    upcomingSessions: number;
    completedSessions: number;
    statusBreakdown: Record<string, number>;
    reviewCount: number;
    averageRating: number;
    fiveStarReviews: number;
    connectedCalendars: number;
  };
  revenueMetrics: {
    totalRevenue: number;
    averageTicket: number;
    monthlyRevenue: Array<{
      month: string;
      total: number;
      sessions: number;
    }>;
  };
  songMetrics: {
    totalShares: number;
    averagePerSpeaker: number;
    uniqueSongs: number;
  };
  topSpeakers: Array<{
    userId: string;
    name: string;
    avatar: string | null;
    role: string;
    reviewsCount: number;
    averageRating: number;
  }>;
}

export interface AdminUser extends User {
  googleCalendar?: {
    connected: boolean;
    expiresAt?: string | null;
  };
}

export interface AdminSessionSummary {
  _id: string;
  title: string;
  date: string;
  status: string;
}

export interface AdminReview {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  from: {
    _id: string;
    firstname?: string;
    lastname?: string;
    role: string;
  };
  to: {
    _id: string;
    firstname?: string;
    lastname?: string;
    role: string;
  };
  session?: AdminSessionSummary | string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    [key: string]: any;
    pagination: {
      total: number;
      page: number;
      pages: number;
      limit: number;
    };
  } & T;
}

