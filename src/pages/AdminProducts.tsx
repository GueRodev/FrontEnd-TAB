/**
 * Admin Products Page
 * Manages product inventory with CRUD operations
 */

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/AdminSidebar';
import AdminHeader from '@/components/AdminHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useProductsAdmin } from '@/hooks/business';
import {
  ProductsListAdmin,
  ProductFormDialog,
  ProductFilters,
} from '@/components/features/products';
import { DeleteConfirmDialog } from '@/components/features/categories/DeleteConfirmDialog';

const AdminProducts = () => {
  const {
    // Products data
    categories,
    filteredProducts,
    filterSummary,

    // Filters
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    resetFilters,

    // Dialog states
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    deleteProductDialog,
    setDeleteProductDialog,

    // Form state
    selectedImage,
    setSelectedImage,
    formData,
    setFormData,
    availableSubcategories,

    // Handlers
    handleImageUpload,
    handleRemoveImage,
    handleEditProduct,
    handleSubmit,
    handleUpdateProduct,
    openDeleteProductDialog,
    confirmDeleteProduct,
    handleToggleFeatured,
    handleOpenAddDialog,
  } = useProductsAdmin();

  const filterCount = [searchQuery, selectedCategory].filter(Boolean).length;

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
                    {filterSummary.resultCount} de {filterSummary.totalCount} productos
                  </p>
                </div>
                <div className="flex justify-center sm:justify-start">
                  <Button 
                    className="bg-brand-orange hover:bg-brand-orange/90 text-white w-full max-w-xs sm:w-auto"
                    onClick={handleOpenAddDialog}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Producto
                  </Button>
                </div>
              </div>

              {/* Filters Component */}
              <Card className="mx-auto w-full">
                <CardContent className="p-4 md:p-6">
                  <ProductFilters
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    categories={categories}
                    onClearFilters={resetFilters}
                    filterCount={filterCount}
                  />
                </CardContent>
              </Card>

              {/* Products List */}
              <Card>
                <CardContent className="p-4 md:p-6">
                  <div className="mb-4">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900">
                      Productos ({filteredProducts.length})
                    </h3>
                  </div>
                  
                  <ProductsListAdmin
                    products={filteredProducts}
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
