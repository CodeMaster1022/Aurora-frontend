'use client';

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/lib/store';
import { initializeAuth } from '@/lib/store/authSlice';
import { initializeLanguage } from '@/lib/store/languageSlice';

interface ReduxProviderProps {
  children: React.ReactNode;
}

function AuthInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize auth state from localStorage on app start
    store.dispatch(initializeAuth());
    // Initialize language state from localStorage on app start
    store.dispatch(initializeLanguage());
  }, []);

  return <>{children}</>;
}

export function ReduxProvider({ children }: ReduxProviderProps) {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  );
}
