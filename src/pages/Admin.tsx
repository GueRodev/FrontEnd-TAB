import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Shield } from 'lucide-react';

const Admin: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20">
        {/* Breadcrumb */}
        <div className="bg-brand-darkBlue text-white py-4">
          <div className="container mx-auto px-4">
            <p className="text-sm">INICIO / ADMIN</p>
          </div>
        </div>

        {/* Admin Panel Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Shield size={64} className="text-brand-orange" />
            </div>
            <h1 className="text-4xl font-bold text-brand-darkBlue mb-4">Panel Administrativo</h1>
            <p className="text-gray-600 text-lg">
              Funcionalidades en desarrollo...
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;
