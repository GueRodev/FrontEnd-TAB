import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Plus, Filter, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Mock data - replace with actual data from your backend
const mockProducts = [
  {
    id: 1,
    image: '/lovable-uploads/17088b0e-dee8-4716-b76d-00be5a07559d.png',
    name: 'LEGO Star Wars',
    category: 'Star Wars',
    price: 89.99,
    stock: 15,
    status: 'active'
  },
  {
    id: 2,
    image: '/lovable-uploads/31cfb3d2-5f19-4cd1-8f9d-efa9f964d81c.png',
    name: 'LEGO Harry Potter',
    category: 'Harry Potter',
    price: 129.99,
    stock: 8,
    status: 'active'
  },
  {
    id: 3,
    image: '/lovable-uploads/51190e3f-2193-4b2a-85ac-e5453680e7bf.png',
    name: 'LEGO City',
    category: 'City',
    price: 59.99,
    stock: 0,
    status: 'inactive'
  },
];

const AdminProducts: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        
        <main className="flex-1 flex flex-col bg-gray-50">
          {/* Header with Toggle */}
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
            <SidebarTrigger className="text-gray-600 hover:text-[#F97316]" />
            <h2 className="text-xl font-semibold text-gray-800">Gestión de Productos</h2>
          </header>

          {/* Main Content */}
          <div className="flex-1 p-8">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Page Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    Gestión de Productos
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Administra tu inventario de juguetes y LEGO
                  </p>
                </div>
                <Button 
                  className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Producto
                </Button>
              </div>

              {/* Search and Filters */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        placeholder="Buscar productos por nombre o categoría..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-12 border-gray-300"
                      />
                    </div>
                    <Button variant="outline" className="h-12 px-6 border-gray-300">
                      <Filter className="h-4 w-4 mr-2" />
                      Filtros
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Products Table */}
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Productos ({mockProducts.length})
                    </h3>
                  </div>
                  
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 hover:bg-gray-50">
                          <TableHead className="font-semibold text-gray-700">Imagen</TableHead>
                          <TableHead className="font-semibold text-gray-700">Nombre</TableHead>
                          <TableHead className="font-semibold text-gray-700">Categoría</TableHead>
                          <TableHead className="font-semibold text-gray-700">Precio</TableHead>
                          <TableHead className="font-semibold text-gray-700">Stock</TableHead>
                          <TableHead className="font-semibold text-gray-700">Estado</TableHead>
                          <TableHead className="font-semibold text-gray-700 text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockProducts.map((product) => (
                          <TableRow key={product.id} className="hover:bg-gray-50">
                            <TableCell>
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                            </TableCell>
                            <TableCell className="font-medium text-gray-900">
                              {product.name}
                            </TableCell>
                            <TableCell className="text-gray-600">
                              {product.category}
                            </TableCell>
                            <TableCell className="text-gray-900 font-medium">
                              ${product.price.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <span className={`font-medium ${
                                product.stock === 0 
                                  ? 'text-red-600' 
                                  : product.stock < 10 
                                  ? 'text-orange-600' 
                                  : 'text-green-600'
                              }`}>
                                {product.stock}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={product.status === 'active' ? 'default' : 'secondary'}
                                className={
                                  product.status === 'active' 
                                    ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                                }
                              >
                                {product.status === 'active' ? 'Activo' : 'Inactivo'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-gray-600 hover:text-[#F97316] hover:bg-[#F97316]/10"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-gray-600 hover:text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminProducts;
