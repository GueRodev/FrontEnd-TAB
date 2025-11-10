/**
 * Orders Service
 * API service for managing orders
 */

import { localStorageAdapter } from '@/lib/storage';
import type { Order, OrderStatus, OrderType } from '../types';
import type { ApiResponse } from '@/api/types';
import { APP_CONFIG } from '@/config/app.config';
import { apiClient } from '@/api/client';

const STORAGE_KEY = 'orders';

/**
 * Orders Service
 * 🔄 READY FOR LARAVEL: Toggle with VITE_USE_API=true in .env
 */

/**
 * Get all orders
 * 🔗 LARAVEL: GET /api/orders
 */
const getAll = async (): Promise<Order[]> => {
  if (APP_CONFIG.useAPI) {
    // Use Laravel API
    const response = await apiClient.get<ApiResponse<Order[]>>('/orders');
    return response.data;
  } else {
    // Use localStorage (development)
    const orders = localStorageAdapter.getItem<Order[]>(STORAGE_KEY) || [];
    return orders;
  }
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
 * 🔗 LARAVEL: POST /api/orders
 */
const create = async (
  data: Omit<Order, 'id' | 'createdAt'>
): Promise<ApiResponse<Order>> => {
  try {
    if (APP_CONFIG.useAPI) {
      // Use Laravel API
      return await apiClient.post<ApiResponse<Order>>('/orders', data);
    } else {
      // Use localStorage (development)
      const orders = await getAll();
      
      const newOrder: Order = {
        ...data,
        id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
      };

      const updatedOrders = [newOrder, ...orders];
      localStorageAdapter.setItem(STORAGE_KEY, updatedOrders);
      
      // ✅ Verificar que se guardó correctamente (para evitar race conditions)
      await new Promise(resolve => setTimeout(resolve, 50));
      const savedOrders = await getAll();
      const foundOrder = savedOrders.find(o => o.id === newOrder.id);
      
      if (!foundOrder) {
        console.error('❌ Error: El pedido no se guardó correctamente en localStorage');
        throw new Error('Error al guardar el pedido');
      }
      
      console.log(`✅ Pedido ${newOrder.id} creado y verificado`);

      return {
        data: newOrder,
        timestamp: new Date().toISOString(),
      };
    }
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Error al crear el pedido');
  }
};

/**
 * Update order status
 * 🔗 LARAVEL: PATCH /api/orders/{id}/status
 */
const updateStatus = async (
  id: string,
  status: OrderStatus
): Promise<ApiResponse<Order>> => {
  try {
    if (APP_CONFIG.useAPI) {
      // Use Laravel API
      return await apiClient.patch<ApiResponse<Order>>(`/orders/${id}/status`, { status });
    } else {
      // Use localStorage (development)
      let orders = await getAll();
      let orderIndex = orders.findIndex(o => o.id === id);

      // ✅ Si no se encuentra, reintentar después de un breve delay (race condition fix)
      if (orderIndex === -1) {
        console.warn(`⚠️ Pedido ${id} no encontrado en primer intento, reintentando...`);
        await new Promise(resolve => setTimeout(resolve, 100));
        orders = await getAll();
        orderIndex = orders.findIndex(o => o.id === id);
      }

      // Si aún no se encuentra después del reintento, lanzar error con detalles
      if (orderIndex === -1) {
        console.error('❌ Pedido no encontrado después de reintentar:', {
          searchId: id,
          availableIds: orders.map(o => o.id),
          totalOrders: orders.length
        });
        throw new Error(`Pedido ${id} no encontrado`);
      }

      // Actualizar el pedido
      orders[orderIndex] = {
        ...orders[orderIndex],
        status,
      };

      localStorageAdapter.setItem(STORAGE_KEY, orders);
      
      console.log(`✅ Pedido ${id} actualizado a estado: ${status}`);

      return {
        data: orders[orderIndex],
        timestamp: new Date().toISOString(),
      };
    }
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

/**
 * Archive order
 * 🔗 LARAVEL: PATCH /api/orders/{id}/archive
 */
const archive = async (id: string): Promise<ApiResponse<Order>> => {
  try {
    if (APP_CONFIG.useAPI) {
      // Use Laravel API
      return await apiClient.patch<ApiResponse<Order>>(`/orders/${id}/archive`);
    } else {
      // Use localStorage (development)
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
    }
  } catch (error) {
    console.error('Error archiving order:', error);
    throw new Error('Error al archivar el pedido');
  }
};

/**
 * Unarchive order
 * 🔗 LARAVEL: PATCH /api/orders/{id}/unarchive
 */
const unarchive = async (id: string): Promise<ApiResponse<Order>> => {
  try {
    if (APP_CONFIG.useAPI) {
      // Use Laravel API
      return await apiClient.patch<ApiResponse<Order>>(`/orders/${id}/unarchive`);
    } else {
      // Use localStorage (development)
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
    }
  } catch (error) {
    console.error('Error unarchiving order:', error);
    throw new Error('Error al restaurar el pedido');
  }
};

/**
 * Delete order
 * 🔗 LARAVEL: DELETE /api/orders/{id}
 */
const deleteOrder = async (id: string): Promise<ApiResponse<void>> => {
  try {
    if (APP_CONFIG.useAPI) {
      // Use Laravel API
      return await apiClient.delete<ApiResponse<void>>(`/orders/${id}`);
    } else {
      // Use localStorage (development)
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
    }
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
