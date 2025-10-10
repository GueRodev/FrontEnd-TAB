/**
 * API Configuration
 * Laravel backend connection settings and routes
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
