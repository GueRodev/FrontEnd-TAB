/**
 * Business Logic Hooks
 * Centralized exports for all business logic hooks
 * 
 * These hooks separate business logic from presentation,
 * making components purely presentational and facilitating
 * Next.js migration (Server Components + Client Components)
 */

export { useProductOperations } from './useProductOperations';
export { useCartOperations } from './useCartOperations';
export { useOrderForm } from './useOrderForm';
export { useWishlistOperations } from './useWishlistOperations';
export { useProductFilters } from './useProductFilters';
