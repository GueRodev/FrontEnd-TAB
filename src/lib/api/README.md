# API Layer Architecture

This directory contains the API abstraction layer for future backend integration.

## Current State (Phase 8)

The API layer is prepared but **not yet active**. Currently, all data is managed via:
- `src/contexts/*` - React Context for state management
- `src/lib/storage/` - LocalStorage for persistence
- `src/data/*` - Mock/default data

## Migration Strategy

When integrating a backend (Supabase, REST API, GraphQL, etc.), replace the implementation while keeping the same interface:

```typescript
// Before (localStorage)
const products = localStorageAdapter.getItem<Product[]>(STORAGE_KEYS.products);

// After (API)
const products = await productsService.getAll();
```

## Directory Structure

```
src/lib/api/
├── README.md                  # This file
├── client.ts                  # HTTP client configuration (axios/fetch)
├── types.ts                   # API-specific types (ApiResponse, ApiError, etc.)
├── services/
│   ├── products.service.ts    # Product CRUD operations
│   ├── orders.service.ts      # Order management
│   ├── categories.service.ts  # Category operations
│   ├── auth.service.ts        # Authentication (future)
│   └── index.ts              # Service exports
└── hooks/
    ├── useQuery.ts           # Data fetching hook (React Query wrapper)
    ├── useMutation.ts        # Data mutation hook
    └── index.ts              # Hook exports
```

## Benefits of This Architecture

### 1. **Separation of Concerns**
- Business logic in `/hooks/business/`
- Data fetching in `/lib/api/services/`
- State management in contexts (temporary) or React Query (future)

### 2. **Easy Migration**
```typescript
// Context Provider (Current)
export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState(() => 
    localStorageAdapter.getItem<Product[]>(STORAGE_KEYS.products)
  );
  // ...
}

// React Query Provider (Future)
export const ProductsProvider = ({ children }) => {
  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: productsService.getAll
  });
  // ...
}
```

### 3. **Type Safety**
All services use centralized types from `/src/types/`:
- `Product`, `Order`, `Category` remain the same
- Only the data source changes

### 4. **Testability**
Services can be easily mocked for testing:
```typescript
// Mock service for testing
jest.mock('@/lib/api/services/products.service', () => ({
  getAll: jest.fn(() => Promise.resolve(mockProducts))
}));
```

## Next.js Migration

In Next.js, this structure will enable:

### Server Components (Read-only data)
```typescript
// app/page.tsx (Server Component)
import { productsService } from '@/lib/api/services';

export default async function HomePage() {
  const products = await productsService.getFeatured();
  
  return <FeaturedProductsSection products={products} />;
}
```

### Client Components (Interactive)
```typescript
// app/cart/page.tsx (Client Component)
'use client';
import { useCartOperations } from '@/hooks/business';

export default function CartPage() {
  const { items, addToCart } = useCartOperations();
  // Same business logic, different data source
}
```

### API Routes
```typescript
// app/api/products/route.ts
import { productsService } from '@/lib/api/services';

export async function GET() {
  const products = await productsService.getAll();
  return Response.json(products);
}
```

## Implementation Checklist

- [x] Phase 1-4: Centralized types, hooks, and components
- [x] Phase 5-6: Next.js structure and optimized images
- [x] Phase 7: Migration documentation
- [x] Phase 8: API layer structure (this directory)
- [ ] **Future**: Replace localStorage with actual API calls
- [ ] **Future**: Integrate Supabase or REST API
- [ ] **Future**: Add React Query for caching and optimistic updates
- [ ] **Future**: Implement authentication service
- [ ] **Future**: Add API error handling and retry logic

## Example Migration Path

When you're ready to integrate a backend:

### Step 1: Update `productsService` implementation
```typescript
// src/lib/api/services/products.service.ts
export const productsService = {
  async getAll(): Promise<Product[]> {
    // Replace localStorage with API call
    const response = await apiClient.get('/products');
    return response.data;
  },
  // ... other methods
};
```

### Step 2: Update Context to use service
```typescript
// src/contexts/ProductsContext.tsx
import { productsService } from '@/lib/api/services';

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    productsService.getAll().then(setProducts);
  }, []);
  // ...
};
```

### Step 3: No changes needed in components!
Business logic hooks and components remain unchanged because they use the same interfaces.

---

This architecture ensures a **smooth, low-risk migration** from localStorage → API → Next.js with minimal refactoring.
