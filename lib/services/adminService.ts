import { authService } from './authService';
import { AdminAnalytics, AdminReview, AdminUser } from '../types/admin';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://aurora-backend-three.vercel.app/api';

interface ListResponse<T> {
  success: boolean;
  data: {
    pagination: {
      total: number;
      page: number;
      pages: number;
      limit: number;
    };
  } & T;
}

class AdminService {
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = authService.getToken();

    const headers = new Headers(options.headers as HeadersInit);
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }

    return data;
  }

  async getAnalytics(): Promise<{ success: boolean; data: AdminAnalytics }> {
    return this.makeRequest('/admin/analytics');
  }

  async getUsers(params: {
    role?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
    isActive?: boolean;
  }): Promise<
    ListResponse<{
      users: AdminUser[];
    }>
  > {
    const query = new URLSearchParams();

    if (params.role) query.set('role', params.role);
    if (params.status) query.set('status', params.status);
    if (params.search) query.set('search', params.search);
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (typeof params.isActive === 'boolean') {
      query.set('isActive', String(params.isActive));
    }

    const qs = query.toString();
    return this.makeRequest(`/admin/users${qs ? `?${qs}` : ''}`);
  }

  async createUser(payload: Partial<AdminUser> & { password: string }): Promise<{
    success: boolean;
    data: { user: AdminUser };
    message: string;
  }> {
    return this.makeRequest('/admin/users', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async updateUser(
    userId: string,
    payload: Partial<AdminUser> & { password?: string },
  ): Promise<{
    success: boolean;
    data: { user: AdminUser };
    message: string;
  }> {
    return this.makeRequest(`/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async updateUserStatus(
    userId: string,
    payload: { status?: AdminUser['status']; isActive?: boolean },
  ): Promise<{
    success: boolean;
    data: { user: AdminUser };
    message: string;
  }> {
    return this.makeRequest(`/admin/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  }

  async deleteUser(userId: string): Promise<{ success: boolean; message: string }> {
    return this.makeRequest(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  }

  async getReviews(params: {
    rating?: number;
    from?: string;
    to?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<
    ListResponse<{
      reviews: AdminReview[];
    }>
  > {
    const query = new URLSearchParams();

    if (params.rating) query.set('rating', String(params.rating));
    if (params.from) query.set('from', params.from);
    if (params.to) query.set('to', params.to);
    if (params.search) query.set('search', params.search);
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));

    const qs = query.toString();
    return this.makeRequest(`/admin/reviews${qs ? `?${qs}` : ''}`);
  }

  async createReview(payload: {
    session: string;
    from: string;
    to: string;
    rating: number;
    comment?: string;
  }): Promise<{
    success: boolean;
    data: { review: AdminReview };
    message: string;
  }> {
    return this.makeRequest('/admin/reviews', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async updateReview(
    reviewId: string,
    payload: { rating?: number; comment?: string },
  ): Promise<{
    success: boolean;
    data: { review: AdminReview };
    message: string;
  }> {
    return this.makeRequest(`/admin/reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async deleteReview(reviewId: string): Promise<{ success: boolean; message: string }> {
    return this.makeRequest(`/admin/reviews/${reviewId}`, {
      method: 'DELETE',
    });
  }
}

export const adminService = new AdminService();

