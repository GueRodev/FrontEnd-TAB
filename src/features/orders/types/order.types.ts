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

export interface DeliveryAddress {
  label: string;
  province: string;
  canton: string;
  district: string;
  address: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email?: string; // Optional email for in-store receipts/notifications
  // Address fields removed - now using delivery_address snapshot
}

export interface Order {
  id: string;
  user_id?: string; // Optional now, required when connected to backend
  type: OrderType;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  createdAt: string;
  customerInfo: CustomerInfo;
  delivery_address?: DeliveryAddress; // Snapshot of address at order time
  deliveryOption?: DeliveryOption;
  paymentMethod?: string;
  archived?: boolean;
  archivedAt?: string;
}
