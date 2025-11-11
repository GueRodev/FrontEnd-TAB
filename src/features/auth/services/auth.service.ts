/**
 * Authentication Service
 * Handles user authentication operations
 * 
 * ✅ INTEGRADO CON LARAVEL BACKEND
 * - Laravel Sanctum token-based authentication
 * - Spatie roles & permissions
 * - Data transformers for Laravel responses
 * 
 * 📖 Documentación completa: docs/AUTH-LARAVEL-INTEGRATION.md
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
   * ✅ Integrado con Laravel: POST /api/v1/auth/login
   * 
   * 📖 Ver: docs/AUTH-LARAVEL-INTEGRATION.md
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
   * ✅ Integrado con Laravel: POST /api/v1/auth/register
   * 
   * ⚠️ Nota: Campo 'phone' eliminado del módulo auth
   * 📖 Ver: docs/AUTH-LARAVEL-INTEGRATION.md
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
   * ✅ Integrado con Laravel: POST /api/v1/auth/logout
   * Revoca el token actual
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
   * ✅ Integrado con Laravel: POST /api/v1/auth/logout-all
   * Revoca todos los tokens del usuario
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
   * ✅ Integrado con Laravel: GET /api/v1/auth/me
   * 
   * Retorna usuario con rol desde Spatie y permisos
   * 📖 Ver: docs/AUTH-LARAVEL-INTEGRATION.md
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
   * ⚠️ PENDIENTE: Requiere endpoint Laravel
   * 
   * Endpoint requerido: PATCH /api/v1/auth/profile
   * 📖 Ver implementación en: docs/AUTH-LARAVEL-INTEGRATION.md
   */
  async updateProfile(data: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    // TODO: Descomentar cuando Laravel esté listo
    // Ver código en docs/AUTH-LARAVEL-INTEGRATION.md
    /*
    if (!APP_CONFIG.useAPI) {
      // Mock...
    }
    
    try {
      const laravelResponse = await apiClient.patch<{
        success: boolean;
        message: string;
        data: { user: LaravelAuthResponse['data']['user'] };
      }>(API_ROUTES.profile, data);

      const userProfile = transformLaravelUser(laravelResponse.data.user);

      return {
        data: userProfile,
        message: laravelResponse.message,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw error;
    }
    */
    
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
   * ⚠️ PENDIENTE: No implementado
   * 
   * Este método se moverá al módulo de perfil de usuario
   */
  async updateAdminProfile(data: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    // TODO: Implementar en módulo de perfil
    
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
   * ⚠️ PENDIENTE: No implementado
   * 
   * Este método se moverá al módulo de perfil de usuario
   */
  async uploadAvatar(file: File): Promise<ApiResponse<{ avatarUrl: string }>> {
    // TODO: Implementar en módulo de perfil
    
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
