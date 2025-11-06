/**
 * Category and Subcategory Types
 * Centralized types for categories and subcategories management
 */

export interface Category {
  id: string;
  name: string;
  description?: string;
  order: number;
  slug: string;
  subcategories: Subcategory[];
  isExpanded?: boolean;
}

export interface Subcategory {
  id: string;
  name: string;
  description?: string;
  order: number;
  slug: string;
}

// DTO types for API operations
export interface CreateCategoryDto {
  name: string;
  description?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
  order?: number;
}

export interface CreateSubcategoryDto {
  name: string;
  description?: string;
}

export interface UpdateSubcategoryDto {
  name?: string;
  description?: string;
  order?: number;
}

export interface ReorderCategoriesDto {
  order: string[]; // Array of category IDs in the new order
}
