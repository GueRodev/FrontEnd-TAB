import React from 'react';
import { useProductOperations, useProductModal } from '@/hooks/business';
import { FeaturedProductsSection, ProductDetailModal } from '@/components/features';

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
  } = useProductOperations();

  const {
    isModalOpen,
    selectedProduct,
    quantity,
    openProductModal,
    closeProductModal,
    setQuantity,
    handleAddToCartFromModal,
    handleToggleWishlistFromModal,
    isProductInWishlist: isModalProductInWishlist,
  } = useProductModal({ 
    onAddToCart: handleAddToCart, 
    onToggleWishlist: handleToggleWishlist,
    isInWishlist: isProductInWishlist,
  });

  const featuredProducts = getFeaturedProducts();

  return (
    <>
      <FeaturedProductsSection
        products={featuredProducts}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        isInWishlist={isProductInWishlist}
        getCategorySlug={getCategorySlug}
        onProductClick={openProductModal}
      />
      
      <ProductDetailModal
        product={selectedProduct}
        open={isModalOpen}
        onOpenChange={closeProductModal}
        onAddToCart={handleAddToCartFromModal}
        onToggleWishlist={handleToggleWishlistFromModal}
        isInWishlist={isModalProductInWishlist}
        categoryName={selectedProduct ? getCategorySlug(selectedProduct.categoryId) : undefined}
        quantity={quantity}
        onQuantityChange={setQuantity}
      />
    </>
  );
};

export default FeaturedProducts;
