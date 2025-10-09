/**
 * Auth Form Hook
 * Business logic for authentication forms using react-hook-form and Zod
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { loginSchema, registerSchema } from '@/lib/validations';
import type { LoginFormData, RegisterFormData } from '@/lib/validations';

export interface UseAuthFormReturn {
  // Login
  loginForm: ReturnType<typeof useForm<LoginFormData>>;
  handleLogin: (data: LoginFormData) => Promise<void>;
  
  // Register
  registerForm: ReturnType<typeof useForm<RegisterFormData>>;
  handleRegister: (data: RegisterFormData) => Promise<void>;
  
  // Shared state
  isLoading: boolean;
}

export const useAuthForm = (): UseAuthFormReturn => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Login form
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      phone: '',
    },
  });

  // Handle login submission
  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login({
        email: data.email,
        password: data.password,
      });
      navigate('/');
    } catch (error) {
      // Errors are handled by AuthContext with toasts
      // No need to expose technical details
    } finally {
      setIsLoading(false);
    }
  };

  // Handle register submission
  const handleRegister = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await register({
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
        phone: data.phone,
      });
      navigate('/');
    } catch (error) {
      // Errors are handled by AuthContext with toasts
      // No need to expose technical details
    } finally {
      setIsLoading(false);
    }
  };

  return {
    loginForm,
    handleLogin,
    registerForm,
    handleRegister,
    isLoading,
  };
};
