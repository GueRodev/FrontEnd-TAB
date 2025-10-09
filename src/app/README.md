# Next.js App Directory Structure

Esta carpeta contiene la estructura preparada para la migración a Next.js App Router.

## 📁 Estructura Actual

```
src/app/
├── layout.tsx                    # Root layout (providers, metadata)
├── page.tsx                      # Homepage (/)
├── not-found.tsx                 # 404 page
├── (shop)/                       # Route group - no afecta URL
│   ├── layout.tsx               # Shop layout (Header + Footer)
│   ├── cart/
│   │   └── page.tsx             # /cart
│   ├── wishlist/
│   │   └── page.tsx             # /wishlist
│   ├── category/
│   │   └── [slug]/
│   │       └── page.tsx         # /category/:slug (dynamic)
│   └── account/
│       └── page.tsx             # /account
├── auth/
│   └── page.tsx                 # /auth (sin layout shop)
└── admin/
    ├── layout.tsx               # Admin layout (Sidebar + Header)
    ├── page.tsx                 # /admin (Dashboard)
    ├── products/
    │   └── page.tsx             # /admin/products
    ├── orders/
    │   ├── page.tsx             # /admin/orders
    │   └── history/
    │       └── page.tsx         # /admin/orders/history
    ├── categories/
    │   └── page.tsx             # /admin/categories
    ├── users/
    │   └── page.tsx             # /admin/users
    ├── settings/
    │   └── page.tsx             # /admin/settings
    └── profile/
        └── page.tsx             # /admin/profile
```

## 🎯 Estado Actual

**Estos archivos son REFERENCIAS para la migración**, no están activos actualmente.

El routing actual funciona con:
- React Router en `src/App.tsx`
- Páginas en `src/pages/`
- Componentes en `src/components/`

## 🚀 Cómo Migrar a Next.js

### Paso 1: Preparación

1. Crear un nuevo proyecto Next.js:
```bash
npx create-next-app@latest toys-and-bricks-nextjs
# Seleccionar: App Router, TypeScript, Tailwind CSS
```

2. Copiar dependencias necesarias del `package.json` actual

### Paso 2: Copiar Estructura Base

```bash
# Copiar configuración del sitio
cp src/config/site.ts [nextjs-project]/src/config/

# Copiar componentes comunes
cp -r src/components [nextjs-project]/src/
cp -r src/contexts [nextjs-project]/src/
cp -r src/hooks [nextjs-project]/src/
cp -r src/lib [nextjs-project]/src/
cp -r src/types [nextjs-project]/src/
cp -r src/data [nextjs-project]/src/

# Copiar app directory
cp -r src/app [nextjs-project]/src/
```

### Paso 3: Adaptar cada Página

Por ejemplo, para el Homepage:

**Antes (React Router - src/pages/Index.tsx):**
```tsx
import Header from '@/components/Header';
// ...

export default Index;
```

**Después (Next.js - app/page.tsx):**
```tsx
import HomePage from './page'; // Este archivo en src/app/page.tsx
export default HomePage;
```

### Paso 4: Actualizar Imports

- Cambiar `react-router-dom` por `next/link` y `next/navigation`
- Actualizar imágenes de `<img>` a `<Image>` de `next/image`
- Ya tienes `OptimizedImage` como preparación

**Antes:**
```tsx
import { Link, useNavigate } from 'react-router-dom';

<Link to="/cart">Carrito</Link>
const navigate = useNavigate();
navigate('/cart');
```

**Después:**
```tsx
import Link from 'next/link';
import { useRouter } from 'next/navigation';

<Link href="/cart">Carrito</Link>
const router = useRouter();
router.push('/cart');
```

### Paso 5: Configurar Metadata

En cada `page.tsx`, descomenta y exporta el metadata:

```tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Carrito de Compras',
  description: 'Revisa y completa tu compra',
};

export default function CartPage() {
  // ...
}
```

### Paso 6: Layouts Automáticos

Los layouts ya están configurados:

1. **app/layout.tsx** - Se aplica a TODAS las páginas
2. **app/(shop)/layout.tsx** - Solo para rutas de shop
3. **app/admin/layout.tsx** - Solo para rutas de admin

No necesitas importar Header/Footer en cada página, los layouts lo hacen automáticamente.

### Paso 7: Migrar Contexts a Server Components

Considera si algunos datos pueden ser Server Components:

```tsx
// Antes: Client Component con Context
'use client';
import { useProducts } from '@/contexts/ProductsContext';

// Después: Posible Server Component
async function ProductsPage() {
  const products = await getProducts(); // Fetch directo
  return <ProductGrid products={products} />;
}
```

## 📋 Checklist de Migración

- [ ] Crear nuevo proyecto Next.js
- [ ] Copiar dependencias
- [ ] Copiar `src/config/site.ts`
- [ ] Copiar todos los componentes (`src/components/`)
- [ ] Copiar contexts, hooks, lib, types, data
- [ ] Copiar estructura `src/app/`
- [ ] Adaptar cada página (reemplazar placeholders)
- [ ] Actualizar imports (Link, useRouter)
- [ ] Cambiar `<img>` por `<Image>` o `<OptimizedImage>`
- [ ] Configurar metadata en cada página
- [ ] Actualizar `tailwind.config.ts`
- [ ] Probar cada ruta
- [ ] Migrar storage de localStorage a API Routes si necesario
- [ ] Configurar variables de entorno
- [ ] Deploy en Vercel

## 🎨 Ventajas de la Estructura

✅ **Layouts Automáticos**: Header/Footer/Sidebar se aplican automáticamente
✅ **Metadata SEO**: Configuración centralizada por página
✅ **Rutas Tipadas**: TypeScript sabe las rutas disponibles
✅ **Loading States**: Fácil agregar `loading.tsx` en cada carpeta
✅ **Error Boundaries**: Agregar `error.tsx` para manejo de errores
✅ **Streaming**: Componentes pueden hacer streaming con Suspense
✅ **Optimización Automática**: Next.js optimiza código automáticamente

## 📚 Recursos

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Migración de Pages a App Router](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
- [Data Fetching en App Router](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [next/image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)

## 💡 Notas Importantes

1. Los archivos en `src/app/` son **REFERENCIAS**. No están activos hasta que migres a Next.js.

2. Todos los componentes actuales funcionarán en Next.js con cambios mínimos.

3. La estructura está diseñada para facilitar la migración gradual: puedes empezar con una página y seguir agregando.

4. Los comentarios `@next-migration` en el código marcan puntos importantes para la migración.
