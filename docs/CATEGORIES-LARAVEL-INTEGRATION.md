# 📦 Categorías - Integración con Laravel Backend

## 🎯 Resumen de Cambios

El módulo de categorías ha sido completamente adaptado para trabajar con el backend Laravel, cambiando de una estructura plana con `subcategories[]` a una estructura jerárquica usando `parent_id` y `level`.

---

## 🔄 Cambios en la Estructura de Datos

### ❌ ANTES (Estructura antigua)
```typescript
interface Category {
  id: string;
  name: string;
  slug: string;
  order: number;
  subcategories: Subcategory[];  // Array anidado
}
```

### ✅ AHORA (Estructura Laravel)
```typescript
interface Category {
  // Core fields
  id: string;                    // string (transformado desde number de Laravel)
  name: string;
  slug: string;
  description?: string;
  
  // Hierarchy (NEW)
  parent_id: string | null;      // null = categoría padre
  level: number;                 // 0=categoría, 1=subcategoría, 2-3=más niveles
  order: number;
  
  // Status (NEW)
  is_protected: boolean;         // true = no se puede eliminar (ej: "Otros")
  is_active: boolean;            // filtrar activas/inactivas
  
  // Relations
  children?: Category[];         // hijos en jerarquía
  subcategories?: Subcategory[]; // DEPRECATED - solo para compatibilidad
  products_count?: number;       // contador de productos
  
  // Soft delete (NEW)
  deleted_at?: string | null;    // fecha de eliminación (papelera)
  
  // Timestamps
  created_at?: string;
  updated_at?: string;
}
```

---

## 📡 Endpoints Laravel

### Categorías Base

```bash
# Listar todas las categorías (con jerarquía)
GET /api/v1/categories
Response: Category[] (array directo, sin wrapper)

# Obtener una categoría específica (con productos)
GET /api/v1/categories/{id}
Response: Category (objeto directo con relations)

# Crear categoría o subcategoría
POST /api/v1/categories
Body: {
  name: string,
  description?: string,
  parent_id?: number|null,  // null = categoría padre
  level: number             // 0=categoría, 1=subcategoría
}
Response: { message: string, category: Category }

# Actualizar categoría
PUT /api/v1/categories/{id}
Body: {
  name?: string,
  description?: string,
  parent_id?: number|null,  // cambiar de categoría padre
  level?: number,
  is_active?: boolean
}
Response: { message: string, category: Category }

# Soft delete (envía a papelera)
DELETE /api/v1/categories/{id}
Response: { message: string, productos_reasignados: number }

# Reordenar categorías
PUT /api/v1/categories/reorder
Body: {
  categories: [
    { id: number, order: number },
    { id: number, order: number }
  ]
}
Response: { message: string }
```

### Papelera de Reciclaje (Soft Delete)

```bash
# Restaurar categoría eliminada
POST /api/v1/categories/{id}/restore
Response: { message: string, category: Category }

# Eliminar permanentemente (force delete)
DELETE /api/v1/categories/{id}/force
Response: { message: string, productos_reasignados: number }
```

---

## 🔧 Transformers (Data Mappers)

### Laravel → Frontend

```typescript
import { transformLaravelCategory } from '@/features/categories/utils/transformers';

// Transforma respuesta de Laravel a formato del frontend
const frontendCategory = transformLaravelCategory(laravelResponse);
```

**Transformaciones realizadas:**
- `id: number` → `id: string`
- `parent_id: number` → `parent_id: string`
- `children` → popula también `subcategories` para compatibilidad

### Frontend → Laravel

```typescript
import { transformToLaravelPayload } from '@/features/categories/utils/transformers';

// Transforma datos del frontend para enviar a Laravel
const laravelPayload = transformToLaravelPayload(categoryData);
```

**Transformaciones realizadas:**
- `id: string` → `id: number`
- `parent_id: string` → `parent_id: number`
- Elimina campos solo de UI (`isExpanded`, etc.)

---

## 🎨 Validaciones Actualizadas

