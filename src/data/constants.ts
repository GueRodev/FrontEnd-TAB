/**
 * Application Constants
 * Centralized configuration and storage keys
 */

// ============================================
// API Configuration - Connection Settings
// ============================================
export const API_CONFIG = {
  baseURL: "http://localhost:8000/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
} as const;

// ============================================
// API Routes - Endpoint Definitions
// ============================================
export const API_ROUTES = {
  // Productos
  products: "/products",
  
  // Categorías
  categories: "/categories",
  
  // Órdenes
  orders: "/orders",
  
  // Autenticación
  auth: "/auth",
  login: "/auth/login",
  register: "/auth/register",
  logout: "/auth/logout",
  refresh: "/auth/refresh",
  
  // Usuarios y administradores
  users: "/users",
  clients: "/users/clients",
  admins: "/users/admins",
  
  // Direcciones
  addresses: "/addresses",
} as const;

// ============================================
// Application Configuration - Business Settings
// ============================================
export const APP_CONFIG = {
  name: "E-Commerce",
  description: "Tu tienda online de confianza",
  whatsapp: {
    phoneNumber: "89176111",
    countryCode: "+506",
  },
  currency: {
    code: "CRC",
    symbol: "₡",
    locale: "es-CR",
  },
  pagination: {
    defaultPageSize: 12,
    maxPageSize: 100,
  },
} as const;

// ============================================
// Storage Keys - LocalStorage Identifiers
// ============================================
export const STORAGE_KEYS = {
  products: "products",
  categories: "categories",
  cart: "cart",
  wishlist: "wishlist",
  orders: "orders",
  notifications: "notifications",
  user: "user",
} as const;

// ============================================
// Payment & Delivery Options
// ============================================
export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Efectivo' },
  { value: 'card', label: 'Tarjeta' },
  { value: 'transfer', label: 'Transferencia' },
  { value: 'sinpe', label: 'SINPE Móvil' },
] as const;

export const DELIVERY_OPTIONS = [
  { value: 'pickup', label: 'Recoger en tienda' },
  { value: 'delivery', label: 'Delivery' },
] as const;

// ============================================
// File Upload Configuration
// ============================================
export const FILE_UPLOAD_CONFIG = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
} as const;
