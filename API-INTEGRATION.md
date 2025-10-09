# Plan de Integración: React/Vite ↔ Laravel 12 API

## 📋 Resumen Ejecutivo

Tu arquitectura está **90% lista** para conectarse con Laravel. Necesitas:
1. **Configurar la URL del backend** (5 minutos)
2. **Reemplazar localStorage con llamadas API** en servicios (30 minutos)
3. **Actualizar Contexts** para usar los servicios (15 minutos)
4. **Agregar manejo de errores** de Laravel (15 minutos)
5. **Implementar autenticación multi-rol** (30 minutos)
6. **CRUD de usuarios admin** (20 minutos)
7. **Gestión de categorías** (15 minutos)
8. **Google OAuth y separación de rutas** (25 minutos)

**Total estimado: 155 minutos de trabajo (2.5 horas)**

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

## 🔐 FASE 8: Autenticación Multi-Rol (30 min)

### Arquitectura de Roles

```
┌─────────────────────────────────────────────────┐
│              SISTEMA DE ROLES                   │
├─────────────────────────────────────────────────┤
│  Tabla: user_roles (separada por seguridad)    │
│  ┌──────────┬──────────┬──────────────────┐    │
│  │ user_id  │ role_id  │ role_name        │    │
│  ├──────────┼──────────┼──────────────────┤    │
│  │ uuid_1   │ 1        │ admin            │    │
│  │ uuid_2   │ 2        │ cliente          │    │
│  └──────────┴──────────┴──────────────────┘    │
│                                                  │
│  ⚠️ NUNCA almacenar roles en users table       │
│  ⚠️ NUNCA validar roles en localStorage        │
└─────────────────────────────────────────────────┘
```

### Backend Laravel - Implementación

#### 0. Instalación y Configuración de Sanctum (Laravel 12)

**IMPORTANTE: Laravel 12 ya no usa `app/Http/Kernel.php`**

```bash
# Instalar API scaffolding con Sanctum (Laravel 12)
php artisan install:api

# Esto automáticamente:
# ✅ Instala Laravel Sanctum (si no está instalado)
# ✅ Publica la configuración (config/sanctum.php)
# ✅ Crea la migración de personal_access_tokens
# ✅ Configura las rutas API en routes/api.php
```

**Ejecutar migraciones:**
```bash
php artisan migrate
```

#### 1. Migración de Roles
```php
// database/migrations/xxxx_create_roles_tables.php
public function up()
{
    // Crear tabla de roles
    Schema::create('roles', function (Blueprint $table) {
        $table->id();
        $table->string('name', 50)->unique();
        $table->string('description')->nullable();
        $table->timestamps();
    });

    // Tabla pivot user_roles
    Schema::create('user_roles', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
        $table->foreignId('role_id')->constrained('roles')->onDelete('cascade');
        $table->timestamps();
        
        $table->unique(['user_id', 'role_id']);
    });
}
```

#### 2. Seeder de Roles y Admins Provisionales
```php
// database/seeders/RoleSeeder.php
public function run()
{
    $adminRole = Role::create(['name' => 'admin', 'description' => 'Administrador del sistema']);
    $clientRole = Role::create(['name' => 'cliente', 'description' => 'Cliente de la tienda']);

    // Crear 3 admins provisionales
    $admins = [
        [
            'name' => 'Admin Principal',
            'email' => 'admin1@toysandbricks.com',
            'password' => Hash::make('AdminTemp123!'),
            'email_verified_at' => now(),
        ],
        [
            'name' => 'Admin Secundario',
            'email' => 'admin2@toysandbricks.com',
            'password' => Hash::make('AdminTemp456!'),
            'email_verified_at' => now(),
        ],
        [
            'name' => 'Admin Soporte',
            'email' => 'admin3@toysandbricks.com',
            'password' => Hash::make('AdminTemp789!'),
            'email_verified_at' => now(),
        ],
    ];

    foreach ($admins as $adminData) {
        $user = User::create($adminData);
        $user->roles()->attach($adminRole->id);
    }
}
```

#### 3. Modelo User con Relación de Roles
```php
// app/Models/User.php
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_roles');
    }

    public function hasRole(string $roleName): bool
    {
        return $this->roles()->where('name', $roleName)->exists();
    }

    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    public function isClient(): bool
    {
        return $this->hasRole('cliente');
    }
}
```

#### 4. Middleware de Admin

**Crear middleware:**
```php
// app/Http/Middleware/EnsureUserIsAdmin.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->user() || !$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'No tienes permisos de administrador'
            ], 403);
        }

        return $next($request);
    }
}
```

**Registrar en `bootstrap/app.php` (Laravel 12):**
```php
// bootstrap/app.php
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\EnsureUserIsAdmin;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Registrar alias de middleware personalizado
        $middleware->alias([
            'admin' => EnsureUserIsAdmin::class,
        ]);
        
        // Configurar stateful API para SPA en mismo dominio
        $middleware->statefulApi();
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
```

**Configurar variables de entorno (.env):**
```env
# Sanctum Configuration
SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173
SESSION_DOMAIN=localhost

# CORS Configuration  
FRONTEND_URL=http://localhost:5173

# Session Configuration
SESSION_DRIVER=cookie
SESSION_LIFETIME=120
```

