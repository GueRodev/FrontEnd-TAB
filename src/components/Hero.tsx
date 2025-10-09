/**
 * Hero Component
 * 
 * @next-migration: Server Component compatible
 * - No client interactivity (no state, no events)
 * - Can be rendered on server for better SEO
 * - Hero content can come from CMS or siteConfig
 * 
 * Perfect candidate for Server Component in Next.js
 */

import React from 'react';
import DecorativeBackground from './DecorativeBackground';

const Hero: React.FC = () => {
  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24 relative overflow-hidden bg-gradient-to-b from-brand-yellow to-white">
      <DecorativeBackground />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="text-center lg:text-left order-2 lg:order-1">
            {/* Content area cleared for future changes */}
          </div>
          
          <div className="order-1 lg:order-2 relative flex justify-center">
            {/* Image area cleared */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
