
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import SpecialCollectionsCarousel from './SpecialCollectionsCarousel';

interface Category {
  id: string;
  name: string;
  image: string;
  description: string;
  link: string;
}

const categories: Category[] = [
  {
    id: 'lego',
    name: 'Lego',
    image: '/lovable-uploads/51190e3f-2193-4b2a-85ac-e5453680e7bf.png',
    description: 'Explora nuestra vasta colección de sets LEGO para todas las edades.',
    link: '/category/lego'
  },
  {
    id: 'funkos',
    name: 'Funkos',
    image: '/lovable-uploads/fbc358a3-bb7b-4fe9-aba6-e1d0b71a13a0.png',
    description: 'Descubre figuras Funko Pop de tus personajes favoritos.',
    link: '/category/funkos'
  },
  {
    id: 'anime',
    name: 'Anime',
    image: '/lovable-uploads/17088b0e-dee8-4716-b76d-00be5a07559d.png',
    description: 'Figuras y merchandising de tus series de anime favoritas.',
    link: '/category/anime'
  },
  {
    id: 'coleccionables',
    name: 'Coleccionables',
    image: '/lovable-uploads/51190e3f-2193-4b2a-85ac-e5453680e7bf.png',
    description: 'Artículos únicos y ediciones limitadas para coleccionistas.',
    link: '/category/coleccionables'
  },
  {
    id: 'peluches',
    name: 'Peluches',
    image: '/lovable-uploads/fbc358a3-bb7b-4fe9-aba6-e1d0b71a13a0.png',
    description: 'Peluches suaves y adorables de todas tus franquicias favoritas.',
    link: '/category/peluches'
  },
  {
    id: 'starwars',
    name: 'Starwars',
    image: '/lovable-uploads/17088b0e-dee8-4716-b76d-00be5a07559d.png',
    description: 'Únete a la fuerza con nuestro merchandising premium de Star Wars.',
    link: '/category/starwars'
  },
  {
    id: 'harrypotter',
    name: 'HarryPotter',
    image: '/lovable-uploads/51190e3f-2193-4b2a-85ac-e5453680e7bf.png',
    description: 'Artículos mágicos del mundo de Harry Potter.',
    link: '/category/harrypotter'
  },
  {
    id: 'otros',
    name: 'Otros',
    image: '/lovable-uploads/fbc358a3-bb7b-4fe9-aba6-e1d0b71a13a0.png',
    description: 'Descubre más productos únicos y especiales.',
    link: '/category/otros'
  }
];

const CategorySection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-darkBlue mb-4">
            Shop by Category
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse our extensive collection of toys and collectibles across various categories
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link 
              to={category.link}
              key={category.id}
              className="bg-white rounded-lg overflow-hidden shadow-md group hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70"></div>
                <h3 className="absolute bottom-4 left-4 text-white text-xl md:text-2xl font-bold drop-shadow-md">
                  {category.name}
                </h3>
              </div>
              <div className="p-4">
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="flex items-center text-brand-orange font-semibold group-hover:text-brand-darkBlue transition-colors">
                  Explore Collection
                  <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <SpecialCollectionsCarousel />
      </div>
    </section>
  );
};

export default CategorySection;
