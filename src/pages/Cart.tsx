import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useOrders } from '@/contexts/OrdersContext';
import { useNotifications } from '@/contexts/NotificationsContext';
import { useProducts } from '@/contexts/ProductsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { addNotification } = useNotifications();
  const [deliveryOption, setDeliveryOption] = useState<'pickup' | 'delivery'>('pickup');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    provincia: '',
    canton: '',
    distrito: '',
    direccion: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFinalizarCompra = () => {
    // Validar campos requeridos
    if (!formData.nombre || !formData.telefono) {
      toast({
        title: "Campos incompletos",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    if (deliveryOption === 'delivery' && (!formData.provincia || !formData.canton || !formData.distrito || !formData.direccion)) {
      toast({
        title: "Campos incompletos",
        description: "Por favor completa todos los campos de dirección",
        variant: "destructive",
      });
      return;
    }

    if (!paymentMethod) {
      toast({
        title: "Método de pago no seleccionado",
        description: "Por favor selecciona un método de pago",
        variant: "destructive",
      });
      return;
    }

    // Construir mensaje para WhatsApp
    let message = `*NUEVO PEDIDO*\n\n`;
    message += `*Productos:*\n`;
    items.forEach(item => {
      message += `• ${item.name} x${item.quantity} - ₡${(item.price * item.quantity).toFixed(2)}\n`;
    });
    message += `\n*Total: ₡${getTotalPrice().toFixed(2)}*\n\n`;
    
    message += `*Datos del cliente:*\n`;
    message += `Nombre: ${formData.nombre}\n`;
    message += `Teléfono: ${formData.telefono}\n\n`;
    
    message += `*Tipo de entrega:*\n`;
    if (deliveryOption === 'pickup') {
      message += `Retiro en Tienda\n\n`;
    } else {
      message += `Envío a Domicilio\n`;
      message += `Provincia: ${formData.provincia}\n`;
      message += `Cantón: ${formData.canton}\n`;
      message += `Distrito: ${formData.distrito}\n`;
      message += `Dirección: ${formData.direccion}\n\n`;
    }
    
    message += `*Método de pago:* ${paymentMethod}\n`;
    
    if (paymentMethod === 'SINPE Móvil' || paymentMethod === 'Transferencia bancaria') {
      message += `\n_*Nota:* Recuerde enviar el comprobante de pago por este medio_`;
    }

    // Codificar mensaje para URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = '50688888888'; // Cambiar por el número real
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Guardar pedido en el contexto
    const orderId = addOrder({
      type: 'online',
      status: 'pending',
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      })),
      total: getTotalPrice(),
      customerInfo: {
        nombre: formData.nombre,
        telefono: formData.telefono,
        provincia: formData.provincia,
        canton: formData.canton,
        distrito: formData.distrito,
        direccion: formData.direccion,
      },
      deliveryOption,
      paymentMethod,
    });

    // Agregar notificación con orderId
    addNotification({
      type: 'order',
      title: 'Nuevo pedido recibido',
      message: `Pedido ${orderId} de ${formData.nombre} - Total: ₡${getTotalPrice().toFixed(2)}`,
      time: 'Ahora',
      orderId: orderId,
    });

    // Abrir WhatsApp
    window.open(whatsappUrl, '_blank');

    // Limpiar carrito y formulario
    clearCart();
    setFormData({
      nombre: '',
      telefono: '',
      provincia: '',
      canton: '',
      distrito: '',
      direccion: '',
    });
    setPaymentMethod('');

    toast({
      title: "Pedido enviado",
      description: "Tu pedido ha sido enviado por WhatsApp",
    });
  };

  const paymentOptions = deliveryOption === 'pickup' 
    ? ['Efectivo', 'Tarjeta', 'SINPE Móvil']
    : ['SINPE Móvil', 'Transferencia bancaria'];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero-style background section */}
      <section className="pt-24 md:pt-32 pb-8 bg-gradient-to-b from-brand-yellow to-white relative overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute -right-24 -top-24 w-64 h-64 rounded-full bg-brand-orange opacity-10"></div>
          <div className="absolute left-1/3 top-1/3 w-32 h-32 rounded-full bg-brand-purple opacity-10"></div>
          <div className="absolute right-1/4 bottom-1/4 w-48 h-48 rounded-full bg-brand-skyBlue opacity-10"></div>
        </div>
        
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="bg-brand-darkBlue text-white py-3 px-6 rounded-lg inline-block mb-6">
            <div className="flex items-center gap-2 text-sm uppercase font-semibold">
              <Link to="/" className="hover:text-brand-orange transition-colors">
                INICIO
              </Link>
              <span>/</span>
              <span>CARRITO</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6 relative z-10">
          <h1 className="text-3xl font-bold mb-4 text-brand-darkBlue">Carrito de Compras</h1>

          {items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-600 mb-4">Tu carrito está vacío</h2>
              <Link to="/">
                <Button className="bg-brand-darkBlue hover:bg-brand-orange">
                  Ir a la tienda
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Lista de productos */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-xl font-semibold mb-4">Productos ({items.length})</h2>
                {items.map(item => (
                  <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm flex gap-4">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{item.name}</h3>
                      <p className="text-lg font-bold text-brand-orange">₡{item.price.toFixed(2)}</p>
                      
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 ml-auto"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Formulario de pedido */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Resumen del pedido</h2>
                  <div className="flex justify-between mb-2 text-gray-600">
                    <span>Subtotal</span>
                    <span>₡{getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span className="text-brand-orange">₡{getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Formulario de Pedido</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="nombre">Nombre *</Label>
                      <Input
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        placeholder="Tu nombre completo"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="telefono">Teléfono *</Label>
                      <Input
                        id="telefono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        placeholder="Tu número de teléfono"
                        required
                      />
                    </div>

                    <div>
                      <Label className="mb-3 block font-semibold">Tipo de entrega *</Label>
                      <RadioGroup value={deliveryOption} onValueChange={(value) => setDeliveryOption(value as 'pickup' | 'delivery')}>
                        <div className="flex items-center space-x-2 mb-3">
                          <RadioGroupItem value="pickup" id="pickup" />
                          <Label htmlFor="pickup" className="cursor-pointer">Retiro en Tienda</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="delivery" id="delivery" />
                          <Label htmlFor="delivery" className="cursor-pointer">Envío a Domicilio</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {deliveryOption === 'delivery' && (
                      <div className="space-y-4 pt-2 border-t">
                        <h3 className="font-semibold text-sm text-gray-700">Datos de envío</h3>
                        
                        <div>
                          <Label htmlFor="provincia">Provincia *</Label>
                          <Input
                            id="provincia"
                            name="provincia"
                            value={formData.provincia}
                            onChange={handleInputChange}
                            placeholder="Provincia"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="canton">Cantón *</Label>
                          <Input
                            id="canton"
                            name="canton"
                            value={formData.canton}
                            onChange={handleInputChange}
                            placeholder="Cantón"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="distrito">Distrito *</Label>
                          <Input
                            id="distrito"
                            name="distrito"
                            value={formData.distrito}
                            onChange={handleInputChange}
                            placeholder="Distrito"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="direccion">Dirección exacta *</Label>
                          <Input
                            id="direccion"
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleInputChange}
                            placeholder="Dirección completa"
                            required
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <Label className="mb-3 block font-semibold">Método de pago *</Label>
                      <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                        {paymentOptions.map(option => (
                          <div key={option} className="flex items-center space-x-2 mb-2">
                            <RadioGroupItem value={option} id={option} />
                            <Label htmlFor={option} className="cursor-pointer">{option}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                      {(paymentMethod === 'SINPE Móvil' || paymentMethod === 'Transferencia bancaria') && (
                        <p className="text-xs text-gray-500 mt-2">
                          * Debe enviar el comprobante por WhatsApp
                        </p>
                      )}
                    </div>

                    <Button 
                      onClick={handleFinalizarCompra}
                      className="w-full bg-brand-darkBlue hover:bg-brand-orange text-white"
                    >
                      Finalizar Compra
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Cart;
