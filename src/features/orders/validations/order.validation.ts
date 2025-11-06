/**
 * Order Validation Schemas
 * Zod schemas for order form data validation
 */

import { z } from 'zod';

export const orderFormSchema = z.object({
  customerName: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  customerPhone: z.string().min(8, 'El teléfono debe tener al menos 8 dígitos'),
  deliveryType: z.enum(['pickup', 'delivery'], {
    required_error: 'Selecciona un tipo de entrega',
  }),
  paymentMethod: z.enum(['cash', 'card', 'transfer', 'sinpe'], {
    required_error: 'Selecciona un método de pago',
  }),
  savedAddressId: z.string().optional(),
  manualAddress: z.object({
    province: z.string().optional(),
    canton: z.string().optional(),
    district: z.string().optional(),
    address: z.string().optional(),
  }).optional(),
}).refine(
  (data) => {
    // If delivery type is delivery, must have either savedAddressId or complete manual address
    if (data.deliveryType === 'delivery') {
      if (data.savedAddressId) return true;
      if (
        data.manualAddress?.province &&
        data.manualAddress?.canton &&
        data.manualAddress?.district &&
        data.manualAddress?.address &&
        data.manualAddress.address.length >= 10
      ) {
        return true;
      }
      return false;
    }
    return true;
  },
  {
    message: 'Debes proporcionar una dirección de entrega completa',
    path: ['manualAddress'],
  }
);

export type OrderFormData = z.infer<typeof orderFormSchema>;
