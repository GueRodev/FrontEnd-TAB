/**
 * Orders Service
 * API service for order operations
 */

import type { Order, OrderStatus, OrderType } from '@/types/order.types';
import type { ApiResponse } from '../types';
import { localStorageAdapter } from '@/lib/storage';
import { STORAGE_KEYS } from '@/data/constants';

export const ordersService = {
  /**
   * Get all orders
   */
  async getAll(): Promise<Order[]> {
    return localStorageAdapter.getItem<Order[]>(STORAGE_KEYS.orders) || [];
  },

  /**
   * Get order by ID
   */
  async getById(id: string): Promise<Order | null> {
    const orders = await this.getAll();
    return orders.find(o => o.id === id) || null;
  },

  /**
   * Get orders by type
   */
  async getByType(type: OrderType): Promise<Order[]> {
    const orders = await this.getAll();
    return orders.filter(o => o.type === type && !o.archived);
  },

  /**
   * Get archived orders
   */
  async getArchived(): Promise<Order[]> {
    const orders = await this.getAll();
    return orders.filter(o => o.archivedAt);
  },

  /**
   * Create order
   * 🔗 CONEXIÓN LARAVEL:
   * 1. Descomentar: return apiClient.post('/orders', data);
   * 2. Eliminar líneas 56-67 (mock localStorage)
   * 3. Agregar user_id desde AuthContext si está autenticado
   * 4. Laravel debe retornar: { data: Order, message: string, timestamp: string }
   */
  async create(data: Omit<Order, 'id' | 'createdAt'>): Promise<ApiResponse<Order>> {
    // TODO: When user is authenticated, include user_id:
    // const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
    // const orderData = { ...data, user_id: user?.id };
    const orders = await this.getAll();
    const newOrder: Order = {
      ...data,
      id: `ORD-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    localStorageAdapter.setItem(STORAGE_KEYS.orders, [newOrder, ...orders]);
    
    return {
      data: newOrder,
      message: 'Order created successfully',
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Update order status
   */
  async updateStatus(id: string, status: OrderStatus): Promise<ApiResponse<Order>> {
    const orders = await this.getAll();
    const updatedOrders = orders.map(o => 
      o.id === id ? { ...o, status } : o
    );
    
    localStorageAdapter.setItem(STORAGE_KEYS.orders, updatedOrders);
    
    const updatedOrder = updatedOrders.find(o => o.id === id)!;
    
    return {
      data: updatedOrder,
      message: 'Order status updated successfully',
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Archive order
   */
  async archive(id: string): Promise<ApiResponse<Order>> {
    const orders = await this.getAll();
    const updatedOrders = orders.map(o =>
      o.id === id 
        ? { ...o, archived: true, archivedAt: new Date().toISOString() } 
        : o
    );
    
    localStorageAdapter.setItem(STORAGE_KEYS.orders, updatedOrders);
    
    const archivedOrder = updatedOrders.find(o => o.id === id)!;
    
    return {
      data: archivedOrder,
      message: 'Order archived successfully',
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Unarchive order
   */
  async unarchive(id: string): Promise<ApiResponse<Order>> {
    const orders = await this.getAll();
    const updatedOrders = orders.map(o =>
      o.id === id ? { ...o, archived: false } : o
    );
    
    localStorageAdapter.setItem(STORAGE_KEYS.orders, updatedOrders);
    
    const unarchivedOrder = updatedOrders.find(o => o.id === id)!;
    
    return {
      data: unarchivedOrder,
      message: 'Order unarchived successfully',
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Delete order
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    const orders = await this.getAll();
    const filteredOrders = orders.filter(o => o.id !== id);
    
    localStorageAdapter.setItem(STORAGE_KEYS.orders, filteredOrders);
    
    return {
      data: undefined as void,
      message: 'Order deleted successfully',
      timestamp: new Date().toISOString(),
    };
  },
};
