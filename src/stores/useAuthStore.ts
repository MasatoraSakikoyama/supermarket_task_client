'use client';

import { create } from 'zustand';
import { AccountResponse } from '@/lib/type';

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

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AccountResponse | null;
  token: string | null;
  setAuth: (isAuthenticated: boolean, isLoading?: boolean) => void;
  setUser: (user: AccountResponse | null) => void;
  setToken: (token: string | null) => void;
  getToken: () => string | null;
  initialize: () => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  token: null,
  
  setAuth: (isAuthenticated: boolean, isLoading: boolean = false) => {
    set({ isAuthenticated, isLoading });
  },
  
  setUser: (user: AccountResponse | null) => {
    set({ user });
  },
  
  setToken: (token: string | null) => {
    if (token) {
      setCookie(TOKEN_COOKIE_NAME, token);
    } else {
      deleteCookie(TOKEN_COOKIE_NAME);
    }
    set({ token });
  },
  
  getToken: (): string | null => {
    return getCookie(TOKEN_COOKIE_NAME);
  },
  
  initialize: () => {
    if (typeof document !== 'undefined') {
      const token = getCookie(TOKEN_COOKIE_NAME);
      set({ 
        token, 
        isAuthenticated: !!token, 
        isLoading: false 
      });
    }
  },
  
  clearAuth: () => {
    deleteCookie(TOKEN_COOKIE_NAME);
    set({ 
      isAuthenticated: false, 
      isLoading: false, 
      user: null, 
      token: null 
    });
  },
}));

// Initialize auth state from cookie on load
if (typeof window !== 'undefined') {
  useAuthStore.getState().initialize();
}
