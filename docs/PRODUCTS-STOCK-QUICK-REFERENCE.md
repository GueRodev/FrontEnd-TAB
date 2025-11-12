# Products & Stock Module - Quick Reference

> Guía rápida de consulta para desarrolladores

---

## 🎯 Importaciones Comunes

```typescript
// Context
import { useProducts } from '@/features/products';

// Hooks
import { 
  useProductsAdmin,
  useStockManagement,
  useProductRecycleBin,
} from '@/features/products';

// Components
import {
  ProductsListAdmin,
  ProductFormDialog,
  ProductRecycleBin,
  AdjustStockDialog,
  StockMovementHistory,
} from '@/features/products';

// Services
import { 
  productsService,
  stockMovementsService,
} from '@/features/products/services';

// Types
import type {
  Product,
  StockMovement,
  AdjustStockDto,
  StockAvailability,
} from '@/features/products/types';
```

---

## 📦 Product Type (Quick View)

```typescript
interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  brand: string | null;
  description: string | null;
  sku: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  status: 'active' | 'inactive' | 'out_of_stock';
  is_featured: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  
  // Optional relations
  category?: Category;
  stock_movements?: StockMovement[];
  stock_movements_count?: number;
}
```

---

## 🔌 Services API

### productsService

```typescript
// CRUD
productsService.getAll(filters?)          // → PaginatedResponse<Product>
productsService.getById(id)               // → Product
productsService.create(data)              // → ApiResponse<Product>
productsService.update(id, data)          // → ApiResponse<Product>
productsService.delete(id)                // → ApiResponse<void> (soft)

// Recycle Bin
productsService.getDeleted()              // → ApiResponse<Product[]>
productsService.restore(id)               // → ApiResponse<Product>
productsService.forceDelete(id)           // → ApiResponse<void>

// Stock
productsService.adjustStock(id, dto)      // → ApiResponse<Product>
```

### stockMovementsService

```typescript
// Query
stockMovementsService.getByProduct(productId)   // → StockMovement[]
stockMovementsService.getAll(filters?)          // → StockMovement[]

// Validation
stockMovementsService.checkAvailability(items)  // → StockAvailability

// Operations (used by OrdersContext)
stockMovementsService.reserveStock(dto)         // → void
stockMovementsService.confirmSale(orderId)      // → void
stockMovementsService.cancelReservation(orderId)// → void
stockMovementsService.adjustStock(id, dto)      // → StockMovement
```

---

## 🎣 Hooks Cheat Sheet

### useProducts() - Context Hook

```typescript
const {
  products,           // Product[]
  loading,            // boolean
  addProduct,         // (data) => Promise<Product>
  updateProduct,      // (id, data) => Promise<Product>
  deleteProduct,      // (id) => Promise<void>
  restoreProduct,     // (id) => Promise<Product>
  forceDeleteProduct, // (id) => Promise<void>
  getDeletedProducts, // () => Promise<Product[]>
  adjustStock,        // (id, dto) => Promise<Product>
  getProductsByCategory, // (categoryId) => Product[]
} = useProducts();
```

### useProductsAdmin() - Admin Page Hook

```typescript
const {
  categories,
  filteredProducts,
  filterSummary,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  handleEditProduct,
  handleSubmit,
  handleToggleFeatured,
  // ... more
} = useProductsAdmin();
```

### useStockManagement() - Stock Dialogs

```typescript
const {
  adjustStockDialog,      // { open: boolean, product: Product | null }
  openAdjustStockDialog,  // (product: Product) => void
  closeAdjustStockDialog, // () => void
  historyDialog,          // { open: boolean, product: Product | null }
  openHistoryDialog,      // (product: Product) => void
  closeHistoryDialog,     // () => void
} = useStockManagement();
```

### useProductRecycleBin() - Recycle Bin

```typescript
const {
  deletedProducts,        // Product[]
  isLoadingDeleted,       // boolean
  confirmDialog,          // { open, productId, productName, action }
  openRestoreDialog,      // (product: Product) => void
  openForceDeleteDialog,  // (product: Product) => void
  handleConfirm,          // () => Promise<void>
} = useProductRecycleBin();
```

---

## 🧩 Components Props

### ProductsListAdmin

```typescript
<ProductsListAdmin
  products={Product[]}
  categories={Category[]}
  onEdit={(product) => void}
  onDelete={(productId) => void}
  onToggleFeatured={(productId, isFeatured) => void}
  onAdjustStock?={(product) => void}
  onViewHistory?={(product) => void}
/>
```

### AdjustStockDialog

```typescript
<AdjustStockDialog
  open={boolean}
  onOpenChange={(open) => void}
  product={Product | null}
/>
```

### StockMovementHistory

```typescript
<StockMovementHistory
  product={Product}
/>
```

### ProductRecycleBin

```typescript
<ProductRecycleBin />
// No props - uses useProductRecycleBin internally
```

---