**Configurar CORS (`config/cors.php`):**
```php
<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:5173')],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

**Verificación Post-Instalación:**
```bash
# Verificar que las migraciones se ejecutaron
php artisan migrate:status
# Debe mostrar: ✅ xxxx_create_personal_access_tokens_table

# Limpiar y cachear configuración
php artisan config:clear
php artisan config:cache

# Verificar rutas API
php artisan route:list --path=api

# Verificar middleware registrado
php artisan route:list --path=admin
```

**Tabla Comparativa: Laravel 10 vs Laravel 12**

| Aspecto | Laravel 10 | Laravel 12 |
|---------|-----------|-----------|
| **Instalación Sanctum** | `composer require laravel/sanctum`<br>`php artisan vendor:publish` | `php artisan install:api` |
| **Middleware** | `app/Http/Kernel.php` | `bootstrap/app.php` |
| **Alias Middleware** | `$middlewareAliases` array | `$middleware->alias([])` |
| **Stateful API** | Configuración manual | `$middleware->statefulApi()` |
| **Configuración** | Manual en múltiples archivos | Centralizada en `bootstrap/app.php` |
```

#### 5. Rutas de Autenticación
```php
// routes/api.php

// Rutas públicas
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']); // Solo clientes
Route::post('/auth/google', [AuthController::class, 'googleAuth']);

// Rutas autenticadas
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/user', [AuthController::class, 'user']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::patch('/auth/update-profile', [AuthController::class, 'updateProfile']);
    Route::patch('/auth/change-password', [AuthController::class, 'changePassword']);
});

// Rutas de admin (protegidas)
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::apiResource('products', ProductController::class);
    Route::apiResource('orders', OrderController::class);
    Route::apiResource('categories', CategoryController::class);
    // ... más rutas admin
});
```

#### 6. AuthController
```php
// app/Http/Controllers/AuthController.php
class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Credenciales inválidas'
            ], 401);
        }

        $user = Auth::user();
        $user->load('roles');

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'roles' => $user->roles->pluck('name'),
                ],
                'token' => $token,
            ],
            'message' => 'Login exitoso',
            'timestamp' => now()->toISOString(),
        ]);
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8|confirmed',
            'phone' => 'nullable|string',
            'province' => 'nullable|string',
            'canton' => 'nullable|string',
            'district' => 'nullable|string',
            'address' => 'nullable|string',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'phone' => $validated['phone'] ?? null,
            'province' => $validated['province'] ?? null,
            'canton' => $validated['canton'] ?? null,
            'district' => $validated['district'] ?? null,
            'address' => $validated['address'] ?? null,
        ]);

        // Asignar rol de cliente por defecto
        $clientRole = Role::where('name', 'cliente')->first();
        $user->roles()->attach($clientRole->id);

        $token = $user->createToken('auth-token')->plainTextToken;
        $user->load('roles');

        return response()->json([
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'roles' => $user->roles->pluck('name'),
                ],
                'token' => $token,
            ],
            'message' => 'Registro exitoso',
            'timestamp' => now()->toISOString(),
        ], 201);
    }

    public function user(Request $request)
    {
        $user = $request->user()->load('roles');

        return response()->json([
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'province' => $user->province,
                'canton' => $user->canton,
                'district' => $user->district,
                'address' => $user->address,
                'roles' => $user->roles->pluck('name'),
            ],
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout exitoso',
        ]);
    }

    public function updateProfile(Request $request)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string',
            'province' => 'sometimes|string',
            'canton' => 'sometimes|string',
            'district' => 'sometimes|string',
            'address' => 'sometimes|string',
        ]);

        $user = $request->user();
        $user->update($validated);

        return response()->json([
            'data' => $user,
            'message' => 'Perfil actualizado',
        ]);
    }

    public function changePassword(Request $request)
    {
        $validated = $request->validate([
            'old_password' => 'required',
            'new_password' => 'required|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($validated['old_password'], $user->password)) {
            return response()->json([
                'message' => 'La contraseña actual es incorrecta',
            ], 422);
        }

        $user->update([
            'password' => Hash::make($validated['new_password']),
        ]);

        return response()->json([
            'message' => 'Contraseña actualizada exitosamente',
        ]);
    }
}
```

### Frontend React - Implementación

#### 1. Tipos de Usuario Actualizados
**Archivo: `src/types/user.types.ts`**
```typescript
/**
 * User-related types
 * Centralized types for user profiles and authentication
 */

export type UserRole = 'admin' | 'cliente';

export interface UserWithRole {
  id: string;
  name: string;
  email: string;
  phone?: string;
  province?: string;
  canton?: string;
  district?: string;
  address?: string;
  roles: UserRole[];
  created_at?: string;
}

export interface ClientProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  province: string;
  canton: string;
  district: string;
  address: string;
  role: 'cliente';
  orderCount: number;
  totalSpent: number;
  lastOrderDate?: string;
  isActive: boolean;
}

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin';
  lastLogin?: string;
  createdAt: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
  province?: string;
  canton?: string;
  district?: string;
  address?: string;
}

export interface AuthResponse {
  data: {
    user: UserWithRole;
    token: string;
  };
  message: string;
  timestamp: string;
}
```

