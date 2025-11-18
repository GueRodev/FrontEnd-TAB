/**
 * Environment Configuration
 * Direct access to environment variables with inline fallbacks
 */

export type AppEnvironment = "development" | "staging" | "production";

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

  // Currency
  CURRENCY_CODE: string;
  CURRENCY_SYMBOL: string;
  CURRENCY_LOCALE: string;

  // Pagination
  PAGINATION_DEFAULT_SIZE: number;
  PAGINATION_MAX_SIZE: number;
}

const appEnv = (import.meta.env.VITE_APP_ENV || "development") as AppEnvironment;

export const ENV: EnvConfig = {
  // Environment
  APP_ENV: appEnv,
  DEBUG: import.meta.env.VITE_DEBUG === "true",
  IS_DEV: appEnv === "development",
  IS_PROD: appEnv === "production",

  // Application
  APP_NAME: import.meta.env.VITE_APP_NAME || "E-Commerce",
  APP_DESCRIPTION: import.meta.env.VITE_APP_DESCRIPTION || "Tu tienda online de confianza",

  // API
  API_URL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  API_TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
  USE_API: import.meta.env.VITE_USE_API === "true",

  // WhatsApp
  WHATSAPP_NUMBER: import.meta.env.VITE_WHATSAPP_NUMBER || "89176111",
  WHATSAPP_COUNTRY_CODE: import.meta.env.VITE_WHATSAPP_COUNTRY_CODE || "+506",

  // Currency
  CURRENCY_CODE: import.meta.env.VITE_CURRENCY_CODE || "CRC",
  CURRENCY_SYMBOL: import.meta.env.VITE_CURRENCY_SYMBOL || "₡",
  CURRENCY_LOCALE: import.meta.env.VITE_CURRENCY_LOCALE || "es-CR",

  // Pagination
  PAGINATION_DEFAULT_SIZE: Number(import.meta.env.VITE_PAGINATION_DEFAULT_SIZE) || 12,
  PAGINATION_MAX_SIZE: Number(import.meta.env.VITE_PAGINATION_MAX_SIZE) || 100,
};
