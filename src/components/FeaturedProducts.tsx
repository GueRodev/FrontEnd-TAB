import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useProductOperations } from '@/hooks/business';
import ProductCard from './ProductCard';

/**
 * FeaturedProducts Component
 * Displays featured products using business logic hook
 * @next-migration: Can be Server Component if data passed as props
 */
const FeaturedProducts: React.FC = () => {
  const {
    getFeaturedProducts,
    handleAddToCart,
    handleToggleWishlist,
    isProductInWishlist,
    getCategorySlug,
    findProductById,
  } = useProductOperations();

  const featuredProducts = getFeaturedProducts();

  // Don't render if no featured products
  if (featuredProducts.length === 0) {
    return null;
  }

  const handleWishlistClick = (e: React.MouseEvent, productId: string) => {
    const product = findProductById(productId);
    if (product) {
      handleToggleWishlist(product, e);
    }
  };

  const handleCartClick = (e: React.MouseEvent, productId: string) => {
    const product = findProductById(productId);
    if (product) {
      handleAddToCart(product, e);
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-darkBlue mb-2">
              Productos Destacados
            </h2>
            <p className="text-gray-600">
              Nuestros productos más populares y de moda
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              image={product.image}
              price={product.price}
              category={getCategorySlug(product.categoryId)}
              isWishlisted={isProductInWishlist(product.id)}
              onToggleWishlist={handleWishlistClick}
              onAddToCart={handleCartClick}
            />
          ))}
        </div>
        
        <div className="flex justify-center">
          <Link 
            to="/products" 
            className="btn-outline flex items-center gap-2 group"
          >
            Ver Todos los Productos
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
