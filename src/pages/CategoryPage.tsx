
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [wishlist, setWishlist] = useState<string[]>([]);
  
  // This would come from your API based on the category
  const categoryData = {
    'lego': {
      name: 'Sets LEGO',
      description: 'Explora nuestra extensa colección de sets LEGO para todas las edades e intereses.',
      image: '/lovable-uploads/51190e3f-2193-4b2a-85ac-e5453680e7bf.png'
    },
    'funkos': {
      name: 'Funkos',
      description: 'Descubre nuestra colección de Funko Pop de todas tus series y películas favoritas.',
      image: '/lovable-uploads/51190e3f-2193-4b2a-85ac-e5453680e7bf.png'
    },
    'anime': {
      name: 'Anime',
      description: 'Encuentra figuras y coleccionables de tus animes favoritos.',
      image: '/lovable-uploads/9c75102e-2923-40ad-8aaf-ff7279ad2993.png'
    },
    'coleccionables': {
      name: 'Coleccionables',
      description: 'Explora nuestros coleccionables premium para fanáticos y coleccionistas dedicados.',
      image: '/lovable-uploads/17088b0e-dee8-4716-b76d-00be5a07559d.png'
    },
    'starwars': {
      name: 'Star Wars',
      description: 'Descubre la mejor mercancía y coleccionables de Star Wars para fanáticos de todas las edades.',
      image: '/lovable-uploads/9c75102e-2923-40ad-8aaf-ff7279ad2993.png'
    },
    'harrypotter': {
      name: 'Harry Potter',
      description: 'Colección mágica de productos de Harry Potter.',
      image: '/lovable-uploads/fbc358a3-bb7b-4fe9-aba6-e1d0b71a13a0.png'
    },
  }[category || 'funkos'];

  const products = Array.from({ length: 9 }).map((_, index) => ({
    id: `product-${index}`,
    name: index % 3 === 0 ? 'LEGO Star Wars X-Wing Fighter' : 
         index % 3 === 1 ? 'Marvel Avengers Iron Man Action Figure' : 
         'DC Comics Batman Batmobile',
    image: index % 3 === 0 ? '/lovable-uploads/51190e3f-2193-4b2a-85ac-e5453680e7bf.png' : 
           index % 3 === 1 ? '/lovable-uploads/9c75102e-2923-40ad-8aaf-ff7279ad2993.png' : 
           '/lovable-uploads/fbc358a3-bb7b-4fe9-aba6-e1d0b71a13a0.png',
    price: 29.99 + index * 10,
    badge: (index % 4 === 0 ? 'new' : index % 5 === 0 ? 'sale' : undefined) as 'new' | 'sale' | undefined,
  }));

  const toggleWishlist = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
      toast({
        title: "Eliminado de favoritos",
        description: "El producto ha sido eliminado de tus favoritos",
      });
    } else {
      setWishlist([...wishlist, productId]);
      toast({
        title: "Agregado a favoritos",
        description: "El producto ha sido agregado a tus favoritos",
      });
    }
  };

  const addToCart = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const product = products.find(p => p.id === productId);
    toast({
      title: "Agregado al carrito",
      description: `${product?.name} ha sido agregado a tu carrito`,
    });
  };

  return (
    <>
      <Header />
      
      <main className="pt-20">
        {/* Product Area */}
        <div className="container mx-auto px-4 py-8">
          <div className="w-full">
            {/* Products */}
            <div className="w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    image={product.image}
                    price={product.price}
                    badge={product.badge}
                    isWishlisted={wishlist.includes(product.id)}
                    onToggleWishlist={toggleWishlist}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
              
              <div className="mt-10 flex justify-center">
                <div className="flex items-center space-x-2">
                  <button className="px-4 py-2 border rounded-md hover:bg-gray-100 transition-colors">
                    &laquo;
                  </button>
                  <button className="px-4 py-2 bg-brand-orange text-white rounded-md">1</button>
                  <button className="px-4 py-2 border rounded-md hover:bg-gray-100 transition-colors">2</button>
                  <button className="px-4 py-2 border rounded-md hover:bg-gray-100 transition-colors">3</button>
                  <button className="px-4 py-2 border rounded-md hover:bg-gray-100 transition-colors">
                    &raquo;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default CategoryPage;
