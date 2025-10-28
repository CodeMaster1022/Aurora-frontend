'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/hooks/redux';
import { getCurrentUser, initializeAuth } from '@/lib/store/authSlice';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  redirectTo = '/auth' 
}: ProtectedRouteProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Initialize auth state from localStorage
    dispatch(initializeAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        router.push(redirectTo);
      }
      // Remove automatic redirect to dashboard for authenticated users on public pages
      // This allows users to stay on the current page after refresh
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, router]);

  useEffect(() => {
    // If we have a token but no user data, fetch current user
    if (isAuthenticated && !user && !isLoading) {
      dispatch(getCurrentUser());
    }
  }, [isAuthenticated, user, isLoading, dispatch]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  // Don't render children if auth requirements aren't met
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // Allow authenticated users to see public pages (removed blocking logic)

  return <>{children}</>;
}
