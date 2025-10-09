# Plan de Integración: React/Vite ↔ Laravel 12 API

## 📋 Resumen Ejecutivo

Tu arquitectura está **95% lista** para conectarse con Laravel. Solo necesitas:
1. **Configurar la URL del backend** (5 minutos)
2. **Reemplazar localStorage con llamadas API** en 2 servicios (30 minutos)
3. **Actualizar Contexts** para usar los servicios (15 minutos)
4. **Agregar manejo de errores** de Laravel (20 minutos)

**Total estimado: 70 minutos de trabajo**

---

## 🎯 Arquitectura Actual vs. Futura

### Estado Actual (LocalStorage)
```
Usuario → Context → LocalStorage
                ↓
              Service (mock)
```

### Estado Futuro (Laravel API)
```
Usuario → Context → Service → API Client → Laravel Backend
                                              ↓
                                         Base de Datos
```

---

## 🔧 FASE 1: Configuración del Cliente API (5 min)

### Archivo: `src/lib/api/client.ts`

**Cambios necesarios:**

```typescript
// ANTES (línea 16)
baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',

// DESPUÉS
baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
```

**Agregar headers para Laravel:**

```typescript
// ANTES (líneas 18-20)
headers: {
  'Content-Type': 'application/json',
},

// DESPUÉS
headers: {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
},
```

**Crear archivo de variables de entorno:**

Crear `.env.local` en la raíz del proyecto:
```env
VITE_API_URL=http://localhost:8000/api
```

Para producción crear `.env.production`:
```env
VITE_API_URL=https://tu-dominio.com/api
```

---

## 🛠️ FASE 2: Migrar Products Service (15 min)

### Archivo: `src/lib/api/services/products.service.ts`

**Reemplazar TODO el contenido con:**

```typescript
import type { Product } from '@/types/product.types';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '../types';
import { apiClient } from '../client';

export const productsService = {
  // GET /api/products
  async getAll(): Promise<Product[]> {
    return apiClient.get<Product[]>('/products');
  },

  // GET /api/products?page=1&limit=12
  async getPaginated(params: PaginationParams): Promise<PaginatedResponse<Product>> {
    return apiClient.get<PaginatedResponse<Product>>('/products', params);
  },

  // GET /api/products/{id}
  async getById(id: string): Promise<Product | null> {
    try {
      return await apiClient.get<Product>(`/products/${id}`);
    } catch (error) {
      return null;
    }
  },

  // GET /api/products/category/{categoryId}
  async getByCategory(categoryId: string): Promise<Product[]> {
    return apiClient.get<Product[]>(`/products/category/${categoryId}`);
  },

  // GET /api/products/subcategory/{subcategoryId}
  async getBySubcategory(subcategoryId: string): Promise<Product[]> {
    return apiClient.get<Product[]>(`/products/subcategory/${subcategoryId}`);
  },

  // GET /api/products/featured
  async getFeatured(): Promise<Product[]> {
    return apiClient.get<Product[]>('/products/featured');
  },

  // GET /api/products/search?q=termo
  async search(query: string): Promise<Product[]> {
    return apiClient.get<Product[]>('/products/search', { q: query });
  },

  // POST /api/products
  async create(data: Omit<Product, 'id' | 'createdAt'>): Promise<ApiResponse<Product>> {
    return apiClient.post<ApiResponse<Product>>('/products', data);
  },

  // PUT /api/products/{id}
  async update(id: string, data: Partial<Product>): Promise<ApiResponse<Product>> {
    return apiClient.put<ApiResponse<Product>>(`/products/${id}`, data);
  },

  // DELETE /api/products/{id}
  async delete(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`/products/${id}`);
  },
};
```

---

## 📦 FASE 3: Migrar Orders Service (15 min)

### Archivo: `src/lib/api/services/orders.service.ts`

**Reemplazar TODO el contenido con:**

```typescript
import type { Order, OrderStatus, OrderType } from '@/types/order.types';
import type { ApiResponse } from '../types';
import { apiClient } from '../client';

export const ordersService = {
  // GET /api/orders
  async getAll(): Promise<Order[]> {
    return apiClient.get<Order[]>('/orders');
  },

  // GET /api/orders/{id}
  async getById(id: string): Promise<Order | null> {
    try {
      return await apiClient.get<Order>(`/orders/${id}`);
    } catch (error) {
      return null;
    }
  },

  // GET /api/orders?type=online
  async getByType(type: OrderType): Promise<Order[]> {
    return apiClient.get<Order[]>('/orders', { type });
  },

  // GET /api/orders?archived=true
  async getArchived(): Promise<Order[]> {
    return apiClient.get<Order[]>('/orders', { archived: true });
  },

  // POST /api/orders
  async create(data: Omit<Order, 'id' | 'createdAt'>): Promise<ApiResponse<Order>> {
    return apiClient.post<ApiResponse<Order>>('/orders', data);
  },

  // PATCH /api/orders/{id}/status
  async updateStatus(id: string, status: OrderStatus): Promise<ApiResponse<Order>> {
    return apiClient.patch<ApiResponse<Order>>(`/orders/${id}/status`, { status });
  },

  // PATCH /api/orders/{id}/archive
  async archive(id: string): Promise<ApiResponse<Order>> {
    return apiClient.patch<ApiResponse<Order>>(`/orders/${id}/archive`);
  },

  // PATCH /api/orders/{id}/unarchive
  async unarchive(id: string): Promise<ApiResponse<Order>> {
    return apiClient.patch<ApiResponse<Order>>(`/orders/${id}/unarchive`);
  },

  // DELETE /api/orders/{id}
  async delete(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`/orders/${id}`);
  },
};
```

