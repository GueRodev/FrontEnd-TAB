/**
 * Application Configuration
 * Business settings, storage keys, and app constants
 * 
 * ⚠️ IMPORTANTE: Este archivo lee de ENV (src/config/env.config.ts)
 */

import { ENV } from './env.config';

// ============================================
// Application Configuration - Business Settings
// ============================================

export const APP_CONFIG = {
  name: ENV.APP_NAME,
  description: ENV.APP_DESCRIPTION,
  environment: ENV.APP_ENV,
  debug: ENV.DEBUG,
  useAPI: ENV.USE_API,
  
  whatsapp: {
    phoneNumber: ENV.WHATSAPP_NUMBER,
    countryCode: ENV.WHATSAPP_COUNTRY_CODE,
    
    /**
     * Build WhatsApp chat URL with pre-filled message
     * @param message - Message to pre-fill (will be URL encoded)
     * @returns WhatsApp URL ready to open
     * 
     * @example
     * const url = APP_CONFIG.whatsapp.buildChatUrl('Hola! Tengo una consulta');
     * window.open(url, '_blank');
     */
    buildChatUrl: (message: string): string => {
      const cleanNumber = ENV.WHATSAPP_NUMBER.replace(/\D/g, '');
      const encodedMessage = encodeURIComponent(message);
      return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
    },
  },
  
  currency: {
    code: ENV.CURRENCY_CODE,
    symbol: ENV.CURRENCY_SYMBOL,
    locale: ENV.CURRENCY_LOCALE,
  },
  
  shipping: {
    cost: ENV.SHIPPING_COST,
    freeThreshold: ENV.FREE_SHIPPING_THRESHOLD,
    
    /**
     * Calculate shipping cost based on order total
     * @param orderTotal - Total amount of the order
     * @returns Shipping cost (0 if order >= freeThreshold)
     */
    calculateCost: (orderTotal: number): number => {
      return orderTotal >= ENV.FREE_SHIPPING_THRESHOLD ? 0 : ENV.SHIPPING_COST;
    },
    
    /**
     * Check if order qualifies for free shipping
     */
    isFreeShipping: (orderTotal: number): boolean => {
      return orderTotal >= ENV.FREE_SHIPPING_THRESHOLD;
    },
  },
  
  pagination: {
    defaultPageSize: ENV.PAGINATION_DEFAULT_SIZE,
    maxPageSize: ENV.PAGINATION_MAX_SIZE,
  },
} as const;

// ============================================
// Storage Keys - LocalStorage Identifiers
// ============================================

export const STORAGE_KEYS = {
  // Auth
  authToken: 'auth_token',
  authUser: 'auth_user',
  
  // Data
  products: 'products',
  categories: 'categories',
  cart: 'cart',
  wishlist: 'wishlist',
  orders: 'orders',
  notifications: 'notifications',
  user: 'user',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

// ============================================
// Payment & Delivery Options
// ============================================

export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Efectivo' },
  { value: 'card', label: 'Tarjeta' },
  { value: 'transfer', label: 'Transferencia' },
  { value: 'sinpe', label: 'SINPE Móvil' },
] as const;

export type PaymentMethod = typeof PAYMENT_METHODS[number]['value'];

export const DELIVERY_OPTIONS = [
  { value: 'pickup', label: 'Recoger en tienda' },
  { value: 'delivery', label: 'Envío' },
] as const;

export type DeliveryOption = typeof DELIVERY_OPTIONS[number]['value'];

// ============================================
// File Upload Configuration
// ============================================

export const FILE_UPLOAD_CONFIG = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
} as const;

// ============================================
// Debug Logging (Development Only)
// ============================================

if (ENV.IS_DEV && ENV.DEBUG) {
  console.group('⚙️ App Configuration');
  console.log('Name:', APP_CONFIG.name);
  console.log('Use API:', APP_CONFIG.useAPI);
  console.log('WhatsApp:', `${APP_CONFIG.whatsapp.countryCode}${APP_CONFIG.whatsapp.phoneNumber}`);
  console.log('Shipping Cost:', `${APP_CONFIG.currency.symbol}${APP_CONFIG.shipping.cost}`);
  console.log('Free Shipping Threshold:', `${APP_CONFIG.currency.symbol}${APP_CONFIG.shipping.freeThreshold}`);
  console.groupEnd();
}
