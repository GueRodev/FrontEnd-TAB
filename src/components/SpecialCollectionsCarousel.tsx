import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { AutoCarousel } from '@/components/ui/auto-carousel';

interface CollectionItem {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  linkText: string;
  bgColor: string;
  textColor: string;
}

const collections: CollectionItem[] = [
  {
    id: 'limited-edition',
    title: 'Limited Edition Collections',
    description: 'Discover rare and exclusive LEGO sets and collectibles before they\'re gone.',
    image: '/lovable-uploads/17088b0e-dee8-4716-b76d-00be5a07559d.png',
    link: '/limited-edition',
    linkText: 'View Collection',
    bgColor: 'bg-brand-purple/10',
    textColor: 'text-brand-purple'
  },
  {
    id: 'just-arrived',
    title: 'Just Arrived',
    description: 'Be the first to explore our latest additions to the collection.',
    image: '/lovable-uploads/51190e3f-2193-4b2a-85ac-e5453680e7bf.png',
    link: '/new-arrivals',
    linkText: 'Shop New Arrivals',
    bgColor: 'bg-brand-orange/10',
    textColor: 'text-brand-orange'
  }
];

const SpecialCollectionsCarousel: React.FC = () => {
  return (
    <div className="mt-12">
      <AutoCarousel
        speed={30}
        direction="left"
        pauseOnHover={true}
        fadeEdges={true}
        className="w-full"
      >
        {collections.map((collection) => (
          <div key={collection.id} className="flex-shrink-0 w-[500px] mr-6">
            <div className={`${collection.bgColor} rounded-lg p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 h-full`}>
              <div className="w-24 h-24 rounded-full bg-white shadow-md flex items-center justify-center flex-shrink-0">
                <img 
                  src={collection.image} 
                  alt={collection.title}
                  className="w-16 h-16 object-contain"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-brand-darkBlue mb-2">{collection.title}</h3>
                <p className="text-gray-600 mb-4">{collection.description}</p>
                <Link to={collection.link} className={`${collection.textColor} font-semibold flex items-center hover:underline`}>
                  {collection.linkText}
                  <ChevronRight size={18} className="ml-2" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </AutoCarousel>
    </div>
  );
};

export default SpecialCollectionsCarousel;