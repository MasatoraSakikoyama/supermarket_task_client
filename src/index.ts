/**
 * Supermarket Task Client
 *
 * A TypeScript client library for interacting with the Supermarket Task Server API.
 */

// Export API client
export { ApiClient, ApiError, createApiClient } from "./lib/api";

// Export types
export type {
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
} from "./lib/api";

// Export types from types module
export type {
  AccountBase,
  ShopBase,
  ShopSettlementBase,
  APIError,
  HTTPValidationError,
  ValidationError,
} from "./lib/types";

// Default export
export { default } from "./lib/api";
