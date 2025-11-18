/**
 * API Client
 * Bearer Token-based HTTP client for Laravel backend integration
 * Authentication via Authorization: Bearer {token} header
 */

import type { ApiRequestConfig, ApiClientConfig } from './types';
import { API_CONFIG, STORAGE_KEYS } from '@/config';

/**
 * Default API client configuration
 */
const defaultConfig: ApiClientConfig = {
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
};

/**
 * Simple fetch-based API client
 * Replace with axios if needed for more features
 */
class ApiClient {
  private config: ApiClientConfig;

  constructor(config: ApiClientConfig = defaultConfig) {
    this.config = { ...defaultConfig, ...config };
  }

  /**
   * Make HTTP request with Bearer Token authentication
   */
  async request<T>(config: ApiRequestConfig): Promise<T> {

    const url = `${this.config.baseURL}${config.url}`;
    
    const requestInit: RequestInit = {
      method: config.method,
      headers: {
        ...this.config.headers,
        ...config.headers,
      },
      credentials: 'omit',
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

      // Handle HTTP errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Handle specific HTTP errors
        switch (response.status) {
          case 401:
            // Unauthorized - Clear session and redirect to auth
            localStorage.removeItem(STORAGE_KEYS.authUser);
            localStorage.removeItem(STORAGE_KEYS.authToken);
            this.removeAuthToken();
            window.location.href = '/auth';
            throw new Error(errorData.message || 'No autorizado. Por favor inicia sesión.');
          
          case 403:
            // Forbidden - No permissions
            throw new Error(errorData.message || 'No tienes permisos para realizar esta acción.');
          
          case 404:
            // Not found
            throw new Error(errorData.message || 'Recurso no encontrado.');
          
          case 422:
            // Validation error (Laravel)
            const validationErrors = errorData.errors || {};
            const errorMessages = Object.values(validationErrors)
              .flat()
              .filter(Boolean)
              .join(', ');
            
            const validationError = new Error(
              errorMessages || errorData.message || 'Error de validación. Verifica los datos enviados.'
            ) as any;
            validationError.errors = validationErrors;
            validationError.status = 422;
            throw validationError;
          
          case 500:
            // Server error
            throw new Error(errorData.message || 'Error del servidor. Por favor intenta más tarde.');
          
          default:
            throw new Error(errorData.message || `Error HTTP: ${response.status}`);
        }
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
 */
export const apiClient = new ApiClient();

/**
 * Export for custom instances
 */
export { ApiClient };
