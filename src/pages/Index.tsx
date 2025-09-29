
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import CategorySection from '@/components/CategorySection';
import FeaturedProducts from '@/components/FeaturedProducts';
import PromotionalBanner from '@/components/PromotionalBanner';
import NewsletterSignup from '@/components/NewsletterSignup';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <CategorySection />
        <FeaturedProducts />
        <PromotionalBanner />
        <NewsletterSignup />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
