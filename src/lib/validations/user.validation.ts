/**
 * User Validation Schemas
 * Zod schemas for user-related form validation
 */

import { z } from 'zod';

/**
 * Admin creation/update schema
 */
export const adminSchema = z.object({
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  
  email: z.string()
    .email('Email inválido')
    .max(255, 'El email no puede exceder 255 caracteres'),
  
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .optional(),
  
  role: z.enum(['admin', 'moderador'], {
    errorMap: () => ({ message: 'Rol inválido' }),
  }),
});

export type AdminFormData = z.infer<typeof adminSchema>;

/**
 * Admin profile update schema
 */
export const adminProfileSchema = z.object({
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  
  email: z.string()
    .email('Email inválido')
    .max(255, 'El email no puede exceder 255 caracteres'),
  
  phone: z.string()
    .regex(/^\+?\d{1,4}[\s\-]?\d{4,14}$/, 'Teléfono inválido')
    .optional()
    .or(z.literal('')),
  
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .optional()
    .or(z.literal('')),
});

export type AdminProfileFormData = z.infer<typeof adminProfileSchema>;
