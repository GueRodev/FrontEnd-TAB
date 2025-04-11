
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

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
    name: 'LEGO Sets',
    image: '/lovable-uploads/51190e3f-2193-4b2a-85ac-e5453680e7bf.png',
    description: 'Explore our vast collection of LEGO sets for all ages and interests.',
    link: '/category/lego'
  },
  {
    id: 'star-wars',
    name: 'Star Wars',
    image: '/lovable-uploads/9c75102e-2923-40ad-8aaf-ff7279ad2993.png',
    description: 'Join the force with our premium Star Wars merchandise and collectibles.',
    link: '/category/star-wars'
  },
  {
    id: 'superhero',
    name: 'Superheroes',
    image: '/lovable-uploads/fbc358a3-bb7b-4fe9-aba6-e1d0b71a13a0.png',
    description: 'Discover action figures and sets from Marvel, DC, and more.',
    link: '/category/superheroes'
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
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-brand-purple/10 rounded-lg p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-white shadow-md flex items-center justify-center flex-shrink-0">
              <img 
                src="/lovable-uploads/17088b0e-dee8-4716-b76d-00be5a07559d.png" 
                alt="Limited Edition"
                className="w-16 h-16 object-contain"
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-brand-darkBlue mb-2">Limited Edition Collections</h3>
              <p className="text-gray-600 mb-4">Discover rare and exclusive LEGO sets and collectibles before they're gone.</p>
              <Link to="/limited-edition" className="text-brand-purple font-semibold flex items-center hover:underline">
                View Collection
                <ChevronRight size={18} className="ml-2" />
              </Link>
            </div>
          </div>
          
          <div className="bg-brand-orange/10 rounded-lg p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-white shadow-md flex items-center justify-center flex-shrink-0">
              <img 
                src="/lovable-uploads/51190e3f-2193-4b2a-85ac-e5453680e7bf.png" 
                alt="New Arrivals"
                className="w-16 h-16 object-contain"
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-brand-darkBlue mb-2">Just Arrived</h3>
              <p className="text-gray-600 mb-4">Be the first to explore our latest additions to the collection.</p>
              <Link to="/new-arrivals" className="text-brand-orange font-semibold flex items-center hover:underline">
                Shop New Arrivals
                <ChevronRight size={18} className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
