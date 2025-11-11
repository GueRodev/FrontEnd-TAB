/**
 * DevCredentials Component
 * Muestra credenciales temporales para desarrollo
 * ⚠️ ELIMINAR antes de producción
 */

import React from 'react';
import { Card } from '@/components/ui/card';
import { Key, User, AlertTriangle } from 'lucide-react';

export const DevCredentials: React.FC = () => {
  // Solo mostrar en desarrollo
  if (import.meta.env.PROD) return null;

  return (
    <Card className="mt-6 p-4 bg-yellow-50 border-yellow-200">
      <div className="flex items-center gap-2 mb-3">
        <Key className="h-4 w-4 text-yellow-700" />
        <h3 className="font-semibold text-sm text-yellow-900">
          Credenciales de Prueba
        </h3>
        <AlertTriangle className="h-4 w-4 text-yellow-600 ml-auto" />
      </div>
      
      <div className="space-y-3 text-xs">
        {/* Admin - Credenciales REALES de Laravel */}
        <div className="bg-white p-3 rounded border border-yellow-100">
          <div className="flex items-center gap-2 mb-1">
            <User className="h-3 w-3 text-brand-darkBlue" />
            <span className="font-semibold text-brand-darkBlue">Admin (Laravel Backend)</span>
          </div>
          <div className="space-y-1 text-gray-600">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">📧</span>
              <code className="bg-gray-100 px-2 py-0.5 rounded text-[11px]">
                toysandbricksdev@gmail.com
              </code>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">🔒</span>
              <code className="bg-gray-100 px-2 py-0.5 rounded text-[11px]">
                password
              </code>
            </div>
          </div>
        </div>

        {/* Cliente */}
        <div className="bg-white p-3 rounded border border-yellow-100">
          <div className="flex items-center gap-2 mb-1">
            <User className="h-3 w-3 text-gray-600" />
            <span className="font-semibold text-gray-700">Cliente</span>
          </div>
          <div className="text-gray-600 text-center py-2">
            <p>Crear nuevo usuario usando el formulario de registro</p>
            <p className="text-[10px] text-gray-500 mt-1">
              (Solo requiere: nombre, email, contraseña)
            </p>
          </div>
        </div>
      </div>

      <p className="mt-3 text-[10px] text-yellow-700 italic">
        ⚠️ Solo visible en desarrollo. Se oculta automáticamente en producción.
      </p>
    </Card>
  );
};
