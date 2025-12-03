'use client';

import { ReactNode, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthLogin, useAuthLogout, useAuthMe } from '@/lib/hooks';
import { useAuthStore } from '@/stores/useAuthStore';

/**
 * AuthProvider component - now using Zustand for state management
 * Maintains TanStack Query integration for API calls
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Get state from Zustand store
  const { 
    token, 
    isLoading,
    isAuthenticated,
    setAuth, 
    setUser, 
    clearAuth,
  } = useAuthStore();

  // Only call getMe API when NOT on login page and token exists
  const shouldFetchUser = !!token && pathname !== '/';
  
  // Use TanStack Query to validate token
  const { data: userResponse, isError } = useAuthMe(shouldFetchUser ? token : null);

  // Synchronize token state with API response (401 = invalid token)
  useEffect(() => {
    if (token && userResponse?.status === 401) {
      clearAuth();
    }
  }, [token, userResponse?.status, clearAuth]);

  // Synchronize auth state based on token and user response
  useEffect(() => {
    if (token) {
      if (pathname === '/') {
        // On login page with token - just set authenticated without fetching user
        setAuth(true, false);
      } else if (userResponse) {
        // Not on login page - process user response
        if (userResponse.data) {
          setAuth(true, false);
          setUser(userResponse.data);
        } else if (userResponse.error && userResponse.status !== 401) {
          // Network error or other issues - keep token and assume authenticated
          setAuth(true, false);
        }
      } else if (isError) {
        // Error fetching user, but keep token
        setAuth(true, false);
      } else {
        // Token exists but no response yet (initial load)
        setAuth(true, false);
      }
    } else if (!token) {
      setAuth(false, false);
    }
  }, [token, userResponse, isError, pathname, setAuth, setUser]);

  // Redirect to login (root) if not authenticated and not already on login page
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && pathname !== '/') {
        // Not authenticated and not on login page - redirect to login
        router.push('/');
      } else if (isAuthenticated && pathname === '/') {
        // Authenticated but on login page - redirect to summary
        router.push('/summary');
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  return <>{children}</>;
}

/**
 * Hook to access auth state and actions
 * Now uses Zustand store with additional login/logout methods
 */
export function useAuth() {
  const router = useRouter();
  const store = useAuthStore();
  const loginMutation = useAuthLogin();
  const logoutMutation = useAuthLogout();

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await loginMutation.mutateAsync({ email, password });

      if (result.error) {
        return { success: false, error: result.error };
      }

      if (result.data?.access_token) {
        const accessToken = result.data.access_token;
        
        // Store the token in cookie and state
        store.setToken(accessToken);
        store.setAuth(true);

        router.push('/summary');
        return { success: true };
      }
      
      return { success: false, error: 'No authentication token received' };
    } catch {
      return { success: false, error: 'Unable to connect to server. Please check your connection and try again.' };
    }
  }, [router, loginMutation, store]);

  const logout = useCallback(async () => {
    const currentToken = store.getToken();
    
    // Use TanStack Query mutation for logout
    if (currentToken) {
      try {
        await logoutMutation.mutateAsync(currentToken);
      } catch {
        // Ignore errors during logout
      }
    }

    // Clear local state
    store.clearAuth();
    router.push('/');
  }, [router, store, logoutMutation]);

  return {
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    user: store.user,
    token: store.token,
    login,
    logout,
    getToken: store.getToken,
  };
}
