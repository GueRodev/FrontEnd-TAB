# Common Components

Componentes reutilizables que se usan en toda la aplicación.

## OptimizedImage

Componente de imagen optimizado con características integradas:

### Características
- ✅ Lazy loading por defecto
- ✅ Estado de carga con skeleton
- ✅ Fallback de error automático
- ✅ Listo para migración a Next.js

### Uso Básico

```tsx
import { OptimizedImage } from '@/components/common';

<OptimizedImage
  src="/path/to/image.jpg"
  alt="Descripción de la imagen"
  className="w-full h-64"
/>
```

### Props

- `src`: URL de la imagen (requerido)
- `alt`: Texto alternativo (requerido)
- `className`: Clases CSS adicionales
- `fallback`: Imagen de respaldo (default: '/placeholder.svg')
- `loading`: 'lazy' | 'eager' (default: 'lazy')
- `aspectRatio`: 'square' | 'video' | 'auto' (default: 'auto')
- `objectFit`: 'cover' | 'contain' | 'fill' | 'none' (default: 'cover')

### ProductImage

Variante especializada para imágenes de productos:

```tsx
import { ProductImage } from '@/components/common';

<ProductImage
  src={product.image}
  alt={product.name}
  variant="card" // 'card' | 'detail' | 'thumbnail'
/>
```

## Migración a Next.js

Estos componentes están diseñados para facilitar la migración a Next.js:

```tsx
// Actual (React + Vite)
import { OptimizedImage } from '@/components/common';
<OptimizedImage src="/image.jpg" alt="..." />

// Futuro (Next.js)
import Image from 'next/image';
<Image src="/image.jpg" alt="..." width={500} height={500} />
```

Todos los componentes están marcados con `@next-migration` para identificar fácilmente los puntos de migración.
