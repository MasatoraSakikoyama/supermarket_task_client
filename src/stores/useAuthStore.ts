'use client';

import { create } from 'zustand';
import { AccountResponse } from '@/lib/type';

// Token cookie name
const TOKEN_COOKIE_NAME = 'supermarket_task_auth_token';
const TOKEN_TIMESTAMP_COOKIE_NAME = 'supermarket_task_auth_token_ts';

// Token expiration time (24 hours in milliseconds)
const TOKEN_MAX_AGE = 24 * 60 * 60 * 1000;

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

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AccountResponse | null;
  token: string | null;
  shouldValidateToken: boolean; // Flag to control when to validate token
  setAuth: (isAuthenticated: boolean, isLoading?: boolean) => void;
  setUser: (user: AccountResponse | null) => void;
  setToken: (token: string | null) => void;
  getToken: () => string | null;
  initialize: () => void;
  clearAuth: () => void;
  setShouldValidateToken: (should: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  token: null,
  shouldValidateToken: false, // Don't validate token on initial load
  
  setAuth: (isAuthenticated: boolean, isLoading: boolean = false) => {
    set({ isAuthenticated, isLoading });
  },
  
  setUser: (user: AccountResponse | null) => {
    set({ user });
  },
  
  setToken: (token: string | null) => {
    if (token) {
      setCookie(TOKEN_COOKIE_NAME, token);
      setCookie(TOKEN_TIMESTAMP_COOKIE_NAME, Date.now().toString()); // Store timestamp
    } else {
      deleteCookie(TOKEN_COOKIE_NAME);
      deleteCookie(TOKEN_TIMESTAMP_COOKIE_NAME);
    }
    set({ token, shouldValidateToken: !!token }); // Enable validation when token is set
  },
  
  getToken: (): string | null => {
    return getCookie(TOKEN_COOKIE_NAME);
  },
  
  initialize: () => {
    if (typeof document !== 'undefined') {
      const token = getCookie(TOKEN_COOKIE_NAME);
      const tokenTimestamp = getCookie(TOKEN_TIMESTAMP_COOKIE_NAME);
      
      if (token && tokenTimestamp) {
        const timestamp = parseInt(tokenTimestamp, 10);
        if (isNaN(timestamp)) {
          // Invalid timestamp, treat as stale
          deleteCookie(TOKEN_COOKIE_NAME);
          deleteCookie(TOKEN_TIMESTAMP_COOKIE_NAME);
          set({ 
            token: null,
            isAuthenticated: false,
            isLoading: false,
            shouldValidateToken: false
          });
          return;
        }
        const now = Date.now();
        const age = now - timestamp;
        
        // If token is older than TOKEN_MAX_AGE, consider it stale and don't use it
        if (age > TOKEN_MAX_AGE) {
          // Clear stale token without making API call
          deleteCookie(TOKEN_COOKIE_NAME);
          deleteCookie(TOKEN_TIMESTAMP_COOKIE_NAME);
          set({ 
            token: null,
            isAuthenticated: false,
            isLoading: false,
            shouldValidateToken: false
          });
        } else {
          // Token is recent enough, validate it
          set({ 
            token,
            isAuthenticated: false,
            isLoading: true, // Loading while validating
            shouldValidateToken: true // Validate token
          });
        }
      } else if (token) {
        // Token exists but no timestamp - treat as stale
        deleteCookie(TOKEN_COOKIE_NAME);
        deleteCookie(TOKEN_TIMESTAMP_COOKIE_NAME);
        set({ 
          token: null,
          isAuthenticated: false,
          isLoading: false,
          shouldValidateToken: false
        });
      } else {
        // No token
        set({ 
          token: null,
          isAuthenticated: false,
          isLoading: false,
          shouldValidateToken: false
        });
      }
    }
  },
  
  clearAuth: () => {
    deleteCookie(TOKEN_COOKIE_NAME);
    deleteCookie(TOKEN_TIMESTAMP_COOKIE_NAME);
    set({ 
      isAuthenticated: false, 
      isLoading: false, 
      user: null, 
      token: null,
      shouldValidateToken: false
    });
  },
  
  setShouldValidateToken: (should: boolean) => {
    set({ shouldValidateToken: should });
  },
}));

// Initialize auth state from cookie on load
if (typeof window !== 'undefined') {
  useAuthStore.getState().initialize();
}
