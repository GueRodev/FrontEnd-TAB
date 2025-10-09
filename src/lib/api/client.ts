/**
 * API Client
 * HTTP client configuration for API requests
 * 
 * @next-migration: Will be configured with actual backend URL
 * Currently prepared but not active - data comes from localStorage
 */

import type { ApiRequestConfig, ApiClientConfig } from './types';

/**
 * Default API client configuration
 * @next-migration: Update baseURL with actual backend endpoint
 */
const defaultConfig: ApiClientConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
};

/**
 * Simple fetch-based API client
 * Replace with axios if needed for more features
 * 
 * @next-migration: Can use Next.js fetch with revalidation options
 */
class ApiClient {
  private config: ApiClientConfig;

  constructor(config: ApiClientConfig = defaultConfig) {
    this.config = { ...defaultConfig, ...config };
  }

  /**
   * Make HTTP request
   */
  async request<T>(config: ApiRequestConfig): Promise<T> {
    const url = `${this.config.baseURL}${config.url}`;
    
    const requestInit: RequestInit = {
      method: config.method,
      headers: {
        ...this.config.headers,
        ...config.headers,
      },
      credentials: this.config.withCredentials ? 'include' : 'omit',
    };

    // Add body for non-GET requests
    if (config.data && config.method !== 'GET') {
      requestInit.body = JSON.stringify(config.data);
    }

    // Add query params
    const searchParams = new URLSearchParams(config.params);
    const urlWithParams = config.params 
      ? `${url}?${searchParams.toString()}` 
      : url;

    try {
      const response = await fetch(urlWithParams, requestInit);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  /**
   * GET request
   */
  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    return this.request<T>({ method: 'GET', url, params });
  }

  /**
   * POST request
   */
  async post<T>(url: string, data?: any): Promise<T> {
    return this.request<T>({ method: 'POST', url, data });
  }

  /**
   * PUT request
   */
  async put<T>(url: string, data?: any): Promise<T> {
    return this.request<T>({ method: 'PUT', url, data });
  }

  /**
   * PATCH request
   */
  async patch<T>(url: string, data?: any): Promise<T> {
    return this.request<T>({ method: 'PATCH', url, data });
  }

  /**
   * DELETE request
   */
  async delete<T>(url: string): Promise<T> {
    return this.request<T>({ method: 'DELETE', url });
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string) {
    this.config.headers = {
      ...this.config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  /**
   * Remove authentication token
   */
  removeAuthToken() {
    const { Authorization, ...restHeaders } = this.config.headers || {};
    this.config.headers = restHeaders;
  }
}

/**
 * Export singleton instance
 * @next-migration: Will be configured with environment variables
 */
export const apiClient = new ApiClient();

/**
 * Export for custom instances
 */
export { ApiClient };
