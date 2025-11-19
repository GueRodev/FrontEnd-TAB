/**
 * Configuration Module Exports
 * Centralized exports for all configuration
 */

// Environment (debe importarse primero)
export { ENV, type EnvConfig, type AppEnvironment } from './env.config';

// Application Config
export {
  APP_CONFIG,
  PAYMENT_METHODS,
  DELIVERY_OPTIONS,
  FILE_UPLOAD_CONFIG,
  type StorageKey,
  type PaymentMethod,
  type DeliveryOption,
} from './app.config';

// API Layer Re-exports (from simplified API layer)
export { api, API_BASE_URL, API_ENDPOINTS, STORAGE_KEYS } from '@/api';
