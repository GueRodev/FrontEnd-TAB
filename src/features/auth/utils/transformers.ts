/**
 * Data Transformers for Laravel Integration
 * Converts Laravel response format to frontend types
 */

import type { LaravelAuthResponse } from '../types/auth.types';
import type { UserProfile } from '../types/user.types';
import type { AuthResponse } from '../types/auth.types';

/**
 * Mapea roles de Laravel a roles del frontend
 * 
 * Laravel: "Super Admin" | "Cliente"
 * Frontend: "admin" | "cliente"
 */
export function mapLaravelRoleToFrontend(laravelRole: string): 'admin' | 'cliente' {
  const roleMap: Record<string, 'admin' | 'cliente'> = {
    'Super Admin': 'admin',
    'Cliente': 'cliente',
  };
  
  return roleMap[laravelRole] || 'cliente';
}

/**
 * Transforma usuario de Laravel a UserProfile del frontend
 * 
 * Conversiones:
 * - id: number → string
 * - role: "Super Admin" → "admin"
 * - Agrega permissions array
 * - Agrega email_verified_at
 */
export function transformLaravelUser(laravelUser: LaravelAuthResponse['data']['user']): UserProfile {
  return {
    id: String(laravelUser.id),
    name: laravelUser.name,
    email: laravelUser.email,
    role: mapLaravelRoleToFrontend(laravelUser.role),
    permissions: laravelUser.permissions,
    email_verified_at: laravelUser.email_verified_at,
    created_at: laravelUser.created_at,
    updated_at: laravelUser.updated_at || laravelUser.created_at,
  };
}

/**
 * Transforma respuesta completa de autenticación de Laravel
 * 
 * Laravel structure:
 * {
 *   success: true,
 *   message: "...",
 *   data: { user: {...}, token: "...", token_type: "Bearer" }
 * }
 * 
 * Frontend structure:
 * {
 *   user: UserProfile,
 *   token: string,
 *   token_type: string,
 *   expires_at: string
 * }
 */
export function transformLaravelAuthResponse(laravelResponse: LaravelAuthResponse): AuthResponse {
  return {
    user: transformLaravelUser(laravelResponse.data.user),
    token: laravelResponse.data.token,
    token_type: laravelResponse.data.token_type,
    expires_at: new Date(Date.now() + 86400000).toISOString(), // 24h por defecto
  };
}
