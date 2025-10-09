/**
 * Shop Layout Component
 * @next-migration: This will become app/(shop)/layout.tsx in Next.js App Router
 * 
 * Layout for all shop-related pages (cart, wishlist, categories, etc.)
 * Includes Header and Footer
 */

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface ShopLayoutProps {
  children: React.ReactNode;
}

/**
 * ShopLayout Component
 * Wraps shop pages with common header and footer
 */
export default function ShopLayout({ children }: ShopLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}

/**
 * Migration Notes:
 * ================
 * 
 * When migrating to Next.js:
 * 1. Copy this file to app/(shop)/layout.tsx
 * 2. This layout will automatically wrap all pages in the (shop) folder
 * 3. The parentheses in (shop) mean it's a route group - it doesn't add
 *    a /shop segment to the URL
 * 4. All pages inside app/(shop)/ will automatically get Header + Footer
 * 
 * Structure example:
 * app/
 *   (shop)/
 *     layout.tsx        <- This file (Header + Footer)
 *     cart/
 *       page.tsx        <- /cart route
 *     wishlist/
 *       page.tsx        <- /wishlist route
 *     category/
 *       [slug]/
 *         page.tsx      <- /category/lego route
 */
