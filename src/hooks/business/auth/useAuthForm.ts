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
import { useApi } from '@/hooks/useApi';
import { toast } from '@/hooks/use-toast';

export interface UseAuthFormReturn {
  // Login
  loginForm: ReturnType<typeof useForm<LoginFormData>>;
  handleLogin: (data: LoginFormData) => Promise<void>;
  
  // Register
  registerForm: ReturnType<typeof useForm<RegisterFormData>>;
  handleRegister: (data: RegisterFormData) => Promise<void>;
  
  // Forgot Password
  showForgotPassword: boolean;
  handleForgotPassword: () => void;
  handleCloseForgotPassword: () => void;
  handleForgotPasswordSubmit: (email: string) => Promise<void>;
  
  // Shared state
  isLoading: boolean;
}

export const useAuthForm = (): UseAuthFormReturn => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { isLoading, execute } = useApi();
  const [showForgotPassword, setShowForgotPassword] = useState(false);

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
    await execute(
      () => login({
        email: data.email,
        password: data.password,
      }),
      {
        onSuccess: () => navigate('/'),
        showSuccessToast: false, // AuthContext handles success toast
        showErrorToast: false, // AuthContext handles error toast
      }
    );
  };

  // Handle register submission
  const handleRegister = async (data: RegisterFormData) => {
    await execute(
      () => register({
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
        phone: data.phone,
      }),
      {
        onSuccess: () => navigate('/'),
        showSuccessToast: false, // AuthContext handles success toast
        showErrorToast: false, // AuthContext handles error toast
      }
    );
  };

  // Forgot password handlers
  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleCloseForgotPassword = () => {
    setShowForgotPassword(false);
  };

  const handleForgotPasswordSubmit = async (email: string, code?: string) => {
    if (!code) {
      // Step 1: Simulate sending verification code
      toast({
        title: 'Código enviado',
        description: `Enviamos un código de verificación a ${email}`,
      });
      // Dialog stays open, user moves to verification step
    } else {
      // Step 2: Validate code (temporary implementation)
      toast({
        title: 'Funcionalidad en desarrollo',
        description: 'La verificación del código estará disponible próximamente.',
      });
      setShowForgotPassword(false);
    }
  };

  return {
    loginForm,
    handleLogin,
    registerForm,
    handleRegister,
    showForgotPassword,
    handleForgotPassword,
    handleCloseForgotPassword,
    handleForgotPasswordSubmit,
    isLoading,
  };
};
