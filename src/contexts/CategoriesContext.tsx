import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Subcategory {
  id: string;
  name: string;
  description: string;
  order: number;
  slug: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  order: number;
  slug: string;
  subcategories: Subcategory[];
  isExpanded?: boolean;
}

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
    description: 'Sets de construcción LEGO para todas las edades',
    order: 1,
    slug: 'lego',
    isExpanded: false,
    subcategories: [
      { id: 's1', name: 'Sets', description: 'Sets completos de LEGO', order: 1, slug: 'lego/sets' },
      { id: 's2', name: 'Polybag', description: 'Sets pequeños en bolsa', order: 2, slug: 'lego/polybag' },
      { id: 's3', name: 'Figuras', description: 'Minifiguras LEGO', order: 3, slug: 'lego/figuras' },
      { id: 's4', name: 'Piezas', description: 'Piezas sueltas', order: 4, slug: 'lego/piezas' },
    ],
  },
  {
    id: '2',
    name: 'Funkos',
    description: 'Figuras Funko Pop de tus personajes favoritos',
    order: 2,
    slug: 'funkos',
    isExpanded: false,
    subcategories: [],
  },
  {
    id: '3',
    name: 'Anime',
    description: 'Figuras y coleccionables de anime',
    order: 3,
    slug: 'anime',
    isExpanded: false,
    subcategories: [],
  },
  {
    id: '4',
    name: 'Coleccionables',
    description: 'Artículos premium para coleccionistas',
    order: 4,
    slug: 'coleccionables',
    isExpanded: false,
    subcategories: [],
  },
  {
    id: '5',
    name: 'Peluches',
    description: 'Peluches suaves y adorables',
    order: 5,
    slug: 'peluches',
    isExpanded: false,
    subcategories: [],
  },
  {
    id: '6',
    name: 'Starwars',
    description: 'Merchandising oficial de Star Wars',
    order: 6,
    slug: 'starwars',
    isExpanded: false,
    subcategories: [],
  },
  {
    id: '7',
    name: 'HarryPotter',
    description: 'Productos del mundo mágico de Harry Potter',
    order: 7,
    slug: 'harrypotter',
    isExpanded: false,
    subcategories: [],
  },
  {
    id: '8',
    name: 'Otros',
    description: 'Otros productos únicos y especiales',
    order: 8,
    slug: 'otros',
    isExpanded: false,
    subcategories: [],
  },
];

export const CategoriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>(() => {
    const stored = localStorage.getItem('categories');
    return stored ? JSON.parse(stored) : defaultCategories;
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