#### 2. Servicio de Autenticación
**Archivo: `src/lib/api/services/auth.service.ts` (NUEVO)**
```typescript
import type { AuthResponse, RegisterData, UserWithRole } from '@/types/user.types';
import type { ApiResponse } from '../types';
import { apiClient } from '../client';

export const authService = {
  // Login cliente/admin
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', { email, password });
    
    // Guardar token en el cliente API
    if (response.data.token) {
      apiClient.setAuthToken(response.data.token);
      // Guardar token en localStorage solo para persistencia
      localStorage.setItem('auth_token', response.data.token);
    }
    
    return response;
  },
  
  // Registro cliente (sin admin)
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    
    if (response.data.token) {
      apiClient.setAuthToken(response.data.token);
      localStorage.setItem('auth_token', response.data.token);
    }
    
    return response;
  },
  
  // Google OAuth
  async googleLogin(token: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/google', { token });
    
    if (response.data.token) {
      apiClient.setAuthToken(response.data.token);
      localStorage.setItem('auth_token', response.data.token);
    }
    
    return response;
  },
  
  // Obtener usuario actual
  async getCurrentUser(): Promise<UserWithRole> {
    return apiClient.get<UserWithRole>('/auth/user');
  },
  
  // Cerrar sesión
  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
    apiClient.removeAuthToken();
    localStorage.removeItem('auth_token');
  },
  
  // Actualizar perfil
  async updateProfile(data: Partial<UserWithRole>): Promise<ApiResponse<UserWithRole>> {
    return apiClient.patch<ApiResponse<UserWithRole>>('/auth/update-profile', data);
  },
  
  // Cambiar contraseña
  async changePassword(oldPassword: string, newPassword: string, newPasswordConfirmation: string): Promise<ApiResponse<void>> {
    return apiClient.patch<ApiResponse<void>>('/auth/change-password', { 
      old_password: oldPassword, 
      new_password: newPassword,
      new_password_confirmation: newPasswordConfirmation,
    });
  },

  // Verificar token al iniciar app
  initializeAuth(): void {
    const token = localStorage.getItem('auth_token');
    if (token) {
      apiClient.setAuthToken(token);
    }
  },
};
```

#### 3. Context de Autenticación
**Archivo: `src/contexts/AuthContext.tsx` (ACTUALIZAR)**
```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/lib/api/services/auth.service';
import type { UserWithRole, RegisterData } from '@/types/user.types';

interface AuthContextType {
  user: UserWithRole | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isClient: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  googleLogin: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserWithRole>) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string, newPasswordConfirmation: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Inicializar autenticación al montar
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Inicializar token desde localStorage
        authService.initializeAuth();
        
        // Obtener usuario actual
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (error) {
        // Token inválido o expirado
        localStorage.removeItem('auth_token');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    setUser(response.data.user);
  };

  const register = async (data: RegisterData) => {
    const response = await authService.register(data);
    setUser(response.data.user);
  };

  const googleLogin = async (token: string) => {
    const response = await authService.googleLogin(token);
    setUser(response.data.user);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const updateProfile = async (data: Partial<UserWithRole>) => {
    const response = await authService.updateProfile(data);
    setUser(response.data);
  };

  const changePassword = async (oldPassword: string, newPassword: string, newPasswordConfirmation: string) => {
    await authService.changePassword(oldPassword, newPassword, newPasswordConfirmation);
  };

  const isAdmin = user?.roles?.includes('admin') ?? false;
  const isClient = user?.roles?.includes('cliente') ?? false;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin,
        isClient,
        isLoading,
        login,
        register,
        googleLogin,
        logout,
        updateProfile,
        changePassword,
      }}
    >
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

#### 4. Componente de Protección de Rutas
**Archivo: `src/components/auth/ProtectedRoute.tsx` (NUEVO)**
```typescript
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { user, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
```

#### 5. Actualizar App.tsx con Rutas Protegidas
```typescript
// src/App.tsx
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        
        {/* Rutas del cliente (autenticadas) */}
        <Route path="/cart" element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        } />
        
        {/* Rutas del admin (requiere rol admin) */}
        <Route path="/admin/*" element={
          <ProtectedRoute requireAdmin>
            <AdminLayout />
          </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  );
}
```

---

## 👥 FASE 9: CRUD de Usuarios Admin (20 min)

### Backend Laravel - Endpoints

```
GET    /api/admin/users              # Listar todos (clientes + admins)
GET    /api/admin/users/{id}         # Ver usuario específico
PATCH  /api/admin/users/{id}/toggle  # Activar/Desactivar cliente
POST   /api/admin/admins             # Crear nuevo admin (máx 3)
PUT    /api/admin/admins/{id}        # Editar admin
DELETE /api/admin/admins/{id}        # Eliminar admin
```

### Backend Laravel - Controller

```php
// app/Http/Controllers/Admin/UserController.php
class UserController extends Controller
{
    public function index(Request $request)
    {
        $role = $request->query('role');
        
        $query = User::with('roles');
        
        if ($role) {
            $query->whereHas('roles', function ($q) use ($role) {
                $q->where('name', $role);
            });
        }
        
        $users = $query->get()->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'roles' => $user->roles->pluck('name'),
                'is_active' => $user->is_active ?? true,
                'created_at' => $user->created_at,
            ];
        });

        return response()->json(['data' => $users]);
    }

    public function show($id)
    {
        $user = User::with('roles')->findOrFail($id);

        return response()->json([
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'province' => $user->province,
                'canton' => $user->canton,
                'district' => $user->district,
                'address' => $user->address,
                'roles' => $user->roles->pluck('name'),
                'is_active' => $user->is_active ?? true,
            ],
        ]);
    }

    public function toggle($id)
    {
        $user = User::findOrFail($id);
        
        // No permitir desactivar admins
        if ($user->isAdmin()) {
            return response()->json([
                'message' => 'No se puede desactivar un administrador',
            ], 403);
        }

        $user->update(['is_active' => !($user->is_active ?? true)]);

        return response()->json([
            'message' => 'Estado del cliente actualizado',
        ]);
    }
}

