/**
 * Product Row Component
 * Individual table row for desktop view
 */

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { TableRow, TableCell } from '@/components/ui/table';
import { Pencil, Trash2 } from 'lucide-react';
import type { Product } from '../types';
import type { Category } from '@/features/categories';

interface ProductRowProps {
  product: Product;
  category: Category | undefined;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onToggleFeatured: (productId: string, isFeatured: boolean) => void;
}

export const ProductRow = ({
  product,
  category,
  onEdit,
  onDelete,
  onToggleFeatured
}: ProductRowProps) => {
  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell>
        <img 
          src={product.image} 
          alt={product.name}
          className="w-16 h-16 object-cover rounded-lg"
        />
      </TableCell>
      <TableCell className="font-medium text-gray-900">
        {product.name}
      </TableCell>
      <TableCell className="text-gray-600">
        {category?.name || 'Sin categoría'}
      </TableCell>
      <TableCell className="text-gray-900 font-medium">
        ₡{product.price.toFixed(2)}
      </TableCell>
      <TableCell>
        <span className={`font-medium ${
          product.stock === 0 
            ? 'text-red-600' 
            : product.stock < 10 
            ? 'text-orange-600' 
            : 'text-green-600'
        }`}>
          {product.stock}
        </span>
      </TableCell>
      <TableCell>
        <Badge 
          variant={product.status === 'active' ? 'default' : 'secondary'}
          className={
            product.status === 'active' 
              ? 'bg-green-100 text-green-800 hover:bg-green-100' 
              : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
          }
        >
          {product.status === 'active' ? 'Activo' : 'Inactivo'}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-center">
          <Switch
            checked={product.isFeatured}
            onCheckedChange={(checked) => onToggleFeatured(product.id, checked)}
          />
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-600 hover:text-[#F97316] hover:bg-[#F97316]/10"
            onClick={() => onEdit(product)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-600 hover:text-red-600 hover:bg-red-50"
            onClick={() => onDelete(product.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
