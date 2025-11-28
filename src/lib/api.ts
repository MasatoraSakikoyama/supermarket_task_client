/**
 * Web API utility functions for making HTTP requests
 */

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
