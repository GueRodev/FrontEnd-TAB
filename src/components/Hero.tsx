
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24 relative overflow-hidden bg-gradient-to-b from-brand-yellow to-white">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -right-24 -top-24 w-64 h-64 rounded-full bg-brand-orange opacity-10"></div>
        <div className="absolute left-1/3 top-1/3 w-32 h-32 rounded-full bg-brand-purple opacity-10"></div>
        <div className="absolute right-1/4 bottom-1/4 w-48 h-48 rounded-full bg-brand-skyBlue opacity-10"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="text-center lg:text-left order-2 lg:order-1">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              <span className="block text-brand-darkBlue">Build Your</span>
              <span className="block text-brand-orange mt-2">Imagination</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-xl mx-auto lg:mx-0">
              Discover our latest collection of LEGO sets, Star Wars merchandise, 
              and superhero figurines. Start building your dream world today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/category/featured" className="btn-primary flex items-center justify-center gap-2 group">
                Shop Featured
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/category/new-arrivals" className="btn-outline flex items-center justify-center gap-2 group">
                New Arrivals
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="mt-8 bg-white/60 backdrop-blur-sm p-4 rounded-lg shadow-sm flex flex-col md:flex-row gap-4 justify-around items-center">
              <div className="text-center">
                <span className="block text-brand-darkBlue font-bold text-xl">10,000+</span>
                <span className="text-gray-600">Products</span>
              </div>
              <div className="h-10 w-px bg-gray-200 hidden md:block"></div>
              <div className="text-center">
                <span className="block text-brand-darkBlue font-bold text-xl">50+</span>
                <span className="text-gray-600">Brands</span>
              </div>
              <div className="h-10 w-px bg-gray-200 hidden md:block"></div>
              <div className="text-center">
                <span className="block text-brand-darkBlue font-bold text-xl">Free</span>
                <span className="text-gray-600">Shipping*</span>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 relative flex justify-center">
            <img 
              src="/lovable-uploads/17088b0e-dee8-4716-b76d-00be5a07559d.png" 
              alt="LEGO Figurines" 
              className="max-w-xs md:max-w-md mx-auto object-contain animate-float"
            />
            <div className="absolute w-full h-full rounded-full bg-gradient-radial from-white/80 to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
