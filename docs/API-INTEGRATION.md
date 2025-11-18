# 🔗 Guía de Integración con Laravel API

## 📋 Índice

1. [Configuración Inicial](#configuración-inicial)
2. [Endpoints de Autenticación](#endpoints-de-autenticación)
3. [Endpoints de Productos](#endpoints-de-productos)
4. [Endpoints de Pedidos](#endpoints-de-pedidos)
5. [Endpoints de Direcciones](#endpoints-de-direcciones)
6. [Manejo de Errores](#manejo-de-errores)
7. [Headers Requeridos](#headers-requeridos)

---

## 🚀 Configuración Inicial

### 1. Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:8000/api
VITE_WHATSAPP_NUMBER=50688888888
```

### 2. CORS en Laravel

Configurar `config/cors.php`:

```php
'paths' => ['api/*'],
'allowed_methods' => ['*'],
'allowed_origins' => ['http://localhost:5173'], // URL de tu frontend
'allowed_headers' => ['*'],
'exposed_headers' => [],
'max_age' => 0,
'supports_credentials' => true,
```

---

## 🔒 Seguridad y Gestión de Roles

### ⚠️ ADVERTENCIA CRÍTICA

**NUNCA almacenes roles en la tabla `users` o `profiles`**.

Los roles DEBEN estar en una tabla separada `user_roles` con Row-Level Security (RLS) en PostgreSQL. Almacenar roles en la tabla principal permite ataques de escalada de privilegios.

📖 **Ver documentación completa**: [SECURITY.md](SECURITY.md)

---

### 🛡️ Checklist de Seguridad (Pre-Deploy)

Antes de conectar con el backend Laravel, verificar obligatoriamente:

#### **🗃️ Base de Datos PostgreSQL**

- [ ] ✅ ENUM `app_role` creado (valores: 'admin', 'cliente')
- [ ] ✅ Tabla `user_roles` creada con relación a `users`
- [ ] ✅ Función `has_role()` implementada (SECURITY DEFINER)
- [ ] ✅ Políticas RLS habilitadas en `user_roles`
- [ ] ✅ Trigger `assign_default_role` para asignar 'cliente' por defecto
- [ ] ✅ Índices creados para performance (user_id, role)

**Comando SQL**: Ver SECURITY.md sección "SQL Completo para PostgreSQL"

#### **🔧 Laravel Backend**

- [ ] ✅ Modelo `User` con métodos: `getRole()`, `hasRole()`, `isAdmin()`
- [ ] ✅ Modelo `UserRole` implementado
- [ ] ✅ Middleware `EnsureUserIsAdmin` registrado y aplicado
- [ ] ✅ Rutas admin protegidas: `Route::middleware(['auth:sanctum', 'admin'])`
- [ ] ✅ `AuthController::me()` retorna rol desde `$user->getRole()`
- [ ] ✅ `AuthController::updateProfile()` NO permite modificar rol
- [ ] ✅ Tests de seguridad implementados y pasando
- [ ] ✅ Rate limiting en endpoints críticos (10 requests/min)
- [ ] ✅ Audit logging para cambios de roles

**Código Laravel completo**: Ver SECURITY.md sección "Integración con Laravel"

#### **⚛️ Frontend React**

- [ ] ✅ `AuthContext` obtiene rol desde API (no localStorage)
- [ ] ✅ `ProtectedRoute` es solo UX (backend valida permisos)
- [ ] ✅ Comentarios de seguridad agregados en archivos críticos
- [ ] ✅ No se almacena información sensible en localStorage
- [ ] ✅ Tokens enviados en headers: `Authorization: Bearer {token}`
- [ ] ✅ Validación client-side solo para UX (mostrar/ocultar componentes)

#### **🔒 Auditoría y Prevención de Ataques**

- [ ] ✅ CORS configurado correctamente en `config/cors.php`
- [ ] ✅ HTTPS habilitado en producción
- [ ] ✅ Tokens JWT con expiración (recomendado: 30 días)
- [ ] ✅ CSRF protection habilitado en Laravel
- [ ] ✅ Input validation con FormRequest
- [ ] ✅ SQL injection prevenido (uso de Eloquent ORM)
- [ ] ✅ XSS prevenido (sanitización de outputs)
- [ ] ✅ Logs de errores y seguridad configurados
- [ ] ✅ Secrets en archivo `.env` (no hardcoded)

#### **📊 Monitoreo y Logs**

- [ ] ✅ Audit log de cambios de roles (`Log::info()`)
- [ ] ✅ Alertas para intentos fallidos (401, 403)
- [ ] ✅ Monitoreo de requests sospechosos
- [ ] ✅ Backups de base de datos configurados

---

### 🚨 Ataques Comunes a Prevenir

| Ataque                      | Descripción                          | Prevención                                 |
| --------------------------- | ------------------------------------ | ------------------------------------------ |
| **Escalada de Privilegios** | Usuario modifica su rol a 'admin'    | Tabla `user_roles` separada con RLS        |
| **JWT Manipulation**        | Modificar claims del token           | Verificar rol contra DB, no confiar en JWT |
| **IDOR**                    | Acceder a recursos de otros usuarios | Validar `user_id` en cada query            |
| **Session Hijacking**       | Robar token de autenticación         | HTTPS, tokens con expiración corta         |
| **CSRF**                    | Ejecutar acciones sin consentimiento | CSRF tokens, SameSite cookies              |

---

### ✅ Verificación Rápida

Después de implementar, ejecutar estos tests:

```bash
# Test 1: Usuario sin rol admin no puede crear productos
curl -X POST http://localhost:8000/api/products \
  -H "Authorization: Bearer {cliente_token}" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test"}' \
# Esperado: 403 Forbidden

# Test 2: Usuario no puede auto-asignarse rol admin
curl -X PATCH http://localhost:8000/api/auth/profile \
  -H "Authorization: Bearer {cliente_token}" \
  -H "Content-Type: application/json" \
  -d '{"role":"admin"}' \
# Esperado: Campo 'role' ignorado (no modificado en DB)

# Test 3: Solo admin puede asignar roles
curl -X POST http://localhost:8000/api/users/{userId}/assign-role \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json" \
  -d '{"role":"admin"}' \
# Esperado: 200 OK (si es admin) o 403 (si no lo es)
```

---

### 📖 Recursos Adicionales

- **Documentación completa**: [SECURITY.md](SECURITY.md)
- **PostgreSQL RLS**: https://www.postgresql.org/docs/current/ddl-rowsecurity.html
- **Laravel Authorization**: https://laravel.com/docs/12.x/authorization
- **OWASP Top 10**: https://owasp.org/www-project-top-ten/

---

## 🔐 Endpoints de Autenticación

**📖 DOCUMENTACIÓN COMPLETA**: Ver `docs/AUTH-LARAVEL-INTEGRATION.md`

**Estado**: ✅ 100% integrado con Laravel

### POST /api/v1/auth/login

**Descripción:** Iniciar sesión de usuario

**Request:**

```json
{
  "email": "toysandbricksdev@gmail.com",
  "password": "password"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "toysandbricksdev@gmail.com",
      "role": "Super Admin",
      "permissions": ["view_products", "create_products", "edit_products"],
      "email_verified_at": "2024-01-01T00:00:00.000Z",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    },
    "token": "1|abcdef1234567890...",
    "token_type": "Bearer"
  }
}
```

**⚠️ Cambios vs versión anterior:**
- ❌ Campo `phone` eliminado
- ✅ Campo `permissions` agregado (Spatie)
- ✅ Campo `email_verified_at` agregado
- ✅ Estructura anidada: `{ success, message, data }`
- ✅ Prefijo `/v1` en rutas

**Archivo Frontend:** `src/features/auth/services/auth.service.ts` línea 23

---

### POST /api/v1/auth/register

**Descripción:** Registrar nuevo usuario

**Request:**

```json
{
  "name": "Nuevo Usuario",
  "email": "nuevo@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**⚠️ IMPORTANTE**: Campo `phone` eliminado del registro.

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Registro exitoso",
  "data": {
    "user": {
      "id": 2,
      "name": "Nuevo Usuario",
      "email": "nuevo@example.com",
      "role": "Cliente",
      "permissions": ["view_products"],
      "email_verified_at": null,
      "created_at": "2024-01-01T12:00:00.000Z",
      "updated_at": "2024-01-01T12:00:00.000Z"
    },
    "token": "2|xyz123...",
    "token_type": "Bearer"
  }
}
```

**Archivo Frontend:** `src/features/auth/services/auth.service.ts` línea 71

---

### POST /api/v1/auth/logout

**Descripción:** Cerrar sesión de usuario (revoca token actual)

**Headers:**

```
Authorization: Bearer {token}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Sesión cerrada exitosamente"
}
```

**Archivo Frontend:** `src/features/auth/services/auth.service.ts` línea 126

---

### POST /api/v1/auth/logout-all

**Descripción:** Cerrar sesión en todos los dispositivos (revoca todos los tokens)

**Headers:**

```
Authorization: Bearer {token}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Sesión cerrada en todos los dispositivos"
}
```

**Archivo Frontend:** `src/features/auth/services/auth.service.ts` línea 155

---

### GET /api/v1/auth/me

**Descripción:** Obtener perfil del usuario autenticado

**Headers:**

```
Authorization: Bearer {token}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Usuario autenticado",
  "data": {
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "toysandbricksdev@gmail.com",
      "role": "Super Admin",
      "permissions": ["view_products", "create_products"],
      "email_verified_at": "2024-01-01T00:00:00.000Z",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Archivo Frontend:** `src/features/auth/services/auth.service.ts` línea 215

---

### PATCH /api/v1/auth/profile

**Estado:** ⚠️ Pendiente implementación Laravel

**Descripción:** Actualizar perfil del usuario autenticado

**Headers:**

```
Authorization: Bearer {token}
```

**Request:**

```json
{
  "name": "Nombre Actualizado",
  "email": "nuevo@email.com"
}
```

**Response esperada (200 OK):**

```json
{
  "success": true,
  "message": "Perfil actualizado exitosamente",
  "data": {
    "user": { /* estructura user completa */ }
  }
}
```

**📖 Ver código Laravel necesario en:** `docs/AUTH-LARAVEL-INTEGRATION.md`

**Archivo Frontend:** `src/features/auth/services/auth.service.ts` línea 254

---

## 📦 Endpoints de Productos

### GET /api/products

**Descripción:** Listar todos los productos

**Query Parameters:**

- `category` (opcional): Filtrar por categoría
- `featured` (opcional): Solo productos destacados

**Response (200 OK):**

```json
{
  "data": [
    {
      "id": "1",
      "name": "Producto 1",
      "description": "Descripción del producto",
      "price": 15000,
      "image": "https://...",
      "category": "categoria-1",
      "subcategory": "subcategoria-1",
      "featured": true,
      "stock": 10,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Archivo Frontend:** `src/lib/api/services/products.service.ts` línea 12

---

### GET /api/products/{id}

**Descripción:** Obtener un producto específico

**Response (200 OK):**

```json
{
  "data": {
    "id": "1",
    "name": "Producto 1",
    "description": "Descripción del producto",
    "price": 15000,
    "image": "https://...",
    "category": "categoria-1",
    "subcategory": "subcategoria-1",
    "featured": true,
    "stock": 10,
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Archivo Frontend:** `src/lib/api/services/products.service.ts` línea 28

---

### POST /api/products

**Descripción:** Crear nuevo producto (solo admin)

**Headers:**

```
Authorization: Bearer {token}
```

**Request:**

```json
{
  "name": "Producto Nuevo",
  "description": "Descripción",
  "price": 15000,
  "image": "https://...",
  "category": "categoria-1",
  "subcategory": "subcategoria-1",
  "featured": false,
  "stock": 10
}
```

**Response (201 Created):**

```json
{
  "data": {
    "id": "10",
    "name": "Producto Nuevo",
    "description": "Descripción",
    "price": 15000,
    "image": "https://...",
    "category": "categoria-1",
    "subcategory": "subcategoria-1",
    "featured": false,
    "stock": 10,
    "created_at": "2024-01-01T12:00:00.000Z"
  },
  "message": "Producto creado correctamente",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Archivo Frontend:** `src/lib/api/services/products.service.ts` línea 44

---

### PUT /api/products/{id}

**Descripción:** Actualizar producto existente (solo admin)

**Headers:**

```
Authorization: Bearer {token}
```

**Request:** (igual que POST)

**Response (200 OK):** (igual que POST con mensaje "Producto actualizado correctamente")

**Archivo Frontend:** `src/lib/api/services/products.service.ts` línea 60

---

### DELETE /api/products/{id}

**Descripción:** Eliminar producto (solo admin)

**Headers:**

```
Authorization: Bearer {token}
```

**Response (200 OK):**

```json
{
  "message": "Producto eliminado correctamente",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Archivo Frontend:** `src/lib/api/services/products.service.ts` línea 76

---

## 🛒 Endpoints de Pedidos

### GET /api/orders

**Descripción:** Listar pedidos del usuario autenticado

**Headers:**

```
Authorization: Bearer {token}
```

**Query Parameters:**

- `type` (opcional): 'online' | 'instore' | 'phone'
- `archived` (opcional): 'true' | 'false'

**Response (200 OK):**

```json
{
  "data": [
    {
      "id": "ORD-1234567890",
      "type": "online",
      "status": "pending",
      "items": [
        {
          "id": "1",
          "name": "Producto 1",
          "image": "https://...",
          "price": 15000,
          "quantity": 2
        }
      ],
      "total": 30000,
      "customerInfo": {
        "name": "Juan Pérez",
        "phone": "88888888"
      },
      "delivery_address": {
        "label": "Casa",
        "province": "San José",
        "canton": "Escazú",
        "district": "San Rafael",
        "address": "100m norte de..."
      },
      "deliveryOption": "delivery",
      "paymentMethod": "SINPE Móvil",
      "user_id": "1",
      "archived": false,
      "createdAt": "2024-01-01T12:00:00.000Z"
    }
  ],
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Archivo Frontend:** `src/lib/api/services/orders.service.ts` línea 18

---

### GET /api/orders/{id}

**Descripción:** Obtener un pedido específico

**Headers:**

```
Authorization: Bearer {token}
```

**Response (200 OK):** (igual que el objeto individual del array anterior)

**Archivo Frontend:** `src/lib/api/services/orders.service.ts` línea 26

---

### POST /api/orders

**Descripción:** Crear nuevo pedido

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**

```json
{
  "type": "online",
  "status": "pending",
  "items": [
    {
      "id": "1",
      "name": "Producto 1",
      "image": "https://...",
      "price": 15000,
      "quantity": 2
    }
  ],
  "total": 30000,
  "customerInfo": {
    "name": "Juan Pérez",
    "phone": "88888888"
  },
  "delivery_address": {
    "label": "Casa",
    "province": "San José",
    "canton": "Escazú",
    "district": "San Rafael",
    "address": "100m norte de..."
  },
  "deliveryOption": "delivery",
  "paymentMethod": "SINPE Móvil",
  "user_id": "1"
}
```

**Response (201 Created):**

```json
{
  "data": {
    "id": "ORD-1234567890",
    "type": "online",
    "status": "pending",
    "items": [...],
    "total": 30000,
    "customerInfo": {...},
    "delivery_address": {...},
    "deliveryOption": "delivery",
    "paymentMethod": "SINPE Móvil",
    "user_id": "1",
    "archived": false,
    "createdAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Pedido creado correctamente",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Archivo Frontend:** `src/lib/api/services/orders.service.ts` línea 53

---

### PATCH /api/orders/{id}/status

**Descripción:** Actualizar estado de un pedido (solo admin)

**Headers:**

```
Authorization: Bearer {token}
```

**Request:**

```json
{
  "status": "processing"
}
```

**Response (200 OK):**

```json
{
  "data": {
    "id": "ORD-1234567890",
    "status": "processing",
    ...
  },
  "message": "Estado del pedido actualizado",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Archivo Frontend:** `src/lib/api/services/orders.service.ts` línea 74

---

### PATCH /api/orders/{id}/archive

**Descripción:** Archivar un pedido

**Headers:**

```
Authorization: Bearer {token}
```

**Response (200 OK):**

```json
{
  "data": {
    "id": "ORD-1234567890",
    "archived": true,
    "archivedAt": "2024-01-01T12:00:00.000Z",
    ...
  },
  "message": "Pedido archivado correctamente",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Archivo Frontend:** `src/lib/api/services/orders.service.ts` línea 95

---

### PATCH /api/orders/{id}/unarchive

**Descripción:** Desarchivar un pedido

**Headers:**

```
Authorization: Bearer {token}
```

**Response (200 OK):** (similar a archive con `archived: false`)

**Archivo Frontend:** `src/lib/api/services/orders.service.ts` línea 118

---

### DELETE /api/orders/{id}

**Descripción:** Eliminar un pedido

**Headers:**

```
Authorization: Bearer {token}
```

**Response (200 OK):**

```json
{
  "message": "Pedido eliminado correctamente",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Archivo Frontend:** `src/lib/api/services/orders.service.ts` línea 139

---

## 📍 Endpoints de Direcciones

### GET /api/addresses

**Descripción:** Obtener direcciones del usuario autenticado

**Headers:**

```
Authorization: Bearer {token}
```

**Response (200 OK):**

```json
{
  "data": [
    {
      "id": "addr-1",
      "label": "Casa",
      "province": "San José",
      "canton": "Escazú",
      "district": "San Rafael",
      "address": "100m norte de...",
      "is_default": true,
      "user_id": "1"
    }
  ],
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Archivo Frontend:** `src/lib/api/services/addresses.service.ts` línea 12

---

### POST /api/addresses

**Descripción:** Crear nueva dirección

**Headers:**

```
Authorization: Bearer {token}
```

**Request:**

```json
{
  "label": "Oficina",
  "province": "San José",
  "canton": "San José",
  "district": "Carmen",
  "address": "Edificio X, piso 5",
  "is_default": false
}
```

**Response (201 Created):**

```json
{
  "data": {
    "id": "addr-2",
    "label": "Oficina",
    "province": "San José",
    "canton": "San José",
    "district": "Carmen",
    "address": "Edificio X, piso 5",
    "is_default": false,
    "user_id": "1"
  },
  "message": "Dirección creada correctamente",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Archivo Frontend:** `src/lib/api/services/addresses.service.ts` línea 28

---

### PUT /api/addresses/{id}

**Descripción:** Actualizar dirección existente

**Headers:**

```
Authorization: Bearer {token}
```

**Request:** (igual que POST)

**Response (200 OK):** (similar a POST con mensaje "Dirección actualizada correctamente")

**Archivo Frontend:** `src/lib/api/services/addresses.service.ts` línea 44

---

### DELETE /api/addresses/{id}

**Descripción:** Eliminar dirección

**Headers:**

```
Authorization: Bearer {token}
```

**Response (200 OK):**

```json
{
  "message": "Dirección eliminada correctamente",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Archivo Frontend:** `src/lib/api/services/addresses.service.ts` línea 60

---

### PATCH /api/addresses/{id}/default

**Descripción:** Establecer dirección como predeterminada

**Headers:**

```
Authorization: Bearer {token}
```

**Response (200 OK):**

```json
{
  "data": {
    "id": "addr-2",
    "label": "Oficina",
    "is_default": true,
    ...
  },
  "message": "Dirección predeterminada actualizada",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Archivo Frontend:** `src/lib/api/services/addresses.service.ts` línea 76

---

## 📂 Endpoints de Categorías y Subcategorías

### GET /api/categories

**Descripción:** Listar todas las categorías con sus subcategorías

**Response (200 OK):**

```json
{
  "data": [
    {
      "id": "cat-1",
      "name": "Sets de Construcción",
      "description": "Descripción opcional",
      "order": 1,
      "slug": "sets-de-construccion",
      "subcategories": [
        {
          "id": "sub-1",
          "name": "Star Wars",
          "description": "Descripción opcional",
          "order": 1,
          "slug": "sets-de-construccion/star-wars"
        }
      ]
    }
  ],
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Archivo Frontend:** `src/lib/api/services/categories.service.ts` línea 36

---

### GET /api/categories/{id}

**Descripción:** Obtener una categoría específica con sus subcategorías

**Response (200 OK):**

```json
{
  "data": {
    "id": "cat-1",
    "name": "Sets de Construcción",
    "description": "Descripción opcional",
    "order": 1,
    "slug": "sets-de-construccion",
    "subcategories": [...]
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Archivo Frontend:** `src/lib/api/services/categories.service.ts` línea 59

---

### POST /api/categories

**Descripción:** Crear nueva categoría (solo admin)

**Headers:**

```
Authorization: Bearer {token}
```

**Request:**

```json
{
  "name": "Nueva Categoría",
  "description": "Descripción opcional"
}
```

**Response (201 Created):**

```json
{
  "data": {
    "id": "cat-2",
    "name": "Nueva Categoría",
    "description": "Descripción opcional",
    "order": 2,
    "slug": "nueva-categoria",
    "subcategories": []
  },
  "message": "Category created successfully",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Archivo Frontend:** `src/lib/api/services/categories.service.ts` línea 94

---

### PUT /api/categories/{id}

**Descripción:** Actualizar categoría existente (solo admin)

**Headers:**

```
Authorization: Bearer {token}
```

**Request:**

```json
{
  "name": "Categoría Actualizada",
  "description": "Nueva descripción",
  "order": 1
}
```

**Response (200 OK):**

```json
{
  "data": {
    "id": "cat-1",
    "name": "Categoría Actualizada",
    "description": "Nueva descripción",
    "order": 1,
    "slug": "categoria-actualizada",
    "subcategories": [...]
  },
  "message": "Category updated successfully",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Archivo Frontend:** `src/lib/api/services/categories.service.ts` línea 141

---

### DELETE /api/categories/{id}

**Descripción:** Eliminar categoría (solo admin)

**Headers:**

```
Authorization: Bearer {token}
```

**Response (200 OK):**

```json
{
  "message": "Category deleted successfully",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Archivo Frontend:** `src/lib/api/services/categories.service.ts` línea 199

---

### POST /api/categories/reorder

**Descripción:** Reordenar categorías mediante drag & drop (solo admin)

**Headers:**

```
Authorization: Bearer {token}
```

**Request:**

```json
{
  "order": ["cat-3", "cat-1", "cat-2"]
}
```

**Response (200 OK):**

```json
{
  "data": [
    {
      "id": "cat-3",
      "name": "Categoría 3",
      "order": 1,
      ...
    },
    {
      "id": "cat-1",
      "name": "Categoría 1",
      "order": 2,
      ...
    }
  ],
  "message": "Categories reordered successfully",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Archivo Frontend:** `src/lib/api/services/categories.service.ts` línea 225

---

### POST /api/subcategories

**Descripción:** Crear nueva subcategoría (solo admin)

**Headers:**

```
Authorization: Bearer {token}
```

**Request:**

```json
{
  "name": "Nueva Subcategoría",
  "description": "Descripción opcional",
  "category_id": "cat-1"
}
```

**Response (201 Created):**

```json
{
  "data": {
    "id": "sub-2",
    "name": "Nueva Subcategoría",
    "description": "Descripción opcional",
    "order": 2,
    "slug": "categoria-padre/nueva-subcategoria"
  },
  "message": "Subcategory created successfully",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Archivo Frontend:** `src/lib/api/services/categories.service.ts` línea 266

---

### PUT /api/subcategories/{id}

**Descripción:** Actualizar subcategoría existente (solo admin)

**Headers:**

```
Authorization: Bearer {token}
```

**Request:**

```json
{
  "name": "Subcategoría Actualizada",
  "description": "Nueva descripción",
  "category_id": "cat-2",
  "order": 1
}
```

**Response (200 OK):**

```json
{
  "data": {
    "id": "sub-1",
    "name": "Subcategoría Actualizada",
    "description": "Nueva descripción",
    "order": 1,
    "slug": "nueva-categoria/subcategoria-actualizada"
  },
  "message": "Subcategory updated successfully",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Archivo Frontend:** `src/lib/api/services/categories.service.ts` línea 320

---

### DELETE /api/subcategories/{id}

**Descripción:** Eliminar subcategoría (solo admin)

**Headers:**

```
Authorization: Bearer {token}
```

**Response (200 OK):**

```json
{
  "message": "Subcategory deleted successfully",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Archivo Frontend:** `src/lib/api/services/categories.service.ts` línea 406

---

## ⚠️ Manejo de Errores

### Códigos de Estado HTTP

| Código  | Significado                   | Acción Frontend                         |
| ------- | ----------------------------- | --------------------------------------- |
| **401** | No autorizado                 | Limpiar sesión, redirigir a `/auth`     |
| **403** | Sin permisos                  | Mostrar error, no redirigir             |
| **404** | No encontrado                 | Mostrar mensaje "Recurso no encontrado" |
| **422** | Error de validación (Laravel) | Mostrar errores de validación           |
| **500** | Error del servidor            | Mostrar "Error del servidor"            |

### Formato de Respuestas de Error

```json
{
  "message": "Mensaje de error legible",
  "errors": {
    "email": ["El email ya está registrado"],
    "password": ["La contraseña debe tener al menos 8 caracteres"]
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Archivo Frontend:** `src/lib/api/client.ts` líneas 63-102 (interceptor de errores)

---

## 🔑 Headers Requeridos

### Para todas las peticiones:

```
Content-Type: application/json
Accept: application/json
```

### Para rutas protegidas (autenticadas):

```
Authorization: Bearer {token}
```

El token se obtiene del response de `/auth/login` o `/auth/register` y se guarda en `localStorage` con la key `auth_token`.

El cliente HTTP (`src/lib/api/client.ts`) maneja automáticamente el token usando los métodos:

- `apiClient.setAuthToken(token)` - Al hacer login
- `apiClient.removeAuthToken()` - Al hacer logout

---

## 🚀 Pasos para Activar la Integración

### 1. Configurar Variables de Entorno

Copiar `.env.example` a `.env` y configurar:

```bash
cp .env.example .env
```

### 2. Verificar que Laravel está corriendo

```bash
php artisan serve
# Laravel debe estar en http://localhost:8000
```

### 3. Descomentar llamadas API en servicios

Ver archivos:

- `src/lib/api/services/auth.service.ts`
- `src/lib/api/services/products.service.ts`
- `src/lib/api/services/orders.service.ts`
- `src/lib/api/services/addresses.service.ts`
- `src/lib/api/services/categories.service.ts`

Buscar líneas marcadas con `// TODO: Descomentar cuando Laravel esté listo` y descomentar.

### 4. Simplificar acceso a localStorage

Los servicios ahora usan helpers inline para acceder a localStorage directamente, sin abstracciones innecesarias.

### 5. Probar la conexión

1. Iniciar el frontend: `npm run dev`
2. Ir a `/auth` y hacer login
3. Verificar en Network DevTools que se hacen las peticiones a `http://localhost:8000/api`
4. Verificar que el token se guarda en `localStorage`

---

## 📚 Referencias

- **Documentación de servicios:** `src/lib/api/services/`
- **Cliente HTTP:** `src/lib/api/client.ts`
- **Tipos TypeScript:** `src/types/`
- **Contextos:** `src/contexts/`

---

## 🎯 Checklist de Migración

- [ ] Configurar `.env` con `VITE_API_URL`
- [ ] Configurar CORS en Laravel
- [ ] Implementar endpoints de autenticación en Laravel
- [ ] Implementar endpoints de productos en Laravel
- [ ] Implementar endpoints de pedidos en Laravel
- [ ] Implementar endpoints de direcciones en Laravel
- [ ] Implementar endpoints de categorías en Laravel
- [ ] Descomentar llamadas API en `auth.service.ts`
- [ ] Descomentar llamadas API en `products.service.ts`
- [ ] Descomentar llamadas API en `orders.service.ts`
- [ ] Descomentar llamadas API en `addresses.service.ts`
- [ ] Descomentar llamadas API en `categories.service.ts`
- [ ] Descomentar llamadas API en `users.service.ts`
- [ ] Descomentar llamadas API de perfil admin en `auth.service.ts`
- [ ] Eliminar mocks de `localStorage`
- [ ] Probar login/logout
- [ ] Probar CRUD de productos
- [ ] Probar creación de pedidos
- [ ] Probar CRUD de direcciones
- [ ] Probar CRUD de categorías y subcategorías
- [ ] Probar drag & drop para reordenar categorías
- [ ] Probar gestión de usuarios y roles (admin)
- [ ] Verificar manejo de errores (401, 403, 422, 500)

---

## 👥 Endpoints de Usuarios (Admin)

### GET /api/users/clients

**Descripción:** Obtener todos los clientes (solo admin)

**Headers:**

```
Authorization: Bearer {token}
```

**Response (200 OK):**

```json
{
  "data": [
    {
      "id": "1",
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "phone": "88888888",
      "role": "cliente",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z",
      "addresses": []
    }
  ],
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Archivo Frontend:** `src/lib/api/services/users.service.ts` línea 18

---

### GET /api/users/admins

**Descripción:** Obtener todos los administradores (solo super admin)

**Headers:**

```
Authorization: Bearer {token}
```

**Response (200 OK):**

```json
{
  "data": [
    {
      "id": "1",
      "name": "Admin Principal",
      "email": "admin@example.com",
      "phone": "",
      "role": "admin",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Archivo Frontend:** `src/lib/api/services/users.service.ts` línea 35

---

### PATCH /api/users/{userId}/status

**Descripción:** Activar/desactivar usuario (solo admin)

**Headers:**

```
Authorization: Bearer {token}
```

**Request:**

```json
{
  "active": true
}
```

**Response (200 OK):**

```json
{
  "data": {
    "id": "1",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "phone": "88888888",
    "role": "cliente",
    "active": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T12:00:00.000Z"
  },
  "message": "Estado actualizado correctamente",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Archivo Frontend:** `src/lib/api/services/users.service.ts` línea 52

---

### POST /api/users/admins

**Descripción:** Crear nuevo administrador (solo super admin)

**Headers:**

```
Authorization: Bearer {token}
```

**Request:**

```json
{
  "name": "Nuevo Admin",
  "email": "admin2@example.com",
  "password": "password123",
  "role": "moderador"
}
```

**Response (201 Created):**

```json
{
  "data": {
    "id": "2",
    "name": "Nuevo Admin",
    "email": "admin2@example.com",
    "role": "admin",
    "created_at": "2024-01-01T12:00:00.000Z",
    "updated_at": "2024-01-01T12:00:00.000Z"
  },
  "message": "Administrador creado correctamente",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Archivo Frontend:** `src/lib/api/services/users.service.ts` línea 76

---

### POST /api/users/{userId}/roles

**Descripción:** Asignar rol a usuario (solo super admin)

**⚠️ SEGURIDAD CRÍTICA:** Debe usar tabla `user_roles` separada

**Headers:**

```
Authorization: Bearer {token}
```

**Request:**

```json
{
  "role": "admin"
}
```

**Response (200 OK):**

```json
{
  "data": {
    "id": "1",
    "name": "Usuario",
    "email": "user@example.com",
    "role": "admin",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T12:00:00.000Z"
  },
  "message": "Rol asignado correctamente",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Archivo Frontend:** `src/lib/api/services/users.service.ts` línea 145

---

### PATCH /api/auth/admin/profile

**Descripción:** Actualizar perfil de administrador (incluye avatar)

**Headers:**

```
Authorization: Bearer {token}
```

**Request:**

```json
{
  "name": "Admin Actualizado",
  "phone": "+506 1234-5678",
  "avatarUrl": "data:image/png;base64,..."
}
```

**Response (200 OK):**

```json
{
  "data": {
    "id": "1",
    "name": "Admin Actualizado",
    "email": "admin@example.com",
    "phone": "+506 1234-5678",
    "role": "admin",
    "avatarUrl": "https://...",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T12:00:00.000Z"
  },
  "message": "Perfil actualizado correctamente",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Archivo Frontend:** `src/lib/api/services/auth.service.ts` línea 135

---

### POST /api/auth/avatar

**Descripción:** Subir avatar de usuario

**Headers:**

```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request:**

```
FormData con campo 'avatar' (imagen)
```

**Response (200 OK):**

```json
{
  "data": {
    "avatarUrl": "https://storage.example.com/avatars/user-1.jpg"
  },
  "message": "Avatar actualizado correctamente",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Archivo Frontend:** `src/lib/api/services/auth.service.ts` línea 164

---

**Última actualización:** 2024-01-09  
**Versión:** 2.0.0
