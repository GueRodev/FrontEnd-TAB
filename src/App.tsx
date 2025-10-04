
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WishlistProvider } from "./contexts/WishlistContext";
import { CartProvider } from "./contexts/CartContext";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CategoryPage from "./pages/CategoryPage";
import Wishlist from "./pages/Wishlist";
import Account from "./pages/Account";
import Cart from "./pages/Cart";
import Admin from "./pages/Admin";
import AdminProducts from "./pages/AdminProducts";
import AdminCategorias from "./pages/AdminCategorias";
import AdminUsuarios from "./pages/AdminUsuarios";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <WishlistProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/category/:category" element={<CategoryPage />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/account" element={<Account />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/productos" element={<AdminProducts />} />
              <Route path="/admin/categorias" element={<AdminCategorias />} />
              <Route path="/admin/usuarios" element={<AdminUsuarios />} />
              <Route path="/new-arrivals" element={<CategoryPage />} />
              <Route path="/limited-editions" element={<CategoryPage />} />
              <Route path="/on-sale" element={<CategoryPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </WishlistProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
