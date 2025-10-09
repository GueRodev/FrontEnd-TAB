/**
 * Products List Admin Component
 * Wrapper for desktop and mobile views
 */

import { ProductsTable } from './ProductsTable';
import { ProductCardAdmin } from './ProductCardAdmin';
import type { Product, Category } from '@/types/product.types';

interface ProductsListAdminProps {
  products: Product[];
  categories: Category[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onToggleFeatured: (productId: string, isFeatured: boolean) => void;
}

export const ProductsListAdmin = ({
  products,
  categories,
  onEdit,
  onDelete,
  onToggleFeatured
}: ProductsListAdminProps) => {
  return (
    <>
      {/* Desktop Table View */}
      <ProductsTable
        products={products}
        categories={categories}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleFeatured={onToggleFeatured}
      />

      {/* Mobile/Tablet Card View */}
      <div className="lg:hidden space-y-3">
        {products.map((product) => {
          const category = categories.find(c => c.id === product.categoryId);
          return (
            <ProductCardAdmin
              key={product.id}
              product={product}
              category={category}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleFeatured={onToggleFeatured}
            />
          );
        })}
      </div>
    </>
  );
};
