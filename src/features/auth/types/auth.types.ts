/**
 * Authentication Types
 * Type definitions for authentication-related data
 */

import type { UserProfile } from '@/types/user.types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
}

export interface AuthResponse {
  user: UserProfile;
  token: string;
  expires_at: string;
}

export interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
