/**
 * Orders History Business Logic Hook
 * Manages archived orders, restoration, and exports
 */

import { useOrders } from '@/contexts/OrdersContext';
import { useNotifications } from '@/contexts/NotificationsContext';
import { toast } from '@/hooks/use-toast';
import { exportOrdersToPDF, exportOrdersToExcel } from '@/lib/helpers/export.helpers';
import { Order } from '@/types/order.types';

interface UseOrdersHistoryReturn {
  archivedOrders: Order[];
  handleRestoreOrder: (orderId: string) => void;
  handleExportPDF: () => void;
  handleExportExcel: () => void;
}

export const useOrdersHistory = (): UseOrdersHistoryReturn => {
  const { getArchivedOrders, unarchiveOrder } = useOrders();
  const { addNotification } = useNotifications();
  
  const archivedOrders = getArchivedOrders();

  const handleRestoreOrder = (orderId: string) => {
    unarchiveOrder(orderId);
    addNotification({
      type: 'order',
      title: 'Pedido restaurado',
      message: `El pedido ${orderId} ha sido restaurado`,
      time: 'Ahora',
    });
    toast({
      title: "Pedido restaurado",
      description: "El pedido ha sido restaurado y está visible en la página de pedidos",
    });
  };

  const handleExportPDF = () => {
    exportOrdersToPDF(archivedOrders);
  };

  const handleExportExcel = () => {
    exportOrdersToExcel(archivedOrders);
  };

  return {
    archivedOrders,
    handleRestoreOrder,
    handleExportPDF,
    handleExportExcel,
  };
};
