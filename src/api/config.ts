/**
 * API Configuration
 * Laravel backend connection settings and routes
 */

import { ENV } from '@/config/env.config';

// ============================================
// API Configuration - Connection Settings
// ============================================

export const API_CONFIG = {
  baseURL: ENV.API_URL,
  timeout: ENV.API_TIMEOUT,
  useAPI: ENV.USE_API,
  
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
} as const;

// ============================================
// API Routes - Endpoint Definitions
// ============================================

export const API_ROUTES = {
  // Products
  products: "/v1/products",
  
  // Categories
  categories: "/v1/categories",
  
  // Orders
  orders: "/v1/orders",
  
  // Authentication
  auth: "/v1/auth",
  login: "/v1/auth/login",
  register: "/v1/auth/register",
  logout: "/v1/auth/logout",
  logoutAll: "/v1/auth/logout-all",
  me: "/v1/auth/me",
  refresh: "/v1/auth/refresh",
  profile: "/v1/auth/profile",
  
  // Users
  users: "/v1/users",
  clients: "/v1/users/clients",
  admins: "/v1/users/admins",
  
  // Addresses
  addresses: "/v1/addresses",
} as const;

export type ApiRoute = typeof API_ROUTES[keyof typeof API_ROUTES];