// app/Http/Controllers/Admin/AdminController.php
class AdminController extends Controller
{
    public function index()
    {
        $admins = User::whereHas('roles', function ($q) {
            $q->where('name', 'admin');
        })->get();

        return response()->json(['data' => $admins]);
    }

    public function store(Request $request)
    {
        // Verificar límite de 3 admins
        $adminCount = User::whereHas('roles', function ($q) {
            $q->where('name', 'admin');
        })->count();

        if ($adminCount >= 3) {
            return response()->json([
                'message' => 'Ya existe el máximo de 3 administradores',
            ], 422);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8',
            'phone' => 'nullable|string',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'phone' => $validated['phone'] ?? null,
        ]);

        $adminRole = Role::where('name', 'admin')->first();
        $user->roles()->attach($adminRole->id);

        return response()->json([
            'data' => $user,
            'message' => 'Administrador creado exitosamente',
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        if (!$user->isAdmin()) {
            return response()->json([
                'message' => 'El usuario no es administrador',
            ], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'phone' => 'sometimes|nullable|string',
            'password' => 'sometimes|nullable|min:8',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'data' => $user,
            'message' => 'Administrador actualizado',
        ]);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);

        if (!$user->isAdmin()) {
            return response()->json([
                'message' => 'El usuario no es administrador',
            ], 403);
        }

        // Verificar que quede al menos 1 admin
        $adminCount = User::whereHas('roles', function ($q) {
            $q->where('name', 'admin');
        })->count();

        if ($adminCount <= 1) {
            return response()->json([
                'message' => 'Debe existir al menos un administrador',
            ], 422);
        }

        $user->delete();

        return response()->json([
            'message' => 'Administrador eliminado',
        ]);
    }
}
```

### Frontend React - Service

**Archivo: `src/lib/api/services/users.service.ts` (NUEVO)**
```typescript
import type { ClientProfile, AdminProfile, UserWithRole } from '@/types/user.types';
import type { ApiResponse } from '../types';
import { apiClient } from '../client';

export interface CreateAdminData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export const usersService = {
  // Listar clientes
  async getClients(): Promise<ClientProfile[]> {
    const response = await apiClient.get<{ data: UserWithRole[] }>('/admin/users?role=cliente');
    // Transformar a ClientProfile si es necesario
    return response.data.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      province: user.province || '',
      canton: user.canton || '',
      district: user.district || '',
      address: user.address || '',
      role: 'cliente' as const,
      orderCount: 0, // Se debe obtener del backend
      totalSpent: 0, // Se debe obtener del backend
      isActive: true, // Se debe obtener del backend
    }));
  },
  
  // Listar admins
  async getAdmins(): Promise<AdminProfile[]> {
    const response = await apiClient.get<{ data: UserWithRole[] }>('/admin/admins');
    return response.data.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: 'admin' as const,
      createdAt: user.created_at || new Date().toISOString(),
    }));
  },
  
  // Activar/Desactivar cliente
  async toggleClient(id: string): Promise<ApiResponse<void>> {
    return apiClient.patch<ApiResponse<void>>(`/admin/users/${id}/toggle`);
  },
  
  // Ver detalles de usuario
  async getUserById(id: string): Promise<UserWithRole> {
    const response = await apiClient.get<{ data: UserWithRole }>(`/admin/users/${id}`);
    return response.data;
  },
  
  // Crear admin (validar límite en backend)
  async createAdmin(data: CreateAdminData): Promise<AdminProfile> {
    const response = await apiClient.post<{ data: UserWithRole }>('/admin/admins', data);
    return {
      id: response.data.id,
      name: response.data.name,
      email: response.data.email,
      phone: response.data.phone,
      role: 'admin' as const,
      createdAt: response.data.created_at || new Date().toISOString(),
    };
  },
  
  // Editar admin
  async updateAdmin(id: string, data: Partial<CreateAdminData>): Promise<AdminProfile> {
    const response = await apiClient.put<{ data: UserWithRole }>(`/admin/admins/${id}`, data);
    return {
      id: response.data.id,
      name: response.data.name,
      email: response.data.email,
      phone: response.data.phone,
      role: 'admin' as const,
      createdAt: response.data.created_at || new Date().toISOString(),
    };
  },
  
  // Eliminar admin
  async deleteAdmin(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`/admin/admins/${id}`);
  },
};
```

---

## 🏷️ FASE 10: Gestión de Categorías (15 min)

### Backend Laravel - Endpoints

```
# Público
GET    /api/categories                       # Listar todas

