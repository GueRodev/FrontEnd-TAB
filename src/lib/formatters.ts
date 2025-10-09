/**
 * Formatting Utilities
 * Centralized functions for consistent data formatting
 */

import { APP_CONFIG } from '@/data/constants';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Format currency using app configuration
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat(APP_CONFIG.currency.locale, {
    style: 'currency',
    currency: APP_CONFIG.currency.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format currency with custom symbol (for compatibility)
 */
export const formatPrice = (amount: number): string => {
  return `${APP_CONFIG.currency.symbol}${amount.toFixed(2)}`;
};

/**
 * Format date with customizable format string
 */
export const formatDate = (date: string | Date, formatString: string = 'PPP'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatString, { locale: es });
};

/**
 * Format date as short date (dd/MM/yyyy)
 */
export const formatShortDate = (date: string | Date): string => {
  return formatDate(date, 'dd/MM/yyyy');
};

/**
 * Format date with time (dd/MM/yyyy HH:mm)
 */
export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, 'dd/MM/yyyy HH:mm');
};

/**
 * Format phone number with country code
 */
export const formatPhoneNumber = (phone: string, includeCountryCode: boolean = false): string => {
  if (!phone) return '';
  
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (includeCountryCode) {
    return `${APP_CONFIG.whatsapp.countryCode} ${cleanPhone}`;
  }
  
  return cleanPhone;
};

/**
 * Format number with thousand separators
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat(APP_CONFIG.currency.locale).format(num);
};
