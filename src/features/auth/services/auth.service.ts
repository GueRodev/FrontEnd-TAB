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

import { apiClient } from "@/api/client";
import { API_ROUTES, APP_CONFIG } from "@/config";
import type { AuthResponse, LoginCredentials, RegisterData, LaravelAuthResponse } from "../types/auth.types";
import type { UserProfile } from "../types";
import type { ApiResponse } from "@/api/types";
import { transformLaravelAuthResponse, transformLaravelUser } from "../utils/transformers";

// ⚠️ VALIDACIÓN CRÍTICA: Prevenir uso accidental de mocks
if (!APP_CONFIG.useAPI) {
  console.error("❌ ERROR CRÍTICO: API Mode está desactivado");
  console.error("El módulo Auth requiere VITE_USE_API=true en .env");
  throw new Error("Módulo Auth solo funciona con Laravel backend");
}

export const authService = {
  /**
   * Login user
   * ✅ Integrado con Laravel: POST /api/v1/auth/login
   *
   * 📖 Ver: docs/AUTH-LARAVEL-INTEGRATION.md
   */
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    // ✅ Laravel API Integration
    try {
      const laravelResponse = await apiClient.post<LaravelAuthResponse>(API_ROUTES.auth.login, credentials);

      const authResponse = transformLaravelAuthResponse(laravelResponse);

      return {
        data: authResponse,
        message: laravelResponse.message,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      if (error.status === 422) {
        const errorMessages = error.errors?.email?.[0] || "Credenciales inválidas";
        throw new Error(errorMessages);
      }
      throw error;
    }
  },

  /**
   * Register new user
   * ✅ Integrado con Laravel: POST /api/v1/auth/register
   *
   * ⚠️ Nota: Campo 'phone' no es obligatorio en auth
   * 📖 Ver: docs/AUTH-LARAVEL-INTEGRATION.md
   */
  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    // ✅ Laravel API Integration
    try {
      const laravelResponse = await apiClient.post<LaravelAuthResponse>(API_ROUTES.auth.register, {
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });

      const authResponse = transformLaravelAuthResponse(laravelResponse);

      return {
        data: authResponse,
        message: laravelResponse.message,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      if (error.status === 422) {
        const errors = error.errors || {};
        const firstError = Object.values(errors)[0]?.[0] || "Error de validación";
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
    // ✅ Laravel API Integration
    try {
      const response = await apiClient.post<{ success: boolean; message: string }>(API_ROUTES.auth.logout);

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
    try {
      const response = await apiClient.post<{ success: boolean; message: string }>(API_ROUTES.auth.logoutAll);

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
    // ✅ Laravel API Integration
    try {
      const laravelResponse = await apiClient.get<{
        success: boolean;
        data: { user: LaravelAuthResponse["data"]["user"] };
      }>(API_ROUTES.auth.me);

      const userProfile = transformLaravelUser(laravelResponse.data.user);

      return {
        data: userProfile,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw error;
    }
  },
};
