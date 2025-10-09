/**
 * Admin Layout Component
 * @next-migration: This will become app/admin/layout.tsx in Next.js
 * 
 * Layout for all admin pages with AdminHeader and AdminSidebar
 */

import React from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AdminHeader from '@/components/AdminHeader';

interface AdminLayoutProps {
  children: React.ReactNode;
}

/**
 * AdminLayout Component
 * Wraps admin pages with sidebar and header
 */
export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <SidebarInset className="flex-1">
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

/**
 * Migration Notes:
 * ================
 * 
 * When migrating to Next.js:
 * 1. Copy this file to app/admin/layout.tsx
 * 2. All pages in app/admin/ will automatically use this layout
 * 3. Consider adding authentication check here:
 * 
 * export default async function AdminLayout({ children }: AdminLayoutProps) {
 *   const session = await getServerSession();
 *   if (!session?.user?.isAdmin) {
 *     redirect('/auth');
 *   }
 *   return (
 *     <SidebarProvider>
 *       ...
 *     </SidebarProvider>
 *   );
 * }
 * 
 * Structure:
 * app/
 *   admin/
 *     layout.tsx           <- This file (Sidebar + Header for all admin pages)
 *     page.tsx            <- /admin route (Dashboard)
 *     products/
 *       page.tsx          <- /admin/products route
 *     orders/
 *       page.tsx          <- /admin/orders route
 *       history/
 *         page.tsx        <- /admin/orders/history route
 */
