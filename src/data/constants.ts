/**
 * Application Constants
 * Centralized configuration and storage keys
 */

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

export const API_CONFIG = {
  baseURL: "http://localhost:8000/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
} as const;
