/**
 * useOrderForm
 * Business logic for order form validation and submission
 * Next.js ready - can be used in Client Components
 */

import { useState } from 'react';
import { useOrders } from '@/contexts/OrdersContext';
import { useNotifications } from '@/contexts/NotificationsContext';
import { useCartOperations } from './useCartOperations';
import { toast } from '@/hooks/use-toast';
import type { DeliveryOption } from '@/types/order.types';

interface OrderFormData {
  name: string;
  phone: string;
  province: string;
  canton: string;
  district: string;
  address: string;
}

const INITIAL_FORM_STATE: OrderFormData = {
  name: '',
  phone: '',
  province: '',
  canton: '',
  district: '',
  address: '',
};

export const useOrderForm = () => {
  const { addOrder } = useOrders();
  const { addNotification } = useNotifications();
  const { items, totalPrice, clearCart } = useCartOperations();
  
  const [formData, setFormData] = useState<OrderFormData>(INITIAL_FORM_STATE);
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>('pickup');
  const [paymentMethod, setPaymentMethod] = useState<string>('');

  /**
   * Handle form input changes
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /**
   * Reset form to initial state
   */
  const resetForm = () => {
    setFormData(INITIAL_FORM_STATE);
    setPaymentMethod('');
    setDeliveryOption('pickup');
  };

  /**
   * Validate required fields
   */
  const validateForm = (): boolean => {
    // Basic validation
    if (!formData.name || !formData.phone) {
      toast({
        title: 'Campos incompletos',
        description: 'Por favor completa nombre y teléfono',
        variant: 'destructive',
      });
      return false;
    }

    // Delivery validation
    if (deliveryOption === 'delivery') {
      if (!formData.province || !formData.canton || !formData.district || !formData.address) {
        toast({
          title: 'Campos incompletos',
          description: 'Por favor completa todos los campos de dirección',
          variant: 'destructive',
        });
        return false;
      }
    }

    // Payment method validation
    if (!paymentMethod) {
      toast({
        title: 'Método de pago no seleccionado',
        description: 'Por favor selecciona un método de pago',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  /**
   * Build WhatsApp message
   */
  const buildWhatsAppMessage = (): string => {
    let message = `*NUEVO PEDIDO*\n\n`;
    message += `*Productos:*\n`;
    
    items.forEach(item => {
      message += `• ${item.name} x${item.quantity} - ₡${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    message += `\n*Total: ₡${totalPrice.toFixed(2)}*\n\n`;
    message += `*Datos del cliente:*\n`;
    message += `Nombre: ${formData.name}\n`;
    message += `Teléfono: ${formData.phone}\n\n`;
    message += `*Tipo de entrega:*\n`;
    
    if (deliveryOption === 'pickup') {
      message += `Retiro en Tienda\n\n`;
    } else {
      message += `Envío a Domicilio\n`;
      message += `Provincia: ${formData.province}\n`;
      message += `Cantón: ${formData.canton}\n`;
      message += `Distrito: ${formData.district}\n`;
      message += `Dirección: ${formData.address}\n\n`;
    }
    
    message += `*Método de pago:* ${paymentMethod}\n`;
    
    if (paymentMethod === 'SINPE Móvil' || paymentMethod === 'Transferencia bancaria') {
      message += `\n_*Nota:* Recuerde enviar el comprobante de pago por este medio_`;
    }

    return message;
  };

  /**
   * Submit order
   */
  const submitOrder = (): boolean => {
    // Validate form
    if (!validateForm()) {
      return false;
    }

    // Create order
    const orderId = addOrder({
      type: 'online',
      status: 'pending',
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      })),
      total: totalPrice,
      customerInfo: {
        name: formData.name,
        phone: formData.phone,
        province: formData.province,
        canton: formData.canton,
        district: formData.district,
        address: formData.address,
      },
      deliveryOption,
      paymentMethod,
    });

    // Add notification
    addNotification({
      type: 'order',
      title: 'Nuevo pedido recibido',
      message: `Pedido ${orderId} de ${formData.name} - Total: ₡${totalPrice.toFixed(2)}`,
      time: 'Ahora',
      orderId: orderId,
    });

    // Build WhatsApp message
    const message = buildWhatsAppMessage();
    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = '50688888888'; // TODO: Move to config
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');

    // Clear cart and reset form
    clearCart();
    resetForm();

    toast({
      title: 'Pedido enviado',
      description: 'Tu pedido ha sido procesado correctamente',
    });

    return true;
  };

  return {
    // Form state
    formData,
    deliveryOption,
    paymentMethod,
    
    // Form actions
    handleInputChange,
    setDeliveryOption,
    setPaymentMethod,
    resetForm,
    
    // Validation & submission
    validateForm,
    submitOrder,
    buildWhatsAppMessage,
  };
};
