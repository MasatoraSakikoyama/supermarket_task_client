/**
 * TanStack Query hooks for API calls
 */

import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  authLogin,
  authLogout,
  authMe,
  authRegister,
  getShops,
  getShop,
  createShop,
  updateShop,
  deleteShop,
  getShopAccountEntryList,
  createShopAccountEntryList,
  getShopAccountTitleList,
  createShopAccountTitleList,
  get,
  post,
  put,
  del,
} from '@/lib/api';
import {
  UserCreate,
  LoginRequest,
  ShopCreate,
  ShopUpdate,
  ShopAccountEntryRequest,
  ShopAccountTitleRequest,
} from '@/type/api';

// =============================================================================
// Authentication Hooks
// =============================================================================

/**
 * Hook for user registration
 */
export function useAuthRegister() {
  return useMutation({
    mutationFn: (data: UserCreate) => authRegister(data),
  });
}

/**
 * Hook for user login
 */
export function useAuthLogin() {
  return useMutation({
    mutationFn: (data: LoginRequest) => authLogin(data),
  });
}

/**
 * Hook for user logout
 */
export function useAuthLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (token: string) => authLogout(token),
    onSuccess: () => {
      // Invalidate all queries on logout
      queryClient.clear();
    },
  });
}

/**
 * Hook for getting current user information
 */
export function useAuthMe(token: string | null) {
  return useQuery({
    queryKey: ['auth', 'me', token],
    queryFn: () => {
      if (!token) {
        throw new Error('No token provided');
      }
      return authMe(token);
    },
    enabled: !!token,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// =============================================================================
// Shops Hooks
// =============================================================================

/**
 * Hook for getting all shops with pagination
 */
export function useShops(
  token: string | null,
  offset: number = 0,
  limit: number = 10,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['shop', offset, limit],
    queryFn: () => {
      if (!token) {
        throw new Error('No token provided');
      }
      return getShops(token, offset, limit);
    },
    enabled: enabled && !!token,
    placeholderData: keepPreviousData,
  });
}

/**
 * Hook for getting a single shop
 */
export function useShop(token: string | null, shopId: number) {
  return useQuery({
    queryKey: ['shop', shopId],
    queryFn: () => {
      if (!token) {
        throw new Error('No token provided');
      }
      return getShop(token, shopId);
    },
    enabled: !!token && shopId > 0,
  });
}

/**
 * Hook for creating a shop
 */
export function useCreateShop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ token, data }: { token: string; data: ShopCreate }) => createShop(token, data),
    onSuccess: () => {
      // Invalidate shops list on create
      queryClient.invalidateQueries({ queryKey: ['shop'] });
    },
  });
}

/**
 * Hook for updating a shop
 */
export function useUpdateShop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ token, shopId, data }: { token: string; shopId: number; data: ShopUpdate }) =>
      updateShop(token, shopId, data),
    onSuccess: (_, variables) => {
      // Invalidate specific shop and shops list on update
      queryClient.invalidateQueries({ queryKey: ['shop', variables.shopId] });
      queryClient.invalidateQueries({ queryKey: ['shop'] });
    },
  });
}

/**
 * Hook for deleting a shop
 */
export function useDeleteShop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ token, shopId }: { token: string; shopId: number }) => deleteShop(token, shopId),
    onSuccess: (_, variables) => {
      // Invalidate specific shop and shops list on delete
      queryClient.invalidateQueries({ queryKey: ['shop', variables.shopId] });
      queryClient.invalidateQueries({ queryKey: ['shop'] });
    },
  });
}

// =============================================================================
// Shop AccountTitle Hooks
// =============================================================================

/**
 * Hook for getting all account title for a shop with pagination
 */
export function useShopAccountTitleList(
  token: string | null,
  shopId: number,
) {
  return useQuery({
    queryKey: ['shop', shopId, 'account_title'],
    queryFn: () => {
      if (!token) {
        throw new Error('No token provided');
      }
      return getShopAccountTitleList(token, shopId);
    },
    enabled: !!token && shopId > 0,
    placeholderData: keepPreviousData,
  });
}

/**
 * Hook for creating a account title
 */
export function useCreateShopAccountTitleList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ token, shopId, data }: { token: string; shopId: number; data: ShopAccountTitleRequest }) =>
      createShopAccountTitleList(token, shopId, data),
    onSuccess: (_, variables) => {
      // Invalidate account data list on create
      queryClient.invalidateQueries({ queryKey: ['shop', variables.shopId, 'account_title'] });
    },
  });
}

// =============================================================================
// Shop AccountEntry Hooks
// =============================================================================

/**
 * Hook for getting all account entry for a shop with pagination
 */
export function useShopAccountEntryList(
  token: string | null,
  shopId: number,
  year: number | undefined,
) {
  return useQuery({
    queryKey: ['shop', shopId, 'account_entry', year],
    queryFn: () => {
      if (!token) {
        throw new Error('No token provided');
      }
      if (year === undefined) {
        throw new Error('Year parameter is required');
      }
      return getShopAccountEntryList(token, shopId, year);
    },
    enabled: !!token && shopId > 0 && year !== undefined,
    placeholderData: keepPreviousData,
  });
}

/**
 * Hook for creating a account entry
 */
export function useCreateShopAccountEntryList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ token, shopId, data }: { token: string; shopId: number; data: ShopAccountEntryRequest }) =>
      createShopAccountEntry(token, shopId, data),
    onSuccess: (_, variables) => {
      // Invalidate account entry list on create
      queryClient.invalidateQueries({ queryKey: ['shop', variables.shopId, 'account_entry'] });
    },
  });
}

// =============================================================================
// Generic Hooks for Custom API Endpoints
// =============================================================================

/**
 * Generic hook for GET requests
 */
export function useGet<T>(url: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['get', url],
    queryFn: () => get<T>(url),
    enabled,
  });
}

/**
 * Generic hook for POST requests (mutations)
 */
export function usePost<T>() {
  return useMutation({
    mutationFn: ({ url, body, headers }: { url: string; body: unknown; headers?: Record<string, string> }) =>
      post<T>(url, body, headers),
  });
}

/**
 * Generic hook for PUT requests (mutations)
 */
export function usePut<T>() {
  return useMutation({
    mutationFn: ({ url, body, headers }: { url: string; body: unknown; headers?: Record<string, string> }) =>
      put<T>(url, body, headers),
  });
}

/**
 * Generic hook for DELETE requests (mutations)
 */
export function useDelete<T>() {
  return useMutation({
    mutationFn: ({ url, headers }: { url: string; headers?: Record<string, string> }) =>
      del<T>(url, headers),
  });
}
