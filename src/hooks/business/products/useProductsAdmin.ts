/**
 * Products Admin Business Logic Hook
 * Manages all business logic for admin products page
 */

import { useState } from 'react';
import { useProducts } from '@/contexts/ProductsContext';
import { useCategories } from '@/features/categories';
import { useNotifications } from '@/contexts/NotificationsContext';
import { toast } from '@/hooks/use-toast';
import { productSchema, type ProductFormData } from '@/lib/validations/product.validation';
import { useProductFilters } from './useProductFilters';
import { useApi } from '@/hooks/useApi';
import type { Product } from '@/types/product.types';

interface DeleteProductDialog {
  open: boolean;
  productId: string;
  productName: string;
}

interface UseProductsAdminReturn {
  // Products data
  products: Product[];
  categories: ReturnType<typeof useCategories>['categories'];
  
  // Filters (delegated to useProductFilters)
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (categoryId: string) => void;
  filteredProducts: Product[];
  resetFilters: () => void;
  filterSummary: {
    hasActiveFilters: boolean;
    resultCount: number;
    totalCount: number;
  };

  // Dialog states
  isAddDialogOpen: boolean;
  isEditDialogOpen: boolean;
  deleteProductDialog: DeleteProductDialog;
  
  // Form state
  selectedImage: string | null;
  selectedProduct: Product | null;
  formData: ProductFormData;
  availableSubcategories: any[];
  
  // Handlers
  setIsAddDialogOpen: (open: boolean) => void;
  setIsEditDialogOpen: (open: boolean) => void;
  setSelectedImage: (image: string | null) => void;
  setFormData: (data: ProductFormData) => void;
  setDeleteProductDialog: (dialog: DeleteProductDialog) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: () => void;
  handleEditProduct: (product: Product) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleUpdateProduct: (e: React.FormEvent) => void;
  openDeleteProductDialog: (productId: string) => void;
  confirmDeleteProduct: () => void;
  handleToggleFeatured: (productId: string, isFeatured: boolean) => void;
  handleOpenAddDialog: () => void;
}

export const useProductsAdmin = (): UseProductsAdminReturn => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { categories } = useCategories();
  const { addNotification } = useNotifications();
  const { execute } = useApi();

  // Product filtering logic (delegated to useProductFilters)
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredProducts,
    resetFilters,
    getFilterSummary,
  } = useProductFilters({ 
    products, 
    includeInactive: true // Admin sees all products
  });

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState<DeleteProductDialog>({
    open: false,
    productId: '',
    productName: '',
  });

  // Form state
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

  // Derived state - subcategories for form
  const availableSubcategories = categories.find(
    c => c.id === formData.category
  )?.subcategories || [];

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

  const handleSubmit = async (e: React.FormEvent) => {
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

    await execute(
      async () => {
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
        
        return formData.name;
      },
      {
        successMessage: `${formData.name} ha sido agregado exitosamente`,
        onSuccess: (productName) => {
          addNotification({
            type: 'product',
            title: 'Producto creado',
            message: `${productName} ha sido agregado al inventario`,
            time: 'Ahora',
          });

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
        }
      }
    );
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
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

    await execute(
      async () => {
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
        
        return formData.name;
      },
      {
        successMessage: `${formData.name} ha sido actualizado exitosamente`,
        onSuccess: (productName) => {
          addNotification({
            type: 'product',
            title: 'Producto actualizado',
            message: `${productName} ha sido modificado`,
            time: 'Ahora',
          });

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
        }
      }
    );
  };

  const openDeleteProductDialog = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setDeleteProductDialog({
        open: true,
        productId: product.id,
        productName: product.name,
      });
    }
  };

  const confirmDeleteProduct = () => {
    const { productId, productName } = deleteProductDialog;
    
    deleteProduct(productId);
    
    toast({
      title: "Producto eliminado",
      description: `${productName} ha sido eliminado del inventario`,
    });

    setDeleteProductDialog({
      open: false,
      productId: '',
      productName: '',
    });
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

  const handleOpenAddDialog = () => {
    setIsAddDialogOpen(true);
  };

  return {
    // Products data
    products,
    categories,
    
    // Filters (delegated to useProductFilters)
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredProducts,
    resetFilters,
    filterSummary: getFilterSummary(),

    // Dialog states
    isAddDialogOpen,
    isEditDialogOpen,
    deleteProductDialog,
    
    // Form state
    selectedImage,
    selectedProduct,
    formData,
    availableSubcategories,
    
    // Handlers
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    setSelectedImage,
    setFormData,
    setDeleteProductDialog,
    handleImageUpload,
    handleRemoveImage,
    handleEditProduct,
    handleSubmit,
    handleUpdateProduct,
    openDeleteProductDialog,
    confirmDeleteProduct,
    handleToggleFeatured,
    handleOpenAddDialog,
  };
};
