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
  created_at: string;
  updated_at: string;
}

// =============================================================================
// Shop Account Title Types
// =============================================================================

export interface ShopAccountTitleCreate {
  shop_id: number;
  type: AccountTitleType;
  sub_type?: AccountTitleSubType;
  code: string;
  name: string;
  order: number;
}

export interface ShopAccountTitleUpdate {
  id: number;
  shop_id: number;
  type?: AccountTitleType;
  sub_type?: AccountTitleSubType;
  code?: string;
  name?: string;
  order?: number;
}

export interface ShopAccountTitleResponse {
  id: number;
  shop_id: number;
  type: AccountTitleType;
  sub_type: AccountTitleSubType | null;
  code: string;
  name: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface ShopAccountTitleListResponse {
  revenues: ShopAccountTitleResponse[];
  expenses: ShopAccountTitleResponse[];
}

// =============================================================================
// Shop Account Entry Types
// =============================================================================

export interface ShopAccountEntryCreate {
  shop_id: number;
  shopp_account_title_id: number;
  year: number;
  month: number;
  amount: number;
}

export interface ShopAccountEntryUpdate {
  id: number;
  shop_id: number;
  shopp_account_title_id: number;
  year: number;
  month: number;
  amount: number;
}

export interface ShopAccountEntryResponse {
  id: number;
  shop_id: number;
  shopp_account_title_id: number;
  year: number;
  month: number;
  amount: number;
  created_at: string;
  updated_at: string;
}

export interface ShopAccountEntryListResponse {
  headers: string[];
  revenues: { amount: number | null }[][];
  expenses: { amount: number | null }[][];
}
