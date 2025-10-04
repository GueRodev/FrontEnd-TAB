import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Admin: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <Shield size={64} className="text-brand-orange" strokeWidth={2} />
        </div>
        <h1 className="text-4xl font-bold text-brand-darkBlue mb-4">Panel Administrativo</h1>
        <p className="text-gray-600 text-lg mb-8">
          Funcionalidades en desarrollo...
        </p>
        <Link to="/">
          <Button className="bg-brand-orange hover:bg-brand-orange/90 text-white">
            <Home size={18} />
            Volver al Inicio
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Admin;
