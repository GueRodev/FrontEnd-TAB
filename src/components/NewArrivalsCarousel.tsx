import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { AutoCarousel } from "@/components/ui/auto-carousel";

interface NewProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  series: string;
  category: string;
  rating: number;
  daysNew: number;
}

const newProducts: NewProduct[] = [
  {
    id: 'n1',
    name: 'Green Alien',
    image: '/lovable-uploads/6237f778-638a-4442-88e7-9d9cbf6b1807.png',
    price: 19.99,
    series: 'Serie 16 lego',
    category: 'Minifigures',
    rating: 4.7,
    daysNew: 3
  },
  {
    id: 'n2',
    name: 'Accordion Player',
    image: '/lovable-uploads/44be4b8e-5655-47bf-9e53-1599c313f2d9.png',
    price: 14.99,
    series: 'Serie 17 lego',
    category: 'Minifigures',
    rating: 4.5,
    daysNew: 5
  },
  {
    id: 'n3',
    name: 'The Riddler',
    image: '/lovable-uploads/6a58403f-3c43-4cc6-bace-c4e441cc5e7a.png',
    price: 24.99,
    series: 'Batman 2 lego',
    category: 'Superheroes',
    rating: 4.9,
    daysNew: 2
  },
  {
    id: 'n4',
    name: 'The Joker',
    image: '/lovable-uploads/4e819246-4502-40c9-895a-670ae4e45001.png',
    price: 24.99,
    series: 'Batman 2 lego',
    category: 'Superheroes',
    rating: 4.8,
    daysNew: 2
  },
  {
    id: 'n5',
    name: 'Batsuit',
    image: '/lovable-uploads/a18eaddb-fc3b-4820-acc1-8edd4c93c7ae.png',
    price: 29.99,
    series: 'Batman 2 lego',
    category: 'Superheroes',
    rating: 5.0,
    daysNew: 1
  },
  {
    id: 'n6',
    name: 'Emmet',
    image: '/lovable-uploads/c59becb2-b812-4238-8ab5-1255896bea17.png',
    price: 17.99,
    series: 'Lego Movie 1',
    category: 'Minifigures',
    rating: 4.6,
    daysNew: 7
  },
  {
    id: 'n7',
    name: 'Barista',
    image: '/lovable-uploads/e5422192-ab1f-4066-b91a-c67c980d7093.png',
    price: 12.99,
    series: 'Lego Movie 1',
    category: 'Minifigures',
    rating: 4.3,
    daysNew: 6
  },
  {
    id: 'n8',
    name: 'City Worker',
    image: '/lovable-uploads/20e7b4d1-8de9-4d15-8c46-7ea22799b55f.png',
    price: 12.99,
    series: 'Lego Movie 1',
    category: 'Minifigures',
    rating: 4.4,
    daysNew: 4
  }
];

const extendedProducts = [...newProducts, ...newProducts];

const NewArrivalsCarousel: React.FC = () => {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [visibleProducts, setVisibleProducts] = useState<NewProduct[]>([]);
  
  useEffect(() => {
    // Simulate products being loaded gradually for animation effect
    const timer = setTimeout(() => {
      setVisibleProducts(extendedProducts);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

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

  const addToCart = (e: React.MouseEvent, product: NewProduct) => {
    e.preventDefault();
    e.stopPropagation();
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  return (
    <section className="py-16 bg-[#FFF8F0]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="w-full md:w-1/3 flex flex-col justify-center">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-darkBlue mb-3">
                Just Arrived
              </h2>
              <p className="text-gray-600 mb-6">
                Be the first to explore our latest additions to the collection.
              </p>
              <Link 
                to="/new-arrivals"
                className="text-brand-orange font-semibold flex items-center gap-1 group hover:text-orange-700 transition-colors"
              >
                Shop New Arrivals
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
          
          <div className="w-full md:w-2/3">
            <AutoCarousel 
              speed={40}
              direction="right" 
              fadeEdges={true}
              className="after:from-[#FFF8F0] before:from-[#FFF8F0] py-4"
            >
              {visibleProducts.map((product, index) => (
                <div 
                  key={`${product.id}-${index}`}
                  className="flex-shrink-0 w-full sm:w-1/2 md:w-1/2 lg:w-1/3 pl-4 pr-4"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <Link 
                    to={`/product/${product.id}`}
                    className="block"
                  >
                    <div className="bg-white rounded-xl overflow-hidden shadow-md group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg h-full">
                      <div className="relative h-52">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover object-center transform transition-transform group-hover:scale-105 duration-300"
                        />
                        <Badge className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-brand-orange text-white">NEW</Badge>
                        <button
                          onClick={(e) => toggleWishlist(e, product.id)}
                          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-brand-orange hover:text-white transition-colors"
                        >
                          <Heart 
                            size={16} 
                            className={wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : ''} 
                          />
                        </button>
                      </div>
                      
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-medium text-gray-500">{product.series}</span>
                          <div className="flex items-center gap-1">
                            <Star size={12} className="text-yellow-400 fill-yellow-400" />
                            <span className="text-xs font-medium">{product.rating}</span>
                          </div>
                        </div>
                        
                        <h3 className="font-semibold text-brand-darkBlue hover:text-brand-orange transition-colors mb-2 line-clamp-1">
                          {product.name}
                        </h3>
                        
                        <div className="flex justify-between items-center mt-4">
                          <span className="font-bold text-brand-darkBlue">${product.price.toFixed(2)}</span>
                          <Button
                            onClick={(e) => addToCart(e, product)}
                            size="sm"
                            className="bg-brand-darkBlue hover:bg-brand-orange text-white transition-colors"
                          >
                            <ShoppingCart size={14} className="mr-1" />
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </AutoCarousel>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewArrivalsCarousel;
