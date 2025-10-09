import React from 'react';
import { useProductOperations } from '@/hooks/business';
import { FeaturedProductsSection } from '@/components/features';

/**
 * FeaturedProducts Component
 * Smart component that connects business logic to presentational component
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

  const handleWishlistClick = (product: any, e?: React.MouseEvent) => {
    handleToggleWishlist(product, e);
  };

  const handleCartClick = (product: any, e?: React.MouseEvent) => {
    handleAddToCart(product, e);
  };

  return (
    <FeaturedProductsSection
      products={featuredProducts}
      onAddToCart={handleCartClick}
      onToggleWishlist={handleWishlistClick}
      isInWishlist={isProductInWishlist}
      getCategorySlug={getCategorySlug}
    />
  );
};

export default FeaturedProducts;
