import React from 'react';
import { Shield } from 'lucide-react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/AdminSidebar';

const Admin: React.FC = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        
        <main className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Shield size={64} className="text-brand-orange" strokeWidth={2} />
            </div>
            <h1 className="text-4xl font-bold text-brand-darkBlue mb-4">Panel Administrativo</h1>
            <p className="text-gray-600 text-lg">
              Funcionalidades en desarrollo...
            </p>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Admin;
