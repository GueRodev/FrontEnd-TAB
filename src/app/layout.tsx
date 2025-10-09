/**
 * Root Layout Component
 * @next-migration: This will become the root layout.tsx in Next.js App Router
 * 
 * Currently serves as reference/preparation for Next.js migration
 * The actual routing is handled by React Router in src/App.tsx
 */

import React from 'react';
import { siteConfig } from '@/config/site';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import ScrollToTop from '@/components/ScrollToTop';

/**
 * @next-migration: In Next.js, this will generate metadata
 * export const metadata: Metadata = {
 *   title: siteConfig.metadata.title,
 *   description: siteConfig.metadata.description,
 *   keywords: siteConfig.metadata.keywords,
 *   openGraph: {
 *     type: 'website',
 *     locale: 'es_MX',
 *     url: siteConfig.url,
 *     title: siteConfig.name,
 *     description: siteConfig.description,
 *     siteName: siteConfig.name,
 *   },
 *   twitter: {
 *     card: 'summary_large_image',
 *     title: siteConfig.name,
 *     description: siteConfig.description,
 *   },
 * }
 */

interface RootLayoutProps {
  children: React.ReactNode;
}

/**
 * RootLayout Component
 * Provides the base HTML structure and global providers
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      {children}
      <ScrollToTop />
      <Toaster />
      <Sonner />
    </>
  );
}

/**
 * Migration Notes:
 * ================
 * 
 * When migrating to Next.js:
 * 1. This file will replace the <html> and <body> tags
 * 2. Move all Context Providers from App.tsx to this layout
 * 3. Add font optimization using next/font
 * 4. Add Analytics and other global scripts
 * 5. Uncomment and export the metadata object
 * 
 * Example with providers:
 * 
 * export default function RootLayout({ children }: RootLayoutProps) {
 *   return (
 *     <html lang="es">
 *       <body className={inter.className}>
 *         <ProductsProvider>
 *           <CategoriesProvider>
 *             <CartProvider>
 *               <WishlistProvider>
 *                 <OrdersProvider>
 *                   <NotificationsProvider>
 *                     {children}
 *                     <ScrollToTop />
 *                     <Toaster />
 *                     <Sonner />
 *                   </NotificationsProvider>
 *                 </OrdersProvider>
 *               </WishlistProvider>
 *             </CartProvider>
 *           </CategoriesProvider>
 *         </ProductsProvider>
 *       </body>
 *     </html>
 *   );
 * }
 */
