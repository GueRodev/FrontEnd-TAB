/**
 * Products Service
 * API service for product operations
 * 🔄 LARAVEL READY: Toggle with VITE_USE_API=true
 */

import type { Product, CreateProductDto, UpdateProductDto, ProductFilters } from '../types/product.types';
import type { AdjustStockDto } from '../types/stock-movement.types';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/api/types';
import { localStorageAdapter } from '@/lib/storage';
import { APP_CONFIG, STORAGE_KEYS } from '@/config/app.config';
import { apiClient } from '@/api/client';
import {
  transformLaravelProduct,
  transformLaravelProducts,
  transformLaravelPaginatedProducts,
  transformToLaravelProductPayload,
} from '../utils/transformers';

/**
 * Products Service
 * Handles all product-related API operations
 */
export const productsService = {
  /**
   * Get all products with filters
   * 🔗 LARAVEL: GET /api/v1/products (paginated)
   */
  async getAll(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    if (APP_CONFIG.useAPI) {
      // Laravel returns paginated response
      const response = await apiClient.get('/products', filters);
      return transformLaravelPaginatedProducts(response);
    } else {
      // localStorage fallback
      let products = localStorageAdapter.getItem<Product[]>(STORAGE_KEYS.products) || [];
      
      // Apply filters manually
      if (filters?.category_id) {
        products = products.filter(p => p.category_id === filters.category_id);
      }
      if (filters?.brand) {
        products = products.filter(p => p.brand?.toLowerCase().includes(filters.brand!.toLowerCase()));
      }
      if (filters?.status) {
        products = products.filter(p => p.status === filters.status);
      }
      if (filters?.featured !== undefined) {
        products = products.filter(p => p.is_featured === filters.featured);
      }
      if (filters?.search) {
        const query = filters.search.toLowerCase();
        products = products.filter(p => 
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.brand?.toLowerCase().includes(query)
        );
      }
      if (filters?.in_stock) {
        products = products.filter(p => p.stock > 0);
      }
      if (filters?.min_price !== undefined) {
        products = products.filter(p => p.price >= filters.min_price!);
      }
      if (filters?.max_price !== undefined) {
        products = products.filter(p => p.price <= filters.max_price!);
      }
      
      // Sorting
      if (filters?.sort) {
        const order = filters.order === 'desc' ? -1 : 1;
        products.sort((a, b) => {
          const aVal = a[filters.sort as keyof Product];
          const bVal = b[filters.sort as keyof Product];
          return aVal > bVal ? order : aVal < bVal ? -order : 0;
        });
      }
      
      // Pagination
      const page = filters?.page || 1;
      const perPage = filters?.per_page || 10;
      const start = (page - 1) * perPage;
      const end = start + perPage;
      const paginatedData = products.slice(start, end);
      
      return {
        data: paginatedData,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(products.length / perPage),
          totalItems: products.length,
          itemsPerPage: perPage,
          hasNextPage: end < products.length,
          hasPreviousPage: page > 1,
        },
        timestamp: new Date().toISOString(),
      };
    }
  },

  /**
   * Get paginated products (backward compatibility)
   */
  async getPaginated(params: PaginationParams): Promise<PaginatedResponse<Product>> {
    return this.getAll({
      page: params.page,
      per_page: params.limit,
      sort: params.sortBy as any,
      order: params.sortOrder,
    });
  },

  /**
   * Get featured products
   * 🔗 LARAVEL: GET /api/v1/products/featured
   */
  async getFeatured(): Promise<Product[]> {
    if (APP_CONFIG.useAPI) {
      // Laravel returns direct array
      const response = await apiClient.get<any[]>('/products/featured');
      return transformLaravelProducts(response);
    } else {
      // localStorage
      const result = await this.getAll({ featured: true, status: 'active' });
      return result.data;
    }
  },

  /**
   * Get product by ID with relations
   * 🔗 LARAVEL: GET /api/v1/products/{id}
   */
  async getById(id: string): Promise<Product | null> {
    if (APP_CONFIG.useAPI) {
      // Laravel returns direct object with category and stock_movements
      const response = await apiClient.get(`/products/${id}`);
      return transformLaravelProduct(response);
    } else {
      // localStorage
      const result = await this.getAll();
      return result.data.find(p => p.id === id) || null;
    }
  },

  /**
   * Get products by category
   */
  async getByCategory(categoryId: string): Promise<Product[]> {
    const result = await this.getAll({ category_id: categoryId, status: 'active' });
    return result.data;
  },

  /**
   * Get products by subcategory (deprecated - subcategories are now categories)
   * @deprecated Use getByCategory instead
   */
  async getBySubcategory(subcategoryId: string): Promise<Product[]> {
    return this.getByCategory(subcategoryId);
  },

  /**
   * Search products
   */
  async search(query: string): Promise<Product[]> {
    const result = await this.getAll({ search: query });
    return result.data;
  },

  /**
   * Create product
   * 🔗 LARAVEL: POST /api/v1/products
   * Response: { message, product }
   */
  async create(data: CreateProductDto): Promise<ApiResponse<Product>> {
    if (APP_CONFIG.useAPI) {
      // Laravel expects FormData for image upload
      const formData = new FormData();
      const payload = transformToLaravelProductPayload(data);
      
      // Append all fields
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });
      
      // Append image if present
      if (data.image) {
        formData.append('image', data.image);
      }
      
      const response = await apiClient.post<any>('/products', formData);
      
      return {
        data: transformLaravelProduct(response.product),
        message: response.message,
        timestamp: new Date().toISOString(),
      };
    } else {
      // localStorage fallback
      const result = await this.getAll();
      const products = result.data;
      
      const newProduct: Product = {
        id: `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        category_id: data.category_id,
        name: data.name,
        slug: data.name.toLowerCase().replace(/\s+/g, '-'),
        brand: data.brand || null,
        description: data.description || null,
        sku: data.sku || null,
        price: data.price,
        stock: data.stock,
        image_url: data.image ? URL.createObjectURL(data.image) : null,
        status: data.status,
        is_featured: data.is_featured || false,
        deleted_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      localStorageAdapter.setItem(STORAGE_KEYS.products, [...products, newProduct]);
      
      return {
        data: newProduct,
        message: 'Product created successfully',
        timestamp: new Date().toISOString(),
      };
    }
  },

  /**
   * Update product
   * 🔗 LARAVEL: PUT /api/v1/products/{id}
   * Response: { message, product }
   */
  async update(id: string, data: UpdateProductDto): Promise<ApiResponse<Product>> {
    if (APP_CONFIG.useAPI) {
      const formData = new FormData();
      const payload = transformToLaravelProductPayload(data);
      
      // Append all fields
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });
      
      // Append image if present
      if (data.image) {
        formData.append('image', data.image);
      }
      
      // Laravel requires _method=PUT with FormData
      formData.append('_method', 'PUT');
      
      const response = await apiClient.post<any>(`/products/${id}`, formData);
      
      return {
        data: transformLaravelProduct(response.product),
        message: response.message,
        timestamp: new Date().toISOString(),
      };
    } else {
      // localStorage fallback
      const result = await this.getAll();
      const products = result.data;
      
      const updatedProducts = products.map(p => {
        if (p.id === id) {
          return {
            ...p,
            ...data,
            updated_at: new Date().toISOString(),
            image_url: data.image ? URL.createObjectURL(data.image) : p.image_url,
          };
        }
        return p;
      });
      
      localStorageAdapter.setItem(STORAGE_KEYS.products, updatedProducts);
      
      const updatedProduct = updatedProducts.find(p => p.id === id)!;
      
      return {
        data: updatedProduct,
        message: 'Product updated successfully',
        timestamp: new Date().toISOString(),
      };
    }
  },

  /**
   * Soft delete product
   * 🔗 LARAVEL: DELETE /api/v1/products/{id}
   * Response: { message }
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    if (APP_CONFIG.useAPI) {
      const response = await apiClient.delete<any>(`/products/${id}`);
      return {
        data: undefined as void,
        message: response.message,
        timestamp: new Date().toISOString(),
      };
    } else {
      // localStorage fallback - soft delete
      const result = await this.getAll();
      const products = result.data;
      
      const updatedProducts = products.map(p => 
        p.id === id ? { ...p, deleted_at: new Date().toISOString() } : p
      );
      
      localStorageAdapter.setItem(STORAGE_KEYS.products, updatedProducts);
      
      return {
        data: undefined as void,
        message: 'Product deleted successfully',
        timestamp: new Date().toISOString(),
      };
    }
  },

  /**
   * Force delete product (permanent)
   * 🔗 LARAVEL: DELETE /api/v1/products/{id}/force
   * ⚠️ NEW ENDPOINT
   */
  async forceDelete(id: string): Promise<ApiResponse<void>> {
    if (APP_CONFIG.useAPI) {
      const response = await apiClient.delete<any>(`/products/${id}/force`);
      return {
        data: undefined as void,
        message: response.message,
        timestamp: new Date().toISOString(),
      };
    } else {
      // localStorage - permanent delete
      const result = await this.getAll();
      const products = result.data;
      const filteredProducts = products.filter(p => p.id !== id);
      
      localStorageAdapter.setItem(STORAGE_KEYS.products, filteredProducts);
      
      return {
        data: undefined as void,
        message: 'Product permanently deleted',
        timestamp: new Date().toISOString(),
      };
    }
  },

  /**
   * Restore deleted product
   * 🔗 LARAVEL: POST /api/v1/products/{id}/restore
   * Response: { message, product }
   * ⚠️ NEW ENDPOINT
   */
  async restore(id: string): Promise<ApiResponse<Product>> {
    if (APP_CONFIG.useAPI) {
      const response = await apiClient.post<any>(`/products/${id}/restore`);
      return {
        data: transformLaravelProduct(response.product),
        message: response.message,
        timestamp: new Date().toISOString(),
      };
    } else {
      // localStorage fallback
      const result = await this.getAll();
      const products = result.data;
      
      const updatedProducts = products.map(p => 
        p.id === id ? { ...p, deleted_at: null } : p
      );
      
      localStorageAdapter.setItem(STORAGE_KEYS.products, updatedProducts);
      
      const restoredProduct = updatedProducts.find(p => p.id === id)!;
      
      return {
        data: restoredProduct,
        message: 'Product restored successfully',
        timestamp: new Date().toISOString(),
      };
    }
  },

  /**
   * Adjust product stock
   * 🔗 LARAVEL: POST /api/v1/products/{id}/stock
   * Response: { message, product }
   * ⚠️ NEW ENDPOINT
   */
  async adjustStock(id: string, data: AdjustStockDto): Promise<ApiResponse<Product>> {
    if (APP_CONFIG.useAPI) {
      const response = await apiClient.post<any>(`/products/${id}/stock`, data);
      return {
        data: transformLaravelProduct(response.product),
        message: response.message,
        timestamp: new Date().toISOString(),
      };
    } else {
      // localStorage fallback
      const result = await this.getAll();
      const products = result.data;
      
      const updatedProducts = products.map(p => {
        if (p.id === id) {
          let newStock = p.stock;
          if (data.type === 'entrada') {
            newStock += data.quantity;
          } else if (data.type === 'salida') {
            newStock -= data.quantity;
          } else if (data.type === 'ajuste') {
            newStock = data.quantity;
          }
          
          return {
            ...p,
            stock: Math.max(0, newStock),
            updated_at: new Date().toISOString(),
          };
        }
        return p;
      });
      
      localStorageAdapter.setItem(STORAGE_KEYS.products, updatedProducts);
      
      const updatedProduct = updatedProducts.find(p => p.id === id)!;
      
      return {
        data: updatedProduct,
        message: 'Stock adjusted successfully',
        timestamp: new Date().toISOString(),
      };
    }
  },
};
