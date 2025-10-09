import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartOperations, useOrderForm } from '@/hooks/business';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CartItem, EmptyCart, CartSummary, AddressSelector, PaymentMethodSelector } from '@/components/features';
import { DELIVERY_OPTIONS } from '@/data/constants';

/**
 * Cart Page
 * Uses business logic hooks for cart operations and order submission
 * @next-migration: Can be Server Component with Client islands for interactive parts
 */
const Cart = () => {
  const { user, isAuthenticated } = useAuth();
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

  // 🔗 Address state management
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [manualAddress, setManualAddress] = useState({
    province: '',
    canton: '',
    district: '',
    address: '',
  });
  
  const userAddresses = (isAuthenticated && user?.role === 'cliente') 
    ? (user as any).addresses || [] 
    : [];
  
  const showManualInput = selectedAddressId === 'manual' || userAddresses.length === 0;
  
  const handleManualAddressChange = (field: string, value: string) => {
    setManualAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleFinalizarCompra = () => {
    submitOrder();
  };

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
                        {DELIVERY_OPTIONS.map((option) => (
                          <div key={option.value} className="flex items-center space-x-2 mb-3">
                            <RadioGroupItem value={option.value} id={option.value} />
                            <Label htmlFor={option.value} className="cursor-pointer">
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    {deliveryOption === 'delivery' && (
                      <div className="space-y-4 pt-2 border-t">
                        <h3 className="font-semibold text-sm text-gray-700">Datos de envío</h3>
                        
                        <AddressSelector
                          savedAddresses={userAddresses}
                          selectedAddressId={selectedAddressId}
                          onSelectAddress={setSelectedAddressId}
                          manualAddress={manualAddress}
                          onManualAddressChange={handleManualAddressChange}
                          showManualInput={showManualInput}
                        />
                      </div>
                    )}

                    <PaymentMethodSelector
                      value={paymentMethod}
                      onChange={setPaymentMethod}
                    />

                    {(paymentMethod === 'sinpe' || paymentMethod === 'transfer') && (
                      <p className="text-xs text-muted-foreground">
                        * Debe enviar el comprobante por WhatsApp
                      </p>
                    )}

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
