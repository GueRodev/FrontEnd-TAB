
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingCart, Search, User, Heart } from 'lucide-react';
import Logo from './Logo';
import { cn } from '@/lib/utils';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Handle scroll event to change header style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { name: 'LEGO Sets', href: '/category/lego' },
    { name: 'Star Wars', href: '/category/star-wars' },
    { name: 'Superheroes', href: '/category/superheroes' },
    { name: 'Collectibles', href: '/category/collectibles' },
    { name: 'New Arrivals', href: '/new-arrivals' },
    { name: 'On Sale', href: '/on-sale' },
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full",
        isScrolled 
          ? "bg-white shadow-md py-2" 
          : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Logo />
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-brand-darkBlue font-semibold hover:text-brand-orange transition-colors relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-brand-orange after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Icons */}
        <div className="hidden lg:flex items-center space-x-6">
          <button className="hover:text-brand-orange transition-colors">
            <Search size={22} />
          </button>
          <Link to="/wishlist" className="hover:text-brand-orange transition-colors relative">
            <Heart size={22} />
          </Link>
          <Link to="/account" className="hover:text-brand-orange transition-colors">
            <User size={22} />
          </Link>
          <Link to="/cart" className="hover:text-brand-orange transition-colors relative">
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-orange text-white rounded-full text-xs w-5 h-5 flex items-center justify-center animate-fade-in">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center space-x-4 lg:hidden">
          <Link to="/cart" className="relative">
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-orange text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-brand-darkBlue focus:outline-none"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white shadow-lg animate-fade-in absolute top-full left-0 w-full">
          <div className="container mx-auto py-4 px-4">
            <nav className="flex flex-col space-y-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-brand-darkBlue font-semibold py-2 hover:text-brand-orange transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex justify-between py-2">
                <Link to="/account" className="text-brand-darkBlue font-semibold hover:text-brand-orange transition-colors flex items-center gap-2">
                  <User size={18} /> Account
                </Link>
                <Link to="/wishlist" className="text-brand-darkBlue font-semibold hover:text-brand-orange transition-colors flex items-center gap-2">
                  <Heart size={18} /> Wishlist
                </Link>
              </div>
              <div className="relative mt-2">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full p-2 pl-10 border rounded-md"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
