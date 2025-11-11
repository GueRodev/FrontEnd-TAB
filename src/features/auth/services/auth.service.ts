/**
 * Authentication Service
 * Handles user authentication operations
 */

import { apiClient } from '@/api/client';
import { API_ROUTES, APP_CONFIG } from '@/config';
import type { AuthResponse, LoginCredentials, RegisterData, LaravelAuthResponse } from '../types/auth.types';
import type { UserProfile } from '../types';
import type { ApiResponse } from '@/api/types';
import { validateCredentials } from '../mocks';
import { transformLaravelAuthResponse, transformLaravelUser } from '../utils/transformers';

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
    if (!APP_CONFIG.useAPI) {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 800));
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
    }

    // ✅ Laravel API Integration
    try {
      const laravelResponse = await apiClient.post<LaravelAuthResponse>(
        API_ROUTES.login,
        credentials
      );

      const authResponse = transformLaravelAuthResponse(laravelResponse);

      return {
        data: authResponse,
        message: laravelResponse.message,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      if (error.status === 422) {
        const errorMessages = error.errors?.email?.[0] || 'Credenciales inválidas';
        throw new Error(errorMessages);
      }
      throw error;
    }
  },

  /**
   * Register new user
   * TODO: Connect to Laravel endpoint: POST /api/auth/register
   */
  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    if (!APP_CONFIG.useAPI) {
      // Mock implementation
      return Promise.resolve({
        data: {
          user: { 
            id: '1', 
            name: data.name, 
            email: data.email, 
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
    }

    // ✅ Laravel API Integration
    try {
      const laravelResponse = await apiClient.post<LaravelAuthResponse>(
        API_ROUTES.register,
        {
          name: data.name,
          email: data.email,
          password: data.password,
          password_confirmation: data.password_confirmation,
        }
      );

      const authResponse = transformLaravelAuthResponse(laravelResponse);

      return {
        data: authResponse,
        message: laravelResponse.message,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      if (error.status === 422) {
        const errors = error.errors || {};
        const firstError = Object.values(errors)[0]?.[0] || 'Error de validación';
        throw new Error(firstError as string);
      }
      throw error;
    }
  },

  /**
   * Logout user
   * TODO: Connect to Laravel endpoint: POST /api/auth/logout
   * Requires: Authorization header with Bearer token
   */
  async logout(): Promise<ApiResponse<void>> {
    if (!APP_CONFIG.useAPI) {
      return Promise.resolve({
        data: undefined,
        message: 'Logout exitoso',
        timestamp: new Date().toISOString(),
      });
    }

    // ✅ Laravel API Integration
    try {
      const response = await apiClient.post<{ success: boolean; message: string }>(
        API_ROUTES.logout
      );

      return {
        data: undefined,
        message: response.message,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Logout from all devices
   * Revokes all user tokens
   */
  async logoutAll(): Promise<ApiResponse<void>> {
    if (!APP_CONFIG.useAPI) {
      return Promise.resolve({
        data: undefined,
        message: 'Sesión cerrada en todos los dispositivos',
        timestamp: new Date().toISOString(),
      });
    }

    try {
      const response = await apiClient.post<{ success: boolean; message: string }>(
        API_ROUTES.logoutAll
      );

      return {
        data: undefined,
        message: response.message,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw error;
    }
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
    if (!APP_CONFIG.useAPI) {
      const userStr = localStorage.getItem('auth_user');
      if (userStr) {
        return Promise.resolve({
          data: JSON.parse(userStr),
          timestamp: new Date().toISOString(),
        });
      }
      throw new Error('No authenticated user');
    }

    // ✅ Laravel API Integration
    try {
      const laravelResponse = await apiClient.get<{
        success: boolean;
        data: { user: LaravelAuthResponse['data']['user'] };
      }>(API_ROUTES.me);

      const userProfile = transformLaravelUser(laravelResponse.data.user);

      return {
        data: userProfile,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw error;
    }
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
