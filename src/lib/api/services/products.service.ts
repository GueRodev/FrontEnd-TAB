/**
 * Products Service
 * API service for product operations
 * 
 * @next-migration: Replace localStorage with actual API calls
 * Current: Reads from localStorage adapter
 * Future: Fetches from Supabase/REST API
 */

import type { Product } from '@/types/product.types';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '../types';
import { localStorageAdapter } from '@/lib/storage';
import { STORAGE_KEYS } from '@/data/constants';

/**
 * Products Service
 * 
 * @next-migration: Implementation will change to API calls
 * Interface will remain the same, ensuring no breaking changes in components
 */
export const productsService = {
  /**
   * Get all products
   * @next-migration: Replace with API call
   * Example: return apiClient.get<Product[]>('/products');
   */
  async getAll(): Promise<Product[]> {
    // Current: Read from localStorage
    return localStorageAdapter.getItem<Product[]>(STORAGE_KEYS.products) || [];
  },

  /**
   * Get paginated products
   * @next-migration: Add actual pagination from backend
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
   * @next-migration: return apiClient.get<Product>(`/products/${id}`);
   */
  async getById(id: string): Promise<Product | null> {
    const products = await this.getAll();
    return products.find(p => p.id === id) || null;
  },

  /**
   * Get products by category
   * @next-migration: return apiClient.get<Product[]>(`/products/category/${categoryId}`);
   */
  async getByCategory(categoryId: string): Promise<Product[]> {
    const products = await this.getAll();
    return products.filter(p => p.categoryId === categoryId && p.status === 'active');
  },

  /**
   * Get products by subcategory
   * @next-migration: return apiClient.get<Product[]>(`/products/subcategory/${subcategoryId}`);
   */
  async getBySubcategory(subcategoryId: string): Promise<Product[]> {
    const products = await this.getAll();
    return products.filter(p => p.subcategoryId === subcategoryId && p.status === 'active');
  },

  /**
   * Get featured products
   * @next-migration: return apiClient.get<Product[]>('/products/featured');
   */
  async getFeatured(): Promise<Product[]> {
    const products = await this.getAll();
    return products.filter(p => p.isFeatured && p.status === 'active');
  },

  /**
   * Search products
   * @next-migration: return apiClient.get<Product[]>(`/products/search?q=${query}`);
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
   * @next-migration: return apiClient.post<Product>('/products', data);
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
   * @next-migration: return apiClient.put<Product>(`/products/${id}`, data);
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
   * @next-migration: return apiClient.delete(`/products/${id}`);
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
