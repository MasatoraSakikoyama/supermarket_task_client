'use client';

import { createContext, useContext, useEffect, ReactNode, useCallback, useSyncExternalStore, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthLogin, useAuthLogout, useAuthMe } from '@/lib/hooks';
import { AccountResponse } from '@/lib/type';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AccountResponse | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
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
  const [token, setToken] = useState<string | null>(() => {
    // Initialize token from cookie on first render
    if (typeof document !== 'undefined') {
      return getCookie(TOKEN_COOKIE_NAME);
    }
    return null;
  });
  const router = useRouter();
  const pathname = usePathname();

  // TanStack Query hooks
  const loginMutation = useAuthLogin();
  const logoutMutation = useAuthLogout();

  // Get token from cookie
  const getToken = useCallback((): string | null => {
    return getCookie(TOKEN_COOKIE_NAME);
  }, []);

  // Use TanStack Query to validate token
  const { data: userResponse, isError } = useAuthMe(token, !!token);

  // Derive user state from userResponse
  const user = userResponse?.data || null;

  // Synchronize auth state based on token and user response
  useEffect(() => {
    if (token && userResponse) {
      if (userResponse.data) {
        authStore.setAuth(true, false);
      } else if (userResponse.status === 401) {
        // Token is invalid (unauthorized), clear it
        deleteCookie(TOKEN_COOKIE_NAME);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setToken(null);
        authStore.setAuth(false, false);
      } else if (userResponse.error) {
        // Network error or other issues - keep token and assume authenticated
        // This prevents users from being logged out due to temporary network issues
        authStore.setAuth(true, false);
      }
    } else if (token && isError) {
      // Error fetching user, but keep token
      authStore.setAuth(true, false);
    } else if (!token) {
      authStore.setAuth(false, false);
    }
  }, [token, userResponse, isError]);

  useEffect(() => {
    // Redirect to login (root) if not authenticated and not already on login page
    if (!authState.isLoading && !authState.isAuthenticated && pathname !== '/') {
      router.push('/');
    }
  }, [authState.isAuthenticated, authState.isLoading, pathname, router]);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Use TanStack Query mutation for login
      const result = await loginMutation.mutateAsync({ email, password });

      if (result.error) {
        return { success: false, error: result.error };
      }

      if (result.data?.access_token) {
        const accessToken = result.data.access_token;
        
        // Store the token in cookie
        setCookie(TOKEN_COOKIE_NAME, accessToken);
        setToken(accessToken);

        authStore.setAuth(true);
        router.push('/summary');
        return { success: true };
      }
      
      return { success: false, error: 'No authentication token received' };
    } catch {
      return { success: false, error: 'Unable to connect to server. Please check your connection and try again.' };
    }
  }, [router, loginMutation]);

  const logout = useCallback(async () => {
    const currentToken = getToken();
    
    // Use TanStack Query mutation for logout
    if (currentToken) {
      try {
        await logoutMutation.mutateAsync(currentToken);
      } catch {
        // Ignore errors during logout
      }
    }

    // Clear local state
    deleteCookie(TOKEN_COOKIE_NAME);
    setToken(null);
    authStore.setAuth(false);
    router.push('/');
  }, [router, getToken, logoutMutation]);

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
