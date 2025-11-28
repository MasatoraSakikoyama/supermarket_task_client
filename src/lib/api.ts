/**
 * API Client for the Supermarket Task Server
 *
 * This module provides API call functions for interacting with the FastAPI backend.
 * It supports all endpoints including authentication, shops, and shop settlements.
 */

import type {
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
} from "./types";

// Re-export types for convenience
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
};

/**
 * API Client Configuration
 */
interface ApiClientConfig {
  baseUrl: string;
  accessToken?: string;
}

/**
 * API Error class for handling HTTP errors
 */
export class ApiError extends Error {
  status: number;
  detail: string;

  constructor(status: number, detail: string) {
    super(detail);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}

/**
 * API Client class for making requests to the Supermarket Task Server
 */
export class ApiClient {
  private baseUrl: string;
  private accessToken?: string;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, "");
    this.accessToken = config.accessToken;
  }

  /**
   * Set the access token for authenticated requests
   */
  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  /**
   * Clear the access token
   */
  clearAccessToken(): void {
    this.accessToken = undefined;
  }

  /**
   * Get authorization headers if token is set
   */
  private getAuthHeaders(): Record<string, string> {
    if (this.accessToken) {
      return { Authorization: `Bearer ${this.accessToken}` };
    }
    return {};
  }

  /**
   * Generic request method
   */
  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    requiresAuth = true
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(requiresAuth ? this.getAuthHeaders() : {}),
    };

    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      let detail = "An error occurred";
      try {
        const errorData = (await response.json()) as { detail?: string };
        detail = errorData.detail || detail;
      } catch {
        // Ignore JSON parse errors
      }
      throw new ApiError(response.status, detail);
    }

    // For 204 No Content responses
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  }

  // ==================== Auth Endpoints ====================

  /**
   * Register a new account
   * POST /auth/register
   */
  async register(data: AccountCreate): Promise<AccountResponse> {
    return this.request<AccountResponse>("POST", "/auth/register", data, false);
  }

  /**
   * Login and get access token
   * POST /auth/login
   */
  async login(data: LoginRequest): Promise<TokenResponse> {
    const response = await this.request<TokenResponse>(
      "POST",
      "/auth/login",
      data,
      false
    );
    // Automatically set the access token on successful login
    if (response.access_token) {
      this.setAccessToken(response.access_token);
    }
    return response;
  }

  /**
   * Logout and invalidate token
   * POST /auth/logout
   */
  async logout(): Promise<void> {
    await this.request<void>("POST", "/auth/logout");
    this.clearAccessToken();
  }

  /**
   * Get current account information
   * GET /auth/me
   */
  async getMe(): Promise<AccountResponse> {
    return this.request<AccountResponse>("GET", "/auth/me");
  }

  // ==================== Shop Endpoints ====================

  /**
   * Get all shops with pagination
   * GET /shops
   */
  async getShops(skip = 0, limit = 100): Promise<ShopResponse[]> {
    return this.request<ShopResponse[]>(
      "GET",
      `/shops?skip=${skip}&limit=${limit}`
    );
  }

  /**
   * Get a single shop by ID
   * GET /shops/{shop_id}
   */
  async getShop(shopId: number): Promise<ShopResponse> {
    return this.request<ShopResponse>("GET", `/shops/${shopId}`);
  }

  /**
   * Create a new shop
   * POST /shops
   */
  async createShop(data: ShopCreate): Promise<ShopResponse> {
    return this.request<ShopResponse>("POST", "/shops", data);
  }

  /**
   * Update an existing shop
   * PUT /shops/{shop_id}
   */
  async updateShop(shopId: number, data: ShopUpdate): Promise<ShopResponse> {
    return this.request<ShopResponse>("PUT", `/shops/${shopId}`, data);
  }

  /**
   * Delete a shop
   * DELETE /shops/{shop_id}
   */
  async deleteShop(shopId: number): Promise<void> {
    return this.request<void>("DELETE", `/shops/${shopId}`);
  }

  // ==================== Shop Settlement Endpoints ====================

  /**
   * Get all settlements for a shop with pagination
   * GET /shops/{shop_id}/settlements
   */
  async getShopSettlements(
    shopId: number,
    skip = 0,
    limit = 100
  ): Promise<ShopSettlementResponse[]> {
    return this.request<ShopSettlementResponse[]>(
      "GET",
      `/shops/${shopId}/settlements?skip=${skip}&limit=${limit}`
    );
  }

  /**
   * Get a single settlement by ID for a shop
   * GET /shops/{shop_id}/settlements/{settlement_id}
   */
  async getShopSettlement(
    shopId: number,
    settlementId: number
  ): Promise<ShopSettlementResponse> {
    return this.request<ShopSettlementResponse>(
      "GET",
      `/shops/${shopId}/settlements/${settlementId}`
    );
  }

  /**
   * Create a new settlement for a shop
   * POST /shops/{shop_id}/settlements
   */
  async createShopSettlement(
    shopId: number,
    data: ShopSettlementCreate
  ): Promise<ShopSettlementResponse> {
    return this.request<ShopSettlementResponse>(
      "POST",
      `/shops/${shopId}/settlements`,
      data
    );
  }

  /**
   * Update an existing settlement for a shop
   * PUT /shops/{shop_id}/settlements/{settlement_id}
   */
  async updateShopSettlement(
    shopId: number,
    settlementId: number,
    data: ShopSettlementUpdate
  ): Promise<ShopSettlementResponse> {
    return this.request<ShopSettlementResponse>(
      "PUT",
      `/shops/${shopId}/settlements/${settlementId}`,
      data
    );
  }

  /**
   * Delete a settlement for a shop
   * DELETE /shops/{shop_id}/settlements/{settlement_id}
   */
  async deleteShopSettlement(
    shopId: number,
    settlementId: number
  ): Promise<void> {
    return this.request<void>(
      "DELETE",
      `/shops/${shopId}/settlements/${settlementId}`
    );
  }
}

/**
 * Create a new API client instance
 */
export function createApiClient(
  baseUrl: string,
  accessToken?: string
): ApiClient {
  return new ApiClient({ baseUrl, accessToken });
}

// Default export for convenience
export default ApiClient;
