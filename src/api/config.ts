/**
 * API Configuration
 * Laravel backend connection settings and routes
 * 
 * ⚠️ IMPORTANTE: Este archivo lee de ENV (src/config/env.config.ts)
 */

import { ENV } from '@/config/env.config';

// ============================================
// API Configuration - Connection Settings
// ============================================

export const API_CONFIG = {
  baseURL: ENV.API_URL,
  timeout: ENV.API_TIMEOUT,
  useAPI: ENV.USE_API,
  environment: ENV.APP_ENV,
  debug: ENV.DEBUG,
  
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

export type ApiRoute = typeof API_ROUTES[keyof typeof API_ROUTES];

// ============================================
// API URL Builder Helper
// ============================================

/**
 * Build full API URL with query parameters
 * 
 * @param route - API route from API_ROUTES
 * @param params - Query parameters (optional)
 * @returns Full URL with query string
 * 
 * @example
 * // Simple route
 * buildApiUrl('/products')
 * // => 'http://localhost:8000/api/products'
 * 
 * @example
 * // With query params
 * buildApiUrl('/products', { category: 'electronics', limit: 10 })
 * // => 'http://localhost:8000/api/products?category=electronics&limit=10'
 */
export function buildApiUrl(route: string, params?: Record<string, any>): string {
  const baseUrl = API_CONFIG.baseURL;
  
  // Remove leading slash from route if present (baseURL already has it)
  const cleanRoute = route.startsWith('/') ? route.slice(1) : route;
  
  let url = `${baseUrl}/${cleanRoute}`;
  
  // Add query parameters if provided
  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }
  
  return url;
}

/**
 * Validate environment configuration
 * Throws error if required variables are missing
 */
function validateEnvVars(): void {
  if (!ENV.API_URL) {
    throw new Error(
      '[API] VITE_API_URL no está definida en .env. ' +
      'Por favor configura la URL del backend Laravel.'
    );
  }

  // Validate URL format
  try {
    new URL(ENV.API_URL);
  } catch {
    throw new Error(
      `[API] VITE_API_URL no es una URL válida: ${ENV.API_URL}`
    );
  }

  // Warn if using localhost in production
  if (ENV.IS_PROD && ENV.API_URL.includes('localhost')) {
    console.warn(
      '⚠️ [API] Estás usando localhost en producción. ' +
      'Asegúrate de actualizar VITE_API_URL en .env'
    );
  }
}

// Run validation
validateEnvVars();

// ============================================
// Debug Logging (Development Only)
// ============================================

if (ENV.IS_DEV && ENV.DEBUG) {
  console.group('🌐 API Configuration');
  console.log('Base URL:', API_CONFIG.baseURL);
  console.log('Timeout:', `${API_CONFIG.timeout}ms`);
  console.log('Use API:', API_CONFIG.useAPI ? '✅ Enabled' : '❌ Disabled (using localStorage)');
  console.log('Environment:', API_CONFIG.environment);
  
  // Log example URLs
  console.log('\n📝 Example URLs:');
  console.log('  Products:', buildApiUrl(API_ROUTES.products));
  console.log('  Products with params:', buildApiUrl(API_ROUTES.products, { category: 'electronics', limit: 10 }));
  console.log('  Login:', buildApiUrl(API_ROUTES.login));
  
  console.groupEnd();
}
