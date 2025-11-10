/**
 * Order Validation Schemas
 * Zod schemas for order form data validation
 */

import { z } from 'zod';

export const orderFormSchema = z.object({
  customerName: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  customerPhone: z.string().min(8, 'El teléfono debe tener al menos 8 dígitos'),
  deliveryOption: z.enum(['pickup', 'delivery'], {
    required_error: 'Selecciona un tipo de entrega',
  }),
  paymentMethod: z.enum(['cash', 'card', 'transfer', 'sinpe'], {
    required_error: 'Selecciona un método de pago',
  }),
  deliveryAddress: z.object({
    label: z.string().optional(),
    province: z.string().min(1, 'La provincia es requerida'),
    canton: z.string().min(1, 'El cantón es requerido'),
    district: z.string().min(1, 'El distrito es requerido'),
    address: z.string().min(10, 'La dirección debe tener al menos 10 caracteres'),
  }).optional(),
}).refine(
  (data) => {
    // If delivery type is envío, must have complete address
    if (data.deliveryOption === 'delivery') {
      return !!data.deliveryAddress;
    }
    return true;
  },
  {
    message: 'Debes proporcionar una dirección de entrega completa',
    path: ['deliveryAddress'],
  }
);

export type OrderFormData = z.infer<typeof orderFormSchema>;
