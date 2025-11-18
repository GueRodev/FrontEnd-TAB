# Configuración de la Aplicación

Gestión centralizada de configuración y variables de entorno con acceso directo y type-safe.

## Archivos

### `env.config.ts`
**Responsabilidad:** Acceso directo y type-safe a variables de entorno.

- Define tipos para todas las variables de entorno
- Acceso directo a `import.meta.env` con fallbacks inline
- Sin validación compleja ni custom error classes
- Configuración inmutable exportada como `ENV`

**Ejemplo:**
```typescript
export const ENV: EnvConfig = {
  APP_NAME: import.meta.env.VITE_APP_NAME || 'E-Commerce',
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  USE_API: import.meta.env.VITE_USE_API === 'true',
  // ... más configuración
};
```

**Relación con Laravel:**
- Define `VITE_API_URL` para conectar con backend Laravel
- `VITE_USE_API=true` activa modo API (Laravel)
- Todas las variables tienen fallbacks sensatos para desarrollo

### `app.config.ts`
**Responsabilidad:** Configuración de negocio y constantes de aplicación.

- Settings de negocio (moneda, WhatsApp)
- Claves de LocalStorage
- Opciones de pago y delivery
- Configuración de subida de archivos
- Helpers integrados para cálculos (URLs WhatsApp)

**Ejemplo:**
```typescript
export const APP_CONFIG = {
  appName: ENV.APP_NAME,
  currency: {
    code: ENV.CURRENCY_CODE,
    symbol: ENV.CURRENCY_SYMBOL,
    locale: ENV.CURRENCY_LOCALE,
  },
  whatsapp: {
    countryCode: ENV.WHATSAPP_COUNTRY_CODE,
    number: ENV.WHATSAPP_NUMBER,
    buildChatUrl: (message?: string) => { /* ... */ }
  },
  // ... más configuración
};
```

**Relación con Laravel:**
- Valores actuales son locales pero preparados para migrar a Laravel
- Al integrar Laravel, estos valores pueden venir de la API
- Facilita transición a configuración dinámica desde BD

### `index.ts`
**Responsabilidad:** Barrel export para importaciones limpias.

- Centraliza exportaciones de configuración
- Permite importar desde un solo punto: `@/config`
- Mantiene orden de carga (ENV primero, luego APP_CONFIG)

## Uso

### Importar configuración
```typescript
import { ENV, APP_CONFIG } from '@/config';

// Acceder a variables de entorno
console.log(ENV.API_URL);
console.log(ENV.USE_API);

// Construir URL de WhatsApp
const whatsappUrl = APP_CONFIG.whatsapp.buildChatUrl('Hola, consulta sobre producto');
```

## Integración con Laravel

### Modo Local (VITE_USE_API=false)
```typescript
import { APP_CONFIG } from '@/config';
// Usa valores estáticos de .env y localStorage
```

### Modo API (VITE_USE_API=true)
```typescript
import { APP_CONFIG } from '@/config';
// Servicios automáticamente usan Laravel backend
// ENV.API_URL apunta a http://localhost:8000/api (o producción)
```

### Configuración Dinámica (Futuro)
Laravel puede proveer endpoints para configuración dinámica:

```typescript
// GET /api/settings
{
  "currency": { "code": "CRC", "symbol": "₡" },
  "whatsapp": { "number": "88888888" }
}
```

`app.config.ts` podría consumir estos valores vía API, manteniendo solo URLs base y secrets en variables de entorno.

## Variables de Entorno Requeridas

Ver archivo `.env.example` para la lista completa de variables disponibles. Todas tienen fallbacks apropiados para desarrollo local.
