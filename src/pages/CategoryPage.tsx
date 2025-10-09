import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import DecorativeBackground from '@/components/DecorativeBackground';
import { useProductOperations } from '@/hooks/business';
import { formatCurrency } from '@/lib/formatters';

/**
 * CategoryPage Component
 * Displays products filtered by category/subcategory
 * @next-migration: Can be Server Component with data fetching
 */
const CategoryPage: React.FC = () => {
  const { category, subcategory } = useParams<{ category: string; subcategory?: string }>();
  
  const {
    categories,
    getProductsByCategory,
    getProductsBySubcategory,
    handleAddToCart,
    handleToggleWishlist,
    isProductInWishlist,
    findProductById,
  } = useProductOperations();

  // Find the current category
  const currentCategory = useMemo(() => 
    categories.find(cat => cat.slug === category),
    [categories, category]
  );

  // Find the current subcategory if provided
  const currentSubcategory = useMemo(() => {
    if (!subcategory || !currentCategory) return undefined;
    return currentCategory.subcategories.find(sub => sub.slug === subcategory);
  }, [currentCategory, subcategory]);

  // Get products based on category or subcategory
  const products = useMemo(() => {
    if (!currentCategory) return [];
    
    if (currentSubcategory) {
      return getProductsBySubcategory(currentSubcategory.id);
    }
    
    return getProductsByCategory(currentCategory.id);
  }, [currentCategory, currentSubcategory, getProductsByCategory, getProductsBySubcategory]);

  const handleWishlistToggle = (e: React.MouseEvent, productId: string) => {
    const product = findProductById(productId);
    if (product) {
      handleToggleWishlist(product, e);
    }
  };

  const handleCartAdd = (e: React.MouseEvent, productId: string) => {
    const product = findProductById(productId);
    if (product) {
      handleAddToCart(product, e);
    }
  };

  if (!currentCategory) {
    return (
      <>
        <Header />
        <main className="pt-20 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-brand-darkBlue mb-4">Categoría no encontrada</h1>
            <Link to="/" className="text-brand-orange hover:underline">
              Volver al inicio
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
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
              <Link 
                to={`/category/${currentCategory.slug}`} 
                className="hover:text-brand-orange transition-colors"
              >
                {currentCategory.name.toUpperCase()}
              </Link>
              {currentSubcategory && (
                <>
                  <span>/</span>
                  <span>{currentSubcategory.name.toUpperCase()}</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Category Header */}
        <div className="container mx-auto px-4 py-6 relative z-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-brand-darkBlue mb-2">
            {currentSubcategory ? currentSubcategory.name : currentCategory.name}
          </h1>
          <p className="text-gray-600">
            {currentSubcategory ? currentSubcategory.description : currentCategory.description}
          </p>
        </div>
      </section>

      <main>
        {/* Products Grid */}
        <div className="container mx-auto px-4 py-8 bg-white">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={formatCurrency(product.price)}
                  image={product.image}
                  category={currentCategory.name}
                  isWishlisted={isProductInWishlist(product.id)}
                  onToggleWishlist={handleWishlistToggle}
                  onAddToCart={handleCartAdd}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No hay productos disponibles en esta categoría
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default CategoryPage;
