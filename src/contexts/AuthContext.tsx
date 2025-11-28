'use client';

import { createContext, useContext, useEffect, ReactNode, useCallback, useSyncExternalStore } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple auth store for managing authentication state
const createAuthStore = () => {
  let state = { isAuthenticated: false, isLoading: true };
  const serverSnapshot = { isAuthenticated: false, isLoading: true };
  let listeners: (() => void)[] = [];
  
  const getSnapshot = () => state;
  const getServerSnapshot = () => serverSnapshot;
  
  const subscribe = (listener: () => void) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  };
  
  const setAuth = (isAuthenticated: boolean, isLoading: boolean = false) => {
    state = { isAuthenticated, isLoading };
    listeners.forEach(listener => listener());
  };
  
  const initialize = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      state = { isAuthenticated: !!token, isLoading: false };
      listeners.forEach(listener => listener());
    }
  };
  
  return { getSnapshot, getServerSnapshot, subscribe, setAuth, initialize };
};

const authStore = createAuthStore();

export function AuthProvider({ children }: { children: ReactNode }) {
  const authState = useSyncExternalStore(
    authStore.subscribe,
    authStore.getSnapshot,
    authStore.getServerSnapshot
  );
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Initialize auth state from localStorage on mount
    authStore.initialize();
  }, []);

  useEffect(() => {
    // Redirect to login if not authenticated and not already on login page
    if (!authState.isLoading && !authState.isAuthenticated && pathname !== '/login') {
      router.push('/login');
    }
  }, [authState.isAuthenticated, authState.isLoading, pathname, router]);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.message || 'Login failed' };
      }

      // Store the token and update auth state only if token is received
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
        authStore.setAuth(true);
        router.push('/');
        return { success: true };
      }
      
      return { success: false, error: 'No authentication token received' };
    } catch {
      return { success: false, error: 'Unable to connect to server. Please check your connection and try again.' };
    }
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    authStore.setAuth(false);
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated: authState.isAuthenticated, 
      isLoading: authState.isLoading, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
