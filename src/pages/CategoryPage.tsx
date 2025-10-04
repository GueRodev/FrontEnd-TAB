
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
    'peluches': {
      name: 'Peluches',
      description: 'Descubre nuestra adorable colección de peluches para todas las edades.',
      image: '/lovable-uploads/fbc358a3-bb7b-4fe9-aba6-e1d0b71a13a0.png'
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
    'otros': {
      name: 'Otros',
      description: 'Explora nuestra variada selección de productos únicos y especiales.',
      image: '/lovable-uploads/17088b0e-dee8-4716-b76d-00be5a07559d.png'
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
        {/* Breadcrumb */}
        <div className="bg-brand-darkBlue text-white py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 text-sm uppercase font-semibold">
              <Link to="/" className="hover:text-brand-orange transition-colors">
                INICIO
              </Link>
              <span>/</span>
              <span>{categoryData?.name?.toUpperCase() || 'CATEGORÍA'}</span>
            </div>
          </div>
        </div>

        {/* Category Header */}
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-brand-darkBlue mb-2">
            {categoryData?.name || 'Categoría'}
          </h1>
          <p className="text-gray-600">
            {categoryData?.description || 'Explora nuestra colección de productos.'}
          </p>
        </div>

        {/* Product Area */}
        <div className="container mx-auto px-4 py-8">
          <div className="w-full">
            {/* Products */}
            <div className="w-full">
              {/* Products will be added here */}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default CategoryPage;
