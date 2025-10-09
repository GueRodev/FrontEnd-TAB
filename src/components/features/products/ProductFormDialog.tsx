/**
 * Product Form Dialog Component
 * Unified dialog for adding and editing products
 */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProductImageUpload } from './ProductImageUpload';
import type { ProductFormData } from '@/lib/validations/product.validation';
import type { Category, Subcategory } from '@/types/product.types';

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'add' | 'edit';
  formData: ProductFormData;
  setFormData: (data: ProductFormData) => void;
  selectedImage: string | null;
  setSelectedImage: (img: string | null) => void;
  availableSubcategories: Subcategory[];
  categories: Category[];
  onSubmit: (e: React.FormEvent) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
}

export const ProductFormDialog = ({
  open,
  onOpenChange,
  mode,
  formData,
  setFormData,
  selectedImage,
  availableSubcategories,
  categories,
  onSubmit,
  onImageUpload,
  onRemoveImage
}: ProductFormDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Agregar Nuevo Producto' : 'Editar Producto'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'add' 
              ? 'Completa los datos del nuevo producto' 
              : 'Modifica los datos del producto'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre del Producto *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: LEGO Star Wars UCS Millennium Falcon"
                required
              />
            </div>

            <div>
              <Label htmlFor="marca">Marca</Label>
              <Input
                id="marca"
                value={formData.marca}
                onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                placeholder="Ej: LEGO"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Categoría *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ 
                    ...formData, 
                    category: value,
                    subcategory: '' 
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="subcategory">Subcategoría</Label>
                <Select
                  value={formData.subcategory}
                  onValueChange={(value) => setFormData({ ...formData, subcategory: value })}
                  disabled={availableSubcategories.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar subcategoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSubcategories.map((subcat) => (
                      <SelectItem key={subcat.id} value={subcat.id}>
                        {subcat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Precio (₡) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <Label htmlFor="stock">Stock *</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción detallada del producto"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="status">Estado *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as 'active' | 'inactive' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="inactive">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <ProductImageUpload
              selectedImage={selectedImage}
              onImageUpload={onImageUpload}
              onRemoveImage={onRemoveImage}
              id={mode === 'add' ? 'add-image' : 'edit-image'}
            />
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-brand-orange hover:bg-brand-orange/90"
            >
              {mode === 'add' ? 'Agregar Producto' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
