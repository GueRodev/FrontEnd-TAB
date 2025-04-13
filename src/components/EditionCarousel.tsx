import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { AutoCarousel } from "@/components/ui/auto-carousel";

interface EditionProduct {
  id: string;
  name: string;
  image: string;
  series: string;
  category: string;
  badgeType?: 'limited' | 'exclusive' | 'collectors';
}

const editionProducts: EditionProduct[] = [
  {
    id: 'ed1',
    name: 'Police Officer',
    image: '/lovable-uploads/48926f05-1a05-461c-9415-d32887e67d65.png',
    series: 'Lego Movie 1',
    category: 'Minifigures',
    badgeType: 'limited'
  },
  {
    id: 'ed2',
    name: 'Elephant Costume Girl',
    image: '/lovable-uploads/f6c4362b-43da-4ac0-848a-6ac26ec51d3e.png',
    series: 'Serie 18 lego',
    category: 'Minifigures',
    badgeType: 'collectors'
  },
  {
    id: 'ed3',
    name: 'Punk Warrior',
    image: '/lovable-uploads/c562f14a-386b-4f03-af10-36158ced1a09.png',
    series: 'Serie 17 lego',
    category: 'Minifigures'
  },
  {
    id: 'ed4',
    name: 'Space Officer',
    image: '/lovable-uploads/ea88d5d1-aac1-45aa-bf2d-b0e21b5b0564.png',
    series: 'Serie 16 lego',
    category: 'Minifigures',
    badgeType: 'exclusive'
  },
  {
    id: 'ed5',
    name: 'Butterfly Girl',
    image: '/lovable-uploads/2a13931b-b5c1-4cd2-b498-09e8657b25e9.png',
    series: 'Serie 17 lego',
    category: 'Minifigures',
    badgeType: 'collectors'
  },
  {
    id: 'ed6',
    name: 'Pirate Captain',
    image: '/lovable-uploads/acbe5c26-ef08-449a-8e7e-7afd174390ea.png',
    series: 'Serie 18 lego',
    category: 'Minifigures',
    badgeType: 'limited'
  }
];

const extendedProducts = [...editionProducts, ...editionProducts];

const EditionCarousel: React.FC = () => {
  return (
    <section className="py-16 bg-[#F5F3FF]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="w-full md:w-1/3 flex flex-col justify-center">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-darkBlue mb-3">
                Limited Edition Collections
              </h2>
              <p className="text-gray-600 mb-6">
                Discover rare and exclusive LEGO sets and collectibles before they're gone.
              </p>
              <Link 
                to="/limited-editions"
                className="text-purple-500 font-semibold flex items-center gap-1 group hover:text-purple-700 transition-colors"
              >
                View Collection
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
          
          <div className="w-full md:w-2/3">
            <AutoCarousel 
              speed={35} 
              direction="left"
              fadeEdges={true}
              className="after:from-[#F5F3FF] before:from-[#F5F3FF] py-4"
            >
              {extendedProducts.map((product, index) => (
                <div 
                  key={`${product.id}-${index}`} 
                  className="flex-shrink-0 w-full sm:w-1/2 md:w-1/2 lg:w-1/3 pl-4 pr-4"
                >
                  <Link to={`/product/${product.id}`}>
                    <div className="bg-white rounded-xl overflow-hidden shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg h-full">
                      <div className="relative h-64 bg-gradient-to-b from-brand-darkBlue to-purple-800 flex items-center justify-center">
                        <div className="absolute w-full h-full bg-[radial-gradient(circle,transparent_30%,rgba(0,0,0,0.3)_70%)]"></div>
                        <div className="relative w-40 h-40 flex items-center justify-center z-10">
                          <div className="absolute inset-0 bg-white rounded-full opacity-20 animate-pulse"></div>
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-32 h-32 object-contain z-10 transform transition-transform hover:scale-110 duration-300"
                          />
                        </div>
                        {product.badgeType && (
                          <Badge className={`absolute top-3 left-3 ${
                            product.badgeType === 'limited' ? 'bg-amber-500' : 
                            product.badgeType === 'exclusive' ? 'bg-purple-600' : 
                            'bg-blue-600'
                          }`}>
                            {product.badgeType === 'limited' ? 'Limited Edition' : 
                             product.badgeType === 'exclusive' ? 'Exclusive' : 
                             'Collector\'s Item'}
                          </Badge>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="text-xs font-medium text-gray-500 mb-1">{product.series}</div>
                        <h3 className="font-semibold text-lg text-brand-darkBlue mb-1">{product.name}</h3>
                        <div className="text-sm text-gray-600">{product.category}</div>
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

export default EditionCarousel;