## 📊 DTOs

### AdjustStockDto

```typescript
interface AdjustStockDto {
  type: 'entrada' | 'salida' | 'ajuste';
  quantity: number;        // 1-10000
  reason?: string;         // max 500 chars
}
```

### ReserveStockDto

```typescript
interface ReserveStockDto {
  order_id: string;
  items: Array<{
    product_id: string;
    quantity: number;
  }>;
}
```

### CreateProductDto

```typescript
interface CreateProductDto {
  name: string;
  category_id: string;
  brand?: string | null;
  description?: string | null;
  sku?: string | null;
  price: number;
  stock: number;
  image?: File;
  status: 'active' | 'inactive' | 'out_of_stock';
  is_featured?: boolean;
}
```

---

## 🔄 Stock Movement Types

```typescript
type StockMovementType = 
  | 'entrada'              // Stock entry/purchase
  | 'salida'               // Manual exit
  | 'ajuste'               // Inventory adjustment
  | 'reserva'              // Reservation (pending order)
  | 'venta'                // Confirmed sale
  | 'cancelacion_reserva'; // Release reservation
```

---

## 🔌 Laravel Endpoints

### Products

```
GET    /api/v1/products
GET    /api/v1/products/featured
GET    /api/v1/products/{id}
POST   /api/v1/products          (FormData)
PUT    /api/v1/products/{id}     (FormData + _method=PUT)
DELETE /api/v1/products/{id}     (soft delete)
POST   /api/v1/products/{id}/restore
DELETE /api/v1/products/{id}/force
POST   /api/v1/products/{id}/stock
GET    /api/v1/products/deleted
```

### Stock Movements

```
GET  /api/v1/products/{id}/stock-movements
GET  /api/v1/stock-movements
POST /api/v1/stock-movements/check-availability
POST /api/v1/stock-movements/reserve
POST /api/v1/stock-movements/confirm-sale/{orderId}
POST /api/v1/stock-movements/cancel-reservation/{orderId}
```

---

## ⚙️ Configuration

### .env

```env
# Development (localStorage)
VITE_USE_API=false

# Production (Laravel API)
VITE_USE_API=true
VITE_API_BASE_URL=https://your-api.com
```

---

## 💡 Common Patterns

### Pattern 1: Validar Stock Pre-Order

```typescript
const items = orderData.items.map(item => ({
  product_id: item.id,
  quantity: item.quantity,
}));

const availability = await stockMovementsService.checkAvailability(items);

if (!availability.available) {
  availability.errors.forEach(err => {
    toast.error(`${err.product_name}: disponible ${err.available}`);
  });
  throw new Error('Stock insuficiente');
}
```

### Pattern 2: Ajustar Stock Manualmente

```typescript
await adjustStock(productId, {
  type: 'entrada',
  quantity: 50,
  reason: 'Nueva compra de mercancía',
});
toast.success('Stock ajustado');
```

### Pattern 3: Order Status → Stock

```typescript
// En OrdersContext.updateOrderStatus()
if (previousStatus === 'pending' && status === 'completed') {
  await stockMovementsService.confirmSale(orderId);
} else if (previousStatus === 'pending' && status === 'cancelled') {
  await stockMovementsService.cancelReservation(orderId);
}
```

---

## 🐛 Common Issues

### Issue 1: Product not found after create

**Causa:** Race condition en localStorage  
**Solución:** Ya implementada en `productsService.create()` con verificación post-creación

### Issue 2: Stock no actualizado en UI

**Causa:** Context no se actualiza después de operación  
**Solución:** Asegurar que el service retorna el producto actualizado y el context actualiza el state

### Issue 3: Image upload fails

**Causa:** No usar FormData o faltar `_method=PUT` en updates  
**Solución:** Ya implementado en `productsService.update()`

```typescript
const formData = new FormData();
formData.append('_method', 'PUT'); // Required for Laravel
formData.append('image', file);
```

---

## ✅ Validation Rules

### Product

```typescript
name: string (required, min 1, max 100)
category_id: string (required)
price: number (required, > 0)
stock: number (required, >= 0, integer)
brand: string | null (max 100)
description: string | null (max 1000)
sku: string | null (max 50, unique)
status: 'active' | 'inactive' | 'out_of_stock'
is_featured: boolean
image: File (max 5MB, jpg/jpeg/png/webp)
```

### AdjustStock

```typescript
type: 'entrada' | 'salida' | 'ajuste' (required)
quantity: number (required, > 0, <= 10000)
reason: string (optional, max 500)
```

---

## 📚 Related Docs

- `docs/PRODUCTS-STOCK-LARAVEL-INTEGRATION.md` - Full documentation
- `docs/LARAVEL-INTEGRATION-READY.md` - General Laravel integration
- `docs/API-INTEGRATION.md` - API configuration
- `src/features/products/README.md` - Module structure

---

**Quick Reference v1.0** | Last updated: 2025-11-12
