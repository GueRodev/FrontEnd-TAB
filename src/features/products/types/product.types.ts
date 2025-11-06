/**
 * Product Types
 * Types for product management
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
  status: "active" | "inactive";
  isFeatured: boolean;
  createdAt: string;
}

export type ProductStatus = "active" | "inactive";
