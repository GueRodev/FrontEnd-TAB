/**
 * Order Helper Functions
 * Business logic for order operations and transformations
 */

import type { Order, OrderStatus, OrderType } from '@/types/order.types';

/**
 * Get localized label for order status
 */
export const getStatusLabel = (status: OrderStatus): string => {
  const labels: Record<OrderStatus, string> = {
    pending: 'Pendiente',
    completed: 'Completado',
    cancelled: 'Cancelado',
  };
  return labels[status] || status;
};

/**
 * Get localized label for order type
 */
export const getTypeLabel = (type: OrderType): string => {
  const labels: Record<OrderType, string> = {
    online: 'En línea',
    'in-store': 'En tienda',
  };
  return labels[type] || type;
};

/**
 * Get status color variant for badges
 */
export const getStatusVariant = (
  status: OrderStatus
): 'default' | 'secondary' | 'destructive' | 'outline' => {
  const variants: Record<OrderStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    pending: 'outline',
    completed: 'default',
    cancelled: 'destructive',
  };
  return variants[status] || 'default';
};

/**
 * Calculate order metrics from array of orders
 */
export interface OrderMetrics {
  totalRevenue: number;
  monthlyRevenue: number;
  dailyRevenue: number;
  completedOrders: number;
  pendingOrders: number;
  totalOrders: number;
  averageOrderValue: number;
}

export const calculateOrderMetrics = (orders: Order[]): OrderMetrics => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const completedOrders = orders.filter((o) => o.status === 'completed');
  const pendingOrders = orders.filter((o) => o.status === 'pending');

  const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);
  
  const monthlyRevenue = completedOrders
    .filter((order) => new Date(order.createdAt) >= firstDayOfMonth)
    .reduce((sum, order) => sum + order.total, 0);

  const dailyRevenue = completedOrders
    .filter((order) => new Date(order.createdAt) >= today)
    .reduce((sum, order) => sum + order.total, 0);

  const averageOrderValue = completedOrders.length > 0 
    ? totalRevenue / completedOrders.length 
    : 0;

  return {
    totalRevenue,
    monthlyRevenue,
    dailyRevenue,
    completedOrders: completedOrders.length,
    pendingOrders: pendingOrders.length,
    totalOrders: orders.length,
    averageOrderValue,
  };
};

/**
 * Get orders for last N days with daily totals
 */
export const getLastNDaysData = (orders: Order[], days: number = 7) => {
  const now = new Date();
  const data: { date: string; total: number }[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const dayTotal = orders
      .filter((order) => {
        const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
        return orderDate === dateStr && order.status === 'completed';
      })
      .reduce((sum, order) => sum + order.total, 0);

    data.push({
      date: date.toLocaleDateString('es-CR', { day: '2-digit', month: 'short' }),
      total: dayTotal,
    });
  }

  return data;
};

/**
 * Get top selling products from orders
 */
export const getTopProducts = (orders: Order[], limit: number = 5) => {
  const productSales = new Map<string, { name: string; quantity: number; revenue: number }>();

  orders
    .filter((order) => order.status === 'completed')
    .forEach((order) => {
      order.items.forEach((item) => {
        const existing = productSales.get(item.id);
        if (existing) {
          existing.quantity += item.quantity;
          existing.revenue += item.price * item.quantity;
        } else {
          productSales.set(item.id, {
            name: item.name,
            quantity: item.quantity,
            revenue: item.price * item.quantity,
          });
        }
      });
    });

  return Array.from(productSales.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
};
