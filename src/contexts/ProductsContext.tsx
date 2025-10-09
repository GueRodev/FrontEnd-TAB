import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product } from '@/types/product.types';
import { localStorageAdapter } from '@/lib/storage';
import { STORAGE_KEYS } from '@/data/constants';

// Re-export types for backward compatibility
export type { Product, ProductStatus } from '@/types/product.types';

interface ProductsContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductsByCategory: (categoryId: string) => Product[];
  getProductsBySubcategory: (subcategoryId: string) => Product[];
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    return localStorageAdapter.getItem<Product[]>(STORAGE_KEYS.products) || [];
  });

  useEffect(() => {
    localStorageAdapter.setItem(STORAGE_KEYS.products, products);
  }, [products]);

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      isFeatured: productData.isFeatured || false,
      createdAt: new Date().toISOString(),
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === id ? { ...product, ...productData } : product
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const getProductsByCategory = (categoryId: string) => {
    return products.filter(product => 
      product.categoryId === categoryId && product.status === 'active'
    );
  };

  const getProductsBySubcategory = (subcategoryId: string) => {
    return products.filter(product => 
      product.subcategoryId === subcategoryId && product.status === 'active'
    );
  };

  return (
    <ProductsContext.Provider value={{
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      getProductsByCategory,
      getProductsBySubcategory,
    }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};
