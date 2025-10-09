/**
 * OrderCard Component
 * Displays order details with actions
 */

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Archive, Trash2, CheckCircle, XCircle, MapPin, Phone, User, CreditCard } from 'lucide-react';
import { OrderStatusBadge } from './OrderStatusBadge';
import type { Order } from '@/types/order.types';

interface OrderCardProps {
  order: Order;
  showDeliveryInfo?: boolean;
  onArchive: (orderId: string) => void;
  onDelete: (orderId: string, order: Order) => void;
  onComplete: (order: Order) => void;
  onCancel: (order: Order) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  showDeliveryInfo = false,
  onArchive,
  onDelete,
  onComplete,
  onCancel,
}) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="bg-muted/50 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              #{order.id.slice(0, 8)}
            </span>
            <OrderStatusBadge status={order.status} />
            <Badge variant="outline" className="text-xs">
              {order.type === 'online' ? 'Online' : 'Tienda'}
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground">
            {new Date(order.createdAt).toLocaleString('es-ES', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Customer Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{order.customerInfo.name}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{order.customerInfo.phone}</span>
          </div>
          {order.paymentMethod && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CreditCard className="h-4 w-4" />
              <span className="capitalize">{order.paymentMethod}</span>
            </div>
          )}
        </div>

        {/* Delivery Address */}
        {showDeliveryInfo && order.delivery_address && (
          <div className="p-3 bg-muted/30 rounded-md space-y-1">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="text-sm space-y-0.5">
                <p className="font-medium">{order.delivery_address.label}</p>
                <p className="text-muted-foreground">
                  {order.delivery_address.province}, {order.delivery_address.canton}, {order.delivery_address.district}
                </p>
                <p className="text-muted-foreground">{order.delivery_address.address}</p>
              </div>
            </div>
          </div>
        )}

        {/* Order Items */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Productos:</p>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-2 bg-muted/20 rounded-md">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    ₡{item.price.toLocaleString()} × {item.quantity}
                  </p>
                </div>
                <span className="text-sm font-medium whitespace-nowrap">
                  ₡{(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center pt-2 border-t">
          <span className="font-semibold">Total:</span>
          <span className="text-lg font-bold">
            ₡{order.total.toLocaleString()}
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-2">
          {order.status === 'pending' && (
            <>
              <Button
                size="sm"
                variant="default"
                onClick={() => onComplete(order)}
                className="flex-1 sm:flex-none"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Completar
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onCancel(order)}
                className="flex-1 sm:flex-none"
              >
                <XCircle className="h-4 w-4 mr-1" />
                Cancelar
              </Button>
            </>
          )}
          {order.status !== 'pending' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onArchive(order.id)}
              className="flex-1 sm:flex-none"
            >
              <Archive className="h-4 w-4 mr-1" />
              Archivar
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(order.id, order)}
            className="flex-1 sm:flex-none text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Eliminar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
