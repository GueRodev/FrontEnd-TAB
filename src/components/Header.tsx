
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingCart, Search, User, Heart, Shield } from 'lucide-react';
import Logo from './Logo';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { useCategories } from '@/contexts/CategoriesContext';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { getTotalItems } = useCart();
  const { categories } = useCategories();
  const cartCount = getTotalItems();

  // Handle scroll event to change header style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get sorted categories and separate Lego from others
  const { legoCategory, otherCategories } = useMemo(() => {
    const sorted = [...categories].sort((a, b) => a.order - b.order);
    const lego = sorted.find(cat => cat.slug === 'lego');
    const others = sorted.filter(cat => cat.slug !== 'lego');
    return { legoCategory: lego, otherCategories: others };
  }, [categories]);

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
          {legoCategory && legoCategory.subcategories.length > 0 ? (
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-brand-darkBlue font-semibold hover:text-brand-orange transition-colors bg-transparent hover:bg-transparent focus:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent">
                    {legoCategory.name}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[200px] gap-1 p-2 bg-white shadow-lg border rounded-md">
                      {legoCategory.subcategories
                        .sort((a, b) => a.order - b.order)
                        .map((subcategory) => (
                          <NavigationMenuLink key={subcategory.id} asChild>
                            <Link
                              to={`/category/${subcategory.slug}`}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none">{subcategory.name}</div>
                            </Link>
                          </NavigationMenuLink>
                        ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          ) : legoCategory ? (
            <Link
              to={`/category/${legoCategory.slug}`}
              className="text-brand-darkBlue font-semibold hover:text-brand-orange transition-colors relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-brand-orange after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
            >
              {legoCategory.name}
            </Link>
          ) : null}
          
          {otherCategories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              className="text-brand-darkBlue font-semibold hover:text-brand-orange transition-colors relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-brand-orange after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
            >
              {category.name}
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
          <Link to="/admin" className="hover:text-brand-orange transition-colors">
            <Shield size={22} />
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
              {legoCategory && legoCategory.subcategories.length > 0 && (
                <div className="border-b pb-2">
                  <div className="text-brand-darkBlue font-semibold py-2">{legoCategory.name}</div>
                  <div className="ml-4 space-y-2">
                    {legoCategory.subcategories
                      .sort((a, b) => a.order - b.order)
                      .map((subcategory) => (
                        <Link
                          key={subcategory.id}
                          to={`/category/${subcategory.slug}`}
                          className="block text-gray-600 py-1 hover:text-brand-orange transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {subcategory.name}
                        </Link>
                      ))}
                  </div>
                </div>
              )}
              
              {otherCategories.map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.slug}`}
                  className="text-brand-darkBlue font-semibold py-2 hover:text-brand-orange transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
              <div className="flex justify-between py-2">
                <Link to="/account" className="text-brand-darkBlue font-semibold hover:text-brand-orange transition-colors flex items-center gap-2">
                  <User size={18} /> Cuenta
                </Link>
                <Link to="/wishlist" className="text-brand-darkBlue font-semibold hover:text-brand-orange transition-colors flex items-center gap-2">
                  <Heart size={18} /> Favoritos
                </Link>
              </div>
              <Link to="/admin" className="text-brand-darkBlue font-semibold hover:text-brand-orange transition-colors flex items-center gap-2 py-2" onClick={() => setIsMenuOpen(false)}>
                <Shield size={18} /> Admin
              </Link>
              <div className="relative mt-2">
                <input
                  type="text"
                  placeholder="Buscar productos..."
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