---

## 🔄 FASE 4: Actualizar ProductsContext (10 min)

### Archivo: `src/contexts/ProductsContext.tsx`

**Cambios necesarios:**

```typescript
// REEMPLAZAR líneas 28-29
// ANTES:
import { localStorageAdapter } from '@/lib/storage';
import { STORAGE_KEYS } from '@/data/constants';

// DESPUÉS:
import { productsService } from '@/lib/api/services';

// REEMPLAZAR líneas 45-52 (useState inicial)
// ANTES:
const [products, setProducts] = useState<Product[]>(() => {
  return localStorageAdapter.getItem<Product[]>(STORAGE_KEYS.products) || [];
});

useEffect(() => {
  localStorageAdapter.setItem(STORAGE_KEYS.products, products);
}, [products]);

// DESPUÉS:
const [products, setProducts] = useState<Product[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productsService.getAll();
      setProducts(data);
    } catch (err) {
      setError('Error al cargar productos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  fetchProducts();
}, []);

// ACTUALIZAR addProduct (líneas 54-62)
const addProduct = async (productData: Omit<Product, 'id' | 'createdAt'>) => {
  try {
    const response = await productsService.create(productData);
    setProducts(prev => [...prev, response.data]);
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// ACTUALIZAR updateProduct (líneas 64-70)
const updateProduct = async (id: string, productData: Partial<Product>) => {
  try {
    const response = await productsService.update(id, productData);
    setProducts(prev => 
      prev.map(product => product.id === id ? response.data : product)
    );
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// ACTUALIZAR deleteProduct (líneas 72-74)
const deleteProduct = async (id: string) => {
  try {
    await productsService.delete(id);
    setProducts(prev => prev.filter(product => product.id !== id));
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};
```

**Actualizar interface (línea 34):**
```typescript
interface ProductsContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProductsByCategory: (categoryId: string) => Product[];
  getProductsBySubcategory: (subcategoryId: string) => Product[];
}
```

---

## 📝 FASE 5: Actualizar OrdersContext (10 min)

### Archivo: `src/contexts/OrdersContext.tsx`

**Aplicar los mismos cambios que en ProductsContext:**

1. Importar `ordersService` en lugar de `localStorageAdapter`
2. Agregar `loading` y `error` al estado
3. Crear `useEffect` para fetch inicial
4. Convertir todos los métodos a `async`
5. Actualizar la interface para reflejar métodos async

---

## 🚨 FASE 6: Manejo de Errores de Laravel (15 min)

### Archivo: `src/lib/api/client.ts`

**Mejorar el manejo de errores (líneas 63-74):**

```typescript
try {
  const response = await fetch(urlWithParams, requestInit);

  // Manejar errores HTTP
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    // Error de validación de Laravel (422)
    if (response.status === 422 && errorData.errors) {
      throw {
        status: 422,
        message: 'Validation error',
        errors: errorData.errors,
      };
    }
    
    // Error de autenticación (401)
    if (response.status === 401) {
      throw {
        status: 401,
        message: errorData.message || 'No autenticado',
      };
    }
    
    // Otros errores
    throw {
      status: response.status,
      message: errorData.message || `HTTP error! status: ${response.status}`,
    };
  }

  return await response.json();
} catch (error) {
  console.error('API request failed:', error);
  throw error;
}
```

---

## 🔐 FASE 7: Autenticación Laravel Sanctum (Opcional)

Si tu Laravel usa Sanctum, agregar:

### Archivo: `src/contexts/AuthContext.tsx` (NUEVO)

