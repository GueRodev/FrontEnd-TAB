import { useMemo } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/AdminSidebar';
import { useOrders } from '@/contexts/OrdersContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  DollarSign, 
  TrendingUp, 
  ShoppingCart, 
  Package,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

const Admin = () => {
  const { orders } = useOrders();

  // Calcular métricas principales
  const completedOrders = orders.filter(order => order.status === 'completed');
  const pendingOrders = orders.filter(order => order.status === 'pending');
  const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);
  
  // Ventas del mes actual
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyOrders = completedOrders.filter(order => {
    const orderDate = new Date(order.createdAt);
    return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
  });
  const monthlyRevenue = monthlyOrders.reduce((sum, order) => sum + order.total, 0);

  // Ventas del día
  const today = new Date().toDateString();
  const todayOrders = completedOrders.filter(order => 
    new Date(order.createdAt).toDateString() === today
  );
  const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);

  // Datos para gráfico de últimos 7 días
  const last7DaysData = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toDateString();
      
      const dayOrders = completedOrders.filter(order => 
        new Date(order.createdAt).toDateString() === dateString
      );
      
      const revenue = dayOrders.reduce((sum, order) => sum + order.total, 0);
      
      data.push({
        fecha: format(date, 'dd/MM', { locale: es }),
        ingresos: parseFloat(revenue.toFixed(2)),
        ventas: dayOrders.length
      });
    }
    return data;
  }, [completedOrders]);

  // Pedidos recientes (últimos 5)
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Productos más vendidos
  const topProducts = useMemo(() => {
    const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {};
    
    completedOrders.forEach(order => {
      order.items.forEach(item => {
        if (!productSales[item.id]) {
          productSales[item.id] = {
            name: item.name,
            quantity: 0,
            revenue: 0
          };
        }
        productSales[item.id].quantity += item.quantity;
        productSales[item.id].revenue += item.price * item.quantity;
      });
    });

    return Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [completedOrders]);

  // Total de productos únicos
  const uniqueProducts = new Set(completedOrders.flatMap(order => order.items.map(item => item.id))).size;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background overflow-hidden">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="h-14 md:h-16 border-b bg-background flex items-center px-3 md:px-6 sticky top-0 z-10 flex-shrink-0">
            <SidebarTrigger className="mr-4 flex-shrink-0" />
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold truncate">Dashboard</h1>
          </header>

          <main className="flex-1 p-3 md:p-4 lg:p-6 space-y-4 md:space-y-6 overflow-y-auto overflow-x-hidden">
            {/* Cards de Métricas Principales */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {/* Ingresos Totales */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm md:text-base font-medium">
                    Ingresos Totales
                  </CardTitle>
                  <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground flex-shrink-0" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg md:text-xl lg:text-2xl font-bold break-all">
                    ₡{totalRevenue.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {completedOrders.length} ventas completadas
                  </p>
                </CardContent>
              </Card>

              {/* Ventas del Mes */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm md:text-base font-medium">
                    Ventas del Mes
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-green-500 flex-shrink-0" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg md:text-xl lg:text-2xl font-bold break-all">
                    ₡{monthlyRevenue.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {monthlyOrders.length} pedidos en {format(new Date(), 'MMMM', { locale: es })}
                  </p>
                </CardContent>
              </Card>

              {/* Ventas de Hoy */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm md:text-base font-medium">
                    Ventas de Hoy
                  </CardTitle>
                  <Clock className="h-4 w-4 md:h-5 md:w-5 text-blue-500 flex-shrink-0" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg md:text-xl lg:text-2xl font-bold break-all">
                    ₡{todayRevenue.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {todayOrders.length} pedidos hoy
                  </p>
                </CardContent>
              </Card>

              {/* Pedidos Pendientes */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm md:text-base font-medium">
                    Pedidos Pendientes
                  </CardTitle>
                  <ShoppingCart className="h-4 w-4 md:h-5 md:w-5 text-orange-500 flex-shrink-0" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg md:text-xl lg:text-2xl font-bold">
                    {pendingOrders.length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Requieren atención
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Gráfico de Ventas de los Últimos 7 Días */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg lg:text-xl">
                  Tendencia de Ventas (Últimos 7 Días)
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Ingresos y cantidad de ventas diarias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] sm:h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={last7DaysData} margin={{ bottom: 20, left: 0, right: 10, top: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="fecha" 
                        tick={{ fontSize: 11 }}
                        height={40}
                      />
                      <YAxis tick={{ fontSize: 11 }} width={60} />
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
                      <Line 
                        type="monotone" 
                        dataKey="ingresos" 
                        stroke="#F97316" 
                        strokeWidth={2}
                        name="ingresos"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="ventas" 
                        stroke="#1A1F2C" 
                        strokeWidth={2}
                        name="ventas"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Dos columnas: Pedidos Recientes y Productos Más Vendidos */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
              {/* Pedidos Recientes */}
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <CardTitle className="text-base md:text-lg lg:text-xl">
                      Pedidos Recientes
                    </CardTitle>
                    <Link to="/admin/pedidos">
                      <Badge variant="outline" className="text-xs cursor-pointer hover:bg-muted">
                        Ver todos
                      </Badge>
                    </Link>
                  </div>
                  <CardDescription className="text-xs md:text-sm">
                    Últimos 5 pedidos recibidos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs md:text-sm">ID</TableHead>
                          <TableHead className="text-xs md:text-sm">Cliente</TableHead>
                          <TableHead className="text-xs md:text-sm text-right">Total</TableHead>
                          <TableHead className="text-xs md:text-sm">Estado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentOrders.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center text-muted-foreground text-xs md:text-sm py-8">
                              No hay pedidos aún
                            </TableCell>
                          </TableRow>
                        ) : (
                          recentOrders.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell className="font-medium text-xs md:text-sm">
                                #{order.id.slice(0, 8)}
                              </TableCell>
                              <TableCell className="text-xs md:text-sm">
                                {order.customerInfo.nombre}
                              </TableCell>
                              <TableCell className="text-right font-semibold text-xs md:text-sm">
                                ₡{order.total.toFixed(2)}
                              </TableCell>
                              <TableCell>
                                {order.status === 'completed' ? (
                                  <Badge className="text-xs bg-green-500">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Completado
                                  </Badge>
                                ) : order.status === 'pending' ? (
                                  <Badge className="text-xs bg-orange-500">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Pendiente
                                  </Badge>
                                ) : (
                                  <Badge className="text-xs bg-red-500">
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Cancelado
                                  </Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Productos Más Vendidos */}
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <CardTitle className="text-base md:text-lg lg:text-xl">
                      Productos Más Vendidos
                    </CardTitle>
                    <Link to="/admin/productos">
                      <Badge variant="outline" className="text-xs cursor-pointer hover:bg-muted">
                        Ver todos
                      </Badge>
                    </Link>
                  </div>
                  <CardDescription className="text-xs md:text-sm">
                    Top 5 productos por cantidad vendida
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs md:text-sm">Producto</TableHead>
                          <TableHead className="text-xs md:text-sm text-right">Vendidos</TableHead>
                          <TableHead className="text-xs md:text-sm text-right">Ingresos</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {topProducts.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center text-muted-foreground text-xs md:text-sm py-8">
                              No hay ventas registradas
                            </TableCell>
                          </TableRow>
                        ) : (
                          topProducts.map((product, index) => (
                            <TableRow key={product.name}>
                              <TableCell className="font-medium text-xs md:text-sm">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    #{index + 1}
                                  </Badge>
                                  {product.name}
                                </div>
                              </TableCell>
                              <TableCell className="text-right font-semibold text-xs md:text-sm">
                                {product.quantity}
                              </TableCell>
                              <TableCell className="text-right text-xs md:text-sm text-green-600">
                                ₡{product.revenue.toFixed(2)}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Resumen Rápido */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg lg:text-xl">
                  Resumen Rápido
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Package className="h-8 w-8 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Productos Vendidos</p>
                      <p className="text-lg font-bold">{uniqueProducts}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Completados</p>
                      <p className="text-lg font-bold">{completedOrders.length}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Clock className="h-8 w-8 text-orange-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Pendientes</p>
                      <p className="text-lg font-bold">{pendingOrders.length}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Promedio/Pedido</p>
                      <p className="text-lg font-bold">
                        ₡{completedOrders.length > 0 ? (totalRevenue / completedOrders.length).toFixed(2) : '0.00'}
                      </p>
                    </div>
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

export default Admin;
