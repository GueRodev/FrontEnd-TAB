/**
 * Category and Subcategory Validation Schemas
 * Centralized validation rules using Zod
 */

import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().trim().min(1, 'El nombre es requerido').max(50, 'El nombre debe tener máximo 50 caracteres'),
});

export const subcategorySchema = z.object({
  name: z.string().trim().min(1, 'El nombre es requerido').max(50, 'El nombre debe tener máximo 50 caracteres'),
  categoryId: z.string().min(1, 'Debe seleccionar una categoría padre'),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
export type SubcategoryFormData = z.infer<typeof subcategorySchema>;
