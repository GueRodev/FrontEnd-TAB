/**
 * Admin Dashboard Page
 * @next-migration: This will become app/admin/page.tsx in Next.js
 */

import React from 'react';

/**
 * @next-migration: Add metadata
 * export const metadata: Metadata = {
 *   title: 'Panel de Administración',
 *   description: 'Gestiona tu tienda',
 * }
 */

/**
 * Migration Notes:
 * ================
 * 
 * Current: Route handled by React Router -> src/pages/Admin.tsx
 * Future: This file at app/admin/page.tsx
 * 
 * The AdminHeader in the existing component should be moved
 * to the layout since all admin pages will share it.
 */

export default function AdminDashboardPlaceholder() {
  return null;
}
