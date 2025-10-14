# 🔒 Guía de Seguridad - Gestión de Roles

## ⚠️ ADVERTENCIA CRÍTICA

**NUNCA almacenes roles en la tabla `users` o `profiles`.**

Esto permite ataques de escalada de privilegios donde un atacante podría:
- Modificar su propio rol a 'admin' mediante manipulación de requests
- Bypassear validaciones client-side (localStorage, sessionStorage)
- Ejecutar acciones administrativas sin autorización

**SIEMPRE usa una tabla separada `user_roles` con políticas de seguridad adecuadas.**

---

## 📋 Índice

1. [Arquitectura Correcta](#arquitectura-correcta)
2. [SQL Completo para PostgreSQL](#sql-completo-para-postgresql)
3. [Integración con Laravel](#integración-con-laravel)
4. [Prevención de Ataques](#prevención-de-ataques)
5. [Testing de Seguridad](#testing-de-seguridad)
6. [Checklist Pre-Deploy](#checklist-pre-deploy)

---

## 🏗️ Arquitectura Correcta

### Diagrama de Arquitectura

```
┌──────────────────┐
│   auth.users     │  ← Tabla de autenticación (emails, passwords)
│   - id (PK)      │
│   - email        │
│   - password     │
└────────┬─────────┘
         │
         │ 1:1
         ▼
┌──────────────────┐
│  public.users    │  ← Perfiles de usuarios (PII con RLS)
│   - id (PK)      │
│   - name         │
│   - phone        │
│   - email        │
└────────┬─────────┘
         │
         │ 1:N
         ▼
┌──────────────────┐
│  user_roles      │  ← Tabla de roles (SEPARADA)
│   - id (PK)      │
│   - user_id (FK) │
│   - role (ENUM)  │  ← 'admin', 'cliente'
│   UNIQUE(uid,r)  │
└──────────────────┘
```

### Principios de Diseño

1. **Separación de Roles**: Los roles están en una tabla separada, no en `users`.
2. **SECURITY DEFINER**: Función `has_role()` ejecuta con privilegios elevados para evitar recursión RLS.
3. **RLS Policies**: Row-Level Security protege el acceso a datos sensibles.
4. **Validación Backend**: NUNCA confiar en validaciones client-side.

---

## 🗃️ SQL Completo para PostgreSQL

### 1️⃣ Crear ENUM para Roles

```sql
-- Definir los roles disponibles en la aplicación
CREATE TYPE public.app_role AS ENUM ('admin', 'cliente');
```

### 2️⃣ Crear Tabla user_roles

```sql
-- Tabla separada para almacenar roles de usuarios
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    role public.app_role NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (user_id, role)
);

-- Comentarios para documentación
COMMENT ON TABLE public.user_roles IS 'Almacena roles de usuarios de forma segura';
COMMENT ON COLUMN public.user_roles.role IS 'Rol asignado al usuario (admin o cliente)';
```

### 3️⃣ Índices para Performance

```sql
-- Índice en user_id para búsquedas rápidas por usuario
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);

-- Índice en role para filtrar por rol
CREATE INDEX idx_user_roles_role ON public.user_roles(role);

-- Índice compuesto para búsquedas específicas
CREATE INDEX idx_user_roles_user_role ON public.user_roles(user_id, role);
```

### 4️⃣ Función SECURITY DEFINER

```sql
-- Función para verificar si un usuario tiene un rol específico
-- SECURITY DEFINER permite ejecutar con privilegios elevados, evitando recursión RLS
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Comentario para documentación
COMMENT ON FUNCTION public.has_role IS 'Verifica si un usuario tiene un rol específico. Usa SECURITY DEFINER para evitar recursión RLS.';
```

### 5️⃣ Trigger para Asignar Rol por Defecto

```sql
-- Función trigger para asignar rol 'cliente' por defecto
CREATE OR REPLACE FUNCTION public.assign_default_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Asignar rol 'cliente' al nuevo usuario
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'cliente')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Crear trigger que se ejecuta después de insertar un usuario
CREATE TRIGGER on_user_created
  AFTER INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_default_role();
```

### 6️⃣ Políticas RLS (Row-Level Security)

```sql
-- Habilitar Row-Level Security en la tabla user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden ver sus propios roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles
  FOR SELECT
  USING (user_id = auth.uid());

-- Política: Solo admins pueden insertar roles
CREATE POLICY "Only admins can insert roles"
  ON public.user_roles
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Política: Solo admins pueden actualizar roles
CREATE POLICY "Only admins can update roles"
  ON public.user_roles
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Política: Solo admins pueden eliminar roles
CREATE POLICY "Only admins can delete roles"
  ON public.user_roles
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));
```

### 7️⃣ Función para Obtener Rol Principal

```sql
-- Función helper para obtener el rol principal de un usuario
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS public.app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;
```

### 8️⃣ Vista para Usuarios con Roles

```sql
-- Vista que combina usuarios con sus roles
CREATE OR REPLACE VIEW public.users_with_roles AS
SELECT 
  u.id,
  u.name,
  u.email,
  u.phone,
  ur.role,
  u.created_at,
  u.updated_at
FROM public.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id;

-- Habilitar RLS en la vista
ALTER VIEW public.users_with_roles SET (security_invoker = true);
```

---

## 🔗 Integración con Laravel

### 1. Modelo User (app/Models/User.php)

```php
<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * ⚠️ SEGURIDAD: Relación con user_roles (tabla separada)
     * 
     * Los roles NUNCA deben estar en la tabla users.
     * Siempre usar tabla separada user_roles.
     */
    public function roles()
    {
        return $this->hasMany(UserRole::class);
    }

    /**
     * Obtener el rol principal del usuario
     * 
     * @return string|null
     */
    public function getRole(): ?string
    {
        return $this->roles()->first()?->role;
    }

    /**
     * Verificar si el usuario tiene un rol específico
     * 
     * @param string $role
     * @return bool
     */
    public function hasRole(string $role): bool
    {
        return $this->roles()->where('role', $role)->exists();
    }

    /**
     * Verificar si es administrador
     * 
     * @return bool
     */
    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    /**
     * Verificar si es cliente
     * 
     * @return bool
     */
    public function isCliente(): bool
    {
        return $this->hasRole('cliente');
    }

    /**
     * Asignar un rol al usuario
     * 
     * ⚠️ SEGURIDAD: Solo debe ser llamado por administradores
     * 
     * @param string $role
     * @return void
     */
    public function assignRole(string $role): void
    {
        $this->roles()->updateOrCreate(
            ['user_id' => $this->id],
            ['role' => $role]
        );
    }
}
```

### 2. Modelo UserRole (app/Models/UserRole.php)

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class UserRole extends Model
{
    use HasUuids;

    /**
     * The table associated with the model.
     */
    protected $table = 'user_roles';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'user_id',
        'role',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Roles válidos en la aplicación
     */
    public const ROLE_ADMIN = 'admin';
    public const ROLE_CLIENTE = 'cliente';

    /**
     * Obtener el usuario asociado al rol
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Validar si el rol es válido
     * 
     * @param string $role
     * @return bool
     */
    public static function isValidRole(string $role): bool
    {
        return in_array($role, [self::ROLE_ADMIN, self::ROLE_CLIENTE]);
    }
}
```

### 3. Middleware Admin (app/Http/Middleware/EnsureUserIsAdmin.php)

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    /**
     * ⚠️ SEGURIDAD: Validación SERVER-SIDE del rol
     * 
     * NUNCA confiar en:
     * - Headers HTTP (X-User-Role, etc.)
     * - Claims del JWT sin verificar
     * - localStorage/sessionStorage del frontend
     * 
     * SIEMPRE verificar contra la base de datos.
     * 
     * @param \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response) $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Verificar que el usuario está autenticado
        if (!$request->user()) {
            return response()->json([
                'message' => 'No autenticado.',
                'timestamp' => now()->toIso8601String(),
            ], 401);
        }

        // Verificar que el usuario tiene rol de admin
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'No autorizado. Se requiere rol de administrador.',
                'timestamp' => now()->toIso8601String(),
            ], 403);
        }

        return $next($request);
    }
}
```

### 4. Registrar Middleware (app/Http/Kernel.php o bootstrap/app.php)

```php
// Laravel 11+ (bootstrap/app.php)
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'admin' => \App\Http\Middleware\EnsureUserIsAdmin::class,
    ]);
})

// O en Laravel 10 (app/Http/Kernel.php)
protected $middlewareAliases = [
    // ...
    'admin' => \App\Http\Middleware\EnsureUserIsAdmin::class,
];
```

### 5. AuthController - Incluir Rol en Respuestas

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Login de usuario
     * 
     * POST /api/auth/login
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales proporcionadas son incorrectas.'],
            ]);
        }

        // Crear token de autenticación
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'role' => $user->getRole(), // ⚠️ Obtener desde user_roles
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at,
                ],
                'token' => $token,
                'expires_at' => now()->addDays(30)->toIso8601String(),
            ],
            'message' => 'Login exitoso',
            'timestamp' => now()->toIso8601String(),
        ]);
    }

    /**
     * Registro de nuevo usuario
     * 
     * POST /api/auth/register
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'nullable|string|max:20',
        ]);

        // Crear usuario
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'phone' => $validated['phone'] ?? null,
        ]);

        // El trigger assign_default_role asignará automáticamente rol 'cliente'

        // Crear token
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'role' => $user->getRole(), // Será 'cliente' por defecto
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at,
                ],
                'token' => $token,
                'expires_at' => now()->addDays(30)->toIso8601String(),
            ],
            'message' => 'Registro exitoso',
            'timestamp' => now()->toIso8601String(),
        ], 201);
    }

    /**
     * Logout de usuario
     * 
     * POST /api/auth/logout
     */
    public function logout(Request $request)
    {
        // Revocar el token actual
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout exitoso',
            'timestamp' => now()->toIso8601String(),
        ]);
    }

    /**
     * Obtener perfil del usuario autenticado
     * 
     * GET /api/auth/me
     * 
     * ⚠️ SEGURIDAD: El rol DEBE venir desde user_roles table
     */
    public function me(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->getRole(), // ⚠️ Desde user_roles
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ],
            'timestamp' => now()->toIso8601String(),
        ]);
    }

    /**
     * Actualizar perfil del usuario autenticado
     * 
     * PATCH /api/auth/profile
     * 
     * ⚠️ SEGURIDAD: NO permitir modificación de rol aquí
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|nullable|string|max:20',
            // ⚠️ NO incluir 'role' aquí - evita escalada de privilegios
        ]);

        $user->update($validated);

        return response()->json([
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->getRole(),
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ],
            'message' => 'Perfil actualizado correctamente',
            'timestamp' => now()->toIso8601String(),
        ]);
    }
}
```

### 6. Rutas Protegidas (routes/api.php)

```php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Rutas públicas
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);

// Rutas autenticadas
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::patch('/auth/profile', [AuthController::class, 'updateProfile']);
    
    // Rutas solo para admins
    Route::middleware('admin')->group(function () {
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{id}', [ProductController::class, 'update']);
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);
        
        Route::post('/users/{userId}/assign-role', [UserController::class, 'assignRole']);
        Route::get('/users/clients', [UserController::class, 'getClients']);
        Route::get('/users/admins', [UserController::class, 'getAdmins']);
    });
});
```

---

## ⚔️ Prevención de Ataques

### ❌ ANTIPATRONES (NO HACER)

#### 1. Almacenar Rol en Tabla Users

```sql
-- ❌ NUNCA HACER ESTO
ALTER TABLE public.users ADD COLUMN role VARCHAR(50);

-- ❌ Esto permite escalada de privilegios
UPDATE users SET role = 'admin' WHERE id = 'attacker-id';
```

#### 2. Validar Admin en Client-Side

```typescript
// ❌ NUNCA HACER ESTO
const isAdmin = localStorage.getItem('role') === 'admin';

if (isAdmin) {
  // Mostrar opciones de admin
  // ⚠️ Un atacante puede modificar localStorage
}
```

```typescript
// ❌ NUNCA HACER ESTO
const isAdmin = user?.role === 'admin'; // Del frontend
fetch('/api/admin/delete-user', {
  headers: { 'X-User-Role': 'admin' } // ⚠️ Fácil de falsificar
});
```

#### 3. Confiar en Headers HTTP

```php
// ❌ NUNCA HACER ESTO
public function deleteUser(Request $request)
{
    if ($request->header('X-User-Role') === 'admin') {
        // ⚠️ Cualquiera puede enviar este header
        User::destroy($request->user_id);
    }
}
```

#### 4. Validar Rol sin Verificar en DB

```php
// ❌ NUNCA HACER ESTO
public function updateProduct(Request $request)
{
    // Asumiendo que el JWT tiene un claim 'role'
    $role = $request->user()->token()->role; // ⚠️ Puede estar desactualizado
    
    if ($role === 'admin') {
        // ⚠️ No verifica contra la base de datos actual
    }
}
```

### ✅ PATRONES CORRECTOS

#### 1. Middleware Verificando Rol en DB

```php
// ✅ CORRECTO
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
});

// El middleware verifica contra user_roles table
```

#### 2. Validación Server-Side en Cada Acción

```php
// ✅ CORRECTO
public function store(Request $request)
{
    // Verificar rol contra la base de datos
    if (!$request->user()->isAdmin()) {
        abort(403, 'No autorizado');
    }
    
    // Proceder con la lógica
    $product = Product::create($request->validated());
    
    return response()->json(['data' => $product], 201);
}
```

#### 3. Rate Limiting en Endpoints Críticos

```php
// ✅ CORRECTO
Route::middleware(['auth:sanctum', 'admin', 'throttle:10,1'])->group(function () {
    // Máximo 10 requests por minuto
    Route::post('/users/{userId}/assign-role', [UserController::class, 'assignRole']);
});
```

#### 4. Audit Logging

```php
// ✅ CORRECTO
use Illuminate\Support\Facades\Log;

public function assignRole(Request $request, $userId)
{
    if (!auth()->user()->isAdmin()) {
        abort(403);
    }
    
    $targetUser = User::findOrFail($userId);
    $targetUser->assignRole($request->role);
    
    // Registrar cambio de rol
    Log::info('Role changed', [
        'admin_id' => auth()->id(),
        'admin_email' => auth()->user()->email,
        'target_user_id' => $userId,
        'new_role' => $request->role,
        'ip' => $request->ip(),
        'timestamp' => now(),
    ]);
    
    return response()->json([
        'message' => 'Rol asignado correctamente',
    ]);
}
```

### 🛡️ Ataques Comunes y Prevención

| Ataque | Descripción | Prevención |
|--------|-------------|------------|
| **Escalada de Privilegios** | Usuario modifica su rol a 'admin' | Tabla `user_roles` separada con RLS |
| **Manipulación de JWT** | Modificar claims del token | Verificar rol contra DB, no confiar en JWT |
| **IDOR (Insecure Direct Object Reference)** | Acceder a recursos de otros usuarios | Validar `user_id` en queries |
| **Session Hijacking** | Robar token de sesión | HTTPS, tokens con expiración corta |
| **CSRF** | Ejecutar acciones sin consentimiento | CSRF tokens, SameSite cookies |
| **SQL Injection** | Inyectar código SQL malicioso | Usar Eloquent ORM, prepared statements |

---

## 🧪 Testing de Seguridad

### 1. Test de Escalada de Privilegios

```php
<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class SecurityTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test: Usuario sin rol admin no puede crear productos
     */
    public function test_non_admin_cannot_create_product()
    {
        $user = User::factory()->create();
        $user->assignRole('cliente');

        $response = $this->actingAs($user)->postJson('/api/products', [
            'name' => 'Test Product',
            'price' => 100,
        ]);

        $response->assertStatus(403);
        $response->assertJson([
            'message' => 'No autorizado. Se requiere rol de administrador.',
        ]);
    }

    /**
     * Test: Usuario no puede auto-asignarse rol admin
     */
    public function test_user_cannot_self_promote_to_admin()
    {
        $user = User::factory()->create();
        $user->assignRole('cliente');

        // Intentar modificar rol mediante update de perfil
        $response = $this->actingAs($user)->patchJson('/api/auth/profile', [
            'role' => 'admin', // ⚠️ Intentar bypass
        ]);

        // Verificar que el rol NO cambió
        $this->assertFalse($user->fresh()->isAdmin());
        $this->assertTrue($user->fresh()->isCliente());
    }

    /**
     * Test: Solo admins pueden asignar roles
     */
    public function test_only_admins_can_assign_roles()
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $targetUser = User::factory()->create();

        $response = $this->actingAs($admin)->postJson("/api/users/{$targetUser->id}/assign-role", [
            'role' => 'admin',
        ]);

        $response->assertStatus(200);
        $this->assertTrue($targetUser->fresh()->isAdmin());
    }

    /**
     * Test: Cliente no puede asignar roles
     */
    public function test_cliente_cannot_assign_roles()
    {
        $cliente = User::factory()->create();
        $cliente->assignRole('cliente');

        $targetUser = User::factory()->create();

        $response = $this->actingAs($cliente)->postJson("/api/users/{$targetUser->id}/assign-role", [
            'role' => 'admin',
        ]);

        $response->assertStatus(403);
        $this->assertFalse($targetUser->fresh()->isAdmin());
    }

    /**
     * Test: No se puede acceder a endpoints admin sin autenticación
     */
    public function test_cannot_access_admin_endpoints_without_auth()
    {
        $response = $this->postJson('/api/products', [
            'name' => 'Test Product',
        ]);

        $response->assertStatus(401);
    }

    /**
     * Test: RLS protege user_roles table
     */
    public function test_users_can_only_see_own_roles()
    {
        $user1 = User::factory()->create();
        $user1->assignRole('cliente');

        $user2 = User::factory()->create();
        $user2->assignRole('admin');

        // Usuario 1 intenta ver roles de usuario 2
        // Esto debería estar bloqueado por RLS policies
        // (Requiere test de base de datos directo)
    }
}
```

### 2. Test de Integración con Frontend

```typescript
// tests/security.test.ts
import { describe, it, expect } from 'vitest';

