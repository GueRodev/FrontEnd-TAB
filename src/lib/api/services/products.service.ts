/**
 * Products Service
 * API service for product operations
 */

import type { Product } from '@/types/product.types';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '../types';
import { localStorageAdapter } from '@/lib/storage';
import { STORAGE_KEYS } from '@/data/constants';

/**
 * Products Service
 */
export const productsService = {
  /**
   * Get all products
   */
  async getAll(): Promise<Product[]> {
    // Current: Read from localStorage
    return localStorageAdapter.getItem<Product[]>(STORAGE_KEYS.products) || [];
  },

  /**
   * Get paginated products
   */
  async getPaginated(params: PaginationParams): Promise<PaginatedResponse<Product>> {
    const allProducts = await this.getAll();
    const start = (params.page - 1) * params.limit;
    const end = start + params.limit;
    const paginatedData = allProducts.slice(start, end);

    return {
      data: paginatedData,
      pagination: {
        currentPage: params.page,
        totalPages: Math.ceil(allProducts.length / params.limit),
        totalItems: allProducts.length,
        itemsPerPage: params.limit,
        hasNextPage: end < allProducts.length,
        hasPreviousPage: params.page > 1,
      },
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Get product by ID
   */
  async getById(id: string): Promise<Product | null> {
    const products = await this.getAll();
    return products.find(p => p.id === id) || null;
  },

  /**
   * Get products by category
   */
  async getByCategory(categoryId: string): Promise<Product[]> {
    const products = await this.getAll();
    return products.filter(p => p.categoryId === categoryId && p.status === 'active');
  },

  /**
   * Get products by subcategory
   */
  async getBySubcategory(subcategoryId: string): Promise<Product[]> {
    const products = await this.getAll();
    return products.filter(p => p.subcategoryId === subcategoryId && p.status === 'active');
  },

  /**
   * Get featured products
   */
  async getFeatured(): Promise<Product[]> {
    const products = await this.getAll();
    return products.filter(p => p.isFeatured && p.status === 'active');
  },

  /**
   * Search products
   */
  async search(query: string): Promise<Product[]> {
    const products = await this.getAll();
    const lowercaseQuery = query.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(lowercaseQuery) ||
      p.description?.toLowerCase().includes(lowercaseQuery) ||
      p.brand?.toLowerCase().includes(lowercaseQuery)
    );
  },

  /**
   * Create product
   */
  async create(data: Omit<Product, 'id' | 'createdAt'>): Promise<ApiResponse<Product>> {
    const products = await this.getAll();
    const newProduct: Product = {
      ...data,
      id: `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    
    localStorageAdapter.setItem(STORAGE_KEYS.products, [...products, newProduct]);
    
    return {
      data: newProduct,
      message: 'Product created successfully',
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Update product
   */
  async update(id: string, data: Partial<Product>): Promise<ApiResponse<Product>> {
    const products = await this.getAll();
    const updatedProducts = products.map(p => 
      p.id === id ? { ...p, ...data } : p
    );
    
    localStorageAdapter.setItem(STORAGE_KEYS.products, updatedProducts);
    
    const updatedProduct = updatedProducts.find(p => p.id === id)!;
    
    return {
      data: updatedProduct,
      message: 'Product updated successfully',
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Delete product
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    const products = await this.getAll();
    const filteredProducts = products.filter(p => p.id !== id);
    
    localStorageAdapter.setItem(STORAGE_KEYS.products, filteredProducts);
    
    return {
      data: undefined as void,
      message: 'Product deleted successfully',
      timestamp: new Date().toISOString(),
    };
  },
};