```typescript
// src/features/categories/validations/category.validation.ts

export const categorySchema = z.object({
  name: z.string().trim()
    .min(1, 'El nombre es requerido')
    .max(255, 'Máximo 255 caracteres'),  // ⚠️ Cambio: 50 → 255
  description: z.string()
    .max(1000, 'Máximo 1000 caracteres')
    .optional(),
  parent_id: z.string().nullable().optional(),  // ⚠️ NUEVO
  level: z.number().min(0).max(3).default(0),   // ⚠️ NUEVO
  order: z.number().min(0).optional(),
  is_active: z.boolean().default(true),         // ⚠️ NUEVO
});

export const reorderSchema = z.object({
  categories: z.array(z.object({
    id: z.string(),
    order: z.number().min(0),
  })),
});
```

---

## 🔄 Cambios en el Service

### Formato de Respuesta Laravel

⚠️ **IMPORTANTE**: Laravel NO usa el wrapper estándar `{ data, message, timestamp }`

```typescript
// ❌ NO es así:
{ data: Category[], message: string, timestamp: string }

// ✅ ES así:
Category[]  // Array directo para GET /categories

{ message: string, category: Category }  // Para POST/PUT
```

### Soporte para Ambos Formatos

El servicio ahora soporta tanto el formato antiguo como el nuevo:

```typescript
// Formato antiguo (backward compatibility)
await categoriesService.reorder({ 
  order: ['id1', 'id2', 'id3'] 
});

// Formato nuevo (Laravel)
await categoriesService.reorder({ 
  categories: [
    { id: 'id1', order: 1 },
    { id: 'id2', order: 2 },
    { id: 'id3', order: 3 }
  ]
});
```

---

## 🗂️ Migración de Datos

### Detectar si se necesita migración

```typescript
import { needsMigration, performMigration } from '@/features/categories/utils/migration';

if (needsMigration()) {
  await performMigration();
  console.log('✅ Categorías migradas al nuevo formato');
}
```

### Qué hace la migración

1. Convierte estructura `subcategories[]` a `parent_id + level`
2. Añade campos nuevos: `is_protected`, `is_active`, `deleted_at`
3. Marca "Otros" como `is_protected: true`
4. Mantiene `subcategories[]` para compatibilidad temporal

---

## 📋 Reglas de Negocio Laravel

### Categoría "Otros" (Protegida)

```typescript
// Backend Laravel valida:
if (category.is_protected) {
  throw new \Exception('No se puede eliminar una categoría protegida');
}
```

### Reasignación de Productos al Eliminar

Cuando se elimina una categoría:
1. **Soft delete**: Se marca con `deleted_at`
2. **Productos**: Se reasignan automáticamente a "Otros"
3. **Respuesta**: Indica cuántos productos fueron reasignados

```json
{
  "message": "Categoría eliminada exitosamente",
  "productos_reasignados": 15
}
```

### Jerarquía (Niveles)

```typescript
level: 0  // Categoría padre
level: 1  // Subcategoría (1er nivel)
level: 2  // Sub-subcategoría (2do nivel)
level: 3  // Nivel máximo permitido
```

---

## 🎯 Checklist de Integración

### ✅ Fase 1: Tipos y Validaciones (COMPLETADO)
- [x] Actualizar `Category` interface con campos Laravel
- [x] Crear transformers Laravel ↔ Frontend
- [x] Actualizar validaciones Zod (255 chars, level, etc.)
- [x] Mantener backward compatibility con `Subcategory`

### ✅ Fase 2: Service Layer (COMPLETADO)
- [x] Adaptar `categoriesService` a respuestas Laravel
- [x] Implementar transformers en endpoints
- [x] Soporte dual para formato de reorder
- [x] Crear métodos para soft delete/restore

### ✅ Fase 3: Context y Hooks (COMPLETADO)
- [x] Actualizar `CategoriesContext` con nuevos métodos
- [x] Mantener métodos deprecados para compatibilidad
- [x] Actualizar `useCategoriesAdmin` con lógica de protección

### 🔄 Fase 4: UI Components (PENDIENTE)
- [ ] Añadir badge "Protegida" en categorías `is_protected`
- [ ] Mostrar contador `products_count` en UI
- [ ] Crear componente `CategoryRecycleBin` para papelera
- [ ] Deshabilitar botón eliminar en categorías protegidas

### 🔄 Fase 5: Testing (PENDIENTE)
- [ ] Probar CRUD con transformers
- [ ] Validar soft delete y restore
- [ ] Verificar reasignación de productos a "Otros"
- [ ] Confirmar que "Otros" no se puede eliminar

---

## 🚀 Activar Integración con API

### 1. Configurar variable de entorno

