'use client';

import { createContext, useContext, useEffect, ReactNode, useCallback, useSyncExternalStore, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authLogin, authLogout, authMe, AccountResponse } from '@/lib/api';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AccountResponse | null;
  token: string | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Token storage key
const TOKEN_STORAGE_KEY = 'auth_token';

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
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
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
  const [user, setUser] = useState<AccountResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Get token from localStorage
  const getToken = useCallback((): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_STORAGE_KEY);
    }
    return null;
  }, []);

  // Validate token and fetch user info on mount
  useEffect(() => {
    const validateToken = async () => {
      const storedToken = getToken();
      if (storedToken) {
        setToken(storedToken);
        // Validate token by fetching user info
        const response = await authMe(storedToken);
        if (response.data) {
          setUser(response.data);
          authStore.setAuth(true, false);
        } else if (response.status === 401) {
          // Token is invalid (unauthorized), clear it
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          setToken(null);
          setUser(null);
          authStore.setAuth(false, false);
        } else {
          // Network error or other issues - keep token and assume authenticated
          // This prevents users from being logged out due to temporary network issues
          authStore.setAuth(true, false);
        }
      } else {
        authStore.setAuth(false, false);
      }
    };

    validateToken();
  }, [getToken]);

  useEffect(() => {
    // Redirect to login if not authenticated and not already on login page
    if (!authState.isLoading && !authState.isAuthenticated && pathname !== '/login') {
      router.push('/login');
    }
  }, [authState.isAuthenticated, authState.isLoading, pathname, router]);

  const login = useCallback(async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Call the server API to login
      const response = await authLogin({ username, password });

      if (response.error) {
        return { success: false, error: response.error };
      }

      if (response.data?.access_token) {
        const accessToken = response.data.access_token;
        
        // Store the token
        localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
        setToken(accessToken);

        // Fetch user info
        const userResponse = await authMe(accessToken);
        if (userResponse.data) {
          setUser(userResponse.data);
        }

        authStore.setAuth(true);
        router.push('/');
        return { success: true };
      }
      
      return { success: false, error: 'No authentication token received' };
    } catch {
      return { success: false, error: 'Unable to connect to server. Please check your connection and try again.' };
    }
  }, [router]);

  const logout = useCallback(async () => {
    const currentToken = getToken();
    
    // Call server logout to invalidate token
    if (currentToken) {
      await authLogout(currentToken);
    }

    // Clear local state
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
    authStore.setAuth(false);
    router.push('/login');
  }, [router, getToken]);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated: authState.isAuthenticated, 
      isLoading: authState.isLoading, 
      user,
      token,
      login, 
      logout,
      getToken
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
