import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/AdminSidebar';

const Admin: React.FC = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        
        <main className="flex-1 flex flex-col bg-gray-50">
          {/* Header with Toggle */}
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
            <SidebarTrigger className="text-gray-600 hover:text-brand-orange" />
            <h2 className="text-xl font-semibold text-gray-800">Panel de Administración</h2>
          </header>

          {/* Main Content */}
          <div className="flex-1 p-8">
            <div className="max-w-6xl">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-gray-600 text-lg">
                Resumen general de tu tienda TOYS AND BRICKS
              </p>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Admin;
