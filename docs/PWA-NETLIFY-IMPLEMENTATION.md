# 📱 Toys and Bricks - PWA + Netlify Implementation Guide

> Guía completa para convertir la aplicación en Progressive Web App y desplegarla en Netlify.

---

## 🎯 Resumen del Proyecto

| Aspecto | Estado Actual | Acción Requerida |
|---------|---------------|------------------|
| Framework | Vite + React + TypeScript | ✅ Compatible |
| Build Tool | Vite 5.x | ✅ Compatible |
| Routing | React Router (SPA) | ⚠️ Requiere redirect config |
| Icons PWA | No existen | ❌ Crear 192x192, 512x512 |
| Manifest | No existe | ❌ Configurar en plugin |
| Service Worker | No existe | ❌ Generar con plugin |
| netlify.toml | No existe | ❌ Crear archivo |

**Complejidad:** BAJA-MEDIA  
**Tiempo Estimado:** 2-3 horas

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Fase 1: Preparación (Pre-requisitos)
- [ ] Backup del proyecto (commit actual)
- [ ] Verificar que `npm run build` funciona sin errores
- [ ] Tener iconos del logo en formato PNG (para generar diferentes tamaños)

### Fase 2: Instalación de Dependencias
- [ ] Instalar `vite-plugin-pwa`
- [ ] Verificar que no hay conflictos de versiones

### Fase 3: Configuración Vite
- [ ] Agregar VitePWA plugin a `vite.config.ts`
- [ ] Configurar manifest (nombre, iconos, colores)
- [ ] Configurar workbox (estrategias de cache)
- [ ] Excluir API calls del cache

### Fase 4: Assets PWA
- [ ] Crear `pwa-192x192.png` en `public/`
- [ ] Crear `pwa-512x512.png` en `public/`
- [ ] Crear `apple-touch-icon.png` (180x180) en `public/`
- [ ] Opcional: Crear `maskable-icon.png` (512x512 con padding)

### Fase 5: Meta Tags HTML
- [ ] Agregar `<meta name="theme-color">` a index.html
- [ ] Agregar `<link rel="apple-touch-icon">` a index.html
- [ ] Agregar `<meta name="apple-mobile-web-app-capable">` a index.html

### Fase 6: TypeScript Configuration
- [ ] Agregar types de PWA a `tsconfig.app.json`

### Fase 7: Configuración Netlify
- [ ] Crear `netlify.toml` en raíz del proyecto
- [ ] Configurar redirects SPA
- [ ] Configurar headers para manifest y service worker
- [ ] Configurar cache headers para assets

### Fase 8: Componente de Actualización (Opcional)
- [ ] Crear componente `PWAUpdatePrompt`
- [ ] Integrar con sistema de toasts existente (sonner)

### Fase 9: Testing Local
- [ ] Ejecutar `npm run build`
- [ ] Ejecutar `npm run preview`
- [ ] Verificar en Chrome DevTools > Application > Manifest
- [ ] Verificar en Chrome DevTools > Application > Service Workers
- [ ] Probar instalación de PWA
- [ ] Ejecutar Lighthouse PWA audit

### Fase 10: Deploy y Verificación Producción
- [ ] Deploy a Netlify
- [ ] Verificar manifest.webmanifest (200 OK)
- [ ] Verificar sw.js (200 OK)
- [ ] Probar instalación PWA en producción
- [ ] Verificar funcionamiento offline básico

---

## 📝 PASO A PASO DETALLADO

### PASO 1: Instalar Dependencia

```bash
npm install -D vite-plugin-pwa
```

**Verificación:** `package.json` debe mostrar `"vite-plugin-pwa": "^0.20.x"` en devDependencies

---

### PASO 2: Configurar vite.config.ts

Reemplazar el contenido actual por:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'robots.txt'],
      manifest: {
        name: 'Toys and Bricks - LEGO & Collectibles',
        short_name: 'Toys & Bricks',
        description: 'Shop the best selection of LEGO sets, Star Wars merchandise, superhero figurines, and collectibles.',
        theme_color: '#1a1a2e',
        background_color: '#1a1a2e',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,jpg,jpeg,woff,woff2}'],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        // ⚠️ CRÍTICO: Excluir API calls del cache
        navigateFallbackDenylist: [/^\/api/],
        runtimeCaching: [
          {
            // Cache para imágenes de productos
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 días
              },
            },
          },
          {
            // Network First para API calls
            urlPattern: /^https?:\/\/.*\/api\/.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5, // 5 minutos
              },
              networkTimeoutSeconds: 10,
            },
          },
          {
            // Cache para fuentes
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 año
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: false, // Cambiar a true para testing local
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
```

---

### PASO 3: Actualizar tsconfig.app.json

Agregar la propiedad `types` en `compilerOptions`:

```json
{
  "compilerOptions": {
    "types": ["vite-plugin-pwa/client"],
    // ... resto de configuración existente
  }
}
```

---

### PASO 4: Actualizar index.html

Agregar meta tags PWA en el `<head>`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Toys and Bricks - LEGO, Star Wars & Collectibles</title>
    <meta name="description" content="Shop the best selection of LEGO sets, Star Wars merchandise, superhero figurines, and collectibles at Toys and Bricks." />
    <meta name="author" content="Toys and Bricks" />
    
    <!-- PWA Meta Tags -->
    <meta name="theme-color" content="#1a1a2e" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="Toys & Bricks" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

    <!-- Open Graph -->
    <meta property="og:title" content="Toys and Bricks - LEGO, Star Wars & Collectibles" />
    <meta property="og:description" content="Shop the best selection of LEGO sets, Star Wars merchandise, superhero figurines, and collectibles at Toys and Bricks." />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@lovable_dev" />
    <meta name="twitter:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />
    
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
  </head>

  <body>
    <div id="root"></div>
    <!-- IMPORTANT: DO NOT REMOVE THIS SCRIPT TAG OR THIS VERY COMMENT! -->
    <script src="https://cdn.gpteng.co/gptengineer.js" type="module"></script>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

### PASO 5: Crear Iconos PWA

Crear los siguientes archivos en `public/`:

| Archivo | Tamaño | Uso |
|---------|--------|-----|
| `pwa-192x192.png` | 192x192 px | Android shortcut icon |
| `pwa-512x512.png` | 512x512 px | Splash screen, maskable |
| `apple-touch-icon.png` | 180x180 px | iOS home screen |

**Herramientas recomendadas para generar iconos:**
- [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator)
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [Maskable.app](https://maskable.app/editor) para iconos maskable

**Especificaciones de diseño:**
- Usar colores de marca: `#1a1a2e` (fondo oscuro)
- Logo centrado con padding adecuado para maskable
- Formato PNG con transparencia opcional

---

### PASO 6: Crear netlify.toml

Crear archivo `netlify.toml` en la raíz del proyecto:

```toml
# Netlify Configuration for Toys and Bricks PWA

[build]
  command = "npm run build"
  publish = "dist"

# ============================================
# SPA Routing - CRÍTICO para React Router
# ============================================
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# ============================================
# Headers Configuration
# ============================================

# Manifest file - Content-Type correcto
[[headers]]
  for = "/manifest.webmanifest"
  [headers.values]
    Content-Type = "application/manifest+json"
    Cache-Control = "public, max-age=0, must-revalidate"

# Service Worker - NO cachear
[[headers]]
  for = "/sw.js"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"

# Workbox files - NO cachear
[[headers]]
  for = "/workbox-*.js"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"

# Assets estáticos - Cache largo
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# Imágenes - Cache largo
[[headers]]
  for = "/*.png"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.jpg"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.webp"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# Security Headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

---

### PASO 7: Componente PWAUpdatePrompt (Opcional)

Crear `src/components/pwa/PWAUpdatePrompt.tsx`:

```typescript
import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { toast } from 'sonner';

export function PWAUpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered:', r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  useEffect(() => {
    if (needRefresh) {
      toast('Nueva versión disponible', {
        description: 'Haz clic para actualizar la aplicación',
        duration: Infinity,
        action: {
          label: 'Actualizar',
          onClick: () => {
            updateServiceWorker(true);
          },
        },
        onDismiss: () => setNeedRefresh(false),
      });
    }
  }, [needRefresh, updateServiceWorker, setNeedRefresh]);

  return null;
}
```

Crear `src/components/pwa/index.ts`:

```typescript
export { PWAUpdatePrompt } from './PWAUpdatePrompt';
```

Agregar en `src/App.tsx`:

```typescript
import { PWAUpdatePrompt } from '@/components/pwa';

// Dentro del componente App, antes del cierre:
<PWAUpdatePrompt />
```

---

### PASO 8: Testing Local

```bash
# 1. Build de producción
npm run build

# 2. Preview local (simula producción)
npm run preview
```

**Verificaciones en Chrome DevTools:**

1. **Application > Manifest:**
   - ✅ Manifest detectado
   - ✅ Icons cargando correctamente
   - ✅ Name y short_name correctos

2. **Application > Service Workers:**
   - ✅ SW registrado y activado
   - ✅ Status: "activated and is running"

3. **Lighthouse > PWA:**
   - Ejecutar audit PWA
   - Target: Score > 90

4. **Instalación:**
   - ✅ Icono de instalación en barra de direcciones
   - ✅ App se instala correctamente

---

### PASO 9: Deploy a Netlify

**Opción A: Desde Lovable**
1. Click en "Publish" en Lovable
2. La app se desplegará automáticamente

**Opción B: Desde GitHub + Netlify**
1. Conectar repo a Netlify
2. Netlify detectará `netlify.toml` automáticamente
3. Deploy se ejecuta en cada push

**Verificaciones post-deploy:**

```bash
# Verificar manifest
curl -I https://tu-sitio.netlify.app/manifest.webmanifest
# Debe retornar: Content-Type: application/manifest+json

# Verificar service worker
curl -I https://tu-sitio.netlify.app/sw.js
# Debe retornar: 200 OK
```

---

## ⚠️ TROUBLESHOOTING COMÚN

### Problema 1: "Add to Home Screen" no aparece
**Causa:** Manifest incompleto o iconos faltantes  
**Solución:** Verificar que todos los iconos existen y manifest tiene todos los campos requeridos

### Problema 2: Service Worker no se actualiza
**Causa:** Cache agresivo  
**Solución:** Forzar actualización con `skipWaiting: true` y `clientsClaim: true`

### Problema 3: Rutas 404 en refresh
**Causa:** Falta redirect SPA en Netlify  
**Solución:** Verificar que `netlify.toml` tiene el redirect `/* → /index.html`

### Problema 4: API calls retornan datos cacheados viejos
**Causa:** Workbox cacheando API responses  
**Solución:** Verificar `navigateFallbackDenylist: [/^\/api/]` y handler `NetworkFirst` para API

### Problema 5: Manifest 404
**Causa:** Content-Type incorrecto  
**Solución:** Agregar header en `netlify.toml` para `/manifest.webmanifest`

### Problema 6: TypeScript error "Cannot find module 'virtual:pwa-register/react'"
**Causa:** Types no configurados  
**Solución:** Agregar `"vite-plugin-pwa/client"` a `types` en tsconfig.app.json

---

## 📊 MÉTRICAS DE ÉXITO

| Métrica | Target | Cómo Verificar |
|---------|--------|----------------|
| Lighthouse PWA Score | > 90 | Chrome DevTools > Lighthouse |
| Manifest válido | ✅ | DevTools > Application > Manifest |
| SW activo | ✅ | DevTools > Application > Service Workers |
| Installable | ✅ | Icono de instalación visible |
| Offline básico | ✅ | Desactivar red, verificar shell carga |

---

## 🕐 TIEMPO ESTIMADO POR FASE

| Fase | Tiempo |
|------|--------|
| Instalación y config Vite | 30 min |
| Creación de iconos | 30 min |
| Netlify config | 15 min |
| Testing y ajustes | 45 min |
| Deploy y verificación | 30 min |
| **Total** | **~2.5 horas** |

---

## 📚 RECURSOS ADICIONALES

- [Vite PWA Plugin Documentation](https://vite-pwa-org.netlify.app/)
- [Workbox Documentation](https://developer.chrome.com/docs/workbox/)
- [Netlify Redirects](https://docs.netlify.com/routing/redirects/)
- [PWA Builder](https://www.pwabuilder.com/)
- [Maskable Icons](https://web.dev/maskable-icon/)

---

## 🔄 ACTUALIZACIONES FUTURAS

Cuando necesites actualizar la PWA:

1. **Cambios menores:** El SW se actualizará automáticamente gracias a `registerType: 'autoUpdate'`
2. **Cambios de manifest:** Requieren rebuild y redeploy
3. **Nuevos iconos:** Agregar al manifest y rebuild
4. **Cache issues:** Limpiar caches en DevTools o incrementar versión

---

*Documento creado: Diciembre 2024*  
*Última actualización: Diciembre 2024*
