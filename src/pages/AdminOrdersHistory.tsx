import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AdminSidebar, AdminHeader } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Archive, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EmptyState } from '@/components/common';
import { 
  useOrdersHistory, 
  OrdersTable, 
  ArchivedOrderCard,
  ExportButton
} from '@/features/orders';

const AdminOrdersHistory = () => {
  const navigate = useNavigate();
  const {
    archivedOrders,
    handleRestoreOrder,
    handleExportPDF,
    handleExportExcel,
  } = useOrdersHistory();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <SidebarInset className="flex-1">
          <AdminHeader title="Historial de Pedidos" />

          <main className="p-3 md:p-4 lg:p-6 space-y-4 md:space-y-6">
            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
              <Button
                onClick={() => navigate('/admin/orders')}
                variant="outline"
                className="gap-2 w-full sm:w-auto"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-xs md:text-sm">Volver a Pedidos</span>
              </Button>
              
              <ExportButton
                onExportPDF={handleExportPDF}
                onExportExcel={handleExportExcel}
                disabled={archivedOrders.length === 0}
              />
            </div>

            {/* Pedidos archivados */}
            <Card>
              <CardHeader className="p-4 md:p-6">
                <div className="flex items-center gap-2">
                  <Archive className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
                  <CardTitle className="text-base md:text-lg lg:text-xl">Pedidos Archivados</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0 md:p-6">
                {archivedOrders.length === 0 ? (
                  <EmptyState
                    icon={Archive}
                    title="No hay pedidos archivados aún"
                  />
                ) : (
                  <>
                    {/* Vista Desktop/Tablet: OrdersTable */}
                    <div className="hidden lg:block">
                      <OrdersTable
                        orders={archivedOrders.map(o => ({ ...o, archived: true }))}
                        showActions={false}
                        compact={false}
                      />
                    </div>

                    {/* Vista Mobile/Tablet: Cards */}
                    <div className="lg:hidden space-y-3 p-4">
                      {archivedOrders.map((order) => (
                        <ArchivedOrderCard
                          key={order.id}
                          order={order}
                          onRestore={handleRestoreOrder}
                        />
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminOrdersHistory;
