/**
 * Default Categories Data
 * Centralized category definitions
 */

import type { Category } from '@/types/product.types';

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Lego',
    slug: 'lego',
    order: 0,
    subcategories: [
      { id: '1-1', name: 'Lego Classic', slug: 'lego-classic', order: 0 },
      { id: '1-2', name: 'Lego Technic', slug: 'lego-technic', order: 1 },
      { id: '1-3', name: 'Lego City', slug: 'lego-city', order: 2 },
      { id: '1-4', name: 'Lego Friends', slug: 'lego-friends', order: 3 },
    ],
  },
  {
    id: '2',
    name: 'Juguetes',
    slug: 'juguetes',
    order: 1,
    subcategories: [
      { id: '2-1', name: 'Muñecas', slug: 'munecas', order: 0 },
      { id: '2-2', name: 'Peluches', slug: 'peluches', order: 1 },
      { id: '2-3', name: 'Juegos de Mesa', slug: 'juegos-mesa', order: 2 },
    ],
  },
  {
    id: '3',
    name: 'Electrónica',
    slug: 'electronica',
    order: 2,
    subcategories: [
      { id: '3-1', name: 'Consolas', slug: 'consolas', order: 0 },
      { id: '3-2', name: 'Videojuegos', slug: 'videojuegos', order: 1 },
      { id: '3-3', name: 'Accesorios', slug: 'accesorios', order: 2 },
    ],
  },
  {
    id: '4',
    name: 'Deportes',
    slug: 'deportes',
    order: 3,
    subcategories: [
      { id: '4-1', name: 'Balones', slug: 'balones', order: 0 },
      { id: '4-2', name: 'Bicicletas', slug: 'bicicletas', order: 1 },
      { id: '4-3', name: 'Patinetas', slug: 'patinetas', order: 2 },
    ],
  },
];