```bash
# .env
VITE_USE_API=true
VITE_API_BASE_URL=http://localhost:8000
```

### 2. El servicio automáticamente cambiará

```typescript
// src/features/categories/services/categories.service.ts

// Helper inline para localStorage
const getItem = <T>(key: string): T | null => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};

if (APP_CONFIG.useAPI) {
  // 🟢 USA API LARAVEL
  const response = await apiClient.get('/categories');
  return { data: response.data.map(transformLaravelCategory), ... };
} else {
  // 🟡 USA LOCALSTORAGE (desarrollo)
  const categories = getItem<Category[]>(STORAGE_KEYS.categories) || [];
  return { data: categories, ... };
}
```

### 3. Sin cambios de código necesarios

Todo el código existente seguirá funcionando gracias a:
- **Transformers** que convierten formatos automáticamente
- **Backward compatibility** mantenida en tipos
- **Soporte dual** en métodos del contexto

---

## 🔍 Debugging y Logs

### Ver transformaciones

```typescript
import { transformLaravelCategory } from '@/features/categories/utils/transformers';

console.log('Laravel response:', laravelData);
const transformed = transformLaravelCategory(laravelData);
console.log('Transformed for frontend:', transformed);
```

### Verificar formato de datos

```typescript
import { needsMigration } from '@/features/categories/utils/migration';

if (needsMigration()) {
  console.warn('⚠️ Categories in localStorage need migration!');
  // Ejecutar migración manual si es necesario
}
```

---

## ⚠️ Notas Importantes

### Subcategorías → Children

```typescript
// ❌ DEPRECADO (pero aún funciona)
category.subcategories.forEach(sub => { ... });

// ✅ RECOMENDADO (nueva estructura)
category.children?.forEach(child => { ... });
```

### IDs: number vs string

```typescript
// Laravel envía: id: number
// Frontend usa: id: string

// ✅ Los transformers manejan esto automáticamente
const frontendCat = transformLaravelCategory(laravelCat);
console.log(typeof frontendCat.id);  // "string"
```

### Formato de Respuestas

```typescript
// ❌ NO esperar:
{ data: Category[], message: string }

// ✅ Laravel devuelve:
Category[]  // Directo para GET
{ message: string, category: Category }  // Para mutations
```

---

## 📚 Archivos Modificados

```
src/features/categories/
├── types/
│   └── category.types.ts              ✅ Actualizado con campos Laravel
├── utils/
│   ├── transformers.ts                🆕 Laravel ↔ Frontend mappers
│   ├── migration.ts                   🆕 Migración de datos antiguos
│   └── index.ts                       🆕 Exports
├── validations/
│   └── category.validation.ts         ✅ Actualizado (255 chars, level)
├── services/
│   └── categories.service.ts          ✅ Adaptado a respuestas Laravel
├── contexts/
│   └── CategoriesContext.tsx          ✅ Nuevos métodos soft delete
├── hooks/
│   └── useCategoriesAdmin.ts          ✅ Lógica de categorías protegidas
└── data/
    └── categories.data.ts             ✅ DEFAULT_CATEGORIES con campos nuevos
```

---

## 🎓 Próximos Pasos

1. **Probar en desarrollo** con `VITE_USE_API=false`
2. **Crear componentes UI** para mostrar nuevos campos
3. **Implementar papelera** de reciclaje en admin
4. **Activar API** con `VITE_USE_API=true` cuando Laravel esté listo
5. **Testing end-to-end** con backend real

---

## 🆘 Troubleshooting

### Error: "Property 'parent_id' is missing"

**Causa**: Datos antiguos en localStorage sin los campos nuevos.

**Solución**:
```typescript
import { performMigration } from '@/features/categories/utils/migration';
await performMigration();
```

### Error: "Cannot read property 'children' of undefined"

**Causa**: Accediendo a `children` sin verificar si existe.

**Solución**:
```typescript
// ❌ Incorrecto
category.children.forEach(...)

// ✅ Correcto
category.children?.forEach(...)
```

### Reorder no funciona

**Causa**: Formato incorrecto de la request.

**Solución**: Verificar que se envía el formato correcto:
```typescript
// Laravel espera:
{
  categories: [
    { id: number, order: number }
  ]
}
```

---

**Documentación actualizada**: 2024
**Versión Frontend**: Compatible con Laravel v1.0
**Estado**: ✅ Listo para integración
