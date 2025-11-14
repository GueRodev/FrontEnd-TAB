# Orders Module - Laravel Integration

## Overview
This document describes the complete integration of the Orders module with the Laravel backend, including API endpoints, data transformations, and implementation details.

## Architecture

### Flow
```
Component → Hook → Context → Service → [localStorage | Laravel API]
```

### Key Changes
1. **New Order Fields**: `order_number`, `subtotal`, `shipping_cost`, `notes`, `updated_at`
2. **Extended OrderStatus**: Added `in_progress` and `archived` states
3. **Updated OrderItem**: Added `product_id`, `product_sku`, `product_description`, `subtotal`
4. **Removed DeliveryAddress.label**: Not used by Laravel backend
5. **Separate Endpoints**: Different routes for online vs in-store orders
6. **Automatic Calculations**: OrdersContext handles subtotal/total calculations; shipping_cost is always 0

## Automatic Calculations in OrdersContext

### Overview
`OrdersContext.tsx` automatically handles all financial calculations when creating orders. Hooks (`useOrderForm`, `useOrdersAdmin`) only pass the necessary data, and the context calculates derived fields.

### Calculated Fields

#### 1. **Subtotal**
- **Calculation**: `sum(item.price × item.quantity)` for all items
- **Responsibility**: OrdersContext
- **Applied to**: 
  - Order-level `subtotal`
  - Item-level `subtotal` for each OrderItem

#### 2. **Shipping Cost**
- **Current State**: Always `0` (null in backend)
- **Reason**: Backend doesn't calculate shipping costs yet
- **Future**: Ready to expand when backend implements shipping logic
- **Applied to**: Order-level `shipping_cost`

#### 3. **Total**
- **Calculation**: `subtotal + shipping_cost` (currently `total = subtotal` since shipping is 0)
- **Responsibility**: OrdersContext
- **Applied to**: Order-level `total`

### Implementation Details

#### **OrdersContext.tsx - addOrder() Method**
```typescript
// 1. Calculate subtotal from items
const subtotal = orderData.items.reduce(
  (sum, item) => sum + (item.price * item.quantity),
  0
);

// 2. Shipping cost is always 0 (backend doesn't use it yet)
const shipping_cost = 0;

// 3. Total = subtotal (no shipping for now)
const total = subtotal;

// 4. Ensure each item has subtotal calculated
const itemsWithSubtotal = orderData.items.map(item => ({
  ...item,
  subtotal: item.price * item.quantity,
}));
```

#### **Hooks Simplified**
Both `useOrderForm.ts` and `useOrdersAdmin.ts` have been simplified to:
- ❌ **No longer calculate** `subtotal`, `shipping_cost`, or `total`
- ✅ **Only pass** item data (id, product_id, name, price, quantity)
- ✅ **OrdersContext handles** all derived calculations automatically

### Data Flow
```
Hook (passes raw data)
   ↓
OrdersContext.addOrder()
   ├─► Calculate subtotal
   ├─► Set shipping_cost = 0
   ├─► Calculate total = subtotal
   ├─► Add subtotal to each item
   ↓
ordersService.create()
   ↓
Laravel API
```

### Benefits
1. ✅ **Single Source of Truth**: All calculations in one place (OrdersContext)
2. ✅ **Consistency**: Same logic for online and in-store orders
3. ✅ **Maintainability**: Easy to update shipping logic in the future
4. ✅ **Simplicity**: Hooks focus on data collection, not calculations
5. ✅ **Type Safety**: OrdersContext ensures all required fields are present

### Future Considerations
When backend implements shipping cost calculation:
1. Update `shipping_cost` calculation in `OrdersContext.addOrder()`
2. Potentially fetch shipping cost from API before order creation
3. No changes needed in hooks or components

## API Endpoints

### Client Endpoints
- `POST /api/orders` - Create online order (from cart)
- `GET /api/orders` - Get user's orders

### Admin Endpoints
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/orders?status=archived` - Get archived orders
- `POST /api/admin/orders` - Create in-store order
- `PATCH /api/admin/orders/{id}/mark-in-progress` - Mark order as in progress
- `PATCH /api/admin/orders/{id}/complete` - Complete order
- `PATCH /api/admin/orders/{id}/cancel` - Cancel order
- `POST /api/admin/orders/{id}/archive` - Archive order
- `POST /api/admin/orders/{id}/unarchive` - Restore archived order
- `DELETE /api/admin/orders/{id}` - Delete order (soft delete)

## Status Flow
```
pending → in_progress → completed
   ↓           ↓
cancelled   cancelled
```

## Data Transformations

### Laravel → Frontend
- `order_type` → `type`
- `customer_name` → `customerInfo.name`
- `shipping_address.address_details` → `delivery_address.address`
- `created_at` → `createdAt`

### Frontend → Laravel
- `type` → `order_type` (implicit in endpoint)
- `customerInfo` → `customer_name`, `customer_phone`, `customer_email`
- `delivery_address.address` → `shipping_address.address_details`
- `items` → transformed to include `product_id` only

## Testing
1. Create online order with delivery
2. Create in-store order
3. Mark order as in progress
4. Complete/cancel orders
5. Archive/restore orders
6. Verify stock movements

## Configuration
Set `VITE_USE_API=true` in `.env` to enable Laravel integration.
