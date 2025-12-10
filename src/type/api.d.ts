/**
 * Type definitions for API request/response
 */

import { AccountPeriodType, AccountTitleType, AccountTitleSubType } from '@/constants';

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
  period_type: AccountPeriodType;
  is_cumulative: boolean;
}

export interface ShopUpdate {
  name?: string;
  description?: string;
  period_type?: AccountPeriodType;
  is_cumulative?: boolean;
}

export interface ShopResponse {
  id: number;
  name: string;
  description: string | null;
  period_type: AccountPeriodType;
  is_cumulative: boolean;
}

// =============================================================================
// Shop Account Title Types
// =============================================================================

export interface ShopAccountTitle {
  id?: number;
  shop_id: number;
  type?: AccountTitleType;
  sub_type?: AccountTitleSubType;
  code?: string;
  name?: string;
  order?: number;
}

export interface ShopAccountTitleRequest {
  revenues: ShopAccountTitle[];
  expenses: ShopAccountTitle[];
}

export interface ShopAccountTitleResponse {
  revenues: ShopAccountTitle[];
  expenses: ShopAccountTitle[];
}

// =============================================================================
// Shop Account Entry Types
// =============================================================================

export interface ShopAccountEntry {
  id?: number;
  shop_id: number;
  shopp_account_title_id?: number;
  year: number;
  month: number;
  amount?: number;
}

export interface ShopAccountEntryRequest {
  revenues: { amount: number | null }[][];
  expenses: { amount: number | null }[][];
}

export interface ShopAccountEntryResponse {
  headers: string[];
  revenues: { amount: number | null }[][];
  expenses: { amount: number | null }[][];
}
