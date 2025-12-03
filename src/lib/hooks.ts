/**
 * TanStack Query hooks for API calls
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
  getShopAccountEntry,
  createShopAccountEntry,
  updateShopAccountEntry,
  deleteShopAccountEntry,
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
  ShopAccountEntryCreate,
  ShopAccountEntryUpdate,
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
  limit: number = 100,
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
  });
}

/**
 * Hook for getting a single shop
 */
export function useShop(token: string | null, shopId: number, enabled: boolean = true) {
  return useQuery({
    queryKey: ['shop', shopId],
    queryFn: () => {
      if (!token) {
        throw new Error('No token provided');
      }
      return getShop(token, shopId);
    },
    enabled: enabled && !!token && shopId > 0,
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
// Shop AccountData Hooks
// =============================================================================

/**
 * Hook for getting all account data for a shop with pagination
 */
export function useShopAccountDataList(
  token: string | null,
  shopId: number,
  offset: number = 0,
  limit: number = 100,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['shop', shopId, 'account_data', offset, limit],
    queryFn: () => {
      if (!token) {
        throw new Error('No token provided');
      }
      return getShopAccountEntryList(token, shopId, offset, limit);
    },
    enabled: enabled && !!token && shopId > 0,
  });
}

/**
 * Hook for getting a single account data by ID
 */
export function useShopAccountData(
  token: string | null,
  shopId: number,
  accountDataId: number,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['shop', shopId, 'account_data', accountDataId],
    queryFn: () => {
      if (!token) {
        throw new Error('No token provided');
      }
      return getShopAccountEntry(token, shopId, accountDataId);
    },
    enabled: enabled && !!token && shopId > 0 && accountDataId > 0,
  });
}

/**
 * Hook for creating a account data
 */
export function useCreateShopAccountData() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ token, shopId, data }: { token: string; shopId: number; data: ShopAccountEntryCreate }) =>
      createShopAccountEntry(token, shopId, data),
    onSuccess: (_, variables) => {
      // Invalidate account data list on create
      queryClient.invalidateQueries({ queryKey: ['shop', variables.shopId, 'account_data'] });
    },
  });
}

/**
 * Hook for updating a account data
 */
export function useUpdateShopAccountData() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      token,
      shopId,
      accountDataId,
      data,
    }: {
      token: string;
      shopId: number;
      accountDataId: number;
      data: ShopAccountEntryUpdate;
    }) => updateShopAccountEntry(token, shopId, accountDataId, data),
    onSuccess: (_, variables) => {
      // Invalidate specific account data and account data list on update
      queryClient.invalidateQueries({
        queryKey: ['shop', variables.shopId, 'account_data', variables.accountDataId],
      });
      queryClient.invalidateQueries({ queryKey: ['shop', variables.shopId, 'account_data'] });
    },
  });
}

/**
 * Hook for deleting a account data
 */
export function useDeleteShopAccountData() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ token, shopId, accountDataId }: { token: string; shopId: number; accountDataId: number }) =>
      deleteShopAccountEntry(token, shopId, accountDataId),
    onSuccess: (_, variables) => {
      // Invalidate specific account data and account data list on delete
      queryClient.invalidateQueries({
        queryKey: ['shop', variables.shopId, 'account_data', variables.accountDataId],
      });
      queryClient.invalidateQueries({ queryKey: ['shop', variables.shopId, 'account_data'] });
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
