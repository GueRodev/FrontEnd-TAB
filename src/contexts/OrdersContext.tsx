import React, { createContext, useContext, useState, useEffect } from 'react';

export type OrderStatus = 'pending' | 'completed' | 'cancelled';
export type OrderType = 'online' | 'in-store';

export interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  type: OrderType;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  createdAt: string;
  customerInfo: {
    nombre: string;
    telefono: string;
    provincia?: string;
    canton?: string;
    distrito?: string;
    direccion?: string;
  };
  deliveryOption?: 'pickup' | 'delivery';
  paymentMethod?: string;
  archived?: boolean;
  archivedAt?: string;
}

interface OrdersContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => string; // Retorna el ID del pedido creado
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
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const addOrder = (order: Omit<Order, 'id' | 'createdAt'>) => {
    const newOrder: Order = {
      ...order,
      id: `ORD-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder.id; // Retornar el ID del pedido creado
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(order => order.id !== orderId));
  };

  const archiveOrder = (orderId: string) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, archived: true, archivedAt: new Date().toISOString() } : order
      )
    );
  };

  const unarchiveOrder = (orderId: string) => {
    setOrders(prev =>
      prev.map(order =>
        // Solo cambiamos archived a false, pero mantenemos archivedAt para el historial
        order.id === orderId ? { ...order, archived: false } : order
      )
    );
  };

  const getOrdersByType = (type: OrderType) => {
    return orders.filter(order => order.type === type && !order.archived);
  };

  const getArchivedOrders = () => {
    // Devuelve todos los pedidos que alguna vez fueron archivados (tienen archivedAt)
    // independientemente de si fueron restaurados después
    return orders.filter(order => order.archivedAt);
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        addOrder,
        updateOrderStatus,
        deleteOrder,
        archiveOrder,
        unarchiveOrder,
        getOrdersByType,
        getArchivedOrders,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};
