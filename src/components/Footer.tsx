
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, CreditCard, Truck, Shield } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-darkBlue text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <Logo variant="white" className="mb-6" />
            <div className="flex space-x-4">
              <a href="#" className="hover:text-brand-orange transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-brand-orange transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-brand-orange transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-brand-orange transition-colors" aria-label="YouTube">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Shop Categories</h3>
            <ul className="space-y-3">
              <li><Link to="/category/lego" className="text-gray-300 hover:text-brand-orange transition-colors">LEGO Sets</Link></li>
              <li><Link to="/category/star-wars" className="text-gray-300 hover:text-brand-orange transition-colors">Star Wars</Link></li>
              <li><Link to="/category/superheroes" className="text-gray-300 hover:text-brand-orange transition-colors">Superheroes</Link></li>
              <li><Link to="/category/collectibles" className="text-gray-300 hover:text-brand-orange transition-colors">Collectibles</Link></li>
              <li><Link to="/new-arrivals" className="text-gray-300 hover:text-brand-orange transition-colors">New Arrivals</Link></li>
              <li><Link to="/on-sale" className="text-gray-300 hover:text-brand-orange transition-colors">On Sale</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Customer Service</h3>
            <ul className="space-y-3">
              <li><Link to="/contact" className="text-gray-300 hover:text-brand-orange transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-brand-orange transition-colors">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-brand-orange mt-1" />
                <span className="text-gray-300">Centro Comercial Casa Vieja, Santo Domingo Heredia</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-brand-orange" />
                <span className="text-gray-300">+506 8482 8114</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-brand-orange" />
                <a href="mailto:info@toysandbricks.com" className="text-gray-300 hover:text-brand-orange transition-colors">info@toysandbricks.com</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-full">
                <Truck size={20} className="text-brand-orange" />
              </div>
              <div>
                <h4 className="font-semibold">Envios a todo el País</h4>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-full">
                <CreditCard size={20} className="text-brand-orange" />
              </div>
              <div>
                <h4 className="font-semibold">SINPE MOVIL</h4>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Toys and Bricks. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
