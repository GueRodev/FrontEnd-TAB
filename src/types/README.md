# TypeScript Types

This directory contains centralized TypeScript type definitions for the entire application. These types are organized by domain and designed to be reusable across the application.

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
- `Address` - User address information

### `auth.types.ts`
Authentication types:
- `AuthResponse` - Authentication response
- `LoginCredentials` - Login credentials
- `RegisterData` - Registration data

### `notification.types.ts`
Notification system types:
- `Notification` - Notification interface
- `NotificationType` - Notification category enum

### API Types (`src/lib/api/types.ts`)
API-specific types (located in `src/lib/api/`):
- `ApiResponse<T>` - Generic API response wrapper
- `PaginationParams` - Pagination parameters
- `PaginatedResponse<T>` - Paginated API response
- `ApiError` - Standardized error format
- `AuthToken` - Authentication token structure for Laravel

## 🎯 Purpose

### Current Benefits
1. **Single Source of Truth**: All types defined in one place
2. **Better IntelliSense**: Improved autocomplete across the codebase
3. **Type Safety**: Reduced runtime errors through compile-time checks
4. **Easier Refactoring**: Change types in one place, affect everywhere

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

### Using in API Services

```typescript
import type { Product } from '@/types/product.types';
import type { ApiResponse } from '@/lib/api/types';

export const productsService = {
  async getAll(): Promise<Product[]> {
    const response = await apiClient.get<ApiResponse<Product[]>>('/products');
    return response.data;
  }
};
```

## 🚀 Best Practices

### ✅ DO
- Import types using `import type` syntax
- Keep types organized by domain
- Document complex types with JSDoc comments
- Use generic types for reusable patterns
- Export types from centralized location

### ❌ DON'T
- Duplicate types across files
- Mix business logic with type definitions
- Use `any` type unless absolutely necessary
- Create circular dependencies between type files

---

These centralized types provide the foundation for a type-safe, maintainable React application!
