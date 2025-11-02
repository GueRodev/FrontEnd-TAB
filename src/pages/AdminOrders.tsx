/**
 * AdminOrders Page
 * Orchestrates orders management using business logic hook and UI components
 */

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AdminSidebar, AdminHeader } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useOrdersAdmin } from '@/hooks/business';
import { useCategories } from '@/features/categories';
import { OrdersList, InStoreOrderForm, PaymentConfirmationDialog } from '@/components/features/orders';
import { DeleteConfirmDialog } from '@/components/shared';
import { ShoppingCart, Store, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminOrders = () => {
  const navigate = useNavigate();
  const { categories } = useCategories();
  
  const {
    onlineOrders,
    inStoreOrders,
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
    deleteOrderDialog,
    paymentConfirmDialog,
    setDeleteOrderDialog,
    setPaymentConfirmDialog,
    handleCreateInStoreOrder,
    openDeleteOrderDialog,
    confirmDeleteOrder,
    handleArchiveOrder,
    handleCompleteOrder,
    handleCancelOrder,
    openPaymentConfirmDialog,
    confirmCompleteOrder,
  } = useOrdersAdmin();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <SidebarInset className="flex-1">
          <AdminHeader title="Gestión de Pedidos" />

          <main className="p-3 md:p-4 lg:p-6 space-y-6 md:space-y-8 max-w-full overflow-x-hidden">
            {/* History Button */}
            <div className="flex justify-end">
              <Button
                onClick={() => navigate('/admin/orders/history')}
                variant="outline"
                className="gap-2"
              >
                <History className="h-4 w-4" />
                Ver Historial de Pedidos
              </Button>
            </div>

            {/* Section 1: Online Orders */}
            <div className="space-y-3 md:space-y-4">
              <div className="px-1">
                <div className="flex items-center gap-2 mb-1.5 md:mb-2">
                  <ShoppingCart className="h-5 w-5 md:h-6 md:w-6 text-primary flex-shrink-0" />
                  <h2 className="text-base md:text-lg lg:text-xl font-bold">
                    Pedidos desde el Carrito
                  </h2>
                </div>
                <p className="text-xs md:text-sm lg:text-base text-muted-foreground">
                  Gestiona los pedidos realizados desde la tienda online
                </p>
              </div>
              
              <Card>
                <CardContent className="p-3 md:p-4 lg:p-6">
                  <OrdersList
                    orders={onlineOrders}
                    showDeliveryInfo={true}
                    emptyMessage="No hay pedidos online aún"
                    emptyIcon={<ShoppingCart className="h-10 w-10 md:h-12 md:w-12 opacity-30" />}
                    onArchive={handleArchiveOrder}
                    onDelete={openDeleteOrderDialog}
                    onComplete={handleCompleteOrder}
                    onCancel={handleCancelOrder}
                    onCompleteWithConfirmation={openPaymentConfirmDialog}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Section 2: In-Store Orders */}
            <div className="space-y-3 md:space-y-4">
              <div className="px-1">
                <div className="flex items-center gap-2 mb-1.5 md:mb-2">
                  <Store className="h-5 w-5 md:h-6 md:w-6 text-primary flex-shrink-0" />
                  <h2 className="text-base md:text-lg lg:text-xl font-bold">
                    Pedidos en Tienda Física
                  </h2>
                </div>
                <p className="text-xs md:text-sm lg:text-base text-muted-foreground">
                  Registra y gestiona ventas presenciales
                </p>
              </div>

              <div className="grid gap-4 md:gap-6 lg:grid-cols-2 xl:grid-cols-3">
                {/* In-Store Order Form */}
                <div className="lg:col-span-1">
                  <InStoreOrderForm
                    selectedProduct={selectedProduct}
                    setSelectedProduct={setSelectedProduct}
                    quantity={quantity}
                    setQuantity={setQuantity}
                    customerName={customerName}
                    setCustomerName={setCustomerName}
                    customerPhone={customerPhone}
                    setCustomerPhone={setCustomerPhone}
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    categoryFilter={categoryFilter}
                    setCategoryFilter={setCategoryFilter}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    openProductSearch={openProductSearch}
                    setOpenProductSearch={setOpenProductSearch}
                    filteredProducts={filteredProducts}
                    selectedProductData={selectedProductData}
                    categories={categories}
                    onSubmit={handleCreateInStoreOrder}
                  />
                </div>

                {/* In-Store Orders List */}
                <div className="lg:col-span-1 xl:col-span-2">
                  {inStoreOrders.length === 0 ? (
                    <Card>
                      <CardContent className="py-8 md:py-12 text-center text-muted-foreground">
                        <Store className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-2 opacity-30" />
                        <p className="text-sm md:text-base">No hay pedidos en tienda aún</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <OrdersList
                      orders={inStoreOrders}
                      showDeliveryInfo={false}
                      gridColumns="grid-cols-1 lg:grid-cols-2"
                      onArchive={handleArchiveOrder}
                      onDelete={openDeleteOrderDialog}
                      onComplete={handleCompleteOrder}
                      onCancel={handleCancelOrder}
                    />
                  )}
                </div>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>

      {/* Delete Order Confirmation */}
      <DeleteConfirmDialog
        open={deleteOrderDialog.open}
        onOpenChange={(open) =>
          setDeleteOrderDialog({ ...deleteOrderDialog, open })
        }
        itemName={deleteOrderDialog.order?.id || ''}
        itemType="order"
        onConfirm={confirmDeleteOrder}
      />

      {/* Payment Confirmation Dialog */}
      <PaymentConfirmationDialog
        open={paymentConfirmDialog.open}
        onOpenChange={(open) =>
          setPaymentConfirmDialog({ ...paymentConfirmDialog, open })
        }
        onConfirm={confirmCompleteOrder}
        customerName={paymentConfirmDialog.order?.customerInfo?.name}
        orderTotal={paymentConfirmDialog.order?.total}
      />
    </SidebarProvider>
  );
};

export default AdminOrders;
