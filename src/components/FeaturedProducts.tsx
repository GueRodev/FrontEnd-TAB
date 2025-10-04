
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useWishlist } from '@/contexts/WishlistContext';
import ProductCard from './ProductCard';

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
    category: 'Starwars'
  },
  {
    id: 'p3',
    name: 'LEGO City Space Station',
    image: '/lovable-uploads/51190e3f-2193-4b2a-85ac-e5453680e7bf.png',
    price: 69.99,
    rating: 4.5,
    category: 'Lego Sets'
  },
  {
    id: 'p5',
    name: 'LEGO Harry Potter Hogwarts Castle',
    image: '/lovable-uploads/fbc358a3-bb7b-4fe9-aba6-e1d0b71a13a0.png',
    price: 399.99,
    rating: 4.9,
    category: 'HarryPotter'
  },
  {
    id: 'p6',
    name: 'LEGO Batman Batmobile',
    image: '/lovable-uploads/fbc358a3-bb7b-4fe9-aba6-e1d0b71a13a0.png',
    price: 99.99,
    rating: 4.6,
    category: 'Coleccionables'
  }
];

const FeaturedProducts: React.FC = () => {
  const { isInWishlist, toggleWishlist } = useWishlist();

  const handleToggleWishlist = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const product = featuredProducts.find(p => p.id === productId);
    if (product) {
      toggleWishlist(product);
    }
  };

  const addToCart = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const product = featuredProducts.find(p => p.id === productId);
    toast({
      title: "Agregado al carrito",
      description: `${product?.name} ha sido agregado a tu carrito`,
    });
  };

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
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              image={product.image}
              price={product.price}
              category={product.category}
              isWishlisted={isInWishlist(product.id)}
              onToggleWishlist={handleToggleWishlist}
              onAddToCart={addToCart}
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
