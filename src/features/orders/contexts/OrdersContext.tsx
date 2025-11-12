/**
 * Orders Context
 * Manages order history and status
 * Integrated with stock management system
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ordersService } from '../services';
import { stockMovementsService } from '@/features/products/services';
import type { Order, OrderStatus, OrderType } from '../types';
import { toast } from 'sonner';

interface OrdersContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Promise<string>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  archiveOrder: (orderId: string) => Promise<void>;
  unarchiveOrder: (orderId: string) => Promise<void>;
  getOrdersByType: (type: OrderType) => Order[];
  getArchivedOrders: () => Order[];
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  // Load orders from service on mount
  useEffect(() => {
    const loadOrders = async () => {
      const loadedOrders = await ordersService.getAll();
      setOrders(loadedOrders);
    };
    loadOrders();
  }, []);

  const addOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>): Promise<string> => {
    // 1. Check stock availability before creating order
    const items = orderData.items.map(item => ({
      product_id: item.id,
      quantity: item.quantity,
    }));

    try {
      const availability = await stockMovementsService.checkAvailability(items);
      
      if (!availability.available) {
        // Stock not available - show detailed error
        const errorMessages = availability.errors
          .map(err => `${err.product_name}: solicitado ${err.requested}, disponible ${err.available}`)
          .join(', ');
        
        toast.error('Stock insuficiente', {
          description: errorMessages,
        });
        
        throw new Error('Stock insuficiente para completar el pedido');
      }

      // 2. Create order
      const result = await ordersService.create(orderData);
      
      // 3. Reserve stock for pending orders
      if (orderData.status === 'pending') {
        await stockMovementsService.reserveStock({
          order_id: result.data.id,
          items,
        });
      }
      
      // 4. Update local state with the created order
      setOrders(prev => [result.data, ...prev]);
      
      return result.data.id;
    } catch (error) {
      console.error('Error adding order:', error);
      throw error;
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<void> => {
    try {
      // Get current order to check previous status
      const currentOrder = orders.find(o => o.id === orderId);
      
      if (!currentOrder) {
        throw new Error('Pedido no encontrado');
      }

      const previousStatus = currentOrder.status;

      // Call service to persist status change
      await ordersService.updateStatus(orderId, status);
      
      // Handle stock movements based on status transition
      if (previousStatus === 'pending' && status === 'completed') {
        // Confirm sale - deduct real stock
        await stockMovementsService.confirmSale(orderId);
      } else if (previousStatus === 'pending' && status === 'cancelled') {
        // Cancel reservation - release reserved stock
        await stockMovementsService.cancelReservation(orderId);
      }
      
      // Update local state
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId
            ? { ...order, status }
            : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  };

  const deleteOrder = async (orderId: string): Promise<void> => {
    // Call service to persist
    await ordersService.delete(orderId);
    
    // Update local state
    setOrders(prev => prev.filter(order => order.id !== orderId));
  };

  const archiveOrder = async (orderId: string): Promise<void> => {
    // Call service to persist
    await ordersService.archive(orderId);
    
    // Update local state
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? { ...order, archived: true, archivedAt: new Date().toISOString() }
          : order
      )
    );
  };

  const unarchiveOrder = async (orderId: string): Promise<void> => {
    // Call service to persist
    await ordersService.unarchive(orderId);
    
    // Update local state
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? { ...order, archived: false, archivedAt: undefined }
          : order
      )
    );
  };

  const getOrdersByType = (type: OrderType): Order[] => {
    return orders.filter(order => order.type === type && !order.archived);
  };

  const getArchivedOrders = (): Order[] => {
    return orders.filter(order => order.archived);
  };

  const value: OrdersContextType = {
    orders,
    addOrder,
    updateOrderStatus,
    deleteOrder,
    archiveOrder,
    unarchiveOrder,
    getOrdersByType,
    getArchivedOrders,
  };

  return (
    <OrdersContext.Provider value={value}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within OrdersProvider');
  }
  return context;
};
