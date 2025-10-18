/**
 * ⚠️ SEGURIDAD CRÍTICA: Route Protection (Frontend Only)
 * 
 * Este componente protege rutas en el FRONTEND únicamente.
 * NO es suficiente para seguridad real.
 * 
 * REQUISITOS DE BACKEND (Laravel):
 * - Middleware 'auth:sanctum' en todas las rutas protegidas
 * - Middleware 'admin' verificando rol desde user_roles table
 * - NUNCA confiar en que el usuario pasó esta validación client-side
 * 
 * Un atacante puede:
 * - Bypassear React Router modificando la URL
 * - Modificar localStorage para cambiar el rol
 * - Llamar APIs directamente sin pasar por el frontend
 * - Usar herramientas como Postman/curl para hacer requests
 * 
 * CORRECTO: Este componente mejora la UX (evita mostrar páginas innecesarias)
 * INCORRECTO: Asumir que protege datos sensibles
 * 
 * 📖 Documentación completa: Ver SECURITY.md
 * 
 * ProtectedRoute Component
 * Route protection based on authentication and role
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
