/**
 * User-related types
 * Centralized types for user profiles and authentication
 */

/**
 * User Types
 * Type definitions for user-related data
 */

export interface Address {
  id: string;
  user_id: string;
  label: string; // "Casa", "Trabajo", "Oficina"
  province: string;
  canton: string;
  district: string;
  address: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'cliente' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface ClientProfile extends UserProfile {
  role: 'cliente';
  addresses?: Address[];
  default_address?: Address;
}

export interface AdminProfile extends UserProfile {
  role: 'admin';
  // Admins do not have addresses
}
