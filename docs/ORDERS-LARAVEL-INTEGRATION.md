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
