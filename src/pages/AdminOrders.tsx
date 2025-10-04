import { useState } from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOrders, OrderStatus } from '@/contexts/OrdersContext';
import { toast } from '@/hooks/use-toast';
import { ShoppingCart, Store, Package, CheckCircle, XCircle, Trash2 } from 'lucide-react';

// Datos mock de productos para el formulario de tienda física
const mockProducts = [
  { id: '1', name: 'LEGO Creator 3 en 1', price: 45.99, stock: 10, image: '/lovable-uploads/17088b0e-dee8-4716-b76d-00be5a07559d.png' },
  { id: '2', name: 'LEGO City Camión de Bomberos', price: 89.99, stock: 5, image: '/lovable-uploads/31cfb3d2-5f19-4cd1-8f9d-efa9f964d81c.png' },
  { id: '3', name: 'LEGO Star Wars X-Wing', price: 129.99, stock: 8, image: '/lovable-uploads/51190e3f-2193-4b2a-85ac-e5453680e7bf.png' },
  { id: '4', name: 'LEGO Harry Potter Castillo', price: 199.99, stock: 3, image: '/lovable-uploads/fbc358a3-bb7b-4fe9-aba6-e1d0b71a13a0.png' },
];

const AdminOrders = () => {
  const { orders, addOrder, updateOrderStatus, deleteOrder } = useOrders();
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const onlineOrders = orders.filter(o => o.type === 'online');
  const inStoreOrders = orders.filter(o => o.type === 'in-store');

  const handleCreateInStoreOrder = () => {
    if (!selectedProduct || !customerName || !customerPhone || !paymentMethod) {
      toast({
        title: "Campos incompletos",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    const product = mockProducts.find(p => p.id === selectedProduct);
    if (!product) return;

    if (quantity > product.stock) {
      toast({
        title: "Stock insuficiente",
        description: `Solo hay ${product.stock} unidades disponibles`,
        variant: "destructive",
      });
      return;
    }

    const newOrder = {
      type: 'in-store' as const,
      status: 'pending' as OrderStatus,
      items: [{
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: quantity,
      }],
      total: product.price * quantity,
      customerInfo: {
        nombre: customerName,
        telefono: customerPhone,
      },
      deliveryOption: 'pickup' as const,
      paymentMethod: paymentMethod,
    };

    addOrder(newOrder);
    
    // Limpiar formulario
    setSelectedProduct('');
    setQuantity(1);
    setCustomerName('');
    setCustomerPhone('');
    setPaymentMethod('');

    toast({
      title: "Pedido creado",
      description: "El pedido en tienda ha sido registrado exitosamente",
    });
  };

  const getStatusBadge = (status: OrderStatus) => {
    const config = {
      pending: { label: 'Pendiente', variant: 'secondary' as const, icon: Package },
      completed: { label: 'Finalizado', variant: 'default' as const, icon: CheckCircle },
      cancelled: { label: 'Cancelado', variant: 'destructive' as const, icon: XCircle },
    };
    const { label, variant, icon: Icon } = config[status];
    return (
      <Badge variant={variant} className="gap-1">
        <Icon size={14} />
        {label}
      </Badge>
    );
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este pedido?')) {
      deleteOrder(orderId);
      toast({
        title: "Pedido eliminado",
        description: "El pedido ha sido eliminado exitosamente",
      });
    }
  };

  const OrderCard = ({ order, showDeliveryInfo = true }: { order: any; showDeliveryInfo?: boolean }) => (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{order.id}</CardTitle>
            <CardDescription>{new Date(order.createdAt).toLocaleString('es-ES')}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(order.status)}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeleteOrder(order.id)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 size={18} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Información del cliente */}
        <div className="bg-muted p-3 rounded-lg">
          <p className="font-semibold">{order.customerInfo.nombre}</p>
          <p className="text-sm text-muted-foreground">{order.customerInfo.telefono}</p>
          {showDeliveryInfo && order.deliveryOption === 'delivery' && (
            <div className="mt-2 text-sm">
              <p className="font-medium">Dirección de envío:</p>
              <p>{order.customerInfo.provincia}, {order.customerInfo.canton}</p>
              <p>{order.customerInfo.distrito}</p>
              <p>{order.customerInfo.direccion}</p>
            </div>
          )}
        </div>

        {/* Productos */}
        <div className="space-y-2">
          {order.items.map((item: any) => (
            <div key={item.id} className="flex gap-3 items-center">
              <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
              <div className="flex-1">
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-xs text-muted-foreground">Cantidad: {item.quantity}</p>
              </div>
              <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>

        {/* Total y método de pago */}
        <div className="border-t pt-3">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Total:</span>
            <span className="text-lg font-bold text-primary">${order.total.toFixed(2)}</span>
          </div>
          {order.paymentMethod && (
            <p className="text-sm text-muted-foreground">Pago: {order.paymentMethod}</p>
          )}
        </div>

        {/* Acciones */}
        {order.status === 'pending' && (
          <div className="flex gap-2 pt-2">
            <Button 
              size="sm" 
              onClick={() => updateOrderStatus(order.id, 'completed')}
              className="flex-1"
            >
              <CheckCircle size={16} className="mr-1" />
              Finalizar
            </Button>
            <Button 
              size="sm" 
              variant="destructive"
              onClick={() => updateOrderStatus(order.id, 'cancelled')}
              className="flex-1"
            >
              <XCircle size={16} className="mr-1" />
              Cancelar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <SidebarInset className="flex-1">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold">Gestión de Pedidos</h1>
          </header>

          <main className="p-6 space-y-8">
            {/* Sección 1: Pedidos desde el carrito */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingCart className="h-6 w-6 text-primary" />
                  <h2 className="text-xl font-bold">Pedidos desde el Carrito</h2>
                </div>
                <p className="text-muted-foreground">Gestiona los pedidos realizados desde la tienda online</p>
              </div>
              
              <Card>
                <CardContent className="p-6">
                  {onlineOrders.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">
                      <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-30" />
                      <p>No hay pedidos online aún</p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {onlineOrders.map(order => (
                        <OrderCard key={order.id} order={order} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sección 2: Crear pedido en tienda física */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Store className="h-6 w-6 text-primary" />
                  <h2 className="text-xl font-bold">Pedidos en Tienda Física</h2>
                </div>
                <p className="text-muted-foreground">Registra y gestiona ventas presenciales</p>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Formulario para crear pedido */}
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle>Crear Nuevo Pedido</CardTitle>
                    <CardDescription>Registra una venta presencial</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="product">Producto *</Label>
                      <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                        <SelectTrigger id="product">
                          <SelectValue placeholder="Selecciona un producto" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockProducts.map(product => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} - ${product.price} (Stock: {product.stock})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="quantity">Cantidad *</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="customerName">Nombre del Cliente *</Label>
                      <Input
                        id="customerName"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Nombre completo"
                      />
                    </div>

                    <div>
                      <Label htmlFor="customerPhone">Teléfono *</Label>
                      <Input
                        id="customerPhone"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="Número de contacto"
                      />
                    </div>

                    <div>
                      <Label htmlFor="payment">Método de Pago *</Label>
                      <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                        <SelectTrigger id="payment">
                          <SelectValue placeholder="Selecciona método de pago" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Efectivo">Efectivo</SelectItem>
                          <SelectItem value="Tarjeta">Tarjeta</SelectItem>
                          <SelectItem value="SINPE Móvil">SINPE Móvil</SelectItem>
                          <SelectItem value="Transferencia">Transferencia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      onClick={handleCreateInStoreOrder}
                      className="w-full"
                    >
                      Crear Pedido
                    </Button>
                  </CardContent>
                </Card>

                {/* Lista de pedidos en tienda */}
                <div className="lg:col-span-2">
                  {inStoreOrders.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center text-muted-foreground">
                        <Store className="h-12 w-12 mx-auto mb-2 opacity-30" />
                        <p>No hay pedidos en tienda aún</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {inStoreOrders.map(order => (
                        <OrderCard key={order.id} order={order} showDeliveryInfo={false} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminOrders;
