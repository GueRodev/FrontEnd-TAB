
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-brand-yellow to-white relative overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Círculos decorativos grandes y suaves estilo pastel */}
        <div className="absolute -left-20 top-20 w-80 h-80 rounded-full bg-purple-200 opacity-30 blur-3xl"></div>
        <div className="absolute right-1/4 top-10 w-96 h-96 rounded-full bg-orange-100 opacity-35 blur-3xl"></div>
        <div className="absolute left-1/3 top-1/4 w-[500px] h-[500px] rounded-full bg-cyan-100 opacity-30 blur-3xl"></div>
        
        <div className="absolute right-10 top-1/3 w-72 h-72 rounded-full bg-purple-100 opacity-25 blur-3xl"></div>
        <div className="absolute left-1/4 bottom-1/3 w-96 h-96 rounded-full bg-orange-100 opacity-30 blur-3xl"></div>
        <div className="absolute right-1/3 bottom-1/4 w-80 h-80 rounded-full bg-cyan-200 opacity-35 blur-3xl"></div>
        
        <div className="absolute -right-20 bottom-20 w-[450px] h-[450px] rounded-full bg-purple-200 opacity-30 blur-3xl"></div>
        <div className="absolute left-10 bottom-10 w-72 h-72 rounded-full bg-orange-50 opacity-40 blur-3xl"></div>
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