# Admin
POST   /api/admin/categories                 # Crear categoría
PUT    /api/admin/categories/{id}            # Editar categoría
DELETE /api/admin/categories/{id}            # Eliminar categoría
PATCH  /api/admin/categories/reorder         # Reordenar categorías

GET    /api/categories/{id}/subcategories    # Listar subcategorías
POST   /api/admin/categories/{id}/subcategories  # Crear subcategoría
PUT    /api/admin/subcategories/{id}         # Editar subcategoría
DELETE /api/admin/subcategories/{id}         # Eliminar subcategoría
```

### Backend Laravel - Models y Controller

```php
// app/Models/Category.php
class Category extends Model
{
    protected $fillable = ['name', 'slug', 'icon', 'order', 'parent_id'];

    public function subcategories()
    {
        return $this->hasMany(Category::class, 'parent_id')->orderBy('order');
    }

    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}

// app/Http/Controllers/CategoryController.php (público)
class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::whereNull('parent_id')
            ->with('subcategories')
            ->orderBy('order')
            ->get();

        return response()->json(['data' => $categories]);
    }

    public function subcategories($id)
    {
        $subcategories = Category::where('parent_id', $id)
            ->orderBy('order')
            ->get();

        return response()->json(['data' => $subcategories]);
    }
}

// app/Http/Controllers/Admin/CategoryController.php
class CategoryController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:categories',
            'icon' => 'nullable|string',
            'order' => 'nullable|integer',
        ]);

        $category = Category::create($validated);

        return response()->json([
            'data' => $category,
            'message' => 'Categoría creada',
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|unique:categories,slug,' . $id,
            'icon' => 'sometimes|nullable|string',
            'order' => 'sometimes|nullable|integer',
        ]);

        $category->update($validated);

        return response()->json([
            'data' => $category,
            'message' => 'Categoría actualizada',
        ]);
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        
        // Verificar si tiene productos
        if ($category->products()->count() > 0) {
            return response()->json([
                'message' => 'No se puede eliminar una categoría con productos',
            ], 422);
        }

        $category->delete();

        return response()->json([
            'message' => 'Categoría eliminada',
        ]);
    }

    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'categories' => 'required|array',
            'categories.*.id' => 'required|exists:categories,id',
            'categories.*.order' => 'required|integer',
        ]);

        foreach ($validated['categories'] as $item) {
            Category::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return response()->json([
            'message' => 'Orden actualizado',
        ]);
    }

    public function storeSubcategory(Request $request, $categoryId)
    {
        $category = Category::findOrFail($categoryId);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:categories',
            'order' => 'nullable|integer',
        ]);

        $subcategory = Category::create([
            ...$validated,
            'parent_id' => $categoryId,
        ]);

        return response()->json([
            'data' => $subcategory,
            'message' => 'Subcategoría creada',
        ], 201);
    }
}
```

### Frontend React - Service

**Archivo: `src/lib/api/services/categories.service.ts` (NUEVO)**
```typescript
import type { Category, Subcategory } from '@/types/product.types';
import type { ApiResponse } from '../types';
import { apiClient } from '../client';

export interface CreateCategoryData {
  name: string;
  slug: string;
  icon?: string;
  order?: number;
}

export interface CreateSubcategoryData {
  name: string;
  slug: string;
  order?: number;
}

