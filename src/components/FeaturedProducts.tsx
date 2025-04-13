
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { AutoCarousel } from '@/components/ui/auto-carousel';

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  rating: number;
  category: string;
  badge?: string;
}

const featuredProducts: Product[] = [
  {
    id: 'p1',
    name: 'LEGO Star Wars Millennium Falcon',
    image: '/lovable-uploads/51190e3f-2193-4b2a-85ac-e5453680e7bf.png',
    price: 159.99,
    rating: 4.9,
    category: 'Star Wars',
    badge: 'Bestseller'
  },
  {
    id: 'p2',
    name: 'LEGO Marvel Avengers Tower',
    image: '/lovable-uploads/9c75102e-2923-40ad-8aaf-ff7279ad2993.png',
    price: 89.99,
    rating: 4.7,
    category: 'Superheroes'
  },
  {
    id: 'p3',
    name: 'LEGO City Space Station',
    image: '/lovable-uploads/51190e3f-2193-4b2a-85ac-e5453680e7bf.png',
    price: 69.99,
    rating: 4.5,
    category: 'LEGO City',
    badge: 'New'
  },
  {
    id: 'p4',
    name: 'LEGO Technic Bugatti Chiron',
    image: '/lovable-uploads/9c75102e-2923-40ad-8aaf-ff7279ad2993.png',
    price: 349.99,
    rating: 4.8,
    category: 'Technic',
    badge: 'Limited Edition'
  },
  {
    id: 'p5',
    name: 'LEGO Harry Potter Hogwarts Castle',
    image: '/lovable-uploads/fbc358a3-bb7b-4fe9-aba6-e1d0b71a13a0.png',
    price: 399.99,
    rating: 4.9,
    category: 'Harry Potter'
  },
  {
    id: 'p6',
    name: 'LEGO Batman Batmobile',
    image: '/lovable-uploads/fbc358a3-bb7b-4fe9-aba6-e1d0b71a13a0.png',
    price: 99.99,
    rating: 4.6,
    category: 'Superheroes',
    badge: 'Sale'
  }
];

// Double the products array for smoother infinite scrolling
const extendedProducts = [...featuredProducts, ...featuredProducts];

const FeaturedProducts: React.FC = () => {
  const [wishlist, setWishlist] = useState<string[]>([]);

  const toggleWishlist = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
      toast({
        title: "Removed from wishlist",
        description: "Product has been removed from your wishlist",
      });
    } else {
      setWishlist([...wishlist, productId]);
      toast({
        title: "Added to wishlist",
        description: "Product has been added to your wishlist",
      });
    }
  };

  const addToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    // This would integrate with your cart system
    console.log('Adding to cart:', product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-darkBlue mb-2">
              Featured Products
            </h2>
            <p className="text-gray-600">
              Our most popular and trending products
            </p>
          </div>
        </div>
        
        <AutoCarousel 
          speed={30} 
          direction="left"
          fadeEdges={true}
          className="after:from-gray-50 before:from-gray-50 py-4 mb-12"
        >
          {extendedProducts.map((product, index) => (
            <div 
              key={`${product.id}-${index}`}
              className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 pl-4 pr-4"
            >
              <div className="bg-white rounded-lg overflow-hidden shadow-md group card-hover h-full">
                <div className="relative">
                  <Link to={`/product/${product.id}`} className="block aspect-square overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                  <button
                    onClick={(e) => toggleWishlist(e, product.id)}
                    className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-brand-orange hover:text-white transition-colors"
                  >
                    <Heart 
                      size={18} 
                      className={wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : ''} 
                    />
                  </button>
                  {product.badge && (
                    <span className={`absolute top-4 left-4 px-2 py-1 text-xs font-semibold rounded-full 
                      ${product.badge === 'New' ? 'bg-green-500 text-white' : 
                        product.badge === 'Bestseller' ? 'bg-brand-purple text-white' : 
                        product.badge === 'Sale' ? 'bg-red-500 text-white' : 
                        'bg-brand-orange text-white'}`
                    }>
                      {product.badge}
                    </span>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex items-center gap-1 mb-2">
                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-sm text-gray-700">{product.rating}</span>
                    <span className="text-xs text-gray-400 ml-1">(120)</span>
                    <span className="text-xs text-gray-500 ml-auto">{product.category}</span>
                  </div>
                  
                  <Link to={`/product/${product.id}`} className="block">
                    <h3 className="font-semibold text-brand-darkBlue hover:text-brand-orange transition-colors mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <div className="flex justify-between items-center mt-4">
                    <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                    <Button
                      onClick={(e) => addToCart(e, product)}
                      size="sm"
                      className="bg-brand-darkBlue hover:bg-brand-orange text-white transition-colors flex items-center gap-2"
                    >
                      <ShoppingCart size={16} />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </AutoCarousel>
        
        <div className="flex justify-center">
          <Link 
            to="/products" 
            className="btn-outline flex items-center gap-2 group"
          >
            View All Products
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
