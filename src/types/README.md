# TypeScript Types

This directory contains centralized TypeScript type definitions for the entire application. These types are organized by domain and designed to be reusable across both frontend components and future backend API routes (Next.js migration).

## 📁 File Structure

### `product.types.ts`
Product-related types including:
- `Product` - Main product interface
- `Category` - Product category with subcategories
- `Subcategory` - Category subdivision
- `ProductStatus` - Product status enum type

### `order.types.ts`
Order management types including:
- `Order` - Complete order information
- `OrderItem` - Individual items in an order
- `OrderStatus` - Order status enum ('pending' | 'completed' | 'cancelled')
- `OrderType` - Order type enum ('online' | 'in-store')
- `CustomerInfo` - Customer information for orders
- `DeliveryOption` - Delivery method enum

### `cart.types.ts`
Shopping cart types:
- `CartItem` - Items in the shopping cart

### `user.types.ts`
User-related types:
- `UserProfile` - User profile information

### `notification.types.ts`
Notification system types:
- `Notification` - Notification interface
- `NotificationType` - Notification category enum

### `common.types.ts`
Utility and shared types:
- `ApiResponse<T>` - Generic API response wrapper (ready for Next.js API routes)
- `PaginationParams` - Pagination parameters
- `PaginatedResponse<T>` - Paginated API response
- `LoadingState` - Common loading states
- `FormState<T>` - Form state helper

## 🎯 Purpose

### Current Benefits
1. **Single Source of Truth**: All types defined in one place
2. **Better IntelliSense**: Improved autocomplete across the codebase
3. **Type Safety**: Reduced runtime errors through compile-time checks
4. **Easier Refactoring**: Change types in one place, affect everywhere

### Next.js Migration Benefits
1. **Shared Types**: Same types work in both frontend and API routes
2. **Server Components Ready**: Types designed for Server/Client component split
3. **API Route Compatibility**: Types structured for Next.js API patterns
4. **SSR Compatible**: No client-side dependencies in type definitions

## 📝 Usage Examples

### Importing Types

```typescript
// ✅ Preferred: Import from centralized types
import type { Product, Category } from '@/types/product.types';
import type { Order, OrderStatus } from '@/types/order.types';
import type { CartItem } from '@/types/cart.types';

// ✅ Also works: Import from contexts (re-exported for backward compatibility)
import type { Product } from '@/contexts/ProductsContext';
```

### Using in Components

```typescript
import type { Product } from '@/types/product.types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (id: string) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  // Component implementation
};
```

### Using in API Routes (Future Next.js)

```typescript
// app/api/products/route.ts
import type { Product } from '@/types/product.types';
import type { ApiResponse } from '@/types/common.types';

export async function GET(): Promise<ApiResponse<Product[]>> {
  const products = await db.products.findMany();
  return {
    data: products,
    status: 200,
  };
}
```

## 🔄 Migration Strategy

When migrating to Next.js:

1. **Types stay the same** - No changes needed to type definitions
2. **Import paths stay the same** - `@/types/*` continues to work
3. **Works in Server Components** - Types have no client-side dependencies
4. **Works in API Routes** - Types designed for server-side validation

## 🚀 Next Steps

After Phase 1 (Types centralization), the recommended next phases are:

- **Phase 2**: Extract business logic into custom hooks
- **Phase 3**: Create abstracted data layer with storage adapters
- **Phase 4**: Refactor components to be purely presentational

These phases will leverage these centralized types to build a fully migration-ready architecture.
