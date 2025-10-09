/**
 * 404 Not Found Page
 * @next-migration: This will become app/not-found.tsx in Next.js App Router
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * @next-migration: In Next.js, add metadata
 * export const metadata: Metadata = {
 *   title: '404 - Página no encontrada',
 * }
 */

/**
 * NotFound Component
 * Displayed when user navigates to a non-existent route
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-brand-yellow to-white px-4">
      <div className="text-center max-w-md">
        {/* Large 404 */}
        <h1 className="text-9xl font-bold text-brand-darkBlue mb-4">
          404
        </h1>
        
        {/* Error message */}
        <h2 className="text-3xl font-bold text-brand-darkBlue mb-4">
          ¡Ups! Página no encontrada
        </h2>
        
        <p className="text-lg text-gray-600 mb-8">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="gap-2">
            <Link to="/">
              <Home className="h-5 w-5" />
              Volver al Inicio
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link to="/#search">
              <Search className="h-5 w-5" />
              Buscar Productos
            </Link>
          </Button>
        </div>

        {/* Decorative elements */}
        <div className="mt-12 text-brand-orange/20 text-6xl">
          🧱
        </div>
      </div>
    </div>
  );
}

/**
 * Migration Notes:
 * ================
 * 
 * When migrating to Next.js:
 * 1. Copy this file to app/not-found.tsx
 * 2. Replace <Link> from 'react-router-dom' with <Link> from 'next/link'
 * 3. Add metadata export
 * 4. This will automatically be used for 404 errors in Next.js
 */
