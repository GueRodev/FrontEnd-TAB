
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-brand-yellow to-white relative overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-brand-orange opacity-20"></div>
        <div className="absolute left-1/4 top-1/4 w-64 h-64 rounded-full bg-brand-purple opacity-20"></div>
        <div className="absolute right-1/3 bottom-1/3 w-80 h-80 rounded-full bg-brand-skyBlue opacity-20"></div>
        <div className="absolute left-10 bottom-20 w-48 h-48 rounded-full bg-brand-orange opacity-15"></div>
        <div className="absolute right-10 top-1/2 w-56 h-56 rounded-full bg-brand-purple opacity-15"></div>
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
