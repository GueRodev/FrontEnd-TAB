/**
 * Orders Admin Business Logic Hook
 * Manages all order-related operations for admin pages
 */

import { useState, useMemo } from 'react';
import { useOrders } from '../contexts';
import { useProducts } from '@/features/products';
import { useCategories } from '@/features/categories';
import { useNotifications } from '@/features/notifications';
import { useApi } from '@/hooks/useApi';
import { ordersService } from '../services';
import { productsService } from '@/features/products/services';
import { toast } from '@/hooks/use-toast';
import type { Order } from '../types';
import type { Product } from '@/features/products/types';

interface DeleteOrderDialog {
  open: boolean;
  orderId: string | null;
  order: Order | null;
}

interface PaymentConfirmationDialog {
  open: boolean;
  order: Order | null;
}

interface UseOrdersAdminReturn {
  // Order data
  onlineOrders: Order[];
  inStoreOrders: Order[];
  
  // In-store order creation
  selectedProduct: string;
  setSelectedProduct: (productId: string) => void;
  quantity: number;
  setQuantity: (quantity: number) => void;
  customerName: string;
  setCustomerName: (name: string) => void;
  customerPhone: string;
  setCustomerPhone: (phone: string) => void;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  
  // Product filtering
  categoryFilter: string;
  setCategoryFilter: (categoryId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  productSelectorOpen: boolean;
  setProductSelectorOpen: (open: boolean) => void;
  
  // Product data
  activeProducts: Product[];
  filteredProducts: Product[];
  selectedProductData: Product | undefined;
  
  // Order actions
  handleCreateInStoreOrder: (e: React.FormEvent) => void;
  handleArchiveOrder: (orderId: string) => void;
  handleCompleteOrder: (order: Order) => void;
  handleCancelOrder: (order: Order) => void;
  
  // Delete dialog
  deleteOrderDialog: DeleteOrderDialog;
  openDeleteOrderDialog: (orderId: string, order: Order) => void;
  confirmDeleteOrder: () => void;
  
  // Payment confirmation dialog
  paymentConfirmDialog: PaymentConfirmationDialog;
  openPaymentConfirmDialog: (order: Order) => void;
  confirmCompleteOrder: () => void;
}

export const useOrdersAdmin = (): UseOrdersAdminReturn => {
  // State for in-store order creation
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  
  // Product filtering state
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [productSelectorOpen, setProductSelectorOpen] = useState(false);
  
  // Dialog states
  const [deleteOrderDialog, setDeleteOrderDialog] = useState<DeleteOrderDialog>({
    open: false,
    orderId: null,
    order: null,
  });
  
  const [paymentConfirmDialog, setPaymentConfirmDialog] = useState<PaymentConfirmationDialog>({
    open: false,
    order: null,
  });

  // Get data from contexts
  const { getOrdersByType, archiveOrder, updateOrderStatus } = useOrders();
  const { products, updateProduct } = useProducts();
  const { categories } = useCategories();
  const { addNotification } = useNotifications();
  
  // Get orders by type
  const onlineOrders = getOrdersByType('online');
  const inStoreOrders = getOrdersByType('in-store');
  
  // Filter active products
  const activeProducts = products.filter(p => p.status === 'active');
  
  // Filter products based on category and search
  const filteredProducts = useMemo(() => {
    let filtered = activeProducts;
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(p => p.categoryId === categoryFilter);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [activeProducts, categoryFilter, searchQuery]);
  
  // Get selected product data
  const selectedProductData = activeProducts.find(p => p.id === selectedProduct);

  // API hooks
  const { execute: createOrder } = useApi();
  const { execute: deleteOrderApi } = useApi();
  const { execute: updateOrderStatusApi } = useApi();
  const { execute: updateProductApi } = useApi();

  /**
   * Create in-store order
   */
  const handleCreateInStoreOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProduct || !selectedProductData) {
      toast({
        title: "Error",
        description: "Por favor selecciona un producto",
        variant: "destructive",
      });
      return;
    }

    if (quantity > selectedProductData.stock) {
      toast({
        title: "Error",
        description: "No hay suficiente stock disponible",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      type: 'in-store' as const,
      status: 'completed' as const,
      items: [{
        id: selectedProductData.id,
        name: selectedProductData.name,
        image: selectedProductData.image,
        price: selectedProductData.price,
        quantity,
      }],
      total: selectedProductData.price * quantity,
      customerInfo: {
        name: customerName,
        phone: customerPhone,
      },
      paymentMethod,
    };

    const result = await createOrder(() => ordersService.create(orderData));

    if (result?.data) {
      // Update product stock
      await updateProductApi(() => productsService.update(selectedProductData.id, {
        stock: selectedProductData.stock - quantity,
      }));

      addNotification({
        type: 'order',
        title: 'Pedido creado',
        message: `Pedido en tienda #${result.data.id} creado`,
        time: 'Ahora',
      });

      // Reset form
      setSelectedProduct('');
      setQuantity(1);
      setCustomerName('');
      setCustomerPhone('');
      setPaymentMethod('');

      toast({
        title: "Pedido creado",
        description: "El pedido en tienda ha sido creado exitosamente",
      });
    }
  };

  /**
   * Open delete confirmation dialog
   */
  const openDeleteOrderDialog = (orderId: string, order: Order) => {
    setDeleteOrderDialog({
      open: true,
      orderId,
      order,
    });
  };

  /**
   * Confirm and delete order
   */
  const confirmDeleteOrder = async () => {
    if (!deleteOrderDialog.orderId || !deleteOrderDialog.order) return;

    const result = await deleteOrderApi(() => ordersService.delete(deleteOrderDialog.orderId!));

    if (result) {
      // Restore stock if order was completed
      if (deleteOrderDialog.order.status === 'completed') {
        for (const item of deleteOrderDialog.order.items) {
          const product = products.find(p => p.id === item.id);
          if (product) {
            await updateProductApi(() => productsService.update(product.id, {
              stock: product.stock + item.quantity,
            }));
          }
        }
      }

      addNotification({
        type: 'order',
        title: 'Pedido eliminado',
        message: `Pedido #${deleteOrderDialog.orderId} eliminado`,
        time: 'Ahora',
      });

      toast({
        title: "Pedido eliminado",
        description: "El pedido ha sido eliminado del sistema",
      });
    }

    setDeleteOrderDialog({ open: false, orderId: null, order: null });
  };

  /**
   * Archive order
   */
  const handleArchiveOrder = (orderId: string) => {
    archiveOrder(orderId);
    addNotification({
      type: 'order',
      title: 'Pedido archivado',
      message: `Pedido #${orderId} archivado`,
      time: 'Ahora',
    });
    toast({
      title: "Pedido archivado",
      description: "El pedido ha sido movido al historial",
    });
  };

  /**
   * Open payment confirmation dialog for online orders
   */
  const openPaymentConfirmDialog = (order: Order) => {
    setPaymentConfirmDialog({
      open: true,
      order,
    });
  };

  /**
   * Confirm and complete order (after payment confirmation)
   */
  const confirmCompleteOrder = async () => {
    if (!paymentConfirmDialog.order) return;

    const order = paymentConfirmDialog.order;
    const result = await updateOrderStatusApi(() => ordersService.updateStatus(order.id, 'completed'));

    if (result?.data) {
      // Update stock for each item
      for (const item of order.items) {
        const product = products.find(p => p.id === item.id);
        if (product && product.stock >= item.quantity) {
          await updateProductApi(() => productsService.update(product.id, {
            stock: product.stock - item.quantity,
          }));
        }
      }

      addNotification({
        type: 'order',
        title: 'Pedido completado',
        message: `Pedido #${order.id} completado`,
        time: 'Ahora',
      });

      toast({
        title: "Pedido completado",
        description: "El pedido ha sido marcado como completado",
      });
    }

    setPaymentConfirmDialog({ open: false, order: null });
  };

  /**
   * Complete order (in-store orders complete immediately)
   */
  const handleCompleteOrder = async (order: Order) => {
    const result = await updateOrderStatusApi(() => ordersService.updateStatus(order.id, 'completed'));

    if (result?.data) {
      // Update stock for each item
      for (const item of order.items) {
        const product = products.find(p => p.id === item.id);
        if (product && product.stock >= item.quantity) {
          await updateProductApi(() => productsService.update(product.id, {
            stock: product.stock - item.quantity,
          }));
        }
      }

      addNotification({
        type: 'order',
        title: 'Pedido completado',
        message: `Pedido #${order.id} completado`,
        time: 'Ahora',
      });

      toast({
        title: "Pedido completado",
        description: "El pedido ha sido marcado como completado",
      });
    }
  };

  /**
   * Cancel order
   */
  const handleCancelOrder = async (order: Order) => {
    const result = await updateOrderStatusApi(() => ordersService.updateStatus(order.id, 'cancelled'));

    if (result?.data) {
      addNotification({
        type: 'order',
        title: 'Pedido cancelado',
        message: `Pedido #${order.id} cancelado`,
        time: 'Ahora',
      });

      toast({
        title: "Pedido cancelado",
        description: "El pedido ha sido cancelado",
      });
    }
  };

  return {
    onlineOrders,
    inStoreOrders,
    selectedProduct,
    setSelectedProduct,
    quantity,
    setQuantity,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    paymentMethod,
    setPaymentMethod,
    categoryFilter,
    setCategoryFilter,
    searchQuery,
    setSearchQuery,
    productSelectorOpen,
    setProductSelectorOpen,
    activeProducts,
    filteredProducts,
    selectedProductData,
    handleCreateInStoreOrder,
    deleteOrderDialog,
    openDeleteOrderDialog,
    confirmDeleteOrder,
    paymentConfirmDialog,
    openPaymentConfirmDialog,
    confirmCompleteOrder,
    handleArchiveOrder,
    handleCompleteOrder,
    handleCancelOrder,
  };
};
