/**
 * Admin Products Page
 * Manages product inventory with CRUD operations
 */

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/AdminSidebar';
import AdminHeader from '@/components/AdminHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Plus, Filter } from 'lucide-react';
import { useProductsAdmin } from '@/hooks/business';
import { useCategories } from '@/contexts/CategoriesContext';
import { ProductsListAdmin, ProductFormDialog } from '@/components/features/products';
import { DeleteConfirmDialog } from '@/components/features/categories/DeleteConfirmDialog';

const AdminProducts = () => {
  const {
    products,
    searchQuery,
    setSearchQuery,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    selectedImage,
    setSelectedImage,
    formData,
    setFormData,
    availableSubcategories,
    deleteProductDialog,
    setDeleteProductDialog,
    handleImageUpload,
    handleRemoveImage,
    handleEditProduct,
    handleSubmit,
    handleUpdateProduct,
    openDeleteProductDialog,
    confirmDeleteProduct,
    handleToggleFeatured,
  } = useProductsAdmin();

  const { categories } = useCategories();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <SidebarInset className="flex-1">
          <AdminHeader title="Gestión de Productos" />

          {/* Main Content */}
          <div className="flex-1 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
              {/* Page Header */}
              <div className="flex flex-col gap-4">
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 md:mb-2">
                    Gestión de Productos
                  </h1>
                  <p className="text-gray-600 text-sm md:text-base lg:text-lg">
                    Administra tu inventario de juguetes y LEGO
                  </p>
                </div>
                <div className="flex justify-center sm:justify-start">
                  <Button 
                    className="bg-brand-orange hover:bg-brand-orange/90 text-white w-full max-w-xs sm:w-auto"
                    onClick={() => setIsAddDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Producto
                  </Button>
                </div>
              </div>

              {/* Search and Filters */}
              <Card className="mx-auto w-full">
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col gap-3">
                    <div className="relative w-full">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Buscar productos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-10 border-gray-300 w-full"
                      />
                    </div>
                    <Button variant="outline" className="h-10 px-4 border-gray-300 w-full">
                      <Filter className="h-4 w-4 mr-2" />
                      Filtros
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Products List */}
              <Card>
                <CardContent className="p-4 md:p-6">
                  <div className="mb-4">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900">
                      Productos ({products.length})
                    </h3>
                  </div>
                  
                  <ProductsListAdmin
                    products={products}
                    categories={categories}
                    onEdit={handleEditProduct}
                    onDelete={openDeleteProductDialog}
                    onToggleFeatured={handleToggleFeatured}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </SidebarInset>
      </div>

      {/* Add Product Dialog */}
      <ProductFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        mode="add"
        formData={formData}
        setFormData={setFormData}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        availableSubcategories={availableSubcategories}
        categories={categories}
        onSubmit={handleSubmit}
        onImageUpload={handleImageUpload}
        onRemoveImage={handleRemoveImage}
      />

      {/* Edit Product Dialog */}
      <ProductFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        mode="edit"
        formData={formData}
        setFormData={setFormData}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        availableSubcategories={availableSubcategories}
        categories={categories}
        onSubmit={handleUpdateProduct}
        onImageUpload={handleImageUpload}
        onRemoveImage={handleRemoveImage}
      />

      {/* Delete Product Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteProductDialog.open}
        onOpenChange={(open) => setDeleteProductDialog({ ...deleteProductDialog, open })}
        itemName={deleteProductDialog.productName}
        itemType="product"
        onConfirm={confirmDeleteProduct}
      />
    </SidebarProvider>
  );
};

export default AdminProducts;
