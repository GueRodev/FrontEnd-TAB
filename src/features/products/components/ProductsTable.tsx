/**
 * Products Table Component
 * Desktop table view for products list
 */

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ProductRow } from './ProductRow';
import type { Product, Category } from '../types';

interface ProductsTableProps {
  products: Product[];
  categories: Category[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onToggleFeatured: (productId: string, isFeatured: boolean) => void;
}

export const ProductsTable = ({
  products,
  categories,
  onEdit,
  onDelete,
  onToggleFeatured
}: ProductsTableProps) => {
  return (
    <div className="hidden lg:block border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            <TableHead className="font-semibold text-gray-700">Imagen</TableHead>
            <TableHead className="font-semibold text-gray-700">Nombre</TableHead>
            <TableHead className="font-semibold text-gray-700">Categoría</TableHead>
            <TableHead className="font-semibold text-gray-700">Precio</TableHead>
            <TableHead className="font-semibold text-gray-700">Stock</TableHead>
            <TableHead className="font-semibold text-gray-700">Estado</TableHead>
            <TableHead className="font-semibold text-gray-700">Destacado</TableHead>
            <TableHead className="font-semibold text-gray-700 text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const category = categories.find(c => c.id === product.categoryId);
            return (
              <ProductRow
                key={product.id}
                product={product}
                category={category}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleFeatured={onToggleFeatured}
              />
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
