/**
 * Type definitions for the Supermarket Task Server API
 */

// Auth Types
export interface AccountBase {
  username: string;
  email: string;
}

export interface AccountCreate extends AccountBase {
  password: string;
}

export interface AccountResponse extends AccountBase {
  id: number;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

// Shop Types
export interface ShopBase {
  name: string;
  description?: string | null;
}

export interface ShopCreate extends ShopBase {}

export interface ShopUpdate {
  name?: string | null;
  description?: string | null;
}

export interface ShopResponse extends ShopBase {
  id: number;
  created_at: string;
  updated_at: string;
}

// Shop Settlement Types
export interface ShopSettlementBase {
  name: string;
  description?: string | null;
}

export interface ShopSettlementCreate extends ShopSettlementBase {}

export interface ShopSettlementUpdate {
  name?: string | null;
  description?: string | null;
}

export interface ShopSettlementResponse extends ShopSettlementBase {
  id: number;
  shop_id: number;
  created_at: string;
  updated_at: string;
}

// API Error Type
export interface APIError {
  detail: string;
}

// HTTP Validation Error
export interface HTTPValidationError {
  detail: ValidationError[];
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}
