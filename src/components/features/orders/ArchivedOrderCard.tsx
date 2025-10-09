/**
 * Archived Order Card Component
 * Displays an archived order with restoration action
 */

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Order } from '@/types/order.types';
import { RotateCcw } from 'lucide-react';
import { getStatusLabel, getTypeLabel } from '@/lib/helpers/order.helpers';
import { formatCurrency } from '@/lib/formatters';

interface ArchivedOrderCardProps {
  order: Order;
  onRestore: (orderId: string) => void;
}

export const ArchivedOrderCard = ({ order, onRestore }: ArchivedOrderCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 space-y-3">
        {/* Header del pedido */}
        <div className="flex justify-between items-start gap-2">
          <div className="space-y-1 flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">ID Pedido</p>
            <p className="font-semibold text-sm truncate">{order.id}</p>
          </div>
          <Badge
            variant={
              order.status === 'completed'
                ? 'default'
                : order.status === 'cancelled'
                ? 'destructive'
                : 'secondary'
            }
            className="text-xs flex-shrink-0"
          >
            {getStatusLabel(order.status)}
          </Badge>
        </div>

        {/* Información del cliente */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Cliente</p>
            <p className="text-sm font-medium truncate">{order.customerInfo.name}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Teléfono</p>
            <p className="text-sm">{order.customerInfo.phone}</p>
          </div>
        </div>

        {/* Fecha y tipo */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Fecha</p>
            <p className="text-sm">
              {new Date(order.createdAt).toLocaleDateString('es-ES')}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Tipo</p>
            <Badge variant="outline" className="text-xs w-fit">
              {getTypeLabel(order.type)}
            </Badge>
          </div>
        </div>

        {/* Total y método de pago */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-sm font-bold">{formatCurrency(order.total)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Método de Pago</p>
            <p className="text-sm">{order.paymentMethod || 'N/A'}</p>
          </div>
        </div>

        {/* Productos */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Productos</p>
          <div className="text-xs space-y-1">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between">
                <span className="truncate mr-2">{item.name}</span>
                <span className="text-muted-foreground flex-shrink-0">x{item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Botón de acción */}
        {order.archived && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRestore(order.id)}
            className="w-full gap-2 text-xs"
          >
            <RotateCcw className="h-3 w-3" />
            Restaurar Pedido
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
