/**
 * Homepage (React Router version)
 * 
 * @next-migration: Replace with app/page.tsx
 * - Remove Header and Footer (handled by app/(shop)/layout.tsx)
 * - Fetch featured products in Server Component
 * - Use Suspense for FeaturedProducts loading state
 * 
 * Next.js version:
 * ```tsx
 * import { productsService } from '@/lib/api/services';
 * 
 * export default async function HomePage() {
 *   const featuredProducts = await productsService.getFeatured();
 *   
 *   return (
 *     <>
 *       <Hero />
 *       <FeaturedProductsSection products={featuredProducts} />
 *     </>
 *   );
 * }
 * ```
 */

import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';
import Footer from '@/components/Footer';

const Index = () => {
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
};

export default Index;
