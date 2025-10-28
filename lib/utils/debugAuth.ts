import { authService } from '../services/authService';

export const debugAuth = () => {
  console.log('=== Auth Debug Info ===');
  
  // Check if we're in the browser
  if (typeof window === 'undefined') {
    console.log('❌ Running on server side - no localStorage access');
    return;
  }
  
  // Check token presence
  const token = authService.getToken();
  console.log('🔑 Token exists:', !!token);
  
  if (token) {
    console.log('📝 Token preview:', token.substring(0, 20) + '...');
    
    // Try to decode token (basic check)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('👤 Token payload:', payload);
      console.log('⏰ Token expires:', new Date(payload.exp * 1000));
      console.log('🕐 Current time:', new Date());
      console.log('✅ Token valid:', payload.exp * 1000 > Date.now());
    } catch (error) {
      console.log('❌ Token decode error:', error);
    }
  } else {
    console.log('❌ No token found in localStorage');
    console.log('📦 All localStorage keys:', Object.keys(localStorage));
  }
  
  // Check authentication status
  console.log('🔐 Is authenticated:', authService.isAuthenticated());
  console.log('=======================');
};

// Auto-run debug in development
if (process.env.NODE_ENV === 'development') {
  if (typeof window !== 'undefined') {
    (window as any).debugAuth = debugAuth;
    console.log('🐛 Debug function available: window.debugAuth()');
  }
} 