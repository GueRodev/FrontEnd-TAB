# Configuración de la Aplicación

Gestión centralizada de configuración, validación de variables de entorno y settings de negocio.

## Archivos

### `env.config.ts`
**Responsabilidad:** Validación y acceso type-safe a variables de entorno.

- Valida variables requeridas al inicio
- Define tipos para todas las variables de entorno
- Helpers para convertir strings a números y booleanos
- Valida URLs y formatos específicos (WhatsApp)

**Relación con Laravel:**
- Define `VITE_API_BASE_URL` para conectar con backend Laravel
- Valida configuración de API correctamente
- Prepara integración con autenticación Laravel

### `app.config.ts`
**Responsabilidad:** Configuración de negocio y constantes de aplicación.

- Settings de negocio (envío, moneda, WhatsApp)
- Claves de LocalStorage
- Opciones de pago y delivery
- Configuración de subida de archivos
- Helpers para cálculos (envío gratis, URLs WhatsApp)

**Relación con Laravel:**
- Valores actuales son locales pero preparados para migrar a Laravel
- Al integrar Laravel, estos valores vendrán de la API
- Facilita transición a configuración dinámica desde BD

### `index.ts`
**Responsabilidad:** Barrel export para importaciones limpias.

- Centraliza exportaciones de configuración
- Permite importar desde un solo punto: `@/config`
- Mantiene orden de carga (ENV primero)

## Integración con Laravel

### Actual (Mock/LocalStorage)
```typescript
import { APP_CONFIG, ENV } from '@/config';
// Usa valores estáticos de .env
```

### Futura (con Laravel)
Laravel proveerá endpoints para configuración dinámica:

```typescript
// GET /api/settings
{
  "shipping_cost": 2500,
  "free_shipping_threshold": 20000,
  "currency": { "code": "CRC", "symbol": "₡" },
  "whatsapp": { "number": "88888888" }
}
```

`app.config.ts` consumirá estos valores vía API, manteniendo solo URLs base y secrets en variables de entorno.
