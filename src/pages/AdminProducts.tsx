import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/AdminSidebar';
import AdminHeader from '@/components/AdminHeader';
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
import { useNotifications } from '@/contexts/NotificationsContext';
import { toast } from '@/hooks/use-toast';

// Mock data - replace with actual data from your backend
const mockProducts = [
  {
    id: 1,
    image: '/lovable-uploads/17088b0e-dee8-4716-b76d-00be5a07559d.png',
    name: 'LEGO Star Wars',
    category: 'Star Wars',
    price: 49494.50,
    stock: 15,
    status: 'active'
  },
  {
    id: 2,
    image: '/lovable-uploads/31cfb3d2-5f19-4cd1-8f9d-efa9f964d81c.png',
    name: 'LEGO Harry Potter',
    category: 'Harry Potter',
    price: 71494.50,
    stock: 8,
    status: 'active'
  },
  {
    id: 3,
    image: '/lovable-uploads/51190e3f-2193-4b2a-85ac-e5453680e7bf.png',
    name: 'LEGO City',
    category: 'City',
    price: 32994.50,
    stock: 0,
    status: 'inactive'
  },
];

const AdminProducts: React.FC = () => {
  const { addNotification } = useNotifications();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
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

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: '',
      status: product.status
    });
    setSelectedImage(product.image);
    setIsEditDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí implementarás la lógica para guardar el producto
    console.log('Form data:', formData);
    console.log('Image:', selectedImage);
    
    // Agregar notificación
    addNotification({
      type: 'product',
      title: 'Producto creado',
      message: `${formData.name} ha sido agregado al inventario`,
      time: 'Ahora',
    });

    toast({
      title: "Producto creado",
      description: `${formData.name} ha sido agregado exitosamente`,
    });

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

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí implementarás la lógica para actualizar el producto
    console.log('Updating product:', selectedProduct.id);
    console.log('Form data:', formData);
    console.log('Image:', selectedImage);
    
    // Agregar notificación
    addNotification({
      type: 'product',
      title: 'Producto actualizado',
      message: `${formData.name} ha sido modificado`,
      time: 'Ahora',
    });

    toast({
      title: "Producto actualizado",
      description: `${formData.name} ha sido actualizado exitosamente`,
    });

    setIsEditDialogOpen(false);
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
    setSelectedProduct(null);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        
        <main className="flex-1 flex flex-col bg-gray-50">
          <AdminHeader title="Gestión de Productos" />

          {/* Main Content */}
          <div className="flex-1 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
              {/* Page Header */}
              <div className="flex flex-col gap-4">
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 md:mb-2">
                    Gestión de Productos
                  </h1>
                  <p className="text-gray-600 text-sm md:text-base lg:text-lg">
                    Administra tu inventario de juguetes y LEGO
                  </p>
                </div>
                <div className="flex justify-center sm:justify-start">
                  <Button 
                    className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white w-full max-w-xs sm:w-auto"
                    onClick={() => setIsAddDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Producto
                  </Button>
                </div>
              </div>

              {/* Search and Filters */}
              <Card className="mx-auto w-full">
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col gap-3">
                    <div className="relative w-full">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Buscar productos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-10 border-gray-300 w-full"
                      />
                    </div>
                    <Button variant="outline" className="h-10 px-4 border-gray-300 w-full">
                      <Filter className="h-4 w-4 mr-2" />
                      Filtros
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Products Table/Cards */}
              <Card>
                <CardContent className="p-4 md:p-6">
                  <div className="mb-4">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900">
                      Productos ({mockProducts.length})
                    </h3>
                  </div>
                  
                  {/* Desktop Table View */}
                  <div className="hidden lg:block border rounded-lg overflow-hidden">
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
                              ₡{product.price.toFixed(2)}
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
                                  onClick={() => handleEditProduct(product)}
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

                  {/* Mobile/Tablet Card View */}
                  <div className="lg:hidden space-y-3">
                    {mockProducts.map((product) => (
                      <div key={product.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col gap-3">
                          {/* Product Header with Image and Title */}
                          <div className="flex gap-3 items-start">
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 text-sm mb-1">
                                {product.name}
                              </h4>
                              <Badge 
                                variant={product.status === 'active' ? 'default' : 'secondary'}
                                className={`text-xs ${
                                  product.status === 'active' 
                                    ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                                }`}
                              >
                                {product.status === 'active' ? 'Activo' : 'Inactivo'}
                              </Badge>
                            </div>
                          </div>
                          
                          {/* Product Details */}
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="text-center">
                              <p className="text-gray-600 mb-1">Categoría</p>
                              <p className="font-medium text-gray-900">{product.category}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-gray-600 mb-1">Precio</p>
                              <p className="font-semibold text-gray-900">₡{product.price.toFixed(2)}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-gray-600 mb-1">Stock</p>
                              <p className={`font-medium ${
                                product.stock === 0 
                                  ? 'text-red-600' 
                                  : product.stock < 10 
                                  ? 'text-orange-600' 
                                  : 'text-green-600'
                              }`}>
                                {product.stock}
                              </p>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex gap-2 pt-2 border-t">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-xs h-8 text-gray-600 hover:text-[#F97316] hover:bg-[#F97316]/10"
                              onClick={() => handleEditProduct(product)}
                            >
                              <Pencil className="h-3 w-3 mr-1" />
                              Editar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-xs h-8 text-gray-600 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Eliminar
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl font-bold text-gray-900">
              Agregar Nuevo Producto
            </DialogTitle>
            <DialogDescription className="text-sm md:text-base text-gray-600">
              Completa la información del producto para agregarlo al inventario
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <DialogFooter className="gap-2 flex-col sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                className="border-gray-300 w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white w-full sm:w-auto"
              >
                Guardar Producto
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl font-bold text-gray-900">
              Editar Producto
            </DialogTitle>
            <DialogDescription className="text-sm md:text-base text-gray-600">
              Modifica la información del producto
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateProduct} className="space-y-4 md:space-y-6">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="edit-image" className="text-gray-900 font-medium">
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
                      id="edit-image"
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
              <Label htmlFor="edit-name" className="text-gray-900 font-medium">
                Nombre del Producto *
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: LEGO Star Wars Millennium Falcon"
                required
                className="border-gray-300"
              />
            </div>

            {/* Category and Price Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category" className="text-gray-900 font-medium">
                  Categoría *
                </Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  required
                >
                  <SelectTrigger id="edit-category" className="border-gray-300">
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Star Wars">Star Wars</SelectItem>
                    <SelectItem value="Harry Potter">Harry Potter</SelectItem>
                    <SelectItem value="City">City</SelectItem>
                    <SelectItem value="Technic">Technic</SelectItem>
                    <SelectItem value="Friends">Friends</SelectItem>
                    <SelectItem value="Marvel">Marvel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-price" className="text-gray-900 font-medium">
                  Precio ($) *
                </Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  required
                  className="border-gray-300"
                />
              </div>
            </div>

            {/* Stock and Status Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-stock" className="text-gray-900 font-medium">
                  Stock *
                </Label>
                <Input
                  id="edit-stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="0"
                  required
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status" className="text-gray-900 font-medium">
                  Estado *
                </Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger id="edit-status" className="border-gray-300">
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
              <Label htmlFor="edit-description" className="text-gray-900 font-medium">
                Descripción
              </Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción detallada del producto..."
                rows={4}
                className="border-gray-300 resize-none"
              />
            </div>

            <DialogFooter className="gap-2 flex-col sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="border-gray-300 w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white w-full sm:w-auto"
              >
                Actualizar Producto
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default AdminProducts;
