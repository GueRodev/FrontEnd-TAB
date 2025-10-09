import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DecorativeBackground from '@/components/DecorativeBackground';
import { useWishlistOperations } from '@/hooks/business';
import { useCart } from '@/contexts/CartContext';
import { WishlistGrid, EmptyWishlist } from '@/components/features';

/**
 * Wishlist Page
 * Uses business logic hooks and presentational components
 * @next-migration: Can be Server Component with Client islands
 */
const Wishlist: React.FC = () => {
  const { wishlist, toggleWishlist, itemCount } = useWishlistOperations();
  const { addToCart } = useCart();

  const handleToggleWishlist = (product: any, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    toggleWishlist(product);
  };

  const handleAddToCart = (product: any, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    addToCart({
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero-style background section */}
      <section className="pt-24 md:pt-32 pb-8 bg-gradient-to-b from-brand-yellow to-white relative overflow-hidden">
        <DecorativeBackground />
        
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="bg-brand-darkBlue text-white py-3 px-6 rounded-lg inline-block mb-6">
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
        <div className="container mx-auto px-4 py-6 relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="text-brand-orange" size={32} />
            <h1 className="text-3xl md:text-4xl font-display font-bold text-brand-darkBlue">
              Mis Favoritos
            </h1>
          </div>
          <p className="text-gray-600">
            {itemCount === 0 
              ? 'Aún no tienes productos favoritos'
              : `Tienes ${itemCount} ${itemCount === 1 ? 'producto' : 'productos'} en tu lista de favoritos`
            }
          </p>
        </div>
      </section>

      <main className="flex-grow">
        {/* Wishlist Content */}
        <div className="container mx-auto px-4 py-8 bg-white">
          {itemCount === 0 ? (
            <EmptyWishlist />
          ) : (
            <WishlistGrid
              products={wishlist}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Wishlist;
