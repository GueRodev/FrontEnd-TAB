/**
 * OrdersTable Component
 * Reusable table for displaying orders with responsive design
 */

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getStatusLabel, getStatusVariant, getTypeLabel } from '@/lib/helpers/order.helpers';
import { formatCurrency, formatDateTime } from '@/lib/formatters';
import type { Order } from '@/types/order.types';
import { Archive, Trash2, CheckCircle, XCircle } from 'lucide-react';

interface OrdersTableProps {
  orders: Order[];
  onArchive?: (orderId: string) => void;
  onDelete?: (orderId: string, order: Order) => void;
  onComplete?: (order: Order) => void;
  onCancel?: (order: Order) => void;
  showActions?: boolean;
  compact?: boolean;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  onArchive,
  onDelete,
  onComplete,
  onCancel,
  showActions = true,
  compact = false,
}) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No hay órdenes para mostrar
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Fecha</TableHead>
            {!compact && <TableHead>Cliente</TableHead>}
            <TableHead>Tipo</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Total</TableHead>
            {!compact && <TableHead>Pago</TableHead>}
            {!compact && <TableHead>Productos</TableHead>}
            {showActions && <TableHead className="text-right">Acciones</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-mono text-sm">
                #{order.id.slice(0, 8)}
              </TableCell>
              <TableCell className="text-sm">
                {formatDateTime(order.createdAt)}
              </TableCell>
              {!compact && (
                <TableCell>
                  <div>
                    <div className="font-medium">{order.customerInfo.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {order.customerInfo.phone}
                    </div>
                  </div>
                </TableCell>
              )}
              <TableCell>
                <Badge variant="outline">{getTypeLabel(order.type)}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(order.status)}>
                  {getStatusLabel(order.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-semibold">
                {formatCurrency(order.total)}
              </TableCell>
              {!compact && (
                <TableCell className="text-sm">
                  {order.paymentMethod || 'N/A'}
                </TableCell>
              )}
              {!compact && (
                <TableCell className="text-sm">
                  {order.items.length} producto{order.items.length !== 1 ? 's' : ''}
                </TableCell>
              )}
              {showActions && (
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {order.status === 'pending' && onComplete && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onComplete(order)}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                    {order.status === 'pending' && onCancel && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onCancel(order)}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    )}
                    {onArchive && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onArchive(order.id)}
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onDelete(order.id, order)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
