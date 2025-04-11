
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const PromotionalBanner: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-brand-darkBlue to-brand-purple text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Join Our Collectors Club</h2>
            <p className="text-white/80 text-lg mb-6">
              Get exclusive access to limited edition sets, early releases, and special member-only discounts.
            </p>
            <ul className="mb-8 space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-brand-orange flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span>Early access to new releases</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-brand-orange flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span>Member-only exclusive sets</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-brand-orange flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span>Special discounts and promotions</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-brand-orange flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span>Free shipping on all orders</span>
              </li>
            </ul>
            <Link
              to="/join-club"
              className="bg-brand-orange hover:bg-opacity-90 transition-all text-white px-6 py-3 rounded-md font-semibold inline-flex items-center gap-2 group"
            >
              Join Now
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="order-1 lg:order-2 relative">
            <div className="relative mx-auto max-w-md">
              <div className="absolute inset-0 bg-brand-orange opacity-20 blur-3xl rounded-full"></div>
              <img 
                src="/lovable-uploads/fbc358a3-bb7b-4fe9-aba6-e1d0b71a13a0.png" 
                alt="Exclusive Collections"
                className="relative z-10 mx-auto animate-float"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromotionalBanner;
