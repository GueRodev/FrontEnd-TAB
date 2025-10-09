import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/AdminSidebar';
import AdminHeader from '@/components/AdminHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MetricCard } from '@/components/features/dashboard';
import { 
  DollarSign, 
  TrendingUp, 
  ShoppingCart, 
  Package,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import { formatCurrency } from '@/lib/formatters';
import { getStatusLabel } from '@/lib/helpers/order.helpers';
import { useDashboardMetrics } from '@/hooks/business';

const Admin = () => {
  const { metrics, chartData, recentOrders, topProducts, uniqueProducts } = useDashboardMetrics();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <SidebarInset className="flex-1">
          <AdminHeader title="Dashboard" />

          <main className="p-3 md:p-4 lg:p-6 space-y-4 md:space-y-6">
            {/* Cards de Métricas Principales */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <MetricCard
                title="Ingresos Totales"
                value={formatCurrency(metrics.totalRevenue)}
                icon={DollarSign}
                description={`${metrics.completedOrders} ventas completadas`}
                variant="default"
              />
              <MetricCard
                title="Ventas del Mes"
                value={formatCurrency(metrics.monthlyRevenue)}
                icon={TrendingUp}
                description={`Ventas en ${format(new Date(), 'MMMM', { locale: es })}`}
                variant="success"
              />
              <MetricCard
                title="Ventas de Hoy"
                value={formatCurrency(metrics.dailyRevenue)}
                icon={Clock}
                description="Ingresos del día"
                variant="info"
              />
              <MetricCard
                title="Pedidos Pendientes"
                value={metrics.pendingOrders}
                icon={ShoppingCart}
                description="Requieren atención"
                variant="warning"
              />
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
                    <LineChart data={chartData} margin={{ bottom: 20, left: 0, right: 10, top: 10 }}>
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
                          if (name === 'ingresos') return [formatCurrency(value), 'Ingresos'];
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
                    <Link to="/admin/orders">
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
                                {order.customerInfo.name}
                              </TableCell>
                              <TableCell className="text-right font-semibold text-xs md:text-sm">
                                {formatCurrency(order.total)}
                              </TableCell>
                              <TableCell>
                                <Badge className="text-xs">
                                  {getStatusLabel(order.status)}
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

              {/* Productos Más Vendidos */}
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <CardTitle className="text-base md:text-lg lg:text-xl">
                      Productos Más Vendidos
                    </CardTitle>
                    <Link to="/admin/products">
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
                                {formatCurrency(product.revenue)}
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
                      <p className="text-lg font-bold">{metrics.completedOrders}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Clock className="h-8 w-8 text-orange-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Pendientes</p>
                      <p className="text-lg font-bold">{metrics.pendingOrders}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Promedio/Pedido</p>
                      <p className="text-lg font-bold">
                        {formatCurrency(metrics.averageOrderValue)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Admin;
