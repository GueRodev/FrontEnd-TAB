# Business Logic Hooks

Esta carpeta contiene todos los hooks de lógica de negocio organizados por funcionalidad, siguiendo la misma estructura que `src/components/features/`.

## 📁 Estructura

```
src/hooks/business/
├── addresses/          # Direcciones de envío
├── auth/              # Autenticación y cuenta
├── cart/              # Carrito de compras
├── categories/        # Categorías (admin y público)
├── dashboard/         # Métricas del dashboard
├── orders/            # Pedidos y checkout
├── products/          # Productos (admin y público)
├── profile/           # Perfil de administrador
├── settings/          # Configuración del sistema
├── users/             # Gestión de usuarios
└── wishlist/          # Lista de deseos
```

## 📂 Hooks por Feature

### 📍 addresses/
- `useAddressSelection` - Selección de dirección en checkout

### 🔐 auth/
- `useAuthForm` - Formularios de login y registro
- `useAccountPage` - Página de cuenta del usuario

### 🛒 cart/
- `useCartOperations` - Operaciones del carrito de compras

### 📁 categories/
- `useCategoriesAdmin` - Gestión de categorías (admin)
- `useCategoryPage` - Página de categorías (público)

### 📊 dashboard/
- `useDashboardMetrics` - Métricas y estadísticas del dashboard

### 📦 orders/
- `useOrderForm` - Formulario y validación de pedidos
- `useOrdersAdmin` - Gestión de pedidos (admin)
- `useOrdersHistory` - Historial de pedidos archivados

### 🛍️ products/
- `useProductOperations` - Operaciones de productos (agregar al carrito, wishlist)
- `useProductFilters` - Filtros y búsqueda de productos
- `useProductModal` - Modal de detalle del producto
- `useProductsAdmin` - Gestión de productos (admin)

### 👤 profile/
- `useAdminProfile` - Perfil del administrador

### ⚙️ settings/
- `useLogoSettings` - Configuración del logo

### 👥 users/
- `useUsersAdmin` - Gestión de usuarios (admin)

### ❤️ wishlist/
- `useWishlistOperations` - Operaciones de lista de deseos
- `useWishlistPage` - Página de wishlist

## 🎯 Uso

Todos los hooks se exportan desde el index principal, manteniendo compatibilidad total:

```typescript
// ✅ Importar desde el índice principal
import { useCartOperations, useProductOperations } from '@/hooks/business';

// ✅ También puedes importar directamente desde la feature
import { useCartOperations } from '@/hooks/business/cart';
```

## 📝 Convenciones

1. **Naming**: Los hooks deben empezar con `use` seguido del nombre descriptivo
2. **Ubicación**: Colocar el hook en la carpeta que mejor represente su funcionalidad
3. **Estructura**: Cada carpeta tiene su `index.ts` que re-exporta todos sus hooks
4. **Paralelismo**: La estructura refleja `src/components/features/` para mejor organización

## ✨ Beneficios

- ✅ **Organización clara**: Hooks agrupados por contexto funcional
- ✅ **Fácil de encontrar**: Buscar hooks por feature es intuitivo
- ✅ **Escalabilidad**: Fácil agregar nuevos hooks en la carpeta correcta
- ✅ **Consistencia**: Estructura paralela a components/features
- ✅ **Sin breaking changes**: Los imports desde `@/hooks/business` siguen funcionando
