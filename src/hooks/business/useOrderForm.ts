/**
 * useOrderForm
 * Business logic for order form validation and submission
 */

import { useState, useEffect } from 'react';
import { useOrders } from '@/contexts/OrdersContext';
import { useNotifications } from '@/contexts/NotificationsContext';
import { useCartOperations } from './useCartOperations';
import { toast } from '@/hooks/use-toast';
import { useApi } from '@/hooks/useApi';
import { orderFormSchema } from '@/lib/validations/order.validation';
import { formatCurrency } from '@/lib/formatters';
import { buildWhatsAppUrl } from '@/lib/helpers/url.helpers';
import type { DeliveryOption, DeliveryAddress } from '@/types/order.types';
import { z } from 'zod';

interface OrderFormData {
  name: string;
  phone: string;
}

const INITIAL_FORM_STATE: OrderFormData = {
  name: '',
  phone: '',
};

export const useOrderForm = () => {
  const { addOrder } = useOrders();
  const { addNotification } = useNotifications();
  const { items, totalPrice, clearCart } = useCartOperations();
  const { execute } = useApi();
  
  const [formData, setFormData] = useState<OrderFormData>(INITIAL_FORM_STATE);
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>('pickup');
  const [paymentMethod, setPaymentMethod] = useState<string>('');

  /**
   * Auto-reset payment method if delivery option changes to 'delivery' 
   * and current method is cash or card (not allowed for delivery)
   */
  useEffect(() => {
    if (deliveryOption === 'delivery' && (paymentMethod === 'cash' || paymentMethod === 'card')) {
      setPaymentMethod('transfer'); // Default to transfer for delivery
    }
  }, [deliveryOption, paymentMethod]);

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
   * Validate order form
   */
  const validateForm = (addressData?: DeliveryAddress): boolean => {
    try {
      orderFormSchema.parse({
        customerName: formData.name,
        customerPhone: formData.phone,
        deliveryType: deliveryOption,
        paymentMethod: paymentMethod,
        savedAddressId: undefined,
        manualAddress: deliveryOption === 'delivery' && addressData ? {
          province: addressData.province,
          canton: addressData.canton,
          district: addressData.district,
          address: addressData.address,
        } : undefined,
      });
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast({
          title: 'Error de validación',
          description: firstError.message,
          variant: 'destructive',
        });
      }
      return false;
    }
  };

  /**
   * Build WhatsApp message
   */
  const buildWhatsAppMessage = (addressData?: DeliveryAddress): string => {
    // Sanitizar datos antes de enviar (prevenir inyección)
    const sanitize = (str: string) => str.trim().slice(0, 200);
    
    let message = `*NUEVO PEDIDO*\n\n`;
    message += `*Productos:*\n`;
    
    items.forEach(item => {
      const itemTotal = formatCurrency(item.price * item.quantity);
      message += `• ${item.name} x${item.quantity} - ${itemTotal}\n`;
    });
    
    const total = formatCurrency(totalPrice);
    message += `\n*Total: ${total}*\n\n`;
    message += `*Datos del cliente:*\n`;
    message += `Nombre: ${sanitize(formData.name)}\n`;
    message += `Teléfono: ${sanitize(formData.phone)}\n\n`;
    message += `*Tipo de entrega:*\n`;
    
    if (deliveryOption === 'pickup') {
      message += `Retiro en Tienda\n\n`;
    } else if (addressData) {
      message += `Envío a Domicilio\n`;
      message += `Provincia: ${sanitize(addressData.province)}\n`;
      message += `Cantón: ${sanitize(addressData.canton)}\n`;
      message += `Distrito: ${sanitize(addressData.district)}\n`;
      message += `Dirección: ${sanitize(addressData.address)}\n\n`;
    }
    
    message += `*Método de pago:* ${paymentMethod}\n`;
    
    if (paymentMethod === 'sinpe' || paymentMethod === 'transfer') {
      message += `\n_*Nota:* Recuerde enviar el comprobante de pago por este medio_`;
    }

    return message;
  };

  /**
   * Submit order
   */
  const submitOrder = async (addressData?: DeliveryAddress): Promise<boolean> => {
    // Validate form
    if (!validateForm(addressData)) {
      return false;
    }

    const success = await execute(
      async () => {
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
          },
          delivery_address: deliveryOption === 'delivery' && addressData ? addressData : undefined,
          deliveryOption,
          paymentMethod,
        });

        return { orderId, customerName: formData.name };
      },
      {
        successMessage: 'Tu pedido ha sido procesado correctamente',
        onSuccess: (data) => {
          const total = formatCurrency(totalPrice);
          addNotification({
            type: 'order',
            title: 'Nuevo pedido recibido',
            message: `Pedido ${data.orderId} de ${data.customerName} - Total: ${total}`,
            time: 'Ahora',
            orderId: data.orderId,
          });

          // Build WhatsApp message and open
          const message = buildWhatsAppMessage(addressData);
          const whatsappUrl = buildWhatsAppUrl(message);
          window.open(whatsappUrl, '_blank');

          // Clear cart and reset form
          clearCart();
          resetForm();
        }
      }
    );

    return !!success;
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
