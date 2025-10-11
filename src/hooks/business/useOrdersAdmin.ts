/**
 * Orders Admin Business Logic Hook
 * Manages all business logic for admin orders page
 */

import { useState } from 'react';
import { useOrders } from '@/contexts/OrdersContext';
import { useProducts } from '@/contexts/ProductsContext';
import { useCategories } from '@/contexts/CategoriesContext';
import { useNotifications } from '@/contexts/NotificationsContext';
import { toast } from '@/hooks/use-toast';
import { useApi } from '@/hooks/useApi';
import { Badge } from '@/components/ui/badge';
import { Package, CheckCircle, XCircle } from 'lucide-react';
import type { OrderStatus } from '@/types/order.types';

interface DeleteOrderDialog {
  open: boolean;
  orderId: string;
  order: any;
}

interface PaymentConfirmationDialog {
  open: boolean;
  order: any;
}

interface UseOrdersAdminReturn {
  // State
  onlineOrders: any[];
  inStoreOrders: any[];
  selectedProduct: string;
  quantity: number;
  customerName: string;
  customerPhone: string;
  paymentMethod: string;
  categoryFilter: string;
  searchQuery: string;
  openProductSearch: boolean;
  activeProducts: any[];
  filteredProducts: any[];
  selectedProductData: any;
  deleteOrderDialog: DeleteOrderDialog;
  paymentConfirmDialog: PaymentConfirmationDialog;
  
  // Setters
  setSelectedProduct: (id: string) => void;
  setQuantity: (qty: number) => void;
  setCustomerName: (name: string) => void;
  setCustomerPhone: (phone: string) => void;
  setPaymentMethod: (method: string) => void;
  setCategoryFilter: (filter: string) => void;
  setSearchQuery: (query: string) => void;
  setOpenProductSearch: (open: boolean) => void;
  setDeleteOrderDialog: (dialog: DeleteOrderDialog) => void;
  setPaymentConfirmDialog: (dialog: PaymentConfirmationDialog) => void;
  
  // Handlers
  handleCreateInStoreOrder: () => void;
  openDeleteOrderDialog: (orderId: string, order: any) => void;
  confirmDeleteOrder: () => void;
  handleArchiveOrder: (orderId: string) => void;
  handleCompleteOrder: (order: any) => void;
  handleCancelOrder: (order: any) => void;
  openPaymentConfirmDialog: (order: any) => void;
  confirmCompleteOrder: () => void;
}

