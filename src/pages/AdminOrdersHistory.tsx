import { AdminSidebar } from '@/components/AdminSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AdminHeader from '@/components/AdminHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useOrders, OrderStatus } from '@/contexts/OrdersContext';
import { useNotifications } from '@/contexts/NotificationsContext';
import { toast } from '@/hooks/use-toast';
import { Archive, FileDown, ArrowLeft, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

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
      order.customerInfo.nombre,
      order.customerInfo.telefono,
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
      'Cliente': order.customerInfo.nombre,
      'Teléfono': order.customerInfo.telefono,
      'Provincia': order.customerInfo.provincia || 'N/A',
      'Cantón': order.customerInfo.canton || 'N/A',
      'Distrito': order.customerInfo.distrito || 'N/A',
      'Dirección': order.customerInfo.direccion || 'N/A',
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
            <div className="flex flex-wrap gap-3 justify-between items-center">
              <Button
                onClick={() => navigate('/admin/pedidos')}
                variant="outline"
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver a Pedidos
              </Button>
              
              <div className="flex gap-2">
                <Button
                  onClick={exportToPDF}
                  variant="default"
                  className="gap-2"
                  disabled={archivedOrders.length === 0}
                >
                  <FileDown className="h-4 w-4" />
                  Exportar PDF
                </Button>
                <Button
                  onClick={exportToExcel}
                  variant="default"
                  className="gap-2"
                  disabled={archivedOrders.length === 0}
                >
                  <FileDown className="h-4 w-4" />
                  Exportar Excel
                </Button>
              </div>
            </div>

            {/* Tabla de pedidos archivados */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Archive className="h-5 w-5 text-primary" />
                  <CardTitle>Pedidos Archivados</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {archivedOrders.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    <Archive className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>No hay pedidos archivados aún</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[120px]">ID Pedido</TableHead>
                          <TableHead className="min-w-[100px]">Fecha</TableHead>
                          <TableHead className="min-w-[150px]">Cliente</TableHead>
                          <TableHead className="min-w-[120px]">Teléfono</TableHead>
                          <TableHead className="min-w-[100px]">Tipo</TableHead>
                          <TableHead className="min-w-[100px]">Estado</TableHead>
                          <TableHead className="min-w-[120px]">Total</TableHead>
                          <TableHead className="min-w-[120px]">Método Pago</TableHead>
                          <TableHead className="min-w-[200px]">Productos</TableHead>
                          <TableHead className="min-w-[100px] text-center">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {archivedOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>
                              {new Date(order.createdAt).toLocaleDateString('es-ES')}
                            </TableCell>
                            <TableCell>{order.customerInfo.nombre}</TableCell>
                            <TableCell>{order.customerInfo.telefono}</TableCell>
                            <TableCell>
                              <Badge variant="outline">
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
                              >
                                {getStatusLabel(order.status)}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-semibold">
                              ₡{order.total.toFixed(2)}
                            </TableCell>
                            <TableCell>{order.paymentMethod || 'N/A'}</TableCell>
                            <TableCell>
                              <div className="text-sm space-y-1">
                                {order.items.map((item, idx) => (
                                  <div key={idx}>
                                    {item.name} (x{item.quantity})
                                  </div>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRestoreOrder(order.id)}
                                className="gap-1"
                                title="Restaurar pedido"
                              >
                                <RotateCcw className="h-4 w-4" />
                                <span className="hidden md:inline">Restaurar</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
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
