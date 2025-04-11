
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  variant?: 'default' | 'white' | 'small';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ variant = 'default', className = '' }) => {
  const getLogoClasses = () => {
    switch (variant) {
      case 'white':
        return 'text-white';
      case 'small':
        return 'text-brand-darkBlue text-xl';
      default:
        return 'text-brand-darkBlue';
    }
  };

  return (
    <Link 
      to="/" 
      className={`flex items-center gap-2 transition-transform hover:scale-105 ${getLogoClasses()} ${className}`}
    >
      <div className="relative w-10 h-10 rounded-md overflow-hidden bg-brand-darkBlue flex items-center justify-center border-2 border-white">
        <div className="absolute top-1 w-4 h-1 bg-brand-darkBlue rounded-full border border-white"></div>
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
        <div className="absolute bottom-1 flex space-x-[2px]">
          <div className="w-1 h-1 bg-brand-orange"></div>
          <div className="w-1 h-1 bg-brand-orange"></div>
          <div className="w-1 h-1 bg-brand-orange"></div>
        </div>
      </div>
      <div className="font-display font-bold leading-none">
        <span className="block text-brand-darkBlue text-xl md:text-2xl">TOYS <span className="text-brand-yellow">AND</span></span>
        <span className="block text-brand-orange text-xl md:text-2xl">BRICKS</span>
      </div>
    </Link>
  );
};

export default Logo;
