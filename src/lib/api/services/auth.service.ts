/**
 * Authentication Service
 * Handles user authentication operations
 */

import { apiClient } from '../client';
import type { AuthResponse, LoginCredentials, RegisterData } from '@/types/auth.types';
import type { UserProfile } from '@/types/user.types';
import type { ApiResponse } from '../types';

export const authService = {
  /**
   * Login user
   * TODO: Connect to Laravel endpoint: POST /api/auth/login
   */
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    // TODO: Uncomment when Laravel is ready
    // return apiClient.post('/auth/login', credentials);
    
    // Mock temporal - simula respuesta de Laravel
    return Promise.resolve({
      data: {
        user: { 
          id: '1', 
          name: 'Usuario Demo', 
          email: credentials.email, 
          phone: '', 
          role: 'cliente' as const,
          created_at: new Date().toISOString(), 
          updated_at: new Date().toISOString() 
        },
        token: 'mock-token-123',
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
