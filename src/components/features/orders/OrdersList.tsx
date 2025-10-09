/**
 * OrdersList Component
 * Grid/list of order cards
 */

import { OrderCard } from './OrderCard';
import type { Order } from '@/types/order.types';

interface OrdersListProps {
  orders: Order[];
  showDeliveryInfo?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  onArchive: (orderId: string) => void;
  onDelete: (orderId: string, order: Order) => void;
  onComplete: (order: Order) => void;
  onCancel: (order: Order) => void;
}

export const OrdersList: React.FC<OrdersListProps> = ({
  orders,
  showDeliveryInfo = false,
  emptyMessage = 'No hay pedidos',
  emptyIcon,
  onArchive,
  onDelete,
  onComplete,
  onCancel,
}) => {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        {emptyIcon && <div className="mb-4">{emptyIcon}</div>}
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          showDeliveryInfo={showDeliveryInfo}
          onArchive={onArchive}
          onDelete={onDelete}
          onComplete={onComplete}
          onCancel={onCancel}
        />
      ))}
    </div>
  );
};
