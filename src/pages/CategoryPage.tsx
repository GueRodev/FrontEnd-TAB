
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Sliders, List, Grid, FilterX } from 'lucide-react';
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
        {/* Category Hero */}
        <div className="bg-gray-100 py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-full md:w-1/2">
                <div className="breadcrumbs text-sm mb-4">
                  <ul className="flex items-center gap-2">
                    <li><Link to="/" className="text-gray-500 hover:text-brand-orange transition-colors">Inicio</Link></li>
                    <ChevronRight size={14} className="text-gray-400" />
                    <li><span className="text-brand-darkBlue font-medium">{categoryData?.name || 'Categoría'}</span></li>
                  </ul>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-display font-bold text-brand-darkBlue mb-4">
                  {categoryData?.name || 'Categoría'}
                </h1>
                <p className="text-gray-600 mb-6">
                  {categoryData?.description || 'Explora nuestra colección de productos.'}
                </p>
              </div>
              
              <div className="w-full md:w-1/2">
                <img 
                  src={categoryData?.image || '/placeholder.svg'} 
                  alt={categoryData?.name || 'Category'} 
                  className="max-h-64 object-contain mx-auto"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Filter and Product Area */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-1/4">
              <div className="bg-white border rounded-lg p-4 sticky top-24">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Sliders size={18} /> Filtros
                  </h3>
                  <button className="text-sm text-gray-500 hover:text-brand-orange transition-colors flex items-center gap-1">
                    <FilterX size={16} /> Limpiar Todo
                  </button>
                </div>
                
                {/* Filter components would go here */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Rango de Precio</h4>
                    <div className="flex items-center gap-2">
                      <input type="range" min="0" max="100" className="w-full" />
                    </div>
                    <div className="flex justify-between mt-2 text-sm text-gray-600">
                      <span>$0</span>
                      <span>$500</span>
                    </div>
                  </div>
                  
                  
                  <div>
                    <h4 className="font-medium mb-2">Marca</h4>
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <input type="checkbox" id="brand1" className="mr-2" />
                        <label htmlFor="brand1" className="text-gray-600">LEGO</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="brand2" className="mr-2" />
                        <label htmlFor="brand2" className="text-gray-600">Hasbro</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="brand3" className="mr-2" />
                        <label htmlFor="brand3" className="text-gray-600">Funko</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="brand4" className="mr-2" />
                        <label htmlFor="brand4" className="text-gray-600">Mattel</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Products */}
            <div className="w-full md:w-3/4">
              <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <div>
                  <p className="text-gray-600">Mostrando 1-12 de 48 productos</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 text-sm">Ver:</span>
                    <button className="p-1.5 rounded hover:bg-gray-100 text-brand-orange">
                      <Grid size={20} />
                    </button>
                    <button className="p-1.5 rounded hover:bg-gray-100 text-gray-600">
                      <List size={20} />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 text-sm">Ordenar por:</span>
                    <select className="border rounded-md py-1 px-2 text-sm">
                      <option>Destacados</option>
                      <option>Precio: Menor a Mayor</option>
                      <option>Precio: Mayor a Menor</option>
                      <option>Más Nuevos</option>
                      <option>Más Vendidos</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
