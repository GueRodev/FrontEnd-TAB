/**
 * Products Admin Business Logic Hook
 * Manages all business logic for admin products page
 */

import { useState, useMemo } from 'react';
import { useProducts } from '@/contexts/ProductsContext';
import { useCategories } from '@/contexts/CategoriesContext';
import { useNotifications } from '@/contexts/NotificationsContext';
import { toast } from '@/hooks/use-toast';
import { productSchema, type ProductFormData } from '@/lib/validations/product.validation';
import type { Product } from '@/types/product.types';

interface UseProductsAdminReturn {
  // State
  products: Product[];
  searchQuery: string;
  isAddDialogOpen: boolean;
  isEditDialogOpen: boolean;
  selectedImage: string | null;
  selectedProduct: Product | null;
  formData: ProductFormData;
  availableSubcategories: any[];
  
  // Handlers
  setSearchQuery: (query: string) => void;
  setIsAddDialogOpen: (open: boolean) => void;
  setIsEditDialogOpen: (open: boolean) => void;
  setSelectedImage: (image: string | null) => void;
  setFormData: (data: ProductFormData) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: () => void;
  handleEditProduct: (product: Product) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleUpdateProduct: (e: React.FormEvent) => void;
  handleDeleteProduct: (productId: string) => void;
  handleToggleFeatured: (productId: string, isFeatured: boolean) => void;
}

export const useProductsAdmin = (): UseProductsAdminReturn => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { categories } = useCategories();
  const { addNotification } = useNotifications();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    marca: '',
    category: '',
    subcategory: '',
    price: '',
    stock: '',
    description: '',
    status: 'active'
  });

  // Get subcategories based on selected category
  const availableSubcategories = useMemo(() => {
    if (!formData.category) return [];
    const category = categories.find(cat => cat.id === formData.category);
    return category?.subcategories || [];
  }, [formData.category, categories]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      marca: product.marca || '',
      category: product.categoryId,
      subcategory: product.subcategoryId || '',
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description || '',
      status: product.status
    });
    setSelectedImage(product.image);
    setIsEditDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const validation = productSchema.safeParse(formData);
    if (!validation.success) {
      const firstError = validation.error.errors[0];
      toast({
        title: "Error de validación",
        description: firstError.message,
        variant: "destructive",
      });
      return;
    }

    if (!selectedImage) {
      toast({
        title: "Error",
        description: "Por favor selecciona una imagen",
        variant: "destructive",
      });
      return;
    }

    // Create product
    addProduct({
      name: formData.name,
      marca: formData.marca || undefined,
      categoryId: formData.category,
      subcategoryId: formData.subcategory || undefined,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock) || 0,
      description: formData.description || '',
      image: selectedImage,
      status: formData.status as 'active' | 'inactive',
      isFeatured: false,
    });
    
    // Add notification
    addNotification({
      type: 'product',
      title: 'Producto creado',
      message: `${formData.name} ha sido agregado al inventario`,
      time: 'Ahora',
    });

    toast({
      title: "Producto creado",
      description: `${formData.name} ha sido agregado exitosamente`,
    });

    // Reset form
    setIsAddDialogOpen(false);
    setFormData({
      name: '',
      marca: '',
      category: '',
      subcategory: '',
      price: '',
      stock: '',
      description: '',
      status: 'active'
    });
    setSelectedImage(null);
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct) return;

    // Validate
    const validation = productSchema.safeParse(formData);
    if (!validation.success) {
      const firstError = validation.error.errors[0];
      toast({
        title: "Error de validación",
        description: firstError.message,
        variant: "destructive",
      });
      return;
    }

    // Update product
    updateProduct(selectedProduct.id, {
      name: formData.name,
      marca: formData.marca || undefined,
      categoryId: formData.category,
      subcategoryId: formData.subcategory || undefined,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock) || 0,
      description: formData.description || '',
      image: selectedImage || selectedProduct.image,
      status: formData.status as 'active' | 'inactive',
    });
    
    // Add notification
    addNotification({
      type: 'product',
      title: 'Producto actualizado',
      message: `${formData.name} ha sido modificado`,
      time: 'Ahora',
    });

    toast({
      title: "Producto actualizado",
      description: `${formData.name} ha sido actualizado exitosamente`,
    });

    // Reset form
    setIsEditDialogOpen(false);
    setFormData({
      name: '',
      marca: '',
      category: '',
      subcategory: '',
      price: '',
      stock: '',
      description: '',
      status: 'active'
    });
    setSelectedImage(null);
    setSelectedProduct(null);
  };

  const handleDeleteProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      deleteProduct(productId);
      toast({
        title: "Producto eliminado",
        description: `${product.name} ha sido eliminado del inventario`,
      });
    }
  };

  const handleToggleFeatured = (productId: string, isFeatured: boolean) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      updateProduct(productId, { isFeatured });
      toast({
        title: isFeatured ? "Producto destacado" : "Producto no destacado",
        description: `${product.name} ${isFeatured ? 'aparecerá' : 'no aparecerá'} en productos destacados`,
      });
    }
  };

  return {
    products,
    searchQuery,
    isAddDialogOpen,
    isEditDialogOpen,
    selectedImage,
    selectedProduct,
    formData,
    availableSubcategories,
    setSearchQuery,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    setSelectedImage,
    setFormData,
    handleImageUpload,
    handleRemoveImage,
    handleEditProduct,
    handleSubmit,
    handleUpdateProduct,
    handleDeleteProduct,
    handleToggleFeatured,
  };
};
