import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const Wishlist: React.FC = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleToggleWishlist = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const product = wishlist.find(p => p.id === productId);
    if (product) {
      toggleWishlist(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const product = wishlist.find(p => p.id === productId);
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20">
        {/* Breadcrumb */}
        <div className="bg-brand-darkBlue text-white py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 text-sm uppercase font-semibold">
              <Link to="/" className="hover:text-brand-orange transition-colors">
                INICIO
              </Link>
              <span>/</span>
              <span>FAVORITOS</span>
            </div>
          </div>
        </div>

        {/* Page Header */}
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="text-brand-orange" size={32} />
            <h1 className="text-3xl md:text-4xl font-display font-bold text-brand-darkBlue">
              Mis Favoritos
            </h1>
          </div>
          <p className="text-gray-600">
            {wishlist.length === 0 
              ? 'Aún no tienes productos favoritos'
              : `Tienes ${wishlist.length} ${wishlist.length === 1 ? 'producto' : 'productos'} en tu lista de favoritos`
            }
          </p>
        </div>

        {/* Wishlist Content */}
        <div className="container mx-auto px-4 pb-16">
          {wishlist.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <Heart className="mx-auto mb-4 text-gray-300" size={64} />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Tu lista de favoritos está vacía
              </h3>
              <p className="text-gray-500 mb-6">
                Explora nuestros productos y agrega tus favoritos
              </p>
              <Link to="/">
                <Button className="bg-brand-darkBlue hover:bg-brand-orange">
                  <ShoppingBag className="mr-2" size={18} />
                  Ir a la tienda
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlist.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  image={product.image}
                  price={product.price}
                  category={product.category}
                  isWishlisted={true}
                  onToggleWishlist={handleToggleWishlist}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Wishlist;
