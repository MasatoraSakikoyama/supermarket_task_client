/**
 * Type definitions for API request/response
 */

// =============================================================================
// API Types
// =============================================================================

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
}

// =============================================================================
// Auth Types
// =============================================================================

export interface UserCreate {
  username: string;
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

// =============================================================================
// Shop Types
// =============================================================================

export interface ShopCreate {
  name: string;
  description?: string;
}

export interface ShopUpdate {
  name?: string;
  description?: string;
}

export interface ShopResponse {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

// =============================================================================
// Shop Account Entry Types
// =============================================================================

export interface ShopAccountEntryCreate {
  name: string;
  description?: string;
}

export interface ShopAccountEntryUpdate {
  name?: string;
  description?: string;
}

export interface ShopAccountEntryResponse {
  id: number;
  shop_id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}
