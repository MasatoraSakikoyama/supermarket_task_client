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
  getShopSettlements,
  getShopSettlement,
  createShopSettlement,
  updateShopSettlement,
  deleteShopSettlement,
} from './api';
import {
  AccountCreate,
  LoginRequest,
  ShopCreate,
  ShopUpdate,
  ShopSettlementCreate,
  ShopSettlementUpdate,
} from './type';

// =============================================================================
// Authentication Hooks
// =============================================================================

/**
 * Hook for user registration
 */
export function useAuthRegister() {
  return useMutation({
    mutationFn: (data: AccountCreate) => authRegister(data),
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
export function useAuthMe(token: string | null, enabled: boolean = true) {
  return useQuery({
    queryKey: ['auth', 'me', token],
    queryFn: () => {
      if (!token) {
        throw new Error('No token provided');
      }
      return authMe(token);
    },
    enabled: enabled && !!token,
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
    queryKey: ['shops', token, offset, limit],
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
    queryKey: ['shops', shopId, token],
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
      queryClient.invalidateQueries({ queryKey: ['shops'] });
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
      queryClient.invalidateQueries({ queryKey: ['shops', variables.shopId] });
      queryClient.invalidateQueries({ queryKey: ['shops'] });
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
      queryClient.invalidateQueries({ queryKey: ['shops', variables.shopId] });
      queryClient.invalidateQueries({ queryKey: ['shops'] });
    },
  });
}

// =============================================================================
// Shop Settlements Hooks
// =============================================================================

/**
 * Hook for getting all settlements for a shop with pagination
 */
export function useShopSettlements(
  token: string | null,
  shopId: number,
  offset: number = 0,
  limit: number = 100,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['shops', shopId, 'settlements', token, offset, limit],
    queryFn: () => {
      if (!token) {
        throw new Error('No token provided');
      }
      return getShopSettlements(token, shopId, offset, limit);
    },
    enabled: enabled && !!token && shopId > 0,
  });
}

/**
 * Hook for getting a single settlement
 */
export function useShopSettlement(
  token: string | null,
  shopId: number,
  settlementId: number,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['shops', shopId, 'settlements', settlementId, token],
    queryFn: () => {
      if (!token) {
        throw new Error('No token provided');
      }
      return getShopSettlement(token, shopId, settlementId);
    },
    enabled: enabled && !!token && shopId > 0 && settlementId > 0,
  });
}

/**
 * Hook for creating a settlement
 */
export function useCreateShopSettlement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ token, shopId, data }: { token: string; shopId: number; data: ShopSettlementCreate }) =>
      createShopSettlement(token, shopId, data),
    onSuccess: (_, variables) => {
      // Invalidate settlements list on create
      queryClient.invalidateQueries({ queryKey: ['shops', variables.shopId, 'settlements'] });
    },
  });
}

/**
 * Hook for updating a settlement
 */
export function useUpdateShopSettlement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      token,
      shopId,
      settlementId,
      data,
    }: {
      token: string;
      shopId: number;
      settlementId: number;
      data: ShopSettlementUpdate;
    }) => updateShopSettlement(token, shopId, settlementId, data),
    onSuccess: (_, variables) => {
      // Invalidate specific settlement and settlements list on update
      queryClient.invalidateQueries({
        queryKey: ['shops', variables.shopId, 'settlements', variables.settlementId],
      });
      queryClient.invalidateQueries({ queryKey: ['shops', variables.shopId, 'settlements'] });
    },
  });
}

/**
 * Hook for deleting a settlement
 */
export function useDeleteShopSettlement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ token, shopId, settlementId }: { token: string; shopId: number; settlementId: number }) =>
      deleteShopSettlement(token, shopId, settlementId),
    onSuccess: (_, variables) => {
      // Invalidate specific settlement and settlements list on delete
      queryClient.invalidateQueries({
        queryKey: ['shops', variables.shopId, 'settlements', variables.settlementId],
      });
      queryClient.invalidateQueries({ queryKey: ['shops', variables.shopId, 'settlements'] });
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
    queryFn: async () => {
      const { get } = await import('./api');
      return get<T>(url);
    },
    enabled,
  });
}

/**
 * Generic hook for POST requests (mutations)
 */
export function usePost<T>() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ url, body, headers }: { url: string; body: unknown; headers?: Record<string, string> }) => {
      const { post } = await import('./api');
      return post<T>(url, body, headers);
    },
    onSuccess: () => {
      // Invalidate all queries on successful post
      queryClient.invalidateQueries();
    },
  });
}

/**
 * Generic hook for PUT requests (mutations)
 */
export function usePut<T>() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ url, body, headers }: { url: string; body: unknown; headers?: Record<string, string> }) => {
      const { put } = await import('./api');
      return put<T>(url, body, headers);
    },
    onSuccess: () => {
      // Invalidate all queries on successful put
      queryClient.invalidateQueries();
    },
  });
}

/**
 * Generic hook for DELETE requests (mutations)
 */
export function useDelete<T>() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ url, headers }: { url: string; headers?: Record<string, string> }) => {
      const { del } = await import('./api');
      return del<T>(url, headers);
    },
    onSuccess: () => {
      // Invalidate all queries on successful delete
      queryClient.invalidateQueries();
    },
  });
}
