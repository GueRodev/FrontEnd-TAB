/**
 * Order-related types
 * Centralized types for orders and order items
 */

export type OrderStatus = 'pending' | 'completed' | 'cancelled';
export type OrderType = 'online' | 'in-store';
export type DeliveryOption = 'pickup' | 'delivery';

export interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  province?: string;
  canton?: string;
  district?: string;
  address?: string;
}

export interface Order {
  id: string;
  type: OrderType;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  createdAt: string;
  customerInfo: CustomerInfo;
  deliveryOption?: DeliveryOption;
  paymentMethod?: string;
  archived?: boolean;
  archivedAt?: string;
}
