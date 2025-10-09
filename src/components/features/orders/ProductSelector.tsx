/**
 * ProductSelector Component
 * Product search and selection with Command component
 */

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/product.types';
import type { Category } from '@/types/product.types';

interface ProductSelectorProps {
  selectedProduct: string;
  onSelectProduct: (id: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (filter: string) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filteredProducts: Product[];
  selectedProductData: Product | undefined;
  categories: Category[];
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({
  selectedProduct,
  onSelectProduct,
  categoryFilter,
  onCategoryFilterChange,
  searchQuery,
  onSearchQueryChange,
  open,
  onOpenChange,
  filteredProducts,
  selectedProductData,
  categories,
}) => {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Category Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Categoría</label>
          <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Todas las categorías" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Product Search */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Producto</label>
          <Popover open={open} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {selectedProduct
                  ? selectedProductData?.name
                  : "Buscar producto..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput
                  placeholder="Buscar producto..."
                  value={searchQuery}
                  onValueChange={onSearchQueryChange}
                />
                <CommandList>
                  <CommandEmpty>No se encontraron productos.</CommandEmpty>
                  <CommandGroup>
                    {filteredProducts.map((product) => (
                      <CommandItem
                        key={product.id}
                        value={product.id}
                        onSelect={() => {
                          onSelectProduct(product.id);
                          onOpenChange(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedProduct === product.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex items-center gap-2 flex-1">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-8 h-8 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate">{product.name}</p>
                            <p className="text-xs text-muted-foreground">
                              ₡{product.price.toLocaleString()} • Stock: {product.stock}
                            </p>
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Selected Product Preview */}
      {selectedProductData && (
        <div className="p-3 bg-muted/50 rounded-md flex items-center gap-3">
          <img
            src={selectedProductData.image}
            alt={selectedProductData.name}
            className="w-16 h-16 object-cover rounded"
          />
          <div className="flex-1">
            <p className="font-medium">{selectedProductData.name}</p>
            <p className="text-sm text-muted-foreground">
              Precio: ₡{selectedProductData.price.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              Stock disponible: {selectedProductData.stock} unidades
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
