import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import React from 'react'
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { NotificationsProvider } from './contexts/NotificationsContext';
import { OrdersProvider } from './contexts/OrdersContext';
import { CategoriesProvider } from './contexts/CategoriesContext';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ScrollToTop from './components/ScrollToTop';

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TooltipProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <CategoriesProvider>
            <NotificationsProvider>
              <OrdersProvider>
                <CartProvider>
                  <WishlistProvider>
                    <ScrollToTop />
                    <App />
                    <Toaster />
                    <Sonner />
                  </WishlistProvider>
                </CartProvider>
              </OrdersProvider>
            </NotificationsProvider>
          </CategoriesProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </TooltipProvider>
  </React.StrictMode>
);
