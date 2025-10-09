/**
 * Authentication Context
 * Manages user authentication state and operations
 * 
 * @next-migration: Works as-is in Next.js (use in Client Components)
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/lib/api/services';
import { apiClient } from '@/lib/api/client';
import type { UserProfile } from '@/types/user.types';
import type { AuthState, LoginCredentials, RegisterData } from '@/types/auth.types';
import { toast } from '@/hooks/use-toast';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  isAdmin: () => boolean;
  isClient: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('auth_token');
      const userStr = localStorage.getItem('auth_user');
      
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
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
      
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
      
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
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
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
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

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (state.user) {
      try {
        // 🔗 CONEXIÓN LARAVEL: Call backend API
        const response = await authService.updateProfile(updates);
        const updatedUser = response.data;
        
        setState(prev => ({ ...prev, user: updatedUser }));
        localStorage.setItem('auth_user', JSON.stringify(updatedUser));
        
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

  const isAdmin = (): boolean => {
    return state.user?.role === 'admin';
  };

  const isClient = (): boolean => {
    return state.user?.role === 'cliente';
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateProfile,
        isAdmin,
        isClient,
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