```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Obtener usuario autenticado al cargar
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await apiClient.get<User>('/user');
        setUser(userData);
      } catch (error) {
        setUser(null);
      }
    };
    
    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    // Laravel Sanctum CSRF cookie
    await apiClient.get('/sanctum/csrf-cookie');
    
    // Login
    await apiClient.post('/login', { email, password });
    
    // Obtener datos del usuario
    const userData = await apiClient.get<User>('/user');
    setUser(userData);
  };

  const logout = async () => {
    await apiClient.post('/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

---

## 📋 Checklist de Backend Laravel

Tu equipo de Laravel debe crear estos endpoints:

### Products Endpoints
```
GET    /api/products
GET    /api/products/{id}
GET    /api/products/category/{categoryId}
GET    /api/products/subcategory/{subcategoryId}
GET    /api/products/featured
GET    /api/products/search?q=termo
POST   /api/products
PUT    /api/products/{id}
DELETE /api/products/{id}
```

### Orders Endpoints
```
GET    /api/orders
GET    /api/orders/{id}
GET    /api/orders?type=online
GET    /api/orders?archived=true
POST   /api/orders
PATCH  /api/orders/{id}/status
PATCH  /api/orders/{id}/archive
PATCH  /api/orders/{id}/unarchive
DELETE /api/orders/{id}
```

### Formato de Respuesta Esperado

**Success Response:**
```json
{
  "data": { ... },
  "message": "Success message",
  "timestamp": "2025-10-09T12:00:00Z"
}
```

**Error Response:**
```json
{
  "message": "Error message",
  "errors": {
    "field": ["Error detail"]
  }
}
```

---

## 🧪 Testing Checklist

### 1. Verificar conexión básica
```bash
# Desde el navegador
fetch('http://localhost:8000/api/products')
  .then(r => r.json())
  .then(console.log)
```

### 2. Probar CRUD de productos
- ✅ Listar productos
- ✅ Crear producto
- ✅ Editar producto
- ✅ Eliminar producto

### 3. Probar CRUD de órdenes
- ✅ Crear orden desde carrito
- ✅ Listar órdenes
- ✅ Cambiar estado
- ✅ Archivar orden

### 4. Verificar errores
- ✅ Error 404 (producto no existe)
- ✅ Error 422 (validación)
- ✅ Error 500 (servidor)

---

## 📊 Beneficios de esta Arquitectura

| Aspecto | Beneficio |
|---------|-----------|
| **Separación de responsabilidades** | Contextos manejan estado, Services manejan API |
| **Reusabilidad** | Servicios pueden usarse en Next.js sin cambios |
| **Type Safety** | TypeScript garantiza contratos entre frontend y backend |
| **Testing** | Fácil mockear servicios para tests |
| **Migración gradual** | Puedes migrar un módulo a la vez |
| **Escalabilidad** | Agregar nuevos endpoints es trivial |

---

## 🚀 Orden de Implementación Recomendado

1. ✅ **FASE 1**: Configurar cliente API (5 min)
2. ✅ **FASE 2**: Migrar Products Service (15 min)
3. ✅ **FASE 4**: Actualizar ProductsContext (10 min)
4. 🧪 **TESTING**: Probar productos (10 min)
5. ✅ **FASE 3**: Migrar Orders Service (15 min)
6. ✅ **FASE 5**: Actualizar OrdersContext (10 min)
7. 🧪 **TESTING**: Probar órdenes (10 min)
8. ✅ **FASE 6**: Mejorar manejo de errores (15 min)
9. ✅ **FASE 7**: Agregar auth (opcional, 30 min)

**Total: 120 minutos (2 horas)**

---

## 💡 Consejos para Claude AI / Claude Code

Al usar este documento con IA generativa:

1. **Migración por fases**: Pide implementar una fase a la vez
2. **Contexto completo**: Proporciona este documento completo al inicio
3. **Verificación**: Después de cada fase, pide revisar que el código compile
4. **Tipos TypeScript**: La IA debe respetar todos los tipos definidos en `src/types/`
5. **No romper funcionalidad**: Solo modificar lo indicado en cada fase

### Ejemplo de prompt para Claude:
```
Estoy integrando mi React app con Laravel API. 
Lee el documento API-INTEGRATION.md y ayúdame a implementar la FASE 1.
Mantén toda la funcionalidad existente, solo actualiza lo necesario para la integración.
```

---

## 🆘 Troubleshooting Común

### Error: CORS blocked
**Solución**: Verificar configuración de CORS en Laravel (`config/cors.php`)

### Error: 401 Unauthorized
**Solución**: Verificar que Sanctum esté configurado y el token sea válido

### Error: Network request failed
**Solución**: Verificar que `VITE_API_URL` apunte a la URL correcta

### Error: Cannot read property of undefined
**Solución**: Agregar validación de `loading` en componentes antes de renderizar datos

---

## 📚 Referencias

- [Laravel 12 Documentation](https://laravel.com/docs/12.x)
- [Laravel Sanctum](https://laravel.com/docs/12.x/sanctum)
- [React Context API](https://react.dev/reference/react/useContext)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
