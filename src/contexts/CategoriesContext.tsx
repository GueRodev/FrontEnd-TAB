/**
 * Categories Context
 * Manages product categories and subcategories
 * 
 * @next-migration: Categories can be fetched at build time in Next.js
 * - Use Server Components to fetch categories
 * - Cache categories globally (rarely change)
 * - Admin category management via Server Actions
 * 
 * Migration path:
 * 1. Fetch categories in root layout (app/layout.tsx)
 * 2. Pass as props to Header component
 * 3. Use React Server Components for static categories
 * 4. Add revalidation on category updates
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Category } from '@/types/product.types';
import { localStorageAdapter } from '@/lib/storage';
import { STORAGE_KEYS } from '@/data/constants';
import { DEFAULT_CATEGORIES } from '@/data/categories.data';

// Re-export types for backward compatibility
export type { Category, Subcategory } from '@/types/product.types';

interface CategoriesContextType {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  updateCategoryOrder: (categories: Category[]) => void;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export const CategoriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>(() => {
    const stored = localStorageAdapter.getItem<Category[]>(STORAGE_KEYS.categories);
    return stored || DEFAULT_CATEGORIES.map(cat => ({ ...cat, isExpanded: false }));
  });

  useEffect(() => {
    localStorageAdapter.setItem(STORAGE_KEYS.categories, categories);
  }, [categories]);

  const updateCategoryOrder = (newCategories: Category[]) => {
    const updatedCategories = newCategories.map((cat, index) => ({
      ...cat,
      order: index + 1,
    }));
    setCategories(updatedCategories);
  };

  return (
    <CategoriesContext.Provider value={{ categories, setCategories, updateCategoryOrder }}>
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
};
