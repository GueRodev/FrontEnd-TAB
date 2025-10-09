import { AdminSidebar } from '@/components/AdminSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AdminHeader from '@/components/AdminHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useOrders } from '@/contexts/OrdersContext';
import type { OrderStatus } from '@/types/order.types';
import { useNotifications } from '@/contexts/NotificationsContext';
import { toast } from '@/hooks/use-toast';
import { Archive, ArrowLeft, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import ExportButton from '@/components/ExportButton';

const AdminOrdersHistory = () => {
  const { getArchivedOrders, unarchiveOrder } = useOrders();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const archivedOrders = getArchivedOrders();

  const getStatusLabel = (status: OrderStatus) => {
    const labels = {
      pending: 'Pendiente',
      completed: 'Finalizado',
      cancelled: 'Cancelado',
    };
    return labels[status];
  };

  const getTypeLabel = (type: 'online' | 'in-store') => {
    return type === 'online' ? 'Online' : 'Tienda Física';
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(18);
    doc.text('Historial de Pedidos', 14, 22);
    
    // Preparar datos para la tabla
    const tableData = archivedOrders.map(order => [
      order.id,
      new Date(order.createdAt).toLocaleDateString('es-ES'),
      order.customerInfo.name,
      order.customerInfo.phone,
      getTypeLabel(order.type),
      getStatusLabel(order.status),
      `₡${order.total.toFixed(2)}`,
      order.paymentMethod || 'N/A',
    ]);

    // Crear tabla
    autoTable(doc, {
      head: [['ID', 'Fecha', 'Cliente', 'Teléfono', 'Tipo', 'Estado', 'Total', 'Pago']],
      body: tableData,
      startY: 30,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] },
    });

    doc.save('historial-pedidos.pdf');
    
    toast({
      title: "PDF generado",
      description: "El archivo PDF se ha descargado exitosamente",
    });
  };

  const handleRestoreOrder = (orderId: string) => {
    unarchiveOrder(orderId);
    addNotification({
      type: 'order',
      title: 'Pedido restaurado',
      message: `El pedido ${orderId} ha sido restaurado`,
      time: 'Ahora',
    });
    toast({
      title: "Pedido restaurado",
      description: "El pedido ha sido restaurado y está visible en la página de pedidos",
    });
  };

  const exportToExcel = () => {
    // Preparar datos
    const excelData = archivedOrders.map(order => ({
      'ID': order.id,
      'Fecha Creación': new Date(order.createdAt).toLocaleString('es-ES'),
      'Fecha Archivo': order.archivedAt ? new Date(order.archivedAt).toLocaleString('es-ES') : 'N/A',
      'Cliente': order.customerInfo.name,
      'Teléfono': order.customerInfo.phone,
      'Provincia': order.delivery_address?.province || 'N/A',
      'Cantón': order.delivery_address?.canton || 'N/A',
      'Distrito': order.delivery_address?.district || 'N/A',
      'Dirección': order.delivery_address?.address || 'N/A',
      'Tipo': getTypeLabel(order.type),
      'Estado': getStatusLabel(order.status),
      'Método Pago': order.paymentMethod || 'N/A',
      'Opción Entrega': order.deliveryOption === 'delivery' ? 'Envío' : 'Recoger',
      'Total': order.total,
      'Productos': order.items.map(item => `${item.name} (x${item.quantity})`).join(', '),
    }));

    // Crear libro y hoja
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Pedidos');

    // Ajustar ancho de columnas
    const columnWidths = [
      { wch: 15 }, // ID
      { wch: 18 }, // Fecha Creación
      { wch: 18 }, // Fecha Archivo
      { wch: 20 }, // Cliente
      { wch: 12 }, // Teléfono
      { wch: 12 }, // Provincia
      { wch: 12 }, // Cantón
      { wch: 12 }, // Distrito
      { wch: 30 }, // Dirección
      { wch: 12 }, // Tipo
      { wch: 12 }, // Estado
      { wch: 15 }, // Método Pago
      { wch: 12 }, // Opción Entrega
      { wch: 12 }, // Total
      { wch: 40 }, // Productos
    ];
    worksheet['!cols'] = columnWidths;

    // Guardar archivo
    XLSX.writeFile(workbook, 'historial-pedidos.xlsx');
    
    toast({
      title: "Excel generado",
      description: "El archivo Excel se ha descargado exitosamente",
    });
  };

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
                onExportPDF={exportToPDF}
                onExportExcel={exportToExcel}
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
                  <div className="py-12 text-center text-muted-foreground px-4">
                    <Archive className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm md:text-base">No hay pedidos archivados aún</p>
                  </div>
                ) : (
                  <>
                    {/* Vista Desktop/Tablet: Tabla */}
                    <div className="hidden lg:block overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="min-w-[120px] text-xs lg:text-sm">ID Pedido</TableHead>
                            <TableHead className="min-w-[100px] text-xs lg:text-sm">Fecha</TableHead>
                            <TableHead className="min-w-[150px] text-xs lg:text-sm">Cliente</TableHead>
                            <TableHead className="min-w-[120px] text-xs lg:text-sm">Teléfono</TableHead>
                            <TableHead className="min-w-[100px] text-xs lg:text-sm">Tipo</TableHead>
                            <TableHead className="min-w-[100px] text-xs lg:text-sm">Estado</TableHead>
                            <TableHead className="min-w-[120px] text-xs lg:text-sm">Total</TableHead>
                            <TableHead className="min-w-[120px] text-xs lg:text-sm">Método Pago</TableHead>
                            <TableHead className="min-w-[200px] text-xs lg:text-sm">Productos</TableHead>
                            <TableHead className="min-w-[100px] text-center text-xs lg:text-sm">Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {archivedOrders.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell className="font-medium text-xs lg:text-sm">{order.id}</TableCell>
                              <TableCell className="text-xs lg:text-sm">
                                {new Date(order.createdAt).toLocaleDateString('es-ES')}
                              </TableCell>
                              <TableCell className="text-xs lg:text-sm">{order.customerInfo.name}</TableCell>
                              <TableCell className="text-xs lg:text-sm">{order.customerInfo.phone}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-xs">
                                  {getTypeLabel(order.type)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    order.status === 'completed'
                                      ? 'default'
                                      : order.status === 'cancelled'
                                      ? 'destructive'
                                      : 'secondary'
                                  }
                                  className="text-xs"
                                >
                                  {getStatusLabel(order.status)}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-semibold text-xs lg:text-sm">
                                ₡{order.total.toFixed(2)}
                              </TableCell>
                              <TableCell className="text-xs lg:text-sm">{order.paymentMethod || 'N/A'}</TableCell>
                              <TableCell>
                                <div className="text-xs space-y-1">
                                  {order.items.map((item, idx) => (
                                    <div key={idx}>
                                      {item.name} (x{item.quantity})
                                    </div>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                {order.archived ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRestoreOrder(order.id)}
                                    className="gap-1 text-xs"
                                    title="Restaurar pedido"
                                  >
                                    <RotateCcw className="h-3 w-3 lg:h-4 lg:w-4" />
                                    <span className="hidden xl:inline">Restaurar</span>
                                  </Button>
                                ) : (
                                  <Badge variant="secondary" className="text-xs">
                                    Activo
                                  </Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Vista Mobile/Tablet: Cards */}
                    <div className="lg:hidden space-y-3 p-4">
                      {archivedOrders.map((order) => (
                        <Card key={order.id} className="overflow-hidden">
                          <CardContent className="p-4 space-y-3">
                            {/* Header del pedido */}
                            <div className="flex justify-between items-start gap-2">
                              <div className="space-y-1 flex-1 min-w-0">
                                <p className="text-xs text-muted-foreground">ID Pedido</p>
                                <p className="font-semibold text-sm truncate">{order.id}</p>
                              </div>
                              <Badge
                                variant={
                                  order.status === 'completed'
                                    ? 'default'
                                    : order.status === 'cancelled'
                                    ? 'destructive'
                                    : 'secondary'
                                }
                                className="text-xs flex-shrink-0"
                              >
                                {getStatusLabel(order.status)}
                              </Badge>
                            </div>

                            {/* Información del cliente */}
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Cliente</p>
                                <p className="text-sm font-medium truncate">{order.customerInfo.name}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Teléfono</p>
                                <p className="text-sm">{order.customerInfo.phone}</p>
                              </div>
                            </div>

                            {/* Fecha y tipo */}
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Fecha</p>
                                <p className="text-sm">
                                  {new Date(order.createdAt).toLocaleDateString('es-ES')}
                                </p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Tipo</p>
                                <Badge variant="outline" className="text-xs w-fit">
                                  {getTypeLabel(order.type)}
                                </Badge>
                              </div>
                            </div>

                            {/* Total y método de pago */}
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Total</p>
                                <p className="text-sm font-bold">₡{order.total.toFixed(2)}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Método de Pago</p>
                                <p className="text-sm">{order.paymentMethod || 'N/A'}</p>
                              </div>
                            </div>

                            {/* Productos */}
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground">Productos</p>
                              <div className="text-xs space-y-1">
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="flex justify-between">
                                    <span className="truncate mr-2">{item.name}</span>
                                    <span className="text-muted-foreground flex-shrink-0">x{item.quantity}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Botón de acción */}
                            {order.archived && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRestoreOrder(order.id)}
                                className="w-full gap-2 text-xs"
                              >
                                <RotateCcw className="h-3 w-3" />
                                Restaurar Pedido
                              </Button>
                            )}
                          </CardContent>
                        </Card>
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
