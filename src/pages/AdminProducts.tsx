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
import { Search, Plus, Filter, Pencil, Trash2, Upload, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

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
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    status: 'active'
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí implementarás la lógica para guardar el producto
    console.log('Form data:', formData);
    console.log('Image:', selectedImage);
    setIsAddDialogOpen(false);
    // Reset form
    setFormData({
      name: '',
      category: '',
      price: '',
      stock: '',
      description: '',
      status: 'active'
    });
    setSelectedImage(null);
  };

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
                  onClick={() => setIsAddDialogOpen(true)}
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

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Agregar Nuevo Producto
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Completa la información del producto para agregarlo al inventario
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image" className="text-gray-900 font-medium">
                Imagen del Producto
              </Label>
              <div className="flex items-center gap-4">
                {selectedImage ? (
                  <div className="relative">
                    <img 
                      src={selectedImage} 
                      alt="Preview" 
                      className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#F97316] hover:bg-gray-50 transition-colors">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Subir imagen</span>
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <p className="text-sm text-gray-500">
                Formato: JPG, PNG. Tamaño máximo: 5MB
              </p>
            </div>

            {/* Product Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-900 font-medium">
                Nombre del Producto *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: LEGO Star Wars Millennium Falcon"
                required
                className="border-gray-300"
              />
            </div>

            {/* Category and Price Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-gray-900 font-medium">
                  Categoría *
                </Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  required
                >
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="star-wars">Star Wars</SelectItem>
                    <SelectItem value="harry-potter">Harry Potter</SelectItem>
                    <SelectItem value="city">City</SelectItem>
                    <SelectItem value="technic">Technic</SelectItem>
                    <SelectItem value="friends">Friends</SelectItem>
                    <SelectItem value="creator">Creator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price" className="text-gray-900 font-medium">
                  Precio (USD) *
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  required
                  className="border-gray-300"
                />
              </div>
            </div>

            {/* Stock and Status Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stock" className="text-gray-900 font-medium">
                  Stock *
                </Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="0"
                  required
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-gray-900 font-medium">
                  Estado *
                </Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger className="border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-900 font-medium">
                Descripción
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción detallada del producto..."
                rows={4}
                className="border-gray-300 resize-none"
              />
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                className="border-gray-300"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white"
              >
                Guardar Producto
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default AdminProducts;
