/**
 * Authentication Context
 * Manages user authentication state and operations
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services';
import { apiClient } from '@/api/client';
import { STORAGE_KEYS } from '@/config';
import type { UserProfile } from '../types';
import type { AuthState, LoginCredentials, RegisterData } from '../types/auth.types';
import { toast } from '@/hooks/use-toast';

interface AuthContextType extends AuthState {
  permissions: string[];
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  isAdmin: () => boolean;
  isClient: () => boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const permissions = state.user?.permissions || [];

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem(STORAGE_KEYS.authToken);
      const userStr = localStorage.getItem(STORAGE_KEYS.authUser);
      
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          apiClient.setAuthToken(token);
          setState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error('Error loading user:', error);
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };
    
    loadUser();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      const { user, token } = response.data;
      
      // Save to localStorage
      localStorage.setItem(STORAGE_KEYS.authToken, token);
      localStorage.setItem(STORAGE_KEYS.authUser, JSON.stringify(user));
      
      // Set token in apiClient
      apiClient.setAuthToken(token);
      
      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
      
      toast({
        title: 'Inicio de sesión exitoso',
        description: `Bienvenido ${user.name}`,
      });
    } catch (error) {
      toast({
        title: 'Error de autenticación',
        description: 'Credenciales incorrectas',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await authService.register(data);
      const { user, token } = response.data;
      
      localStorage.setItem(STORAGE_KEYS.authToken, token);
      localStorage.setItem(STORAGE_KEYS.authUser, JSON.stringify(user));
      apiClient.setAuthToken(token);
      
      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
      
      toast({
        title: 'Registro exitoso',
        description: 'Tu cuenta ha sido creada',
      });
    } catch (error) {
      toast({
        title: 'Error en el registro',
        description: 'No se pudo crear la cuenta',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem(STORAGE_KEYS.authToken);
      localStorage.removeItem(STORAGE_KEYS.authUser);
      apiClient.removeAuthToken();
      
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
      
      toast({
        title: 'Sesión cerrada',
        description: 'Has cerrado sesión exitosamente',
      });
    }
  };

  const logoutAll = async () => {
    try {
      await authService.logoutAll();
    } catch (error) {
      console.error('Logout all error:', error);
    } finally {
      localStorage.removeItem(STORAGE_KEYS.authToken);
      localStorage.removeItem(STORAGE_KEYS.authUser);
      apiClient.removeAuthToken();
      
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
      
      toast({
        title: 'Sesión cerrada en todos los dispositivos',
        description: 'Has cerrado sesión en todos tus dispositivos',
      });
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (state.user) {
      try {
        // 🔗 CONEXIÓN LARAVEL: Call backend API
        const response = await authService.updateProfile(updates);
        const updatedUser = response.data;
        
        setState(prev => ({ ...prev, user: updatedUser }));
        localStorage.setItem(STORAGE_KEYS.authUser, JSON.stringify(updatedUser));
        
        toast({
          title: 'Perfil actualizado',
          description: 'Tu perfil ha sido actualizado correctamente',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'No se pudo actualizar el perfil',
          variant: 'destructive',
        });
      }
    }
  };

  /**
   * ⚠️ SEGURIDAD: Role Check (Client-Side Only)
   * 
   * IMPORTANTE: Esta validación es SOLO para UX (mostrar/ocultar componentes en la UI).
   * NUNCA confiar en esta función para decisiones de seguridad.
   * 
   * El backend DEBE:
   * 1. Verificar rol en CADA endpoint protegido mediante middleware
   * 2. Obtener rol desde tabla user_roles (NO desde users o profiles)
   * 3. NUNCA confiar en headers, localStorage o claims del frontend
   * 
   * Un atacante puede:
   * - Modificar localStorage
   * - Bypassear React Router
   * - Llamar APIs directamente con Postman/curl
   * 
   * 📖 Ver SECURITY.md para arquitectura completa
   */
  const isAdmin = (): boolean => {
    return state.user?.role === 'admin';
  };

  /**
   * ⚠️ SEGURIDAD: Role Check (Client-Side Only)
   * 
   * Ver comentario en isAdmin() arriba. Esta función también es solo para UX.
   * 
   * 📖 Ver SECURITY.md para más detalles
   */
  const isClient = (): boolean => {
    return state.user?.role === 'cliente';
  };

  /**
   * ⚠️ SEGURIDAD: Permission Check (Client-Side Only)
   * 
   * IMPORTANTE: Esta validación es SOLO para UX (mostrar/ocultar componentes en la UI).
   * NUNCA confiar en esta función para decisiones de seguridad.
   * 
   * El backend DEBE verificar permisos en cada endpoint protegido.
   * Super Admin tiene todos los permisos automáticamente.
   */
  const hasPermission = (permission: string): boolean => {
    if (!state.user) return false;
    
    // Super Admin tiene todos los permisos
    if (state.user.role === 'admin') {
      return true;
    }
    
    return state.user.permissions?.includes(permission) || false;
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        permissions,
        login,
        register,
        logout,
        logoutAll,
        updateProfile,
        isAdmin,
        isClient,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
