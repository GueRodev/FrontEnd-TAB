
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import CategorySection from '@/components/CategorySection';
import FeaturedProducts from '@/components/FeaturedProducts';
import NewArrivalsCarousel from '@/components/NewArrivalsCarousel';
import PromotionalBanner from '@/components/PromotionalBanner';
import Testimonials from '@/components/Testimonials';
import NewsletterSignup from '@/components/NewsletterSignup';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <CategorySection />
        <NewArrivalsCarousel />
        <FeaturedProducts />
        <PromotionalBanner />
        <Testimonials />
        <NewsletterSignup />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
