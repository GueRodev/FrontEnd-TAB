/**
 * InStoreOrderForm Component
 * Form for creating in-store orders
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductSelector } from './ProductSelector';
import { ShoppingBag } from 'lucide-react';
import type { Product } from '@/types/product.types';
import type { Category } from '@/types/product.types';

interface InStoreOrderFormProps {
  selectedProduct: string;
  setSelectedProduct: (id: string) => void;
  quantity: number;
  setQuantity: (qty: number) => void;
  customerName: string;
  setCustomerName: (name: string) => void;
  customerPhone: string;
  setCustomerPhone: (phone: string) => void;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  categoryFilter: string;
  setCategoryFilter: (filter: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  openProductSearch: boolean;
  setOpenProductSearch: (open: boolean) => void;
  filteredProducts: Product[];
  selectedProductData: Product | undefined;
  categories: Category[];
  onSubmit: () => void;
}

export const InStoreOrderForm: React.FC<InStoreOrderFormProps> = ({
  selectedProduct,
  setSelectedProduct,
  quantity,
  setQuantity,
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  paymentMethod,
  setPaymentMethod,
  categoryFilter,
  setCategoryFilter,
  searchQuery,
  setSearchQuery,
  openProductSearch,
  setOpenProductSearch,
  filteredProducts,
  selectedProductData,
  categories,
  onSubmit,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Crear Pedido en Tienda
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Product Selection */}
        <div className="w-full">
          <ProductSelector
            selectedProduct={selectedProduct}
            onSelectProduct={setSelectedProduct}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            open={openProductSearch}
            onOpenChange={setOpenProductSearch}
            filteredProducts={filteredProducts}
            selectedProductData={selectedProductData}
            categories={categories}
          />
        </div>

        {/* Quantity */}
        <div className="space-y-2">
          <Label htmlFor="quantity">Cantidad</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            max={selectedProductData?.stock || 999}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            disabled={!selectedProduct}
          />
        </div>

        {/* Customer Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Nombre del Cliente</Label>
            <Input
              id="customerName"
              placeholder="Nombre completo"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerPhone">Teléfono</Label>
            <Input
              id="customerPhone"
              placeholder="1234-5678"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-2">
          <Label htmlFor="paymentMethod">Método de Pago</Label>
          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            <SelectTrigger id="paymentMethod">
              <SelectValue placeholder="Seleccionar método" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Efectivo</SelectItem>
              <SelectItem value="card">Tarjeta</SelectItem>
              <SelectItem value="transfer">Transferencia</SelectItem>
              <SelectItem value="sinpe">SINPE Móvil</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Total Preview */}
        {selectedProductData && quantity > 0 && (
          <div className="p-3 bg-primary/10 rounded-md">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total a pagar:</span>
              <span className="text-xl font-bold">
                ₡{(selectedProductData.price * quantity).toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          onClick={onSubmit}
          className="w-full"
          disabled={!selectedProduct || !customerName || !customerPhone || !paymentMethod}
        >
          Crear Pedido
        </Button>
      </CardContent>
    </Card>
  );
};
