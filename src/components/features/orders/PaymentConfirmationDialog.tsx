/**
 * PaymentConfirmationDialog Component
 * Confirms payment proof receipt before completing online orders
 */

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CheckCircle, MessageCircle, AlertTriangle } from 'lucide-react';

interface PaymentConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  customerName?: string;
  orderTotal?: number;
}

export const PaymentConfirmationDialog: React.FC<PaymentConfirmationDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  customerName = 'el cliente',
  orderTotal = 0,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-amber-100 rounded-full">
              <MessageCircle className="h-5 w-5 text-amber-600" />
            </div>
            <AlertDialogTitle className="text-lg">
              Confirmar Comprobante de Pago
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-3 pt-2">
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">Verificación requerida</p>
                <p className="text-xs">
                  Antes de marcar como completado, confirma que{' '}
                  <span className="font-semibold">{customerName}</span> ya envió el
                  comprobante de pago por WhatsApp.
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                <strong>Monto del pedido:</strong>{' '}
                <span className="text-foreground font-semibold">
                  ₡{orderTotal.toLocaleString()}
                </span>
              </p>
              <p className="text-muted-foreground">
                ¿Ya recibiste y verificaste el comprobante de pago de este pedido?
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>No, aún no</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Sí, comprobante recibido
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
