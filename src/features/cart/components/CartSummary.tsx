/**
 * CartSummary Component
 * Pure presentational component for cart summary display
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CartSummaryProps {
  totalItems: number;
  totalPrice: number;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  totalItems,
  totalPrice,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen del Pedido</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Productos ({totalItems})</span>
          <span className="font-semibold">${totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Envío</span>
          <span className="font-semibold">A calcular</span>
        </div>
        <div className="border-t pt-4 flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
};
