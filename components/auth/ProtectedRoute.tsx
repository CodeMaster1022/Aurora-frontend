'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/hooks/redux';
import { getCurrentUser, initializeAuth, setUser } from '@/lib/store/authSlice';
import { TermsAcceptanceModal } from '@/components/TermsAcceptanceModal';
import { AuthModal } from '@/components/auth/AuthModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  redirectTo = '/' 
}: ProtectedRouteProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading, user } = useAppSelector((state) => state.auth);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const hasPromptedRef = useRef(false);

  useEffect(() => {
    // Initialize auth state from localStorage
    dispatch(initializeAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!requireAuth || isLoading) {
      return;
    }

    if (!isAuthenticated) {
      if (!hasPromptedRef.current) {
        setShowAuthModal(true);
        hasPromptedRef.current = true;
      }
    } else {
      setShowAuthModal(false);
      hasPromptedRef.current = false;
    }
  }, [isAuthenticated, isLoading, requireAuth]);

  useEffect(() => {
    // If we have a token but no user data, fetch current user
    if (isAuthenticated && !user && !isLoading) {
      dispatch(getCurrentUser());
    }
  }, [isAuthenticated, user, isLoading, dispatch]);

  // Check if user needs to accept terms
  useEffect(() => {
    if (user && isAuthenticated && !isLoading) {
      // Check if user hasn't accepted terms or privacy policy
      const needsAcceptance = !user.termsAccepted || !user.privacyAccepted;
      if (needsAcceptance) {
        setShowTermsModal(true);
      }
    }
  }, [user, isAuthenticated, isLoading]);

  const handleTermsAccept = async () => {
    try {
      // Update user state in Redux
      if (user) {
        dispatch(setUser({
          ...user,
          termsAccepted: true,
          privacyAccepted: true,
          termsAcceptedAt: new Date().toISOString(),
          privacyAcceptedAt: new Date().toISOString(),
        }));
      }
      setShowTermsModal(false);
    } catch (error) {
      console.error('Error updating user state after terms acceptance:', error);
    }
  };

  const handleAuthModalChange = useCallback(
    (open: boolean) => {
      setShowAuthModal(open);
      if (!open && !isAuthenticated) {
        if (typeof window !== 'undefined' && window.history.length > 1) {
          router.back();
        } else if (redirectTo) {
          router.push(redirectTo);
        }
      }
    },
    [isAuthenticated, redirectTo, router],
  );

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
    return (
      <>
        <AuthModal initialView="signin" open={showAuthModal} onOpenChange={handleAuthModalChange} />
      </>
    );
  }

  // Block access until terms are accepted
  if (user && requireAuth && (!user.termsAccepted || !user.privacyAccepted)) {
    return (
      <>
        <TermsAcceptanceModal open={showTermsModal} onAccept={handleTermsAccept} />
      </>
    );
  }

  // Allow authenticated users to see public pages (removed blocking logic)

  return (
    <>
      <TermsAcceptanceModal open={showTermsModal} onAccept={handleTermsAccept} />
      {children}
    </>
  );
}
