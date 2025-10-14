/**
 * Environment Configuration & Validation
 * Validates required environment variables and provides type-safe access
 * 
 * ⚠️ IMPORTANTE: Este archivo debe importarse ANTES de cualquier otro config
 */

// ============================================
// Environment Variable Types
// ============================================

export type AppEnvironment = 'development' | 'staging' | 'production';

export interface EnvConfig {
  // Environment
  APP_ENV: AppEnvironment;
  DEBUG: boolean;
  IS_DEV: boolean;
  IS_PROD: boolean;

  // Application
  APP_NAME: string;
  APP_DESCRIPTION: string;

  // API
  API_URL: string;
  API_TIMEOUT: number;
  USE_API: boolean;

  // WhatsApp
  WHATSAPP_NUMBER: string;
  WHATSAPP_COUNTRY_CODE: string;

  // Business
  SHIPPING_COST: number;
  FREE_SHIPPING_THRESHOLD: number;

  // Currency
  CURRENCY_CODE: string;
  CURRENCY_SYMBOL: string;
  CURRENCY_LOCALE: string;

  // Pagination
  PAGINATION_DEFAULT_SIZE: number;
  PAGINATION_MAX_SIZE: number;
}

// ============================================
// Validation Helpers
// ============================================

class EnvValidationError extends Error {
  constructor(message: string) {
    super(`[ENV] ${message}`);
    this.name = 'EnvValidationError';
  }
}

/**
 * Get environment variable with fallback
 */
function getEnv(key: string, fallback?: string): string {
  const value = import.meta.env[key];
  
  if (!value && !fallback) {
    throw new EnvValidationError(
      `Variable requerida '${key}' no está definida en .env`
    );
  }
  
  return value || fallback!;
}

/**
 * Get boolean environment variable
 */
function getEnvBoolean(key: string, fallback: boolean = false): boolean {
  const value = import.meta.env[key];
  
  if (!value) return fallback;
  
  return value === 'true' || value === '1';
}

/**
 * Get number environment variable
 */
function getEnvNumber(key: string, fallback?: number): number {
  const value = import.meta.env[key];
  
  if (!value && fallback === undefined) {
    throw new EnvValidationError(
      `Variable numérica requerida '${key}' no está definida en .env`
    );
  }
  
  const parsed = value ? Number(value) : fallback!;
  
  if (isNaN(parsed)) {
    throw new EnvValidationError(
      `Variable '${key}' debe ser un número válido. Valor actual: '${value}'`
    );
  }
  
  return parsed;
}

/**
 * Validate URL format
 */
function validateUrl(url: string, key: string): void {
  try {
    new URL(url);
  } catch {
    throw new EnvValidationError(
      `Variable '${key}' debe ser una URL válida. Valor actual: '${url}'`
    );
  }
}

/**
 * Validate WhatsApp number format
 */
function validateWhatsAppNumber(number: string): void {
  // Remove all non-digits
  const cleaned = number.replace(/\D/g, '');
  
  if (cleaned.length < 8 || cleaned.length > 15) {
    throw new EnvValidationError(
      `VITE_WHATSAPP_NUMBER debe tener entre 8 y 15 dígitos. Valor actual: '${number}'`
    );
  }
}

// ============================================
// Load and Validate Environment
// ============================================

/**
 * Load and validate all environment variables
 */
function loadEnvConfig(): EnvConfig {
  // Environment
  const appEnv = getEnv('VITE_APP_ENV', 'development') as AppEnvironment;
  const debug = getEnvBoolean('VITE_DEBUG', false);

  // API
  const apiUrl = getEnv('VITE_API_URL', 'http://localhost:8000/api');
  validateUrl(apiUrl, 'VITE_API_URL');

  // WhatsApp
  const whatsappNumber = getEnv('VITE_WHATSAPP_NUMBER');
  validateWhatsAppNumber(whatsappNumber);

  const config: EnvConfig = {
    // Environment
    APP_ENV: appEnv,
    DEBUG: debug,
    IS_DEV: appEnv === 'development',
    IS_PROD: appEnv === 'production',

    // Application
    APP_NAME: getEnv('VITE_APP_NAME', 'E-Commerce'),
    APP_DESCRIPTION: getEnv('VITE_APP_DESCRIPTION', 'Tu tienda online de confianza'),

    // API
    API_URL: apiUrl,
    API_TIMEOUT: getEnvNumber('VITE_API_TIMEOUT', 30000),
    USE_API: getEnvBoolean('VITE_USE_API', false),

    // WhatsApp
    WHATSAPP_NUMBER: whatsappNumber,
    WHATSAPP_COUNTRY_CODE: getEnv('VITE_WHATSAPP_COUNTRY_CODE', '+506'),

    // Business
    SHIPPING_COST: getEnvNumber('VITE_SHIPPING_COST', 2000),
    FREE_SHIPPING_THRESHOLD: getEnvNumber('VITE_FREE_SHIPPING_THRESHOLD', 50000),

    // Currency
    CURRENCY_CODE: getEnv('VITE_CURRENCY_CODE', 'CRC'),
    CURRENCY_SYMBOL: getEnv('VITE_CURRENCY_SYMBOL', '₡'),
    CURRENCY_LOCALE: getEnv('VITE_CURRENCY_LOCALE', 'es-CR'),

    // Pagination
    PAGINATION_DEFAULT_SIZE: getEnvNumber('VITE_PAGINATION_DEFAULT_SIZE', 12),
    PAGINATION_MAX_SIZE: getEnvNumber('VITE_PAGINATION_MAX_SIZE', 100),
  };

  return config;
}

// ============================================
// Export Validated Config
// ============================================

let ENV: EnvConfig;

try {
  ENV = loadEnvConfig();
  
  // Log config in development with DEBUG=true
  if (ENV.IS_DEV && ENV.DEBUG) {
    console.group('🔧 Environment Configuration');
    console.log('Environment:', ENV.APP_ENV);
    console.log('Debug Mode:', ENV.DEBUG);
    console.log('Use API:', ENV.USE_API);
    console.log('API URL:', ENV.API_URL);
    console.log('WhatsApp:', `${ENV.WHATSAPP_COUNTRY_CODE}${ENV.WHATSAPP_NUMBER}`);
    console.log('Shipping Cost:', `${ENV.CURRENCY_SYMBOL}${ENV.SHIPPING_COST}`);
    console.log('Free Shipping Threshold:', `${ENV.CURRENCY_SYMBOL}${ENV.FREE_SHIPPING_THRESHOLD}`);
    console.groupEnd();
  }
} catch (error) {
  if (error instanceof EnvValidationError) {
    console.error('❌ Error de configuración:', error.message);
    console.error('👉 Revisa tu archivo .env y asegúrate de que todas las variables requeridas estén definidas.');
    console.error('📄 Referencia: .env.example');
  }
  throw error;
}

export { ENV };
