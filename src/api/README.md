# API Layer Architecture

This directory contains the API abstraction layer for Laravel backend integration.

> **📍 Nueva ubicación**: Ahora en `/src/api/` (antes en `/src/lib/api/`)
> Esta carpeta está visible a nivel raíz para facilitar la configuración del backend.

## Current State

The API layer is prepared but **not yet active**. Currently, all data is managed via:
- `src/contexts/*` - React Context for state management
- `src/lib/storage/` - LocalStorage for persistence
- `src/data/*` - Mock/default data

## Migration Strategy

When integrating a backend (Laravel, REST API, GraphQL, etc.), replace the implementation while keeping the same interface:

```typescript
// Before (localStorage)
const products = localStorageAdapter.getItem<Product[]>(STORAGE_KEYS.products);

// After (API)
const products = await productsService.getAll();
```

## Directory Structure

```
src/api/
├── README.md                  # This file
├── config.ts                  # API configuration and routes (Laravel endpoints)
├── client.ts                  # HTTP client configuration (fetch-based)
├── types.ts                   # API-specific types (ApiResponse, ApiError, etc.)
├── services/
│   ├── products.service.ts    # Product CRUD operations
│   ├── orders.service.ts      # Order management
│   ├── auth.service.ts        # Authentication
│   ├── addresses.service.ts   # Address management
│   ├── categories.service.ts  # Category management
│   ├── users.service.ts       # User management
│   └── index.ts              # Service exports
└── index.ts                  # Main exports
```

## Benefits of This Architecture

### 1. **Separation of Concerns**
- Business logic in `/hooks/business/`
- Data fetching in `/lib/api/services/`
- State management in contexts (temporary)

### 2. **Easy Migration**
```typescript
// Context Provider (Current)
export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState(() => 
    localStorageAdapter.getItem<Product[]>(STORAGE_KEYS.products)
  );
  // ...
}

// Future: Replace with API calls
export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    productsService.getAll().then(setProducts);
  }, []);
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

## Implementation Checklist

- [x] Centralized types, hooks, and components
- [x] API layer structure (this directory)
- [x] Laravel connection comments (`🔗 CONEXIÓN LARAVEL`)
- [ ] **Future**: Replace localStorage with actual API calls
- [ ] **Future**: Integrate Laravel backend
- [ ] **Future**: Add error handling and retry logic
- [ ] **Future**: Implement authentication service

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

This architecture ensures a **smooth, low-risk migration** from localStorage → API with minimal refactoring.
