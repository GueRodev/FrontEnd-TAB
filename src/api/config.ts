/**
 * API Configuration
 * Laravel backend connection settings and routes
 */

import { ENV } from "@/config/env.config";

// ============================================
// API Configuration - Connection Settings
// ============================================

export const API_CONFIG = {
  baseURL: ENV.API_URL,
  timeout: ENV.API_TIMEOUT,
  useAPI: ENV.USE_API,

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
} as const;

// ============================================
// API Routes - Endpoint Definitions
// ============================================

export const API_ROUTES = {
  // ========================================
  // AUTHENTICATION
  // ========================================
  auth: {
    register: "/v1/auth/register",
    login: "/v1/auth/login",
    logout: "/v1/auth/logout",
    logoutAll: "/v1/auth/logout-all",
    me: "/v1/auth/me",
  },

  // ========================================
  // PROFILE
  // ========================================
  profile: "/v1/profile", // GET, PUT

  // ========================================
  // PRODUCTS
  // ========================================
  products: {
    base: "/v1/products",
    featured: "/v1/products/featured",
    byId: (id: string | number) => `/v1/products/${id}`, // GET, PUT, DELETE (soft delete)
    stock: (id: string | number) => `/v1/products/${id}/stock`,
    restore: (id: string | number) => `/v1/products/${id}/restore`,
    forceDelete: (id: string | number) => `/v1/products/${id}/force`,
  },

  // ========================================
  // CATEGORIES
  // ========================================
  categories: {
    base: "/v1/categories",
    byId: (id: string | number) => `/v1/categories/${id}`, // GET, PUT, DELETE (soft delete)
    reorder: "/v1/categories/reorder",
    restore: (id: string | number) => `/v1/categories/${id}/restore`,
    forceDelete: (id: string | number) => `/v1/categories/${id}/force`,
  },

  // ========================================
  // ORDERS - CLIENT
  // ========================================
  orders: {
    base: "/v1/orders", // GET (list), POST (create)
    byId: (id: string | number) => `/v1/orders/${id}`, // GET (show)
  },

  // ========================================
  // ORDERS - ADMIN
  // ========================================
  adminOrders: {
    base: "/v1/admin/orders", // GET (list), POST (create)
    byId: (id: string | number) => `/v1/admin/orders/${id}`, // GET, DELETE (soft delete)
    markInProgress: (id: string | number) => `/v1/admin/orders/${id}/mark-in-progress`,
    complete: (id: string | number) => `/v1/admin/orders/${id}/complete`,
    cancel: (id: string | number) => `/v1/admin/orders/${id}/cancel`,
    archive: (id: string | number) => `/v1/admin/orders/${id}/archive`,
  },

  // ========================================
  // ADDRESSES - CLIENT
  // ========================================
  addresses: {
    base: "/v1/addresses", // GET (list), POST (create)
    byId: (id: string | number) => `/v1/addresses/${id}`, // GET, PUT, DELETE (soft delete)
    setDefault: (id: string | number) => `/v1/addresses/${id}/set-default`,
  },

  // ========================================
  // ADDRESSES - ADMIN (Read-only)
  // ========================================
  adminAddresses: {
    base: "/v1/admin/addresses", // GET (list)
    byId: (id: string | number) => `/v1/admin/addresses/${id}`, // GET (show)
    byUserId: (userId: string | number) => `/v1/admin/users/${userId}/addresses`,
  },

  // ========================================
  // USERS - ADMIN MANAGEMENT
  // ========================================
  users: {
    base: "/v1/users", // GET (list), POST (create)
    byId: (id: string | number) => `/v1/users/${id}`, // GET, PUT/PATCH, DELETE (soft delete)
  },

  // ========================================
  // LOCATIONS (Costa Rica)
  // ========================================
  locations: {
    costaRica: "/v1/locations/cr",
  },

  // ========================================
  // TEST (Development only)
  // ========================================
  test: {
    email: "/test-email",
  },
} as const;

export type ApiRoute = (typeof API_ROUTES)[keyof typeof API_ROUTES];
