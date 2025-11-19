/**
 * Orders Service
 * API service for managing orders
 */

import type { Order, OrderStatus, OrderType } from '../types';
import type { ApiResponse } from '@/api/types';
import { APP_CONFIG } from '@/config/app.config';

// localStorage helpers
const getItem = <T>(key: string): T | null => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};
const setItem = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};
const localStorageAdapter = { getItem, setItem };
import { api } from '@/api';
import { transformLaravelOrder, transformToLaravelOrderPayload } from '../utils/transformers';

const STORAGE_KEY = 'orders';

/**
 * Orders Service
 * 🔄 READY FOR LARAVEL: Toggle with VITE_USE_API=true in .env
 */

/**
 * Get all orders
 * 🔗 LARAVEL: GET /api/admin/orders (Admin) or GET /api/orders (Client)
 */
const getAll = async (): Promise<Order[]> => {
  if (APP_CONFIG.useAPI) {
    // TODO: Determine if admin or client based on user role
    const isAdmin = true;
    const endpoint = isAdmin ? '/admin/orders' : '/orders';
    
    const response = await api.get<ApiResponse<any[]>>(endpoint);
    return response.data.data.map(transformLaravelOrder);
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
 * 🔗 LARAVEL: GET /api/admin/orders?status=archived
 */
const getArchived = async (): Promise<Order[]> => {
  if (APP_CONFIG.useAPI) {
    const response = await api.get<ApiResponse<any[]>>('/admin/orders?status=archived');
    return response.data.data.map(transformLaravelOrder);
  } else {
    const orders = await getAll();
    return orders.filter(order => order.archived);
  }
};

/**
 * Create ONLINE order (from cart - Client)
 * 🔗 LARAVEL: POST /api/orders
 */
const createOnlineOrder = async (
  data: Omit<Order, 'id' | 'createdAt' | 'order_number'>
): Promise<ApiResponse<Order>> => {
  try {
    if (APP_CONFIG.useAPI) {
      const payload = transformToLaravelOrderPayload(data, 'online');
      const response = await api.post<ApiResponse<any>>('/orders', payload);
      return {
        ...response.data,
        data: transformLaravelOrder(response.data.data),
      };
    } else {
      // Use localStorage (development)
      const orders = await getAll();
      
      const newOrder: Order = {
        ...data,
        id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        order_number: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
      };

      const updatedOrders = [newOrder, ...orders];
      localStorageAdapter.setItem(STORAGE_KEY, updatedOrders);
      
      // ✅ Verify saved correctly
      await new Promise(resolve => setTimeout(resolve, 50));
      const savedOrders = await getAll();
      const foundOrder = savedOrders.find(o => o.id === newOrder.id);
      
      if (!foundOrder) {
        console.error('❌ Error: Order not saved correctly in localStorage');
        throw new Error('Error al guardar el pedido');
      }
      
      console.log(`✅ Order ${newOrder.id} created and verified`);

      return {
        data: newOrder,
        timestamp: new Date().toISOString(),
      };
    }
  } catch (error) {
    console.error('Error creating online order:', error);
    throw new Error('Error al crear el pedido');
  }
};

/**
 * Create IN-STORE order (Admin)
 * 🔗 LARAVEL: POST /api/admin/orders
 */
const createInStoreOrder = async (
  data: Omit<Order, 'id' | 'createdAt' | 'order_number'>
): Promise<ApiResponse<Order>> => {
  try {
    if (APP_CONFIG.useAPI) {
      const payload = transformToLaravelOrderPayload(data, 'in-store');
      const response = await api.post<ApiResponse<any>>('/admin/orders', payload);
      return {
        ...response.data,
        data: transformLaravelOrder(response.data.data),
      };
    } else {
      // Use localStorage (development)
      const orders = await getAll();
      
      const newOrder: Order = {
        ...data,
        id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        order_number: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
      };

      const updatedOrders = [newOrder, ...orders];
      localStorageAdapter.setItem(STORAGE_KEY, updatedOrders);
      
      // ✅ Verify saved correctly
      await new Promise(resolve => setTimeout(resolve, 50));
      const savedOrders = await getAll();
      const foundOrder = savedOrders.find(o => o.id === newOrder.id);
      
      if (!foundOrder) {
        console.error('❌ Error: Order not saved correctly in localStorage');
        throw new Error('Error al guardar el pedido');
      }
      
      console.log(`✅ Order ${newOrder.id} created and verified`);

      return {
        data: newOrder,
        timestamp: new Date().toISOString(),
      };
    }
  } catch (error) {
    console.error('Error creating in-store order:', error);
    throw new Error('Error al crear el pedido');
  }
};

/**
 * Unified create method - routes to appropriate endpoint
 */
const create = async (
  data: Omit<Order, 'id' | 'createdAt' | 'order_number'>
): Promise<ApiResponse<Order>> => {
  if (data.type === 'online') {
    return createOnlineOrder(data);
  } else {
    return createInStoreOrder(data);
  }
};

/**
 * Mark order as in progress
 * 🔗 LARAVEL: PATCH /api/admin/orders/{id}/mark-in-progress
 */
const markInProgress = async (id: string): Promise<ApiResponse<Order>> => {
  try {
    if (APP_CONFIG.useAPI) {
      const response = await api.patch<ApiResponse<any>>(`/admin/orders/${id}/mark-in-progress`);
      return {
        ...response.data,
        data: transformLaravelOrder(response.data.data),
      };
    } else {
      // Use localStorage (development)
      const orders = await getAll();
      const orderIndex = orders.findIndex(o => o.id === id);
      if (orderIndex === -1) throw new Error('Pedido no encontrado');
      
      orders[orderIndex].status = 'in_progress';
      orders[orderIndex].updatedAt = new Date().toISOString();
      localStorageAdapter.setItem(STORAGE_KEY, orders);
      
      return {
        data: orders[orderIndex],
        timestamp: new Date().toISOString(),
      };
    }
  } catch (error) {
    console.error('Error marking order in progress:', error);
    throw error;
  }
};

/**
 * Update order status (using specific endpoints)
 * 🔗 LARAVEL: PATCH /api/admin/orders/{id}/[mark-in-progress|complete|cancel]
 */
const updateStatus = async (
  id: string,
  status: OrderStatus
): Promise<ApiResponse<Order>> => {
  try {
    if (APP_CONFIG.useAPI) {
      // Use specific endpoint based on status
      let endpoint = '';
      
      switch (status) {
        case 'in_progress':
          endpoint = `/admin/orders/${id}/mark-in-progress`;
          break;
        case 'completed':
          endpoint = `/admin/orders/${id}/complete`;
          break;
        case 'cancelled':
          endpoint = `/admin/orders/${id}/cancel`;
          break;
        default:
          throw new Error(`Status ${status} not supported for direct update`);
      }
      
      const response = await api.patch<ApiResponse<any>>(endpoint);
      return {
        ...response.data,
        data: transformLaravelOrder(response.data.data),
      };
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
 * 🔗 LARAVEL: POST /api/admin/orders/{id}/archive
 */
const archive = async (id: string): Promise<ApiResponse<Order>> => {
  try {
    if (APP_CONFIG.useAPI) {
      const response = await api.post<ApiResponse<any>>(`/admin/orders/${id}/archive`);
      return {
        ...response.data,
        data: transformLaravelOrder(response.data.data),
      };
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
      const response = await api.patch<ApiResponse<Order>>(`/orders/${id}/unarchive`);
      return response.data;
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
 * 🔗 LARAVEL: DELETE /api/admin/orders/{id}
 */
const deleteOrder = async (id: string): Promise<ApiResponse<void>> => {
  try {
    if (APP_CONFIG.useAPI) {
      const response = await api.delete<ApiResponse<void>>(`/admin/orders/${id}`);
      return response.data;
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
  createOnlineOrder,
  createInStoreOrder,
  updateStatus,
  markInProgress,
  archive,
  unarchive,
  delete: deleteOrder,
};
