/**
 * OrderCard Component
 * Displays detailed information about a single order
 */

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Archive, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { OrderStatusBadge } from './OrderStatusBadge';
import type { Order } from '../types';

interface OrderCardProps {
  order: Order;
  showDeliveryInfo?: boolean;
  onArchive: (orderId: string) => void;
  onDelete: (orderId: string, order: Order) => void;
  onComplete: (order: Order) => void;
  onCancel: (order: Order) => void;
  onCompleteWithConfirmation?: (order: Order) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  showDeliveryInfo = false,
  onArchive,
  onDelete,
  onComplete,
  onCancel,
  onCompleteWithConfirmation,
}) => {
  const handleComplete = () => {
    if (order.type === 'online' && onCompleteWithConfirmation) {
      onCompleteWithConfirmation(order);
    } else {
      onComplete(order);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 min-w-0 flex-1">
            <CardTitle className="text-base">Pedido #{order.id}</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <OrderStatusBadge status={order.status} />
              <Badge variant="outline" className="text-xs">
                {order.type === 'online' ? 'En línea' : 'En tienda'}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pb-3">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Cliente:</span>
            <span className="font-medium">{order.customerInfo.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Teléfono:</span>
            <span className="font-medium">{order.customerInfo.phone}</span>
          </div>
          {showDeliveryInfo && order.delivery_address && (
            <>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Provincia:</span>
                <span className="font-medium">{order.delivery_address.province}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cantón:</span>
                <span className="font-medium">{order.delivery_address.canton}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Distrito:</span>
                <span className="font-medium">{order.delivery_address.district}</span>
              </div>
              <div className="pt-2 border-t">
                <span className="text-muted-foreground">Dirección exacta:</span>
                <p className="mt-1 text-sm">{order.delivery_address.address}</p>
              </div>
            </>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Fecha:</span>
            <span className="font-medium">
              {new Date(order.createdAt).toLocaleDateString('es-CR')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total:</span>
            <span className="font-semibold text-base">₡{order.total.toLocaleString('es-CR')}</span>
          </div>
          {order.paymentMethod && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Método de pago:</span>
              <span className="font-medium capitalize">{order.paymentMethod}</span>
            </div>
          )}
        </div>

        <div className="space-y-2 pt-2 border-t">
          <h4 className="font-medium text-sm">Productos ({order.items.length})</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 text-sm">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {item.quantity}x ₡{item.price.toLocaleString('es-CR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t gap-2 flex-wrap">
        {order.status === 'pending' && (
          <>
            <Button
              onClick={handleComplete}
              size="sm"
              className="flex-1"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Completar
            </Button>
            <Button
              onClick={() => onCancel(order)}
              size="sm"
              variant="outline"
              className="flex-1"
            >
              <XCircle className="h-4 w-4 mr-1" />
              Cancelar
            </Button>
          </>
        )}
        {order.status !== 'pending' && (
          <>
            <Button
              onClick={() => onArchive(order.id)}
              size="sm"
              variant="outline"
              className="flex-1"
            >
              <Archive className="h-4 w-4 mr-1" />
              Archivar
            </Button>
            <Button
              onClick={() => onDelete(order.id, order)}
              size="sm"
              variant="destructive"
              className="flex-1"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Eliminar
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};
