# Arquitectura del Proyecto

Esta documentación describe la estructura y organización del proyecto.

## Estructura de Carpetas

```
src/
├── api/                      # 🔗 Integración con Backend Laravel
│   ├── config.ts             # Configuración API y rutas de endpoints
│   ├── client.ts             # Cliente HTTP (fetch-based)
│   ├── types.ts              # Tipos para respuestas API
│   └── services/             # Servicios por dominio
│       ├── auth.service.ts
│       ├── products.service.ts
│       ├── orders.service.ts
│       └── ...
│
├── config/                   # ⚙️ Configuración de la Aplicación
│   └── app.config.ts         # Configuración de negocio, pagos, storage
│
├── components/               # 🎨 Componentes UI
│   ├── ui/                   # Componentes base (shadcn/ui)
│   ├── features/             # Componentes por funcionalidad
│   └── common/               # Componentes reutilizables
│
├── contexts/                 # 🔄 Estado Global (React Context)
│   ├── AuthContext.tsx
│   ├── ProductsContext.tsx
│   └── ...
│
├── hooks/                    # 🪝 Custom Hooks
│   └── business/             # Lógica de negocio desacoplada
│       ├── useProductsAdmin.ts
│       ├── useOrderForm.ts
│       └── ...
│
├── pages/                    # 📄 Páginas y Rutas
│   ├── Index.tsx
│   ├── Admin.tsx
│   └── ...
│
├── types/                    # 📦 Definiciones de Tipos
│   ├── product.types.ts
│   ├── user.types.ts
│   └── ...
│
├── lib/                      # 🛠️ Utilidades y Helpers
│   ├── storage/              # Adaptadores de persistencia
│   ├── helpers/              # Funciones auxiliares
│   └── validations/          # Schemas de validación (Zod)
│
└── data/                     # 📊 Datos Mock y Constantes
    ├── categories.data.ts    # Datos por defecto
    └── users.mock.ts         # Usuarios de prueba
```

## Principios de Arquitectura

### 1. **Separación de Responsabilidades**
- **UI** (`/components`): Solo renderizado y eventos
- **Lógica** (`/hooks/business`): Lógica de negocio reutilizable
- **Datos** (`/contexts`, `/api`): Gestión de estado y API

### 2. **Configuración Centralizada**
- **Backend**: `/src/api/config.ts` - Configuración de Laravel API
- **App**: `/src/config/app.config.ts` - Configuración de negocio

### 3. **Tipos Compartidos**
Todos los tipos están en `/types` para máxima reutilización.

### 4. **Backend API Layer**
La carpeta `/api` está lista para integrar con Laravel:
- Ver `/src/api/README.md` para documentación detallada
- Actualmente usa `localStorage`, preparado para migración a API real

## Flujo de Datos

```
Usuario Interactúa con UI
         ↓
  Componente (React)
         ↓
  Hook de Negocio (/hooks/business)
         ↓
    Context o API Service
         ↓
  LocalStorage o Backend Laravel
```

## Imports Comunes

```typescript
// Configuración API (Laravel)
import { API_CONFIG, API_ROUTES } from '@/api/config';

// Configuración App
import { APP_CONFIG, STORAGE_KEYS } from '@/config/app.config';

// Servicios API
import { productsService, authService } from '@/api/services';

// Tipos
import type { Product, Order, User } from '@/types/...';

// Utilidades
import { formatCurrency } from '@/lib/formatters';
```

## Migración a Laravel API

Cuando estés listo para integrar el backend:

1. **Actualizar `/src/api/config.ts`** con tu URL de Laravel
2. **Implementar servicios** en `/src/api/services/`
3. **Actualizar contexts** para usar los servicios API
4. **No cambiar componentes ni hooks** (misma interfaz)

Ver `/src/api/README.md` para detalles completos.
