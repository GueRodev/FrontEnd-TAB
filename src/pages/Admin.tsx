import React from 'react';
import { Shield } from 'lucide-react';

const Admin: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <Shield size={64} className="text-brand-orange" strokeWidth={2} />
        </div>
        <h1 className="text-4xl font-bold text-brand-darkBlue mb-4">Panel Administrativo</h1>
        <p className="text-gray-600 text-lg">
          Funcionalidades en desarrollo...
        </p>
      </div>
    </div>
  );
};

export default Admin;