describe('Frontend Security', () => {
  it('should not allow role modification in localStorage', () => {
    // Simular intento de modificación
    localStorage.setItem('role', 'admin');
    
    // La aplicación NO debe usar este valor para decisiones de seguridad
    // Solo debe usarse para UX (hide/show)
    const role = localStorage.getItem('role');
    
    // Verificar que las acciones críticas requieren API call
    expect(role).toBe('admin'); // Modificado localmente
    // Pero el API debería rechazar requests no autorizados
  });

  it('should always verify permissions server-side', async () => {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Role': 'admin', // ⚠️ Header falsificado
      },
      body: JSON.stringify({ name: 'Test' }),
    });

    expect(response.status).toBe(401); // No autenticado
  });
});
```

---

## ✅ Checklist Pre-Deploy

### 🗃️ Base de Datos PostgreSQL

- [ ] ✅ Tabla `user_roles` creada con ENUM `app_role`
- [ ] ✅ Función `has_role()` implementada (SECURITY DEFINER)
- [ ] ✅ Políticas RLS habilitadas en `user_roles`
- [ ] ✅ Trigger `assign_default_role` para nuevos usuarios
- [ ] ✅ Índices creados para performance
- [ ] ✅ Vista `users_with_roles` configurada

### 🔧 Laravel Backend

- [ ] ✅ Modelo `UserRole` implementado
- [ ] ✅ Middleware `EnsureUserIsAdmin` registrado
- [ ] ✅ Rutas admin protegidas con middleware `auth:sanctum` + `admin`
- [ ] ✅ AuthController retorna rol desde `$user->getRole()`
- [ ] ✅ Tests de seguridad pasando (PHPUnit)
- [ ] ✅ Rate limiting en endpoints críticos
- [ ] ✅ Audit logging implementado
- [ ] ✅ CSRF protection habilitado

### ⚛️ Frontend React

- [ ] ✅ `AuthContext` obtiene rol desde API (no localStorage)
- [ ] ✅ `ProtectedRoute` es solo UX (backend valida permisos)
- [ ] ✅ Comentarios de seguridad en archivos críticos
- [ ] ✅ No se almacena información sensible en localStorage
- [ ] ✅ Tokens se envían en headers `Authorization: Bearer`

### 🔒 Auditoría y Prevención

- [ ] ✅ CORS configurado correctamente (`config/cors.php`)
- [ ] ✅ HTTPS habilitado en producción
- [ ] ✅ Tokens con expiración (30 días recomendado)
- [ ] ✅ Input validation (FormRequest en Laravel)
- [ ] ✅ Logs de cambios de roles (audit trail)
- [ ] ✅ Secrets en `.env` (no hardcoded)
- [ ] ✅ SQL injection prevenido (Eloquent ORM)
- [ ] ✅ XSS prevenido (sanitización de outputs)

### 📊 Monitoreo

- [ ] ✅ Logs de errores configurados
- [ ] ✅ Alertas para intentos de escalada de privilegios
- [ ] ✅ Monitoreo de requests fallidos (401, 403)
- [ ] ✅ Backups de base de datos configurados

---

## 📚 Recursos Adicionales

### Documentación Oficial

- [PostgreSQL Row-Level Security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Laravel Authentication](https://laravel.com/docs/11.x/authentication)
- [Laravel Authorization](https://laravel.com/docs/11.x/authorization)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

### Buenas Prácticas

1. **Principio de Mínimo Privilegio**: Los usuarios solo deben tener los permisos mínimos necesarios.
2. **Defense in Depth**: Múltiples capas de seguridad (RLS + Middleware + Validación).
3. **Fail Securely**: En caso de error, negar acceso por defecto.
4. **Audit Everything**: Registrar todas las acciones críticas.
5. **Keep it Simple**: Arquitecturas complejas son más propensas a errores.

### Contacto y Soporte

Para preguntas o reportar vulnerabilidades de seguridad, contactar al equipo de desarrollo.

---

## 🎯 Resumen Ejecutivo

| Concepto | ❌ Incorrecto | ✅ Correcto |
|----------|--------------|-------------|
| **Almacenamiento de Roles** | En tabla `users` | En tabla `user_roles` separada |
| **Validación de Permisos** | Client-side (localStorage) | Server-side (middleware + DB) |
| **RLS Policies** | Queries directas recursivas | Función `has_role()` SECURITY DEFINER |
| **Asignación de Roles** | Endpoint sin protección | Middleware admin + audit log |
| **Confianza en Frontend** | Asumir rol del localStorage | Verificar contra DB en cada request |

### Comandos Rápidos

```bash
# Ejecutar migraciones
php artisan migrate

# Ejecutar tests de seguridad
php artisan test --filter SecurityTest

# Ver logs en tiempo real
tail -f storage/logs/laravel.log

# Listar usuarios con roles
php artisan tinker
>>> User::with('roles')->get()
```

---

**Última actualización**: 2025-01-09  
**Versión**: 1.0.0  
**Autor**: Equipo de Desarrollo