export const useOrdersAdmin = (): UseOrdersAdminReturn => {
  const { addOrder, updateOrderStatus, deleteOrder, archiveOrder, getOrdersByType } = useOrders();
  const { addNotification } = useNotifications();
  const { categories } = useCategories();
  const { products, updateProduct } = useProducts();
  const { execute } = useApi();
  
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openProductSearch, setOpenProductSearch] = useState(false);
  
  const [deleteOrderDialog, setDeleteOrderDialog] = useState<DeleteOrderDialog>({
    open: false,
    orderId: '',
    order: null,
  });

  const [paymentConfirmDialog, setPaymentConfirmDialog] = useState<PaymentConfirmationDialog>({
    open: false,
    order: null,
  });

  const onlineOrders = getOrdersByType('online');
  const inStoreOrders = getOrdersByType('in-store');

  // Get only active products
  const activeProducts = products.filter(p => p.status === 'active');

  // Filter products by category and search
  const filteredProducts = activeProducts.filter(product => {
    const matchesCategory = categoryFilter === 'all' || product.categoryId === categoryFilter;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectedProductData = activeProducts.find(p => p.id === selectedProduct);

  const handleCreateInStoreOrder = async () => {
    if (!selectedProduct || !customerName || !customerPhone || !paymentMethod) {
      toast({
        title: "Campos incompletos",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    const product = selectedProductData;
    if (!product) return;

    if (quantity > product.stock) {
      toast({
        title: "Stock insuficiente",
        description: `Solo hay ${product.stock} unidades disponibles`,
        variant: "destructive",
      });
      return;
    }

    const newOrder = {
      type: 'in-store' as const,
      status: 'pending' as OrderStatus,
      items: [{
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: quantity,
      }],
      total: product.price * quantity,
      customerInfo: {
        name: customerName,
        phone: customerPhone,
      },
      deliveryOption: 'pickup' as const,
      paymentMethod: paymentMethod,
    };

    await execute(
      async () => {
        const orderId = addOrder(newOrder);
        return { orderId, customerName: customerName, productName: product.name, quantity };
      },
      {
        successMessage: "El pedido en tienda ha sido registrado exitosamente",
        onSuccess: (data) => {
          addNotification({
            type: 'order',
            title: 'Pedido en tienda creado',
            message: `Pedido de ${data.customerName} - ${data.productName} x${data.quantity}`,
            time: 'Ahora',
            orderId: data.orderId,
          });
          
          setSelectedProduct('');
          setQuantity(1);
          setCustomerName('');
          setCustomerPhone('');
          setPaymentMethod('');
          setSearchQuery('');
          setCategoryFilter('all');
        }
      }
    );
  };

  const openDeleteOrderDialog = (orderId: string, order: any) => {
    setDeleteOrderDialog({
      open: true,
      orderId,
      order,
    });
  };

  const confirmDeleteOrder = () => {
    const { orderId, order } = deleteOrderDialog;
    
    if (!order) return;

    // Restore stock if order was completed
    if (order.status === 'completed') {
      order.items.forEach((item: any) => {
        const product = products.find(p => p.id === item.id);
        if (product) {
          updateProduct(product.id, {
            stock: product.stock + item.quantity
          });
        }
      });
    }
    
    deleteOrder(orderId);
    
    setDeleteOrderDialog({
      open: false,
      orderId: '',
      order: null,
    });
    
    toast({
      title: "Pedido eliminado",
      description: order.status === 'completed' 
        ? "El pedido ha sido eliminado y el stock ha sido restablecido"
        : "El pedido ha sido eliminado exitosamente",
    });
  };

  const handleArchiveOrder = (orderId: string) => {
    archiveOrder(orderId);
    addNotification({
      type: 'order',
      title: 'Pedido archivado',
      message: `El pedido ${orderId} ha sido archivado`,
      time: 'Ahora',
      orderId: orderId,
    });
    toast({
      title: "Pedido archivado",
      description: "El pedido ha sido archivado exitosamente",
    });
  };

  const openPaymentConfirmDialog = (order: any) => {
    setPaymentConfirmDialog({
      open: true,
      order,
    });
  };

  const confirmCompleteOrder = () => {
    const { order } = paymentConfirmDialog;
    if (!order) return;

    handleCompleteOrder(order);
    
    setPaymentConfirmDialog({
      open: false,
      order: null,
    });
  };

  const handleCompleteOrder = (order: any) => {
    // Update stock when completing order
    order.items.forEach((item: any) => {
      const product = products.find(p => p.id === item.id);
      if (product) {
        updateProduct(product.id, {
          stock: product.stock - item.quantity
        });
      }
    });

    updateOrderStatus(order.id, 'completed');
    addNotification({
      type: 'order',
      title: 'Pedido completado',
      message: `Pedido ${order.id} ha sido marcado como finalizado`,
      time: 'Ahora',
      orderId: order.id,
    });
    toast({
      title: "Pedido completado",
      description: "El pedido ha sido marcado como finalizado y el stock actualizado",
    });
  };

  const handleCancelOrder = (order: any) => {
    updateOrderStatus(order.id, 'cancelled');
    addNotification({
      type: 'order',
      title: 'Pedido cancelado',
      message: `Pedido ${order.id} ha sido cancelado`,
      time: 'Ahora',
      orderId: order.id,
    });
    toast({
      title: "Pedido cancelado",
      description: "El pedido ha sido cancelado",
    });
  };

  return {
    onlineOrders,
    inStoreOrders,
    selectedProduct,
    quantity,
    customerName,
    customerPhone,
    paymentMethod,
    categoryFilter,
    searchQuery,
    openProductSearch,
    activeProducts,
    filteredProducts,
    selectedProductData,
    deleteOrderDialog,
    paymentConfirmDialog,
    setSelectedProduct,
    setQuantity,
    setCustomerName,
    setCustomerPhone,
    setPaymentMethod,
    setCategoryFilter,
    setSearchQuery,
    setOpenProductSearch,
    setDeleteOrderDialog,
    setPaymentConfirmDialog,
    handleCreateInStoreOrder,
    openDeleteOrderDialog,
    confirmDeleteOrder,
    handleArchiveOrder,
    handleCompleteOrder,
    handleCancelOrder,
    openPaymentConfirmDialog,
    confirmCompleteOrder,
  };
};
