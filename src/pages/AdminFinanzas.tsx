import { useState, useMemo } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import AdminHeader from '@/components/AdminHeader';
import { useOrders } from "@/contexts/OrdersContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DollarSign, 
  TrendingUp, 
  ShoppingCart, 
  Calendar
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import ExportButton from '@/components/ExportButton';

const AdminFinanzas = () => {
  const { orders } = useOrders();
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());

  // Calcular métricas
  const completedOrders = orders.filter(order => order.status === 'completed');
  const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);
  
  // Ventas del mes actual
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyOrders = completedOrders.filter(order => {
    const orderDate = new Date(order.createdAt);
    return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
  });
  const monthlyRevenue = monthlyOrders.reduce((sum, order) => sum + order.total, 0);

  // Ordenar por fecha más reciente
  const recentOrders = [...completedOrders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  // Obtener años disponibles
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    completedOrders.forEach(order => {
      const year = new Date(order.createdAt).getFullYear();
      years.add(year);
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [completedOrders]);

  // Datos de ventas por mes para el año seleccionado
  const monthlyData = useMemo(() => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const data = months.map((month, index) => {
      const monthOrders = completedOrders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.getMonth() === index && orderDate.getFullYear() === parseInt(selectedYear);
      });

      const revenue = monthOrders.reduce((sum, order) => sum + order.total, 0);
      const count = monthOrders.length;

      return {
        mes: month,
        ingresos: parseFloat(revenue.toFixed(2)),
        ventas: count
      };
    });

    return data;
  }, [completedOrders, selectedYear]);

  // Totales del año seleccionado
  const yearlyStats = useMemo(() => {
    const yearOrders = completedOrders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate.getFullYear() === parseInt(selectedYear);
    });

    return {
      revenue: yearOrders.reduce((sum, order) => sum + order.total, 0),
      count: yearOrders.length
    };
  }, [completedOrders, selectedYear]);

  const exportToCSV = () => {
    const headers = ['ID Pedido', 'Fecha', 'Cliente', 'Tipo', 'Total', 'Estado'];
    const csvData = completedOrders.map(order => [
      order.id,
      format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm', { locale: es }),
      order.customerInfo.nombre,
      order.type === 'online' ? 'En línea' : 'En tienda',
      `₡${order.total.toFixed(2)}`,
      order.status === 'completed' ? 'Completado' : order.status === 'pending' ? 'Pendiente' : 'Cancelado'
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `informe_finanzas_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    // Crear contenido HTML para PDF
    const printWindow = window.open('', '', 'height=600,width=800');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Informe de Finanzas</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #1A1F2C; }
            .summary { display: flex; gap: 20px; margin: 20px 0; }
            .summary-card { 
              border: 1px solid #ddd; 
              padding: 15px; 
              border-radius: 8px;
              flex: 1;
            }
            .summary-card h3 { margin: 0 0 10px 0; color: #666; font-size: 14px; }
            .summary-card p { margin: 0; font-size: 24px; font-weight: bold; color: #1A1F2C; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .date { color: #666; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <h1>Informe de Finanzas - Toys and Bricks</h1>
          <p class="date">Generado el: ${format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: es })}</p>
          
          <div class="summary">
            <div class="summary-card">
              <h3>Ingresos Totales</h3>
              <p>₡${totalRevenue.toFixed(2)}</p>
            </div>
            <div class="summary-card">
              <h3>Ventas del Mes</h3>
              <p>₡${monthlyRevenue.toFixed(2)}</p>
            </div>
            <div class="summary-card">
              <h3>Total de Ventas</h3>
              <p>${completedOrders.length}</p>
            </div>
          </div>

          <h2>Ventas Recientes</h2>
          <table>
            <thead>
              <tr>
                <th>ID Pedido</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Tipo</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${recentOrders.map(order => `
                <tr>
                  <td>${order.id}</td>
                  <td>${format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })}</td>
                  <td>${order.customerInfo.nombre}</td>
                  <td>${order.type === 'online' ? 'En línea' : 'En tienda'}</td>
                  <td>₡${order.total.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background overflow-hidden">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <AdminHeader title="Finanzas" />

          <main className="flex-1 p-3 md:p-4 lg:p-6 space-y-4 md:space-y-6 overflow-y-auto overflow-x-hidden">
            {/* Cards de Resumen */}
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 md:gap-6">
              {/* Ingresos Totales */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm md:text-base font-medium">
                    Ingresos Totales
                  </CardTitle>
                  <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground flex-shrink-0" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold break-all">
                    ₡{totalRevenue.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    De {completedOrders.length} ventas completadas
                  </p>
                </CardContent>
              </Card>

              {/* Ventas del Mes */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm md:text-base font-medium">
                    Ventas del Mes
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground flex-shrink-0" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold break-all">
                    ₡{monthlyRevenue.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {monthlyOrders.length} ventas en {format(new Date(), 'MMMM', { locale: es })}
                  </p>
                </CardContent>
              </Card>

              {/* Total de Pedidos */}
              <Card className="lg:col-span-2 2xl:col-span-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm md:text-base font-medium">
                    Total de Pedidos
                  </CardTitle>
                  <ShoppingCart className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground flex-shrink-0" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold">
                    {orders.length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {completedOrders.length} completados, {orders.filter(o => o.status === 'pending').length} pendientes
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Tabla de Ventas Recientes */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle className="text-base md:text-lg lg:text-xl">
                      Ventas Recientes
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm">
                      Últimas 10 transacciones completadas
                    </CardDescription>
                  </div>
                  <ExportButton
                    onExportPDF={exportToPDF}
                    onExportExcel={exportToCSV}
                  />
                
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs md:text-sm">ID Pedido</TableHead>
                        <TableHead className="text-xs md:text-sm">Fecha</TableHead>
                        <TableHead className="text-xs md:text-sm">Cliente</TableHead>
                        <TableHead className="text-xs md:text-sm">Tipo</TableHead>
                        <TableHead className="text-xs md:text-sm text-right">Total</TableHead>
                        <TableHead className="text-xs md:text-sm">Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentOrders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground text-xs md:text-sm py-8">
                            No hay ventas completadas aún
                          </TableCell>
                        </TableRow>
                      ) : (
                        recentOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium text-xs md:text-sm">
                              {order.id}
                            </TableCell>
                            <TableCell className="text-xs md:text-sm">
                              {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })}
                            </TableCell>
                            <TableCell className="text-xs md:text-sm">
                              {order.customerInfo.nombre}
                            </TableCell>
                            <TableCell className="text-xs md:text-sm">
                              <Badge variant="outline" className="text-xs">
                                {order.type === 'online' ? 'En línea' : 'En tienda'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-semibold text-xs md:text-sm">
                              ₡{order.total.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={order.status === 'completed' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {order.status === 'completed' ? 'Completado' : 
                                 order.status === 'pending' ? 'Pendiente' : 'Cancelado'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Gráfico de Ventas por Mes */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle className="text-base md:text-lg lg:text-xl">
                      Ventas por Mes
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm">
                      Rendimiento mensual de {selectedYear}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger className="w-[120px] text-xs md:text-sm h-8 md:h-9">
                        <SelectValue placeholder="Seleccionar año" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableYears.length > 0 ? (
                          availableYears.map(year => (
                            <SelectItem key={year} value={year.toString()} className="text-xs md:text-sm">
                              {year}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value={currentYear.toString()} className="text-xs md:text-sm">
                            {currentYear}
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Resumen del año */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 p-3 md:p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground">Total Ingresos {selectedYear}</p>
                      <p className="text-base md:text-lg lg:text-xl xl:text-2xl font-bold break-all">₡{yearlyStats.revenue.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground">Total Ventas {selectedYear}</p>
                      <p className="text-base md:text-lg lg:text-xl xl:text-2xl font-bold">{yearlyStats.count}</p>
                    </div>
                  </div>

                  {/* Gráfico */}
                  <div className="h-[280px] sm:h-[320px] lg:h-[380px] xl:h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData} margin={{ bottom: 60, left: 0, right: 10, top: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis 
                          dataKey="mes" 
                          tick={{ fontSize: 10 }}
                          angle={-45}
                          textAnchor="end"
                          height={70}
                          interval={0}
                        />
                        <YAxis tick={{ fontSize: 10 }} width={60} />
                        <Tooltip
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            fontSize: '12px'
                          }}
                          formatter={(value: number, name: string) => {
                            if (name === 'ingresos') return [`₡${value.toFixed(2)}`, 'Ingresos'];
                            return [value, 'Ventas'];
                          }}
                        />
                        <Legend 
                          wrapperStyle={{ fontSize: '12px' }}
                          formatter={(value) => {
                            if (value === 'ingresos') return 'Ingresos (₡)';
                            return 'Cantidad de Ventas';
                          }}
                        />
                        <Bar dataKey="ingresos" fill="#F97316" name="ingresos" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="ventas" fill="#1A1F2C" name="ventas" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Tabla de datos mensuales */}
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs md:text-sm">Mes</TableHead>
                          <TableHead className="text-xs md:text-sm text-right">Ingresos</TableHead>
                          <TableHead className="text-xs md:text-sm text-right">Ventas</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {monthlyData.map((data) => (
                          <TableRow key={data.mes}>
                            <TableCell className="font-medium text-xs md:text-sm">{data.mes}</TableCell>
                            <TableCell className="text-right text-xs md:text-sm">₡{data.ingresos.toFixed(2)}</TableCell>
                            <TableCell className="text-right text-xs md:text-sm">{data.ventas}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="font-bold bg-muted/50">
                          <TableCell className="text-xs md:text-sm">TOTAL {selectedYear}</TableCell>
                          <TableCell className="text-right text-xs md:text-sm">₡{yearlyStats.revenue.toFixed(2)}</TableCell>
                          <TableCell className="text-right text-xs md:text-sm">{yearlyStats.count}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminFinanzas;