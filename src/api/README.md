# Capa de API

Infraestructura compartida para integración con backend Laravel.

## Estado Actual

**Integración Parcial:** La aplicación usa:
- React Context para estado global
- LocalStorage para persistencia (modo desarrollo)
- **Auth Module**: ✅ 100% integrado con Laravel (ver `docs/AUTH-LARAVEL-INTEGRATION.md`)
- **Otros módulos**: Datos mock en `src/data/*`

Cada feature gestiona su propio servicio en `src/features/*/services/`.

### Ejemplo de Integración Completa: Auth Module

El módulo de autenticación es un ejemplo completo de integración con Laravel:
- ✅ Endpoints implementados: login, register, logout, logoutAll, me
- ✅ Transformadores de datos Laravel → Frontend
- ✅ Switch API automático (VITE_USE_API)
- ✅ Sanctum token authentication
- ✅ Spatie roles & permissions

📖 Ver documentación completa: `docs/AUTH-LARAVEL-INTEGRATION.md`

## Estructura de Archivos

### `client.ts`
Cliente HTTP basado en `fetch` para comunicarse con Laravel.
- Gestiona CSRF tokens
- Configura headers y autenticación
- Maneja errores HTTP estándar (401, 422, 500, etc.)

### `config.ts`
Configuración de endpoints y variables de entorno.
- Define `API_CONFIG` (baseURL, timeout, headers)
- Mapea rutas de Laravel en `API_ROUTES`
- Valida variables de entorno requeridas

### `types.ts`
Tipos TypeScript para requests/responses de API.
- `ApiResponse<T>`, `ApiError`, `ValidationError`
- `PaginatedResponse<T>`, `PaginationParams`
- `AuthToken`, `ApiRequestConfig`

### `index.ts`
Exporta cliente y tipos para uso en services de cada feature.

## Integración con Laravel

### 1. Configurar variables de entorno
```bash
VITE_API_URL=http://localhost:8000/api
VITE_USE_API=true
```

### 2. Implementar servicios en cada feature
```typescript
// src/features/products/services/products.service.ts
import { apiClient } from '@/api';

export const productsService = {
  getAll: () => apiClient.get<Product[]>('/products'),
  create: (data) => apiClient.post<Product>('/products', data),
  // ...
};
```

### 3. Usar servicios en contexts/hooks
```typescript
// En lugar de localStorage
const products = await productsService.getAll();
```

---

**Ventaja:** Cambiar de localStorage → API sin modificar componentes ni lógica de negocio.
