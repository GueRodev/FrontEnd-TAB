/**
 * Application Constants
 * Centralized configuration and storage keys
 */

export const APP_CONFIG = {
  name: "E-Commerce",
  description: "Tu tienda online de confianza",
  whatsapp: {
    phoneNumber: "1234567890", // Configure your WhatsApp number
    countryCode: "+52", // Configure your country code
  },
  currency: {
    code: "MXN",
    symbol: "$",
    locale: "es-MX",
  },
  pagination: {
    defaultPageSize: 12,
    maxPageSize: 100,
  },
} as const;

export const STORAGE_KEYS = {
  products: "products",
  categories: "categories",
  cart: "cart",
  wishlist: "wishlist",
  orders: "orders",
  notifications: "notifications",
  user: "user",
} as const;

export const API_ROUTES = {
  products: "/api/products",
  categories: "/api/categories",
  orders: "/api/orders",
  auth: "/api/auth",
} as const;
