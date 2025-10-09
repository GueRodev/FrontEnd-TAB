/**
 * API Configuration
 * Central configuration for API client
 */

export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 30000,
  withCredentials: true,
} as const;
