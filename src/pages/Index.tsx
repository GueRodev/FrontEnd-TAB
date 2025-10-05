
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-brand-yellow to-white relative overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Círculos decorativos de varios colores y tamaños */}
        <div className="absolute right-10 top-20 w-32 h-32 rounded-full bg-brand-orange opacity-15"></div>
        <div className="absolute left-20 top-40 w-24 h-24 rounded-full bg-brand-purple opacity-20"></div>
        <div className="absolute right-1/4 top-32 w-20 h-20 rounded-full bg-brand-skyBlue opacity-15"></div>
        <div className="absolute left-1/3 top-60 w-28 h-28 rounded-full bg-brand-orange opacity-12"></div>
        <div className="absolute right-1/3 top-80 w-36 h-36 rounded-full bg-brand-yellow opacity-25"></div>
        
        <div className="absolute left-10 bottom-1/3 w-24 h-24 rounded-full bg-brand-skyBlue opacity-18"></div>
        <div className="absolute right-20 bottom-1/2 w-32 h-32 rounded-full bg-brand-purple opacity-15"></div>
        <div className="absolute left-1/4 bottom-1/4 w-28 h-28 rounded-full bg-brand-orange opacity-20"></div>
        <div className="absolute right-1/4 bottom-40 w-20 h-20 rounded-full bg-brand-skyBlue opacity-15"></div>
        <div className="absolute left-1/2 bottom-60 w-24 h-24 rounded-full bg-brand-purple opacity-12"></div>
        
        <div className="absolute right-10 bottom-20 w-36 h-36 rounded-full bg-brand-orange opacity-15"></div>
        <div className="absolute left-1/3 bottom-10 w-20 h-20 rounded-full bg-brand-yellow opacity-20"></div>
        <div className="absolute right-1/3 bottom-32 w-28 h-28 rounded-full bg-brand-skyBlue opacity-18"></div>
        <div className="absolute left-1/2 top-1/3 w-32 h-32 rounded-full bg-brand-purple opacity-10"></div>
        <div className="absolute right-1/2 bottom-1/3 w-24 h-24 rounded-full bg-brand-orange opacity-18"></div>
      </div>
      <Header />
      <main className="flex-grow relative z-10">
        <Hero />
        <FeaturedProducts />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
