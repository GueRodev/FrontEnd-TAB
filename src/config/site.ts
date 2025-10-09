/**
 * Site Configuration
 * Centralized configuration for metadata, SEO, and business information
 * @next-migration: Will be used in app/layout.tsx for metadata generation
 */

export const siteConfig = {
  name: 'Toys and Bricks',
  description: 'Tu tienda online de juguetes y construcción de confianza',
  url: 'https://toysandbricks.com',
  ogImage: 'https://toysandbricks.com/og.jpg',
  
  // Business information
  business: {
    name: 'Toys and Bricks',
    tagline: 'Construye tus sueños',
    phone: '+52 1234567890',
    email: 'contacto@toysandbricks.com',
    whatsapp: {
      phoneNumber: '1234567890',
      countryCode: '+52',
    },
  },

  // Currency and localization
  locale: {
    currency: {
      code: 'MXN',
      symbol: '$',
      locale: 'es-MX',
    },
    language: 'es',
    region: 'MX',
  },

  // Social links
  links: {
    facebook: 'https://facebook.com/toysandbricks',
    instagram: 'https://instagram.com/toysandbricks',
    twitter: 'https://twitter.com/toysandbricks',
  },

  // SEO metadata
  metadata: {
    title: {
      default: 'Toys and Bricks - Tu tienda de juguetes online',
      template: '%s | Toys and Bricks',
    },
    description: 'Descubre la mejor selección de juguetes y sets de construcción. Envíos a toda la república. Compra segura y garantizada.',
    keywords: [
      'juguetes',
      'lego',
      'construcción',
      'tienda online',
      'juguetería',
      'sets de construcción',
      'figuras',
      'coleccionables',
    ],
  },

  // Features flags
  features: {
    wishlist: true,
    reviews: false,
    multipleImages: false,
    stockManagement: true,
    orderTracking: true,
  },

  // Pagination
  pagination: {
    defaultPageSize: 12,
    maxPageSize: 100,
  },
} as const;

export type SiteConfig = typeof siteConfig;
