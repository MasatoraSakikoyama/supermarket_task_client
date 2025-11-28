'use client';

import { createContext, useContext, useEffect, ReactNode, useCallback, useSyncExternalStore, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authLogin, authLogout, authMe } from '@/lib/api';
import { AccountResponse } from '@/lib/type';

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

// Token cookie name
const TOKEN_COOKIE_NAME = 'supermarket_task_auth_token';

// Cookie utility functions
const setCookie = (name: string, value: string, days: number = 7): void => {
  if (typeof document === 'undefined') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Strict;Secure`;
};

const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') cookie = cookie.substring(1, cookie.length);
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
    }
  }
  return null;
};

const deleteCookie = (name: string): void => {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Strict;Secure`;
};

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
    if (typeof document !== 'undefined') {
      const token = getCookie(TOKEN_COOKIE_NAME);
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

  // Get token from cookie
  const getToken = useCallback((): string | null => {
    return getCookie(TOKEN_COOKIE_NAME);
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
          deleteCookie(TOKEN_COOKIE_NAME);
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
        
        // Store the token in cookie
        setCookie(TOKEN_COOKIE_NAME, accessToken);
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
    deleteCookie(TOKEN_COOKIE_NAME);
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
