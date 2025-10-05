
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { useProducts } from '@/contexts/ProductsContext';
import { useCategories } from '@/contexts/CategoriesContext';
import ProductCard from './ProductCard';

const FeaturedProducts: React.FC = () => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { products } = useProducts();
  const { categories } = useCategories();

  // Get only featured products
  const featuredProducts = products.filter(product => product.isFeatured && product.status === 'active');

  const handleToggleWishlist = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const product = featuredProducts.find(p => p.id === productId);
    if (product) {
      toggleWishlist({
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        category: categories.find(c => c.id === product.categoryId)?.slug || '',
      });
    }
  };

  const handleAddToCart = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const product = featuredProducts.find(p => p.id === productId);
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
      });
    }
  };

  // Don't render the section if there are no featured products
  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
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
          {featuredProducts.map((product) => {
            const category = categories.find(c => c.id === product.categoryId);
            return (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                image={product.image}
                price={product.price}
                category={category?.slug || ''}
                isWishlisted={isInWishlist(product.id)}
                onToggleWishlist={handleToggleWishlist}
                onAddToCart={handleAddToCart}
              />
            );
          })}
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
