/**
 * Users Service
 * API service for user management operations (admin)
 */

import type { UserProfile, ClientProfile, AdminProfile } from '@/types/user.types';
import type { ApiResponse } from '../types';
import { localStorageAdapter } from '@/lib/storage';

export const usersService = {
  /**
   * Get all clients
   * 🔗 CONEXIÓN LARAVEL:
   * 1. Descomentar: return apiClient.get('/users/clients');
   * 2. Eliminar líneas 20-22 (mock)
   * 3. Laravel debe retornar: { data: ClientProfile[], timestamp: string }
   */
  async getClients(): Promise<ApiResponse<ClientProfile[]>> {
    // TODO: Replace with Laravel endpoint
    // return apiClient.get('/users/clients');
    
    // Mock temporal
    return Promise.resolve({
      data: [],
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Get all admins
   * 🔗 CONEXIÓN LARAVEL:
   * 1. Descomentar: return apiClient.get('/users/admins');
   * 2. Eliminar líneas 37-39 (mock)
   * 3. Laravel debe retornar: { data: AdminProfile[], timestamp: string }
   */
  async getAdmins(): Promise<ApiResponse<AdminProfile[]>> {
    // TODO: Replace with Laravel endpoint
    // return apiClient.get('/users/admins');
    
    // Mock temporal
    return Promise.resolve({
      data: [],
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Update user status (active/inactive)
   * 🔗 CONEXIÓN LARAVEL:
   * 1. Descomentar: return apiClient.patch(`/users/${userId}/status`, { active });
   * 2. Eliminar líneas 54-60 (mock)
   * 3. Laravel debe retornar: { data: UserProfile, message: string, timestamp: string }
   */
  async updateUserStatus(userId: string, active: boolean): Promise<ApiResponse<UserProfile>> {
    // TODO: Replace with Laravel endpoint
    // return apiClient.patch(`/users/${userId}/status`, { active });
    
    // Mock temporal
    return Promise.resolve({
      data: {} as UserProfile,
      message: 'Estado actualizado correctamente',
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Create admin user
   * 🔗 CONEXIÓN LARAVEL:
   * 1. Descomentar: return apiClient.post('/users/admins', data);
   * 2. Eliminar líneas 78-84 (mock)
   * 3. Laravel debe retornar: { data: AdminProfile, message: string, timestamp: string }
   */
  async createAdmin(data: {
    name: string;
    email: string;
    password: string;
    role: string;
  }): Promise<ApiResponse<AdminProfile>> {
    // TODO: Replace with Laravel endpoint
    // return apiClient.post('/users/admins', data);
    
    // Mock temporal
    return Promise.resolve({
      data: {} as AdminProfile,
      message: 'Administrador creado correctamente',
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Update admin user
   * 🔗 CONEXIÓN LARAVEL:
   * 1. Descomentar: return apiClient.put(`/users/admins/${adminId}`, data);
   * 2. Eliminar líneas 101-107 (mock)
   * 3. Laravel debe retornar: { data: AdminProfile, message: string, timestamp: string }
   */
  async updateAdmin(adminId: string, data: Partial<AdminProfile>): Promise<ApiResponse<AdminProfile>> {
    // TODO: Replace with Laravel endpoint
    // return apiClient.put(`/users/admins/${adminId}`, data);
    
    // Mock temporal
    return Promise.resolve({
      data: {} as AdminProfile,
      message: 'Administrador actualizado correctamente',
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Delete admin user
   * 🔗 CONEXIÓN LARAVEL:
   * 1. Descomentar: return apiClient.delete(`/users/admins/${adminId}`);
   * 2. Eliminar líneas 122-128 (mock)
   * 3. Laravel debe retornar: { message: string, timestamp: string }
   */
  async deleteAdmin(adminId: string): Promise<ApiResponse<void>> {
    // TODO: Replace with Laravel endpoint
    // return apiClient.delete(`/users/admins/${adminId}`);
    
    // Mock temporal
    return Promise.resolve({
      data: undefined as void,
      message: 'Administrador eliminado correctamente',
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Assign role to user
   * 🔗 CONEXIÓN LARAVEL:
   * 1. Descomentar: return apiClient.post(`/users/${userId}/roles`, { role });
   * 2. Eliminar líneas 147-153 (mock)
   * 3. Laravel debe retornar: { data: UserProfile, message: string, timestamp: string }
   * 4. IMPORTANTE: Usar tabla user_roles separada (seguridad)
   */
  async assignRole(userId: string, role: 'admin' | 'cliente'): Promise<ApiResponse<UserProfile>> {
    // TODO: Replace with Laravel endpoint
    // return apiClient.post(`/users/${userId}/roles`, { role });
    
    // Mock temporal
    return Promise.resolve({
      data: {} as UserProfile,
      message: 'Rol asignado correctamente',
      timestamp: new Date().toISOString(),
    });
  },
};
