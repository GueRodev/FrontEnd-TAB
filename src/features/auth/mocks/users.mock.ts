/**
 * Mock Users Data
 * Data de prueba para desarrollo sin backend
 * 
 * ⚠️ SOLO se usa cuando VITE_USE_API=false
 * 
 * Credenciales REALES de Laravel:
 * 📖 Ver: docs/AUTH-LARAVEL-INTEGRATION.md
 */

import type { UserProfile } from '../types';

export interface MockUser {
  id: string;
  email: string;
  password: string; // Plain text solo para mock/desarrollo
  profile: UserProfile;
}

/**
 * Usuarios de prueba (solo para modo localStorage)
 * 
 * ⚠️ IMPORTANTE: Estas NO son las credenciales reales de Laravel.
 * Para credenciales de Laravel, ver: docs/AUTH-LARAVEL-INTEGRATION.md
 * 
 * CREDENCIALES MOCK (solo cuando VITE_USE_API=false):
 * 
 * 👨‍💼 ADMIN:
 *   - Email: admin@test.com
 *   - Password: admin123
 * 
 * 👤 CLIENTES:
 *   - Email: cliente1@test.com / Password: cliente123
 *   - Email: cliente2@test.com / Password: cliente123
 */
export const MOCK_USERS: MockUser[] = [
  // ADMIN
  {
    id: 'admin-001',
    email: 'admin@test.com',
    password: 'admin123',
    profile: {
      id: 'admin-001',
      name: 'Admin Sistema',
      email: 'admin@test.com',
      role: 'admin',
      permissions: ['manage_users', 'manage_products', 'manage_orders', 'manage_categories'],
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  },

  // CLIENTES
  {
    id: 'client-001',
    email: 'cliente1@test.com',
    password: 'cliente123',
    profile: {
      id: 'client-001',
      name: 'María González',
      email: 'cliente1@test.com',
      role: 'cliente',
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z',
    },
  },
  {
    id: 'client-002',
    email: 'cliente2@test.com',
    password: 'cliente123',
    profile: {
      id: 'client-002',
      name: 'Carlos Rodríguez',
      email: 'cliente2@test.com',
      role: 'cliente',
      created_at: '2024-01-20T00:00:00Z',
      updated_at: '2024-01-20T00:00:00Z',
    },
  },
];

/**
 * Buscar usuario por email
 */
export const findUserByEmail = (email: string): MockUser | undefined => {
  return MOCK_USERS.find(user => user.email.toLowerCase() === email.toLowerCase());
};

/**
 * Validar credenciales
 */
export const validateCredentials = (email: string, password: string): MockUser | null => {
  const user = findUserByEmail(email);
  
  if (!user) {
    return null;
  }

  // Validación simple para mock (en producción esto sería hash comparison)
  if (user.password === password) {
    return user;
  }

  return null;
};
