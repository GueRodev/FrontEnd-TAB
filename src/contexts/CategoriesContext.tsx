import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Category } from '@/types/product.types';

// Re-export types for backward compatibility
export type { Category, Subcategory } from '@/types/product.types';

interface CategoriesContextType {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  updateCategoryOrder: (categories: Category[]) => void;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

const defaultCategories: Category[] = [
  {
    id: '1',
    name: 'Lego',
    order: 1,
    slug: 'lego',
    isExpanded: false,
    subcategories: [],
  },
  {
    id: '2',
    name: 'Funkos',
    order: 2,
    slug: 'funkos',
    isExpanded: false,
    subcategories: [],
  },
  {
    id: '3',
    name: 'Anime',
    order: 3,
    slug: 'anime',
    isExpanded: false,
    subcategories: [],
  },
  {
    id: '4',
    name: 'Coleccionables',
    order: 4,
    slug: 'coleccionables',
    isExpanded: false,
    subcategories: [],
  },
  {
    id: '5',
    name: 'Peluches',
    order: 5,
    slug: 'peluches',
    isExpanded: false,
    subcategories: [],
  },
  {
    id: '6',
    name: 'Starwars',
    order: 6,
    slug: 'starwars',
    isExpanded: false,
    subcategories: [],
  },
  {
    id: '7',
    name: 'HarryPotter',
    order: 7,
    slug: 'harrypotter',
    isExpanded: false,
    subcategories: [],
  },
  {
    id: '8',
    name: 'Otros',
    order: 8,
    slug: 'otros',
    isExpanded: false,
    subcategories: [],
  },
];

export const CategoriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>(() => {
    const stored = localStorage.getItem('categories');
    const parsedCategories = stored ? JSON.parse(stored) : defaultCategories;
    
    // Limpiar subcategorías de Lego si existen (migración de datos)
    const cleanedCategories = parsedCategories.map((cat: Category) => {
      if (cat.slug === 'lego' && cat.subcategories.length > 0) {
        return { ...cat, subcategories: [] };
      }
      return cat;
    });
    
    return cleanedCategories;
  });

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
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
