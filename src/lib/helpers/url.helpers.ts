/**
 * URL Helpers
 * Centralized helpers for building URLs (API, WhatsApp, etc.)
 */

import { APP_CONFIG } from '@/config/app.config';
import { buildApiUrl as apiBuildUrl } from '@/api/config';

// ============================================
// WhatsApp URL Builder
// ============================================

/**
 * Build WhatsApp chat URL with pre-filled message
 * 
 * @param message - Message to pre-fill
 * @param phoneNumber - Optional custom phone number (defaults to APP_CONFIG)
 * @returns WhatsApp chat URL
 * 
 * @example
 * // Using default phone from config
 * const url = buildWhatsAppUrl('Hola! Tengo una consulta sobre el producto X');
 * window.open(url, '_blank');
 * 
 * @example
 * // Using custom phone number
 * const url = buildWhatsAppUrl('Mensaje personalizado', '50612345678');
 */
export function buildWhatsAppUrl(message: string, phoneNumber?: string): string {
  const phone = phoneNumber || APP_CONFIG.whatsapp.phoneNumber;
  const cleanNumber = phone.replace(/\D/g, '');
  
  // Sanitize message (prevent injection, limit length)
  const sanitizedMessage = message.trim().slice(0, 1000);
  const encodedMessage = encodeURIComponent(sanitizedMessage);
  
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}

/**
 * Build WhatsApp URL for a new order notification
 * 
 * @param orderData - Order information
 * @returns WhatsApp URL with formatted order message
 */
export function buildWhatsAppOrderUrl(orderData: {
  orderId: string;
  customerName: string;
  total: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  deliveryOption?: string;
  address?: string;
}): string {
  let message = `*NUEVO PEDIDO #${orderData.orderId}*\n\n`;
  message += `👤 *Cliente:* ${orderData.customerName}\n`;
  message += `💰 *Total:* ${orderData.total}\n\n`;
  message += `📦 *Productos:*\n`;
  
  orderData.items.forEach((item, index) => {
    message += `${index + 1}. ${item.name} x${item.quantity} - ${APP_CONFIG.currency.symbol}${item.price}\n`;
  });
  
  if (orderData.deliveryOption) {
    message += `\n🚚 *Entrega:* ${orderData.deliveryOption}\n`;
  }
  
  if (orderData.address) {
    message += `📍 *Dirección:* ${orderData.address}\n`;
  }
  
  return buildWhatsAppUrl(message);
}

// ============================================
// API URL Builders (Re-export for convenience)
// ============================================

/**
 * Build full API URL with query parameters
 * Re-exported from @/api/config for convenience
 * 
 * @example
 * const url = buildApiUrl('/products', { category: 'electronics' });
 */
export const buildApiUrl = apiBuildUrl;

// ============================================
// General URL Helpers
// ============================================

/**
 * Add query parameters to any URL
 * 
 * @param baseUrl - Base URL
 * @param params - Query parameters
 * @returns URL with query string
 */
export function addQueryParams(baseUrl: string, params: Record<string, any>): string {
  const url = new URL(baseUrl);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });
  
  return url.toString();
}

/**
 * Parse query parameters from URL
 * 
 * @param url - URL or search string
 * @returns Object with query parameters
 */
export function parseQueryParams(url: string): Record<string, string> {
  const searchParams = new URLSearchParams(
    url.includes('?') ? url.split('?')[1] : url
  );
  
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  
  return params;
}
