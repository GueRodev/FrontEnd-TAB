/**
 * Orders Context
 * Manages order history and status
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ordersService } from '../services';
import type { Order, OrderStatus, OrderType } from '../types';

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
    // Call service to persist
    const result = await ordersService.create(orderData);
    
    // Update local state with the created order
    setOrders(prev => [result.data, ...prev]);
    
    return result.data.id;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<void> => {
    // Call service to persist
    await ordersService.updateStatus(orderId, status);
    
    // Update local state
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? { ...order, status }
          : order
      )
    );
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
