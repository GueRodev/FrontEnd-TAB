# Business Logic Hooks

This directory contains custom React hooks that encapsulate business logic, separating it from presentation components. This architecture facilitates testing, reusability, and future migration to Next.js.

## 📁 Available Hooks

### `useProductOperations`
Handles all product-related operations:
- ✅ Get featured products
- ✅ Filter by category/subcategory
- ✅ Add to cart with validation
- ✅ Toggle wishlist
- ✅ Find products by ID

**Usage:**
```typescript
import { useProductOperations } from '@/hooks/business';

const MyComponent = () => {
  const {
    getFeaturedProducts,
    handleAddToCart,
    handleToggleWishlist,
    isProductInWishlist
  } = useProductOperations();

  const featured = getFeaturedProducts();
  
  return (
    // Render products...
  );
};
```

---

### `useCartOperations`
Manages shopping cart functionality:
- ✅ Add/remove items
- ✅ Update quantities (increment/decrement)
- ✅ Calculate totals
- ✅ Clear cart
- ✅ Check if product is in cart

**Usage:**
```typescript
import { useCartOperations } from '@/hooks/business';

const CartComponent = () => {
  const {
    items,
    totalPrice,
    incrementQuantity,
    decrementQuantity,
    isEmpty
  } = useCartOperations();

  return (
    // Render cart items...
  );
};
```

---

### `useOrderForm`
Handles order form validation and submission:
- ✅ Form state management
- ✅ Input validation (required fields, delivery address)
- ✅ WhatsApp message builder
- ✅ Order submission
- ✅ Notification creation

**Usage:**
```typescript
import { useOrderForm } from '@/hooks/business';

const CheckoutPage = () => {
  const {
    formData,
    handleInputChange,
    deliveryOption,
    setDeliveryOption,
    submitOrder
  } = useOrderForm();

  const handleSubmit = () => {
    const success = submitOrder();
    if (success) {
      // Handle success
    }
  };

  return (
    // Render form...
  );
};
```

---

### `useWishlistOperations`
Manages wishlist functionality:
- ✅ Add/remove items
- ✅ Toggle wishlist status
- ✅ Calculate total value
- ✅ Clear wishlist
- ✅ Get item count

**Usage:**
```typescript
import { useWishlistOperations } from '@/hooks/business';

const WishlistComponent = () => {
  const {
    wishlist,
    itemCount,
    totalValue,
    removeFromWishlist,
    isEmpty
  } = useWishlistOperations();

  return (
    // Render wishlist...
  );
};
```

---

### `useProductFilters`
Handles product filtering and sorting:
- ✅ Search by name/description/brand
- ✅ Filter by category
- ✅ Filter by price range
- ✅ Sort (name, price, newest)
- ✅ Reset filters

**Usage:**
```typescript
import { useProductFilters } from '@/hooks/business';
import { useProducts } from '@/contexts/ProductsContext';

const ProductListPage = () => {
  const { products } = useProducts();
  const {
    filteredProducts,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    resetFilters
  } = useProductFilters({ products });

  return (
    // Render filtered products...
  );
};
```

---

## 🎯 Benefits

### 1. Separation of Concerns
- **Business logic** lives in hooks
- **Presentation** lives in components
- Easy to test each independently

### 2. Reusability
- Use same hook in multiple components
- DRY (Don't Repeat Yourself) principle
- Consistent behavior across app

### 3. Next.js Migration Ready
```typescript
// ✅ Works in Next.js Client Components
'use client';
import { useProductOperations } from '@/hooks/business';

// ✅ Pass data to Server Components
export default async function ProductsPage() {
  const products = await getProducts(); // Server-side
  return <ProductList products={products} />; // Client component uses hooks
}
```

### 4. Better Testing
```typescript
// Easy to unit test hooks
import { renderHook, act } from '@testing-library/react';
import { useCartOperations } from '@/hooks/business';

test('should add item to cart', () => {
  const { result } = renderHook(() => useCartOperations());
  
  act(() => {
    result.current.addToCart({
      id: '1',
      name: 'Product',
      price: 100,
      image: '/img.jpg'
    });
  });
  
  expect(result.current.items).toHaveLength(1);
});
```

---

## 🚀 Migration Strategy

### Current Architecture (React Router)
```
Component
  ├─ Business Logic (inline)
  └─ Presentation (JSX)
```

### New Architecture (Hook-based)
```
Component (Presentational)
  └─ Uses → Business Hook
              └─ Uses → Context/API
```

### Future Next.js Architecture
```
Server Component
  ├─ Fetches data (server-side)
  └─ Passes to → Client Component
                   └─ Uses → Business Hook
```

---

## 📝 Best Practices

### ✅ DO
- Use hooks for ALL business logic
- Keep components purely presentational
- Return only what components need
- Use TypeScript for type safety
- Document complex logic

### ❌ DON'T
- Mix business logic in components
- Create hooks that depend on specific components
- Return entire context objects
- Skip input validation
- Forget to handle edge cases

---

## 🔄 Next Steps

After implementing Phase 2 (Business Hooks), the next phases are:

- **Phase 3**: Create abstracted data layer (Storage Adapters)
- **Phase 4**: Refactor components to be 100% presentational
- **Phase 5**: Prepare Next.js route structure

These hooks are the foundation for all future refactoring phases!
