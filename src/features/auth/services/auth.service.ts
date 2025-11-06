/**
 * Authentication Service
 * Handles user authentication operations
 */

import { apiClient } from '@/api/client';
import type { AuthResponse, LoginCredentials, RegisterData } from '../types/auth.types';
import type { UserProfile } from '../types';
import type { ApiResponse } from '@/api/types';
import { validateCredentials } from '../mocks';

export const authService = {
  /**
   * Login user
   * TODO: Connect to Laravel endpoint: POST /api/auth/login
   * 
   * CREDENCIALES DE PRUEBA:
   * - Admin: admin@test.com / admin123
   * - Cliente: cliente1@test.com / cliente123
   */
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    // TODO: Uncomment when Laravel is ready
    // return apiClient.post('/auth/login', credentials);
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Validar contra usuarios mock
    const mockUser = validateCredentials(credentials.email, credentials.password);
    
    if (!mockUser) {
      throw new Error('Credenciales inválidas');
    }

    return Promise.resolve({
      data: {
        user: mockUser.profile,
        token: 'mock-token-' + mockUser.id + '-' + Date.now(),
        expires_at: new Date(Date.now() + 86400000).toISOString(),
      },
      message: 'Login exitoso',
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Register new user
   * TODO: Connect to Laravel endpoint: POST /api/auth/register
   */
  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    // TODO: Uncomment when Laravel is ready
    // return apiClient.post('/auth/register', data);
    
    return Promise.resolve({
      data: {
        user: { 
          id: '1', 
          name: data.name, 
          email: data.email, 
          phone: data.phone || '', 
          role: 'cliente' as const,
          created_at: new Date().toISOString(), 
          updated_at: new Date().toISOString() 
        },
        token: 'mock-token-123',
        expires_at: new Date(Date.now() + 86400000).toISOString(),
      },
      message: 'Registro exitoso',
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Logout user
   * TODO: Connect to Laravel endpoint: POST /api/auth/logout
   * Requires: Authorization header with Bearer token
   */
  async logout(): Promise<ApiResponse<void>> {
    // TODO: Uncomment when Laravel is ready
    // return apiClient.post('/auth/logout');
    
    return Promise.resolve({
      data: undefined,
      message: 'Logout exitoso',
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Get current authenticated user
   * 
   * 🔗 CONEXIÓN LARAVEL: GET /api/auth/me
   * 
   * ⚠️ SEGURIDAD: El backend DEBE retornar el rol desde user_roles table
   * 
   * Laravel debe:
   * 1. Verificar token JWT/Sanctum válido
   * 2. Hacer JOIN o relación con user_roles: $user->getRole()
   * 3. NUNCA retornar rol desde columna users.role (si existe, eliminarla)
   * 
   * Ejemplo Laravel (AuthController):
   * ```php
   * public function me(Request $request)
   * {
   *     $user = $request->user();
   *     return response()->json([
   *         'data' => [
   *             'id' => $user->id,
   *             'name' => $user->name,
   *             'email' => $user->email,
   *             'phone' => $user->phone,
   *             'role' => $user->getRole(), // ✅ Desde user_roles table
   *             'created_at' => $user->created_at,
   *             'updated_at' => $user->updated_at,
   *         ]
   *     ]);
   * }
   * ```
   * 
   * 📖 Ver SECURITY.md sección "Integración con Laravel Backend"
   * 
   * TODO: Connect to Laravel endpoint: GET /api/auth/me
   * Requires: Authorization header with Bearer token
   */
  async me(): Promise<ApiResponse<UserProfile>> {
    // TODO: Uncomment when Laravel is ready
    // return apiClient.get('/auth/me');
    
    const userStr = localStorage.getItem('auth_user');
    if (userStr) {
      return Promise.resolve({
        data: JSON.parse(userStr),
        timestamp: new Date().toISOString(),
      });
    }
    
    throw new Error('No authenticated user');
  },

  /**
   * Update user profile
   * 🔗 CONEXIÓN LARAVEL:
   * 1. Descomentar: return apiClient.patch('/auth/profile', data);
   * 2. Laravel debe retornar: { data: UserProfile, message: string, timestamp: string }
   * 
   * TODO: Connect to Laravel endpoint: PATCH /api/auth/profile
   * Requires: Authorization header with Bearer token
   */
  async updateProfile(data: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    // TODO: Uncomment when Laravel is ready
    // return apiClient.patch('/auth/profile', data);
    
    // Mock temporal - actualiza localStorage
    const userStr = localStorage.getItem('auth_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      const updatedUser = { ...user, ...data };
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      
      return Promise.resolve({
        data: updatedUser,
        message: 'Perfil actualizado correctamente',
        timestamp: new Date().toISOString(),
      });
    }
    
    throw new Error('No authenticated user');
  },

  /**
   * Update admin profile (includes avatar)
   * 🔗 CONEXIÓN LARAVEL:
   * 1. Descomentar: return apiClient.patch('/auth/admin/profile', data);
   * 2. Laravel debe retornar: { data: UserProfile, message: string, timestamp: string }
   */
  async updateAdminProfile(data: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    // TODO: Replace with Laravel endpoint
    // return apiClient.patch('/auth/admin/profile', data);
    
    // Mock temporal
    const savedProfile = localStorage.getItem('adminProfile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      const updatedProfile = { ...profile, ...data };
      localStorage.setItem('adminProfile', JSON.stringify(updatedProfile));
      
      return Promise.resolve({
        data: updatedProfile,
        message: 'Perfil actualizado correctamente',
        timestamp: new Date().toISOString(),
      });
    }
    
    throw new Error('No admin profile found');
  },

  /**
   * Upload avatar
   * 🔗 CONEXIÓN LARAVEL:
   * 1. Descomentar: const formData = new FormData(); formData.append('avatar', file); return apiClient.post('/auth/avatar', formData);
   * 2. Laravel debe retornar: { data: { avatarUrl: string }, message: string, timestamp: string }
   */
  async uploadAvatar(file: File): Promise<ApiResponse<{ avatarUrl: string }>> {
    // TODO: Replace with Laravel endpoint
    // const formData = new FormData();
    // formData.append('avatar', file);
    // return apiClient.post('/auth/avatar', formData);
    
    // Mock temporal - convert to base64
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({
          data: { avatarUrl: reader.result as string },
          message: 'Avatar actualizado correctamente',
          timestamp: new Date().toISOString(),
        });
      };
      reader.readAsDataURL(file);
    });
  },
};
