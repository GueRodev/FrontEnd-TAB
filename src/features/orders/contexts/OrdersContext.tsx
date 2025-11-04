/**
 * Orders Context
 * Manages order history and status
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { localStorageAdapter } from '@/lib/storage';
import type { Order, OrderStatus, OrderType } from '../types';

const STORAGE_KEY = 'orders';

interface OrdersContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => string;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;
  archiveOrder: (orderId: string) => void;
  unarchiveOrder: (orderId: string) => void;
  getOrdersByType: (type: OrderType) => Order[];
  getArchivedOrders: () => Order[];
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    return localStorageAdapter.getItem<Order[]>(STORAGE_KEY) || [];
  });

  // Persist to localStorage whenever orders change
  useEffect(() => {
    localStorageAdapter.setItem(STORAGE_KEY, orders);
  }, [orders]);

  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt'>): string => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };

    setOrders(prev => [newOrder, ...prev]);
    return newOrder.id;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? { ...order, status }
          : order
      )
    );
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(order => order.id !== orderId));
  };

  const archiveOrder = (orderId: string) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? { ...order, archived: true, archivedAt: new Date().toISOString() }
          : order
      )
    );
  };

  const unarchiveOrder = (orderId: string) => {
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
