/**
 * Categories Context
 * Manages product categories and subcategories with Laravel API integration
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Category, Subcategory, CreateCategoryDto, UpdateCategoryDto, CreateSubcategoryDto, UpdateSubcategoryDto } from '@/types/product.types';
import { localStorageAdapter } from '@/lib/storage';
import { STORAGE_KEYS } from '@/data/constants';
import { DEFAULT_CATEGORIES } from '@/data/categories.data';
import { categoriesService } from '@/lib/api/services';

// Re-export types for backward compatibility
export type { Category, Subcategory } from '@/types/product.types';

interface CategoriesContextType {
  categories: Category[];
  loading: boolean;
  setCategories: (categories: Category[]) => void;
  syncWithAPI: () => Promise<void>;
  addCategory: (data: CreateCategoryDto) => Promise<Category>;
  updateCategory: (id: string, data: UpdateCategoryDto) => Promise<Category>;
  deleteCategory: (id: string) => Promise<void>;
  addSubcategory: (categoryId: string, data: CreateSubcategoryDto) => Promise<Subcategory>;
  updateSubcategory: (categoryId: string, subcategoryId: string, data: UpdateSubcategoryDto & { newCategoryId?: string }) => Promise<Subcategory>;
  deleteSubcategory: (categoryId: string, subcategoryId: string) => Promise<void>;
  reorderCategories: (categories: Category[]) => Promise<void>;
}

// Default context value to prevent undefined errors during initialization
const defaultContextValue: CategoriesContextType = {
  categories: [],
  loading: false,
  setCategories: () => {},
  syncWithAPI: async () => {},
  addCategory: async () => ({ id: '', name: '', slug: '', order: 0, subcategories: [] }),
  updateCategory: async () => ({ id: '', name: '', slug: '', order: 0, subcategories: [] }),
  deleteCategory: async () => {},
  addSubcategory: async () => ({ id: '', name: '', slug: '', order: 0 }),
  updateSubcategory: async () => ({ id: '', name: '', slug: '', order: 0 }),
  deleteSubcategory: async () => {},
  reorderCategories: async () => {},
};

const CategoriesContext = createContext<CategoriesContextType>(defaultContextValue);

export const CategoriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const stored = localStorageAdapter.getItem<Category[]>(STORAGE_KEYS.categories);
      return stored || DEFAULT_CATEGORIES.map(cat => ({ ...cat, isExpanded: false }));
    } catch (error) {
      console.error('Error loading categories from storage:', error);
      return DEFAULT_CATEGORIES.map(cat => ({ ...cat, isExpanded: false }));
    }
  });
  const [loading, setLoading] = useState(false);

  // Sync with localStorage whenever categories change
  useEffect(() => {
    localStorageAdapter.setItem(STORAGE_KEYS.categories, categories);
  }, [categories]);

  /**
   * Sync categories with Laravel API
   * 🔗 CONEXIÓN LARAVEL: Loads categories from backend
   */
  const syncWithAPI = async () => {
    setLoading(true);
    try {
      const response = await categoriesService.getAll();
      setCategories(response.data);
      localStorageAdapter.setItem(STORAGE_KEYS.categories, response.data);
    } catch (error) {
      console.error('Error syncing categories:', error);
      // Fallback to localStorage on error
      const stored = localStorageAdapter.getItem<Category[]>(STORAGE_KEYS.categories);
      if (stored) setCategories(stored);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add new category
   * 🔗 CONEXIÓN LARAVEL: POST /api/categories
   */
  const addCategory = async (data: CreateCategoryDto): Promise<Category> => {
    setLoading(true);
    try {
      const response = await categoriesService.create(data);
      const newCategory = response.data;
      setCategories([...categories, newCategory]);
      return newCategory;
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update existing category
   * 🔗 CONEXIÓN LARAVEL: PUT /api/categories/{id}
   */
  const updateCategory = async (id: string, data: UpdateCategoryDto): Promise<Category> => {
    setLoading(true);
    try {
      const response = await categoriesService.update(id, data);
      const updatedCategory = response.data;
      setCategories(categories.map(cat => cat.id === id ? updatedCategory : cat));
      return updatedCategory;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete category
   * 🔗 CONEXIÓN LARAVEL: DELETE /api/categories/{id}
   */
  const deleteCategory = async (id: string): Promise<void> => {
    setLoading(true);
    try {
      await categoriesService.delete(id);
      setCategories(categories.filter(cat => cat.id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add new subcategory
   * 🔗 CONEXIÓN LARAVEL: POST /api/subcategories
   */
  const addSubcategory = async (categoryId: string, data: CreateSubcategoryDto): Promise<Subcategory> => {
    setLoading(true);
    try {
      const response = await categoriesService.createSubcategory(categoryId, data);
      const newSubcategory = response.data;
      
      setCategories(categories.map(cat => 
        cat.id === categoryId 
          ? { ...cat, subcategories: [...cat.subcategories, newSubcategory] }
          : cat
      ));
      
      return newSubcategory;
    } catch (error) {
      console.error('Error adding subcategory:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update existing subcategory
   * 🔗 CONEXIÓN LARAVEL: PUT /api/subcategories/{id}
   */
  const updateSubcategory = async (
    categoryId: string, 
    subcategoryId: string, 
    data: UpdateSubcategoryDto & { newCategoryId?: string }
  ): Promise<Subcategory> => {
    setLoading(true);
    try {
      const response = await categoriesService.updateSubcategory(categoryId, subcategoryId, data);
      const updatedSubcategory = response.data;

      setCategories(categories.map(cat => {
        // Remove from old category if moved
        if (data.newCategoryId && cat.id === categoryId && data.newCategoryId !== categoryId) {
          return {
            ...cat,
            subcategories: cat.subcategories.filter(sub => sub.id !== subcategoryId),
          };
        }

        // Add to new category if moved
        if (data.newCategoryId && cat.id === data.newCategoryId) {
          return {
            ...cat,
            subcategories: [...cat.subcategories, updatedSubcategory],
          };
        }

        // Update in current category
        if (cat.id === categoryId) {
          return {
            ...cat,
            subcategories: cat.subcategories.map(sub => 
              sub.id === subcategoryId ? updatedSubcategory : sub
            ),
          };
        }

        return cat;
      }));

      return updatedSubcategory;
    } catch (error) {
      console.error('Error updating subcategory:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete subcategory
   * 🔗 CONEXIÓN LARAVEL: DELETE /api/subcategories/{id}
   */
  const deleteSubcategory = async (categoryId: string, subcategoryId: string): Promise<void> => {
    setLoading(true);
    try {
      await categoriesService.deleteSubcategory(categoryId, subcategoryId);
      
      setCategories(categories.map(cat => 
        cat.id === categoryId
          ? { ...cat, subcategories: cat.subcategories.filter(sub => sub.id !== subcategoryId) }
          : cat
      ));
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reorder categories (drag & drop)
   * 🔗 CONEXIÓN LARAVEL: POST /api/categories/reorder
   */
  const reorderCategories = async (newCategories: Category[]): Promise<void> => {
    setLoading(true);
    try {
      const categoryIds = newCategories.map(cat => cat.id);
      const response = await categoriesService.reorder({ order: categoryIds });
      setCategories(response.data);
    } catch (error) {
      console.error('Error reordering categories:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CategoriesContext.Provider value={{ 
      categories, 
      loading,
      setCategories,
      syncWithAPI,
      addCategory,
      updateCategory,
      deleteCategory,
      addSubcategory,
      updateSubcategory,
      deleteSubcategory,
      reorderCategories,
    }}>
      {children}
    </CategoriesContext.Provider>
  );
};

/**
 * Hook to access categories context
 * Must be used within CategoriesProvider
 */
export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (!context || context === defaultContextValue) {
    // If we're getting the default context, log a warning but don't crash
    console.warn('useCategories: Using default context. Make sure component is wrapped in CategoriesProvider');
  }
  return context;
};
