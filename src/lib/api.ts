/**
 * Web API utility functions for making HTTP requests
 */

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

// Base API URL - should be configured via environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

/**
 * Base API client for making HTTP requests
 */
export async function apiRequest<T>(
  url: string,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
  const { method = 'GET', headers = {}, body } = options;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        ...DEFAULT_HEADERS,
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    // Handle empty responses (e.g., DELETE requests, 204 No Content)
    let data = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const text = await response.text();
      if (text) {
        data = JSON.parse(text);
      }
    }

    if (!response.ok) {
      return {
        data: null,
        error: (data && data.message) || `HTTP error! status: ${response.status}`,
        status: response.status,
      };
    }

    return {
      data,
      error: null,
      status: response.status,
    };
  } catch (error) {
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
  return post<AccountResponse>(`${API_BASE_URL}/auth/register`, data);
}

/**
 * Login and get access token
 */
export async function authLogin(data: LoginRequest): Promise<ApiResponse<TokenResponse>> {
  return post<TokenResponse>(`${API_BASE_URL}/auth/login`, data);
}

/**
 * Logout and invalidate token
 */
export async function authLogout(token: string): Promise<ApiResponse<null>> {
  return post<null>(`${API_BASE_URL}/auth/logout`, {}, {
    'Authorization': `Bearer ${token}`,
  });
}

/**
 * Get current user information
 */
export async function authMe(token: string): Promise<ApiResponse<AccountResponse>> {
  return get<AccountResponse>(`${API_BASE_URL}/auth/me`, {
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
  skip: number = 0,
  limit: number = 100
): Promise<ApiResponse<ShopResponse[]>> {
  const params = new URLSearchParams({ skip: String(skip), limit: String(limit) });
  return get<ShopResponse[]>(`${API_BASE_URL}/shops?${params}`, {
    'Authorization': `Bearer ${token}`,
  });
}

/**
 * Get a single shop by ID
 */
export async function getShop(token: string, shopId: number): Promise<ApiResponse<ShopResponse>> {
  return get<ShopResponse>(`${API_BASE_URL}/shops/${shopId}`, {
    'Authorization': `Bearer ${token}`,
  });
}

/**
 * Create a new shop
 */
export async function createShop(token: string, data: ShopCreate): Promise<ApiResponse<ShopResponse>> {
  return post<ShopResponse>(`${API_BASE_URL}/shops`, data, {
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
  return put<ShopResponse>(`${API_BASE_URL}/shops/${shopId}`, data, {
    'Authorization': `Bearer ${token}`,
  });
}

/**
 * Delete a shop
 */
export async function deleteShop(token: string, shopId: number): Promise<ApiResponse<null>> {
  return del<null>(`${API_BASE_URL}/shops/${shopId}`, {
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
  skip: number = 0,
  limit: number = 100
): Promise<ApiResponse<ShopSettlementResponse[]>> {
  const params = new URLSearchParams({ skip: String(skip), limit: String(limit) });
  return get<ShopSettlementResponse[]>(`${API_BASE_URL}/shops/${shopId}/settlements?${params}`, {
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
  return get<ShopSettlementResponse>(`${API_BASE_URL}/shops/${shopId}/settlements/${settlementId}`, {
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
  return post<ShopSettlementResponse>(`${API_BASE_URL}/shops/${shopId}/settlements`, data, {
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
  return put<ShopSettlementResponse>(`${API_BASE_URL}/shops/${shopId}/settlements/${settlementId}`, data, {
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
  return del<null>(`${API_BASE_URL}/shops/${shopId}/settlements/${settlementId}`, {
    'Authorization': `Bearer ${token}`,
  });
}
