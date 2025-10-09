/**
 * Auth Page Component
 * @next-migration: This will become app/auth/page.tsx in Next.js
 */

import React from 'react';

/**
 * @next-migration: Add metadata
 * export const metadata: Metadata = {
 *   title: 'Iniciar Sesión',
 *   description: 'Accede a tu cuenta',
 * }
 */

/**
 * Migration Notes:
 * ================
 * 
 * Current: Route handled by React Router -> src/pages/Auth.tsx
 * Future: This file at app/auth/page.tsx
 * 
 * Note: Auth page doesn't need the shop layout (Header/Footer)
 * so it's outside the (shop) group
 */

export default function AuthPagePlaceholder() {
  return null;
}
