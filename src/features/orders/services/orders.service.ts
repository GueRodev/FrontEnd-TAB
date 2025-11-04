/**
 * Orders Service
 * API service for managing orders
 */

import { localStorageAdapter } from '@/lib/storage';
import type { Order, OrderStatus, OrderType } from '../types';
import type { ApiResponse } from '@/api/types';

const STORAGE_KEY = 'orders';

/**
 * Get all orders
 */
const getAll = async (): Promise<Order[]> => {
  const orders = localStorageAdapter.getItem<Order[]>(STORAGE_KEY) || [];
  return orders;
};

/**
 * Get order by ID
 */
const getById = async (id: string): Promise<Order | null> => {
  const orders = await getAll();
  return orders.find(order => order.id === id) || null;
};

/**
 * Get orders by type
 */
const getByType = async (type: OrderType): Promise<Order[]> => {
  const orders = await getAll();
  return orders.filter(order => order.type === type && !order.archived);
};

/**
 * Get archived orders
 */
const getArchived = async (): Promise<Order[]> => {
  const orders = await getAll();
  return orders.filter(order => order.archived);
};

/**
 * Create new order
 */
const create = async (
  data: Omit<Order, 'id' | 'createdAt'>
): Promise<ApiResponse<Order>> => {
  try {
    const orders = await getAll();
    
    const newOrder: Order = {
      ...data,
      id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };

    const updatedOrders = [newOrder, ...orders];
    localStorageAdapter.setItem(STORAGE_KEY, updatedOrders);

    return {
      data: newOrder,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Error al crear el pedido');
  }
};

/**
 * Update order status
 */
const updateStatus = async (
  id: string,
  status: OrderStatus
): Promise<ApiResponse<Order>> => {
  try {
    const orders = await getAll();
    const orderIndex = orders.findIndex(o => o.id === id);

    if (orderIndex === -1) {
      throw new Error('Pedido no encontrado');
    }

    orders[orderIndex] = {
      ...orders[orderIndex],
      status,
    };

    localStorageAdapter.setItem(STORAGE_KEY, orders);

    return {
      data: orders[orderIndex],
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error updating order status:', error);
    throw new Error('Error al actualizar el estado del pedido');
  }
};

/**
 * Archive order
 */
const archive = async (id: string): Promise<ApiResponse<Order>> => {
  try {
    const orders = await getAll();
    const orderIndex = orders.findIndex(o => o.id === id);

    if (orderIndex === -1) {
      throw new Error('Pedido no encontrado');
    }

    orders[orderIndex] = {
      ...orders[orderIndex],
      archived: true,
      archivedAt: new Date().toISOString(),
    };

    localStorageAdapter.setItem(STORAGE_KEY, orders);

    return {
      data: orders[orderIndex],
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error archiving order:', error);
    throw new Error('Error al archivar el pedido');
  }
};

/**
 * Unarchive order
 */
const unarchive = async (id: string): Promise<ApiResponse<Order>> => {
  try {
    const orders = await getAll();
    const orderIndex = orders.findIndex(o => o.id === id);

    if (orderIndex === -1) {
      throw new Error('Pedido no encontrado');
    }

    orders[orderIndex] = {
      ...orders[orderIndex],
      archived: false,
      archivedAt: undefined,
    };

    localStorageAdapter.setItem(STORAGE_KEY, orders);

    return {
      data: orders[orderIndex],
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error unarchiving order:', error);
    throw new Error('Error al restaurar el pedido');
  }
};

/**
 * Delete order
 */
const deleteOrder = async (id: string): Promise<ApiResponse<void>> => {
  try {
    const orders = await getAll();
    const filteredOrders = orders.filter(order => order.id !== id);

    if (orders.length === filteredOrders.length) {
      throw new Error('Pedido no encontrado');
    }

    localStorageAdapter.setItem(STORAGE_KEY, filteredOrders);

    return {
      data: undefined as void,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error deleting order:', error);
    throw new Error('Error al eliminar el pedido');
  }
};

export const ordersService = {
  getAll,
  getById,
  getByType,
  getArchived,
  create,
  updateStatus,
  archive,
  unarchive,
  delete: deleteOrder,
};
