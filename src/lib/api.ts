/**
 * Web API utility functions for making HTTP requests
 */

import { AxiosError, AxiosRequestConfig } from 'axios';
import axiosInstance from './axios';
import {
  ApiResponse,
  ApiRequestOptions,
  AccountCreate,
  AccountResponse,
  LoginRequest,
  TokenResponse,
  ShopCreate,
  ShopUpdate,
  ShopResponse,
  ShopSettlementCreate,
  ShopSettlementUpdate,
  ShopSettlementResponse,
} from './type';

/**
 * Base API client for making HTTP requests using axios
 */
export async function apiRequest<T>(
  url: string,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
  const { method = 'GET', headers = {}, body } = options;

  try {
    const config: AxiosRequestConfig = {
      url,
      method,
      headers,
      data: body,
    };

    const response = await axiosInstance.request<T>(config);

    return {
      data: response.data,
      error: null,
      status: response.status,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        data: null,
        error: error.response?.data?.message || error.message || 'Request failed',
        status: error.response?.status || 0,
      };
    }
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      status: 0,
    };
  }
}

/**
 * GET request helper
 */
export async function get<T>(url: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, { method: 'GET', headers });
}

/**
 * POST request helper
 */
export async function post<T>(
  url: string,
  body: unknown,
  headers?: Record<string, string>
): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, { method: 'POST', body, headers });
}

/**
 * PUT request helper
 */
export async function put<T>(
  url: string,
  body: unknown,
  headers?: Record<string, string>
): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, { method: 'PUT', body, headers });
}

/**
 * DELETE request helper
 */
export async function del<T>(url: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, { method: 'DELETE', headers });
}

/**
 * PATCH request helper
 */
export async function patch<T>(
  url: string,
  body: unknown,
  headers?: Record<string, string>
): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, { method: 'PATCH', body, headers });
}

// =============================================================================
// Authentication API
// =============================================================================

/**
 * Register a new user account
 */
export async function authRegister(data: AccountCreate): Promise<ApiResponse<AccountResponse>> {
  return post<AccountResponse>('/auth/register', data);
}

/**
 * Login and get access token
 */
export async function authLogin(data: LoginRequest): Promise<ApiResponse<TokenResponse>> {
  return post<TokenResponse>('/auth/login', data);
}

/**
 * Logout and invalidate token
 */
export async function authLogout(token: string): Promise<ApiResponse<null>> {
  return post<null>('/auth/logout', {}, {
    'Authorization': `Bearer ${token}`,
  });
}

/**
 * Get current user information
 */
export async function authMe(token: string): Promise<ApiResponse<AccountResponse>> {
  return get<AccountResponse>('/auth/me', {
    'Authorization': `Bearer ${token}`,
  });
}

// =============================================================================
// Shops API
// =============================================================================

/**
 * Get all shops with pagination
 */
export async function getShops(
  token: string,
  offset: number = 0,
  limit: number = 100
): Promise<ApiResponse<ShopResponse[]>> {
  const params = new URLSearchParams({ offset: String(offset), limit: String(limit) });
  return get<ShopResponse[]>(`/shops?${params}`, {
    'Authorization': `Bearer ${token}`,
  });
}

/**
 * Get a single shop by ID
 */
export async function getShop(token: string, shopId: number): Promise<ApiResponse<ShopResponse>> {
  return get<ShopResponse>(`/shops/${shopId}`, {
    'Authorization': `Bearer ${token}`,
  });
}

/**
 * Create a new shop
 */
export async function createShop(token: string, data: ShopCreate): Promise<ApiResponse<ShopResponse>> {
  return post<ShopResponse>('/shops', data, {
    'Authorization': `Bearer ${token}`,
  });
}

/**
 * Update an existing shop
 */
export async function updateShop(
  token: string,
  shopId: number,
  data: ShopUpdate
): Promise<ApiResponse<ShopResponse>> {
  return put<ShopResponse>(`/shops/${shopId}`, data, {
    'Authorization': `Bearer ${token}`,
  });
}

/**
 * Delete a shop
 */
export async function deleteShop(token: string, shopId: number): Promise<ApiResponse<null>> {
  return del<null>(`/shops/${shopId}`, {
    'Authorization': `Bearer ${token}`,
  });
}

// =============================================================================
// Shop Settlements API
// =============================================================================

/**
 * Get all settlements for a shop with pagination
 */
export async function getShopSettlements(
  token: string,
  shopId: number,
  offset: number = 0,
  limit: number = 100
): Promise<ApiResponse<ShopSettlementResponse[]>> {
  const params = new URLSearchParams({ offset: String(offset), limit: String(limit) });
  return get<ShopSettlementResponse[]>(`/shops/${shopId}/settlements?${params}`, {
    'Authorization': `Bearer ${token}`,
  });
}

/**
 * Get a single settlement by ID for a shop
 */
export async function getShopSettlement(
  token: string,
  shopId: number,
  settlementId: number
): Promise<ApiResponse<ShopSettlementResponse>> {
  return get<ShopSettlementResponse>(`/shops/${shopId}/settlements/${settlementId}`, {
    'Authorization': `Bearer ${token}`,
  });
}

/**
 * Create a new settlement for a shop
 */
export async function createShopSettlement(
  token: string,
  shopId: number,
  data: ShopSettlementCreate
): Promise<ApiResponse<ShopSettlementResponse>> {
  return post<ShopSettlementResponse>(`/shops/${shopId}/settlements`, data, {
    'Authorization': `Bearer ${token}`,
  });
}

/**
 * Update an existing settlement for a shop
 */
export async function updateShopSettlement(
  token: string,
  shopId: number,
  settlementId: number,
  data: ShopSettlementUpdate
): Promise<ApiResponse<ShopSettlementResponse>> {
  return put<ShopSettlementResponse>(`/shops/${shopId}/settlements/${settlementId}`, data, {
    'Authorization': `Bearer ${token}`,
  });
}

/**
 * Delete a settlement for a shop
 */
export async function deleteShopSettlement(
  token: string,
  shopId: number,
  settlementId: number
): Promise<ApiResponse<null>> {
  return del<null>(`/shops/${shopId}/settlements/${settlementId}`, {
    'Authorization': `Bearer ${token}`,
  });
}
