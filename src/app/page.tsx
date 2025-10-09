/**
 * Homepage Component
 * @next-migration: This will become app/page.tsx in Next.js App Router
 * 
 * Currently references the actual component in src/pages/Index.tsx
 * This file serves as preparation for Next.js migration
 */

import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';
import Footer from '@/components/Footer';

/**
 * @next-migration: In Next.js, you can add metadata per page
 * export const metadata: Metadata = {
 *   title: 'Inicio',
 *   description: 'Descubre nuestra selección de juguetes y sets de construcción',
 * }
 */

/**
 * Homepage Component
 * Main landing page with hero section and featured products
 */
export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white relative overflow-hidden">
      <Header />
      <main className="flex-grow relative z-10">
        <Hero />
        <FeaturedProducts />
      </main>
      <Footer />
    </div>
  );
}

/**
 * Migration Notes:
 * ================
 * 
 * This component is currently a reference. The actual routing
 * is handled by React Router in src/App.tsx using src/pages/Index.tsx
 * 
 * When migrating to Next.js:
 * 1. Copy this file to app/page.tsx
 * 2. Remove the corresponding route from App.tsx
 * 3. Components will work as-is (Header, Hero, FeaturedProducts, Footer)
 * 4. Add metadata export for SEO
 * 5. Consider using Suspense for featured products loading state
 * 
 * Example with Suspense:
 * 
 * export default function HomePage() {
 *   return (
 *     <div className="min-h-screen flex flex-col bg-white">
 *       <Header />
 *       <main className="flex-grow">
 *         <Hero />
 *         <Suspense fallback={<ProductsSkeleton />}>
 *           <FeaturedProducts />
 *         </Suspense>
 *       </main>
 *       <Footer />
 *     </div>
 *   );
 * }
 */
