/**
 * Product Validation Schemas
 * Zod schemas for product-related form validation
 */

import { z } from 'zod';

/**
 * Product creation/update schema
 */
export const productSchema = z.object({
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(200, 'El nombre no puede exceder 200 caracteres'),
  
  marca: z.string()
    .max(100, 'La marca no puede exceder 100 caracteres')
    .optional(),
  
  category: z.string()
    .min(1, 'Selecciona una categoría'),
  
  subcategory: z.string().optional(),
  
  price: z.string()
    .min(1, 'El precio es requerido')
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
      'El precio debe ser mayor a 0'
    ),
  
  stock: z.string()
    .refine(
      (val) => !isNaN(parseInt(val)) && parseInt(val) >= 0,
      'El stock debe ser un número positivo'
    ),
  
  description: z.string()
    .max(1000, 'La descripción no puede exceder 1000 caracteres')
    .optional(),
  
  status: z.enum(['active', 'inactive'], {
    errorMap: () => ({ message: 'Estado inválido' }),
  }),
});

export type ProductFormData = z.infer<typeof productSchema>;
