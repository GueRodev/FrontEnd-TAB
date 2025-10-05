
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24 relative overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -right-24 -top-24 w-64 h-64 rounded-full bg-brand-orange opacity-10"></div>
        <div className="absolute left-1/3 top-1/3 w-32 h-32 rounded-full bg-brand-purple opacity-10"></div>
        <div className="absolute right-1/4 bottom-1/4 w-48 h-48 rounded-full bg-brand-skyBlue opacity-10"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="text-center lg:text-left order-2 lg:order-1">
            {/* Content area cleared for future changes */}
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
