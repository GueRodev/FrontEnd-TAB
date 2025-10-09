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
  
  /**
   * ⚠️ SEGURIDAD: El rol viene de user_roles table (backend PostgreSQL + Laravel)
   * 
   * IMPORTANTE:
   * - Este valor se recibe del API Laravel, NO se modifica en el frontend
   * - El backend obtiene el rol desde la tabla user_roles (separada de users)
   * - NUNCA almacenar roles en tabla users o profiles (riesgo de escalada de privilegios)
   * - PostgreSQL usa función has_role() con SECURITY DEFINER para RLS policies
   * 
   * Arquitectura correcta:
   * ```
   * auth.users (autenticación)
   *     ↓ 1:1
   * public.users (perfiles: name, phone, email)
   *     ↓ 1:N
   * public.user_roles (roles: admin, cliente)
   *     ↓
   * has_role() ← función SECURITY DEFINER para RLS
   * ```
   * 
   * Flujo de datos:
   * 1. Frontend llama GET /api/auth/me
   * 2. Laravel verifica token y hace $user->getRole()
   * 3. Laravel hace query a user_roles table
   * 4. Laravel retorna rol en la respuesta JSON
   * 5. Frontend almacena en AuthContext (solo para UX)
   * 
   * Validación de seguridad:
   * - ✅ Backend valida rol en cada endpoint protegido
   * - ❌ Frontend NO debe usar este valor para decisiones de seguridad
   * - ❌ NUNCA modificar este valor localmente (localStorage)
   * - ❌ NUNCA confiar en headers HTTP del cliente
   * 
   * 📖 Ver SECURITY.md para:
   *    - SQL completo de user_roles table
   *    - Código Laravel completo (modelos, middleware, controllers)
   *    - Ejemplos de RLS policies en PostgreSQL
   *    - Tests de seguridad
   */
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
