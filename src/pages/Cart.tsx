import React from 'react';
import { Link } from 'react-router-dom';
import { useCartOperations, useOrderForm } from '@/hooks/business';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CartItem, EmptyCart, CartSummary } from '@/components/features';

/**
 * Cart Page
 * Uses business logic hooks for cart operations and order submission
 * @next-migration: Can be Server Component with Client islands for interactive parts
 */
const Cart = () => {
  const {
    items,
    totalPrice,
    isEmpty,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
  } = useCartOperations();

  const {
    formData,
    deliveryOption,
    paymentMethod,
    handleInputChange,
    setDeliveryOption,
    setPaymentMethod,
    submitOrder,
  } = useOrderForm();

  const handleFinalizarCompra = () => {
    submitOrder();
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

          {isEmpty ? (
            <EmptyCart />
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Lista de productos */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-xl font-semibold mb-4">Productos ({items.length})</h2>
                {items.map(item => (
                  <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm">
                    <CartItem
                      item={item}
                      onIncrement={incrementQuantity}
                      onDecrement={decrementQuantity}
                      onRemove={removeFromCart}
                    />
                  </div>
                ))}
              </div>

              {/* Formulario de pedido */}
              <div className="space-y-6">
                <CartSummary totalItems={items.length} totalPrice={totalPrice} />

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Formulario de Pedido</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nombre *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Tu nombre completo"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Teléfono *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
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
                          <Label htmlFor="province">Provincia *</Label>
                          <Input
                            id="province"
                            name="province"
                            value={formData.province}
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
                          <Label htmlFor="district">Distrito *</Label>
                          <Input
                            id="district"
                            name="district"
                            value={formData.district}
                            onChange={handleInputChange}
                            placeholder="Distrito"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="address">Dirección exacta *</Label>
                          <Input
                            id="address"
                            name="address"
                            value={formData.address}
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
