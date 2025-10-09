/**
 * Product-related types
 * Centralized types for products, categories, and subcategories
 */

export interface Product {
  id: string;
  name: string;
  marca?: string;
  categoryId: string;
  subcategoryId?: string;
  price: number;
  stock: number;
  description: string;
  image: string;
  status: 'active' | 'inactive';
  isFeatured: boolean;
  createdAt: string;
}

export interface Subcategory {
  id: string;
  name: string;
  description?: string;
  order: number;
  slug: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  order: number;
  slug: string;
  subcategories: Subcategory[];
  isExpanded?: boolean;
}

export type ProductStatus = 'active' | 'inactive';
