
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ShoppingCart, Heart, Sliders, List, Grid, FilterX } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  
  // This would come from your API based on the category
  const categoryData = {
    'lego': {
      name: 'LEGO Sets',
      description: 'Explore our extensive collection of LEGO sets for all ages and interests.',
      image: '/lovable-uploads/51190e3f-2193-4b2a-85ac-e5453680e7bf.png'
    },
    'star-wars': {
      name: 'Star Wars',
      description: 'Discover the best Star Wars merchandise and collectibles for fans of all ages.',
      image: '/lovable-uploads/9c75102e-2923-40ad-8aaf-ff7279ad2993.png'
    },
    'superheroes': {
      name: 'Superheroes',
      description: 'Find your favorite superhero action figures and sets from Marvel, DC, and more.',
      image: '/lovable-uploads/fbc358a3-bb7b-4fe9-aba6-e1d0b71a13a0.png'
    },
    'collectibles': {
      name: 'Collectibles',
      description: 'Browse our premium collectibles for dedicated fans and collectors.',
      image: '/lovable-uploads/17088b0e-dee8-4716-b76d-00be5a07559d.png'
    },
    'new-arrivals': {
      name: 'New Arrivals',
      description: 'Be the first to explore our latest additions to the collection.',
      image: '/lovable-uploads/51190e3f-2193-4b2a-85ac-e5453680e7bf.png'
    },
    'on-sale': {
      name: 'On Sale',
      description: 'Great deals on top products. Limited time offers.',
      image: '/lovable-uploads/9c75102e-2923-40ad-8aaf-ff7279ad2993.png'
    },
  }[category || 'lego'];

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
                    <li><Link to="/" className="text-gray-500 hover:text-brand-orange transition-colors">Home</Link></li>
                    <ChevronRight size={14} className="text-gray-400" />
                    <li><span className="text-brand-darkBlue font-medium">{categoryData?.name || 'Category'}</span></li>
                  </ul>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-display font-bold text-brand-darkBlue mb-4">
                  {categoryData?.name || 'Category'}
                </h1>
                <p className="text-gray-600 mb-6">
                  {categoryData?.description || 'Browse our collection of products.'}
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
                    <Sliders size={18} /> Filters
                  </h3>
                  <button className="text-sm text-gray-500 hover:text-brand-orange transition-colors flex items-center gap-1">
                    <FilterX size={16} /> Clear All
                  </button>
                </div>
                
                {/* Filter components would go here */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Price Range</h4>
                    <div className="flex items-center gap-2">
                      <input type="range" min="0" max="100" className="w-full" />
                    </div>
                    <div className="flex justify-between mt-2 text-sm text-gray-600">
                      <span>$0</span>
                      <span>$500</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Age Range</h4>
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <input type="checkbox" id="age1" className="mr-2" />
                        <label htmlFor="age1" className="text-gray-600">0-3 years</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="age2" className="mr-2" />
                        <label htmlFor="age2" className="text-gray-600">4-6 years</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="age3" className="mr-2" />
                        <label htmlFor="age3" className="text-gray-600">7-12 years</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="age4" className="mr-2" />
                        <label htmlFor="age4" className="text-gray-600">13+ years</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="age5" className="mr-2" />
                        <label htmlFor="age5" className="text-gray-600">Adults</label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Brand</h4>
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
                  <p className="text-gray-600">Showing 1-12 of 48 products</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 text-sm">View:</span>
                    <button className="p-1.5 rounded hover:bg-gray-100 text-brand-orange">
                      <Grid size={20} />
                    </button>
                    <button className="p-1.5 rounded hover:bg-gray-100 text-gray-600">
                      <List size={20} />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 text-sm">Sort by:</span>
                    <select className="border rounded-md py-1 px-2 text-sm">
                      <option>Featured</option>
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                      <option>Newest</option>
                      <option>Best Selling</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* This would be populated with actual products */}
                {Array.from({ length: 9 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md group card-hover">
                    <div className="relative">
                      <Link to={`/product/sample-${index}`} className="block aspect-square overflow-hidden">
                        <img 
                          src={index % 3 === 0 ? '/lovable-uploads/51190e3f-2193-4b2a-85ac-e5453680e7bf.png' : 
                               index % 3 === 1 ? '/lovable-uploads/9c75102e-2923-40ad-8aaf-ff7279ad2993.png' : 
                               '/lovable-uploads/fbc358a3-bb7b-4fe9-aba6-e1d0b71a13a0.png'} 
                          alt="Product"
                          className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                        />
                      </Link>
                      <button
                        className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-brand-orange hover:text-white transition-colors"
                      >
                        <Heart size={18} />
                      </button>
                      {index % 4 === 0 && (
                        <span className="absolute top-4 left-4 px-2 py-1 text-xs font-semibold rounded-full bg-green-500 text-white">
                          New
                        </span>
                      )}
                      {index % 5 === 0 && (
                        <span className="absolute top-4 left-4 px-2 py-1 text-xs font-semibold rounded-full bg-red-500 text-white">
                          Sale
                        </span>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <Link to={`/product/sample-${index}`} className="block">
                        <h3 className="font-semibold text-brand-darkBlue hover:text-brand-orange transition-colors mb-2 line-clamp-2">
                          {index % 3 === 0 ? 'LEGO Star Wars X-Wing Fighter' : 
                           index % 3 === 1 ? 'Marvel Avengers Iron Man Action Figure' : 
                           'DC Comics Batman Batmobile'}
                        </h3>
                      </Link>
                      
                      <div className="flex justify-between items-center mt-4">
                        <span className="font-bold text-lg">${(29.99 + index * 10).toFixed(2)}</span>
                        <button className="bg-brand-darkBlue hover:bg-brand-orange text-white transition-colors flex items-center gap-2 py-1 px-3 rounded">
                          <ShoppingCart size={16} />
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
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