export const categoriesService = {
  // Obtener todas las categorías (público)
  async getAll(): Promise<Category[]> {
    const response = await apiClient.get<{ data: Category[] }>('/categories');
    return response.data;
  },
  
  // Obtener subcategorías de una categoría
  async getSubcategories(categoryId: string): Promise<Subcategory[]> {
    const response = await apiClient.get<{ data: Subcategory[] }>(`/categories/${categoryId}/subcategories`);
    return response.data;
  },
  
  // ADMIN: Crear categoría
  async create(data: CreateCategoryData): Promise<Category> {
    const response = await apiClient.post<{ data: Category }>('/admin/categories', data);
    return response.data;
  },
  
  // ADMIN: Actualizar categoría
  async update(id: string, data: Partial<CreateCategoryData>): Promise<Category> {
    const response = await apiClient.put<{ data: Category }>(`/admin/categories/${id}`, data);
    return response.data;
  },
  
  // ADMIN: Eliminar categoría
  async delete(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`/admin/categories/${id}`);
  },
  
  // ADMIN: Reordenar categorías
  async reorder(categories: Array<{ id: string; order: number }>): Promise<ApiResponse<void>> {
    return apiClient.patch<ApiResponse<void>>('/admin/categories/reorder', { categories });
  },
  
  // ADMIN: Crear subcategoría
  async createSubcategory(categoryId: string, data: CreateSubcategoryData): Promise<Subcategory> {
    const response = await apiClient.post<{ data: Subcategory }>(
      `/admin/categories/${categoryId}/subcategories`, 
      data
    );
    return response.data;
  },
  
  // ADMIN: Actualizar subcategoría
  async updateSubcategory(id: string, data: Partial<CreateSubcategoryData>): Promise<Subcategory> {
    const response = await apiClient.put<{ data: Subcategory }>(`/admin/subcategories/${id}`, data);
    return response.data;
  },
  
  // ADMIN: Eliminar subcategoría
  async deleteSubcategory(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`/admin/subcategories/${id}`);
  },
};
```

---

## 🔗 FASE 11: Separación de Rutas y Google OAuth (25 min)

### Backend Laravel - Google OAuth con Socialite

#### 1. Instalación y Configuración
```bash
composer require laravel/socialite
```

```php
// config/services.php
'google' => [
    'client_id' => env('GOOGLE_CLIENT_ID'),
    'client_secret' => env('GOOGLE_CLIENT_SECRET'),
    'redirect' => env('GOOGLE_REDIRECT_URI', 'http://localhost:8000/api/auth/google/callback'),
],
```

```env
# .env
GOOGLE_CLIENT_ID=tu_client_id_de_google
GOOGLE_CLIENT_SECRET=tu_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback
```

#### 2. Rutas de Google OAuth
```php
// routes/api.php
Route::get('/auth/google/redirect', [AuthController::class, 'googleRedirect']);
Route::get('/auth/google/callback', [AuthController::class, 'googleCallback']);
Route::post('/auth/google', [AuthController::class, 'googleAuth']); // Para token desde frontend
```

#### 3. AuthController - Métodos de Google
```php
use Laravel\Socialite\Facades\Socialite;

public function googleRedirect()
{
    $url = Socialite::driver('google')->stateless()->redirect()->getTargetUrl();
    
    return response()->json(['url' => $url]);
}

public function googleCallback(Request $request)
{
    try {
        $googleUser = Socialite::driver('google')->stateless()->user();
        
        // Buscar o crear usuario
        $user = User::where('email', $googleUser->getEmail())->first();
        
        if (!$user) {
            $user = User::create([
                'name' => $googleUser->getName(),
                'email' => $googleUser->getEmail(),
                'google_id' => $googleUser->getId(),
                'email_verified_at' => now(),
            ]);
            
            // Asignar rol de cliente
            $clientRole = Role::where('name', 'cliente')->first();
            $user->roles()->attach($clientRole->id);
        }
        
        $token = $user->createToken('google-auth')->plainTextToken;
        $user->load('roles');
        
        // Redirigir al frontend con el token
        return redirect(env('FRONTEND_URL') . '/auth/callback?token=' . $token);
        
    } catch (\Exception $e) {
        return redirect(env('FRONTEND_URL') . '/auth?error=google_auth_failed');
    }
}

// Para autenticación con token desde el frontend
public function googleAuth(Request $request)
{
    $validated = $request->validate([
        'token' => 'required|string',
    ]);
    
    try {
        // Verificar token de Google en el frontend
        $client = new \Google_Client(['client_id' => config('services.google.client_id')]);
        $payload = $client->verifyIdToken($validated['token']);
        
        if (!$payload) {
            return response()->json(['message' => 'Token inválido'], 401);
        }
        
        $user = User::where('email', $payload['email'])->first();
        
        if (!$user) {
            $user = User::create([
                'name' => $payload['name'],
                'email' => $payload['email'],
                'google_id' => $payload['sub'],
                'email_verified_at' => now(),
            ]);
            
            $clientRole = Role::where('name', 'cliente')->first();
            $user->roles()->attach($clientRole->id);
        }
        
        $token = $user->createToken('google-auth')->plainTextToken;
        $user->load('roles');
        
        return response()->json([
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'roles' => $user->roles->pluck('name'),
                ],
                'token' => $token,
            ],
            'message' => 'Login con Google exitoso',
        ]);
        
    } catch (\Exception $e) {
        return response()->json(['message' => 'Error en autenticación con Google'], 500);
    }
}
```

### Frontend React - Separación de Rutas

#### 1. Actualizar authService
```typescript
// Agregar al authService existente
export const authService = {
  // ... métodos existentes
  
  // Obtener URL de Google OAuth
  async getGoogleAuthUrl(): Promise<{ url: string }> {
    return apiClient.get<{ url: string }>('/auth/google/redirect');
  },
  
  // Manejar callback de Google (si se usa redirect completo)
  async handleGoogleCallback(token: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/google', { token });
    
    if (response.data.token) {
      apiClient.setAuthToken(response.data.token);
      localStorage.setItem('auth_token', response.data.token);
    }
    
    return response;
  },
};
```

#### 2. Actualizar Auth.tsx (Clientes)
```typescript
// src/pages/Auth.tsx
import { Button } from '@/components/ui/button';

const Auth = () => {
  // ... código existente

  const handleGoogleLogin = async () => {
    try {
      const { url } = await authService.getGoogleAuthUrl();
      window.location.href = url; // Redirigir a Google
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al iniciar sesión con Google",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="register">Registrarse</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              {/* Formulario de login existente */}
              
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    O continuar con
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleLogin}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  {/* Google icon SVG */}
                </svg>
                Continuar con Google
              </Button>
            </TabsContent>

            <TabsContent value="register">
              {/* Formulario de registro con botón de Google también */}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
```

#### 3. Crear AuthAdmin.tsx (Solo Admins)
**Archivo: `src/pages/AuthAdmin.tsx` (NUEVO)**
```typescript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Shield } from 'lucide-react';

const AuthAdmin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      
      // Verificar si es admin se hace en el context
      // Si no es admin, el ProtectedRoute lo redirigirá
      navigate('/admin');
      
      toast({
        title: "Bienvenido",
        description: "Has iniciado sesión correctamente",
      });
    } catch (error: any) {
      toast({
        title: "Error de autenticación",
        description: error.message || "Credenciales inválidas",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Panel de Administración</CardTitle>
          <CardDescription className="text-center">
            Ingresa tus credenciales de administrador
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@toysandbricks.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Solo administradores autorizados
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthAdmin;
```

#### 4. Actualizar App.tsx con Rutas Separadas
```typescript
import AuthAdmin from '@/pages/AuthAdmin';

<Routes>
  {/* Ruta de login para clientes */}
  <Route path="/auth" element={<Auth />} />
  
  {/* Ruta de login EXCLUSIVA para admins */}
  <Route path="/auth/admin" element={<AuthAdmin />} />
  
  {/* Resto de rutas */}
</Routes>
```

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

### **Ruta Básica (Sin autenticación) - 70 min**
1. ✅ **FASE 1**: Configurar cliente API (5 min)
2. ✅ **FASE 2**: Migrar Products Service (15 min)
3. ✅ **FASE 4**: Actualizar ProductsContext (10 min)
4. 🧪 **TESTING**: Probar productos (10 min)
5. ✅ **FASE 3**: Migrar Orders Service (15 min)
6. ✅ **FASE 5**: Actualizar OrdersContext (10 min)
7. 🧪 **TESTING**: Probar órdenes (10 min)
8. ✅ **FASE 6**: Mejorar manejo de errores (15 min)

### **Ruta Completa (Con autenticación y roles) - 155 min**
1. ✅ **FASE 1-7**: Completar ruta básica (70 min)
2. ✅ **FASE 8**: Implementar autenticación multi-rol (30 min)
3. 🧪 **TESTING**: Probar login cliente/admin (10 min)
4. ✅ **FASE 9**: CRUD de usuarios admin (20 min)
5. ✅ **FASE 10**: Gestión de categorías (15 min)
6. ✅ **FASE 11**: Google OAuth y rutas separadas (25 min)
7. 🧪 **TESTING**: Pruebas de seguridad (15 min)

**Total: 155 minutos (2.5 horas)**

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

## 🔒 Checklist de Seguridad

### ⚠️ CRÍTICO - Prevención de Escalamiento de Privilegios

- ✅ **NUNCA** almacenar roles en la tabla `users` o `profiles`
- ✅ **NUNCA** validar permisos de admin usando `localStorage` o `sessionStorage`
- ✅ **SIEMPRE** usar tabla separada `user_roles` con relación many-to-many
- ✅ **SIEMPRE** validar roles en el backend con middleware
- ✅ Implementar Row Level Security (RLS) si usas Supabase
- ✅ Usar tokens JWT con claims de roles verificados server-side
- ✅ Límite estricto de 3 administradores en base de datos
- ✅ Auditar cambios de roles con logs
- ✅ Implementar rate limiting en endpoints de autenticación
- ✅ Usar HTTPS en producción
- ✅ Sanitizar inputs para prevenir SQL injection
- ✅ Validar tokens de Google OAuth en backend

### 🛡️ Arquitectura Segura de Roles

```
❌ INSEGURO (Vulnerable a privilege escalation):
┌─────────────────┐
│   users table   │
│  - id           │
│  - email        │
│  - role (enum)  │ ← Puede ser modificado por el cliente
└─────────────────┘

✅ SEGURO (Protegido):
┌─────────────────┐      ┌─────────────────┐
│   users table   │      │   roles table   │
│  - id           │      │  - id           │
│  - email        │      │  - name         │
└─────────────────┘      └─────────────────┘
         │                        │
         └────────┬───────────────┘
                  │
         ┌────────▼────────────┐
         │  user_roles table   │
         │  - user_id (FK)     │
         │  - role_id (FK)     │
         │  UNIQUE(user, role) │
         └─────────────────────┘
```

---

## 🆘 Troubleshooting Común

### Error: CORS blocked
**Solución**: Verificar configuración de CORS en Laravel (`config/cors.php`)
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:5173')],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'supports_credentials' => true,
```

### Error: 401 Unauthorized
**Solución**: Verificar que Sanctum esté configurado y el token sea válido
```php
// config/sanctum.php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost,localhost:5173')),
```

### Error: 403 Forbidden (No eres admin)
**Solución**: Verificar que el usuario tenga el rol de admin en la tabla `user_roles`
```sql
SELECT u.email, r.name as role 
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE u.email = 'tu-email@example.com';
```

### Error: Network request failed
**Solución**: Verificar que `VITE_API_URL` apunte a la URL correcta
```bash
# .env.local
VITE_API_URL=http://localhost:8000/api
```

### Error: Cannot read property of undefined
**Solución**: Agregar validación de `loading` en componentes antes de renderizar datos
```typescript
if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage message={error} />;
```

### Error: Google OAuth failed
**Solución**: Verificar credenciales de Google Cloud Console
- ✅ Authorized JavaScript origins incluye tu dominio frontend
- ✅ Authorized redirect URIs incluye `http://localhost:8000/api/auth/google/callback`
- ✅ API de Google+ está habilitada

### Error: Maximum 3 admins reached
**Solución**: Este es un límite de seguridad. Elimina un admin existente antes de crear uno nuevo.

---

## 📚 Referencias

- [Laravel 12 Documentation](https://laravel.com/docs/12.x)
- [Laravel Sanctum](https://laravel.com/docs/12.x/sanctum)
- [Laravel Socialite](https://laravel.com/docs/12.x/socialite)
- [React Context API](https://react.dev/reference/react/useContext)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [OWASP Security Best Practices](https://owasp.org/www-project-top-ten/)

---

## 📋 Endpoints Completos - Resumen

### Autenticación
```
POST   /api/auth/login              # Login cliente/admin
POST   /api/auth/register           # Registro solo clientes
GET    /api/auth/google/redirect    # Obtener URL de Google
GET    /api/auth/google/callback    # Callback de Google
POST   /api/auth/google             # Google OAuth (token)
GET    /api/auth/user               # Usuario actual
POST   /api/auth/logout             # Cerrar sesión
PATCH  /api/auth/update-profile     # Actualizar perfil
PATCH  /api/auth/change-password    # Cambiar contraseña
```

### Productos (Admin protegido)
```
GET    /api/products                # Listar productos (público)
GET    /api/products/{id}           # Ver producto (público)
GET    /api/products/category/{id}  # Por categoría (público)
GET    /api/products/featured       # Destacados (público)
GET    /api/products/search         # Buscar (público)
POST   /api/admin/products          # Crear (admin)
PUT    /api/admin/products/{id}     # Editar (admin)
DELETE /api/admin/products/{id}     # Eliminar (admin)
```

### Órdenes (Admin protegido)
```
GET    /api/orders                  # Listar órdenes (usuario actual)
POST   /api/orders                  # Crear orden
GET    /api/admin/orders            # Listar todas (admin)
PATCH  /api/admin/orders/{id}/status    # Cambiar estado (admin)
PATCH  /api/admin/orders/{id}/archive   # Archivar (admin)
```

### Categorías (Admin protegido)
```
GET    /api/categories              # Listar (público)
POST   /api/admin/categories        # Crear (admin)
PUT    /api/admin/categories/{id}   # Editar (admin)
DELETE /api/admin/categories/{id}   # Eliminar (admin)
PATCH  /api/admin/categories/reorder # Reordenar (admin)
```

### Usuarios Admin (Admin protegido)
```
GET    /api/admin/users             # Listar usuarios
GET    /api/admin/users/{id}        # Ver usuario
PATCH  /api/admin/users/{id}/toggle # Activar/Desactivar cliente
POST   /api/admin/admins            # Crear admin (máx 3)
PUT    /api/admin/admins/{id}       # Editar admin
DELETE /api/admin/admins/{id}       # Eliminar admin
```

---

## 🎯 Diagrama de Flujo: Autenticación Multi-Rol

```
                    ┌──────────────────────┐
                    │   Usuario accede     │
                    │   a /auth o          │
                    │   /auth/admin        │
                    └──────────┬───────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
        ┌───────▼────────┐           ┌───────▼────────┐
        │   /auth        │           │  /auth/admin   │
        │  (Clientes)    │           │   (Admins)     │
        │                │           │                │
        │ - Email/Pass   │           │ - Email/Pass   │
        │ - Google OAuth │           │   (solo)       │
        └───────┬────────┘           └────────┬───────┘
                │                             │
                └──────────────┬──────────────┘
                               │
                    ┌──────────▼───────────┐
                    │  POST /auth/login    │
                    │                      │
                    │  Backend valida      │
                    │  credenciales        │
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │  Consulta roles en   │
                    │  tabla user_roles    │
                    └──────────┬───────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
        ┌───────▼────────┐           ┌───────▼────────┐
        │  Role: cliente │           │  Role: admin   │
        └───────┬────────┘           └────────┬───────┘
                │                             │
        ┌───────▼────────┐           ┌───────▼────────┐
        │  Redirige a /  │           │ Redirige a     │
        │  (Shop)        │           │ /admin         │
        └────────────────┘           └────────────────┘
                │                             │
        ┌───────▼────────┐           ┌───────▼────────┐
        │ ProtectedRoute │           │ ProtectedRoute │
        │ (auth required)│           │ (requireAdmin) │
        └────────────────┘           └────────────────┘
```

---

**Documento actualizado**: 2025-10-09  
**Versión**: 2.0 - Con autenticación multi-rol, usuarios admin, categorías y Google OAuth
