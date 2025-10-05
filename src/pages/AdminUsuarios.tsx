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
import { Search, Plus, Pencil, Trash2, Shield, User, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { useNotifications } from '@/contexts/NotificationsContext';

// Mock data - replace with actual data from your backend
const mockClientes = [
  {
    id: 1,
    nombre: 'Juan Pérez',
    email: 'juan.perez@email.com',
    telefono: '+1 234 567 8901',
    activo: true,
    fechaRegistro: '2024-01-15',
    ordenes: 12,
    direcciones: [
      {
        id: 1,
        tipo: 'Principal',
        calle: 'Av. Principal 123',
        ciudad: 'Ciudad de México',
        codigoPostal: '01234',
        pais: 'México'
      },
      {
        id: 2,
        tipo: 'Trabajo',
        calle: 'Calle Secundaria 456',
        ciudad: 'Ciudad de México',
        codigoPostal: '01235',
        pais: 'México'
      }
    ]
  },
  {
    id: 2,
    nombre: 'María García',
    email: 'maria.garcia@email.com',
    telefono: '+1 234 567 8902',
    activo: true,
    fechaRegistro: '2024-02-20',
    ordenes: 8,
    direcciones: [
      {
        id: 3,
        tipo: 'Principal',
        calle: 'Av. Reforma 789',
        ciudad: 'Guadalajara',
        codigoPostal: '44100',
        pais: 'México'
      }
    ]
  },
  {
    id: 3,
    nombre: 'Carlos López',
    email: 'carlos.lopez@email.com',
    telefono: '+1 234 567 8903',
    activo: false,
    fechaRegistro: '2023-12-10',
    ordenes: 3,
    direcciones: [
      {
        id: 4,
        tipo: 'Principal',
        calle: 'Calle Norte 321',
        ciudad: 'Monterrey',
        codigoPostal: '64000',
        pais: 'México'
      }
    ]
  },
];

const mockAdmins = [
  {
    id: 1,
    nombre: 'Admin Principal',
    email: 'admin@toysandbricks.com',
    rol: 'Super Admin',
    fechaCreacion: '2023-01-01',
    ultimoAcceso: '2024-03-15'
  },
  {
    id: 2,
    nombre: 'Moderador Shop',
    email: 'moderador@toysandbricks.com',
    rol: 'Moderador',
    fechaCreacion: '2023-06-15',
    ultimoAcceso: '2024-03-14'
  }
];

const AdminUsuarios: React.FC = () => {
  const { addNotification } = useNotifications();
  const [clientes, setClientes] = useState(mockClientes);
  const [searchClientes, setSearchClientes] = useState('');
  const [searchAdmins, setSearchAdmins] = useState('');
  const [expandedCliente, setExpandedCliente] = useState<number | null>(null);
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<any>(null);
  const [adminFormData, setAdminFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'Moderador'
  });

  const handleClienteToggle = (id: number) => {
    setClientes(prevClientes => 
      prevClientes.map(cliente => {
        if (cliente.id === id) {
          const nuevoEstado = !cliente.activo;
          
          // Agregar notificación
          addNotification({
            type: 'user',
            title: nuevoEstado ? 'Cliente activado' : 'Cliente desactivado',
            message: `${cliente.nombre} ha sido ${nuevoEstado ? 'activado' : 'desactivado'}`,
            time: 'Ahora',
          });
          
          // Mostrar notificación
          toast({
            title: nuevoEstado ? "Cliente activado" : "Cliente desactivado",
            description: `${cliente.nombre} ha sido ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`,
            variant: nuevoEstado ? "default" : "destructive",
          });
          
          return { ...cliente, activo: nuevoEstado };
        }
        return cliente;
      })
    );
  };

  const handleExpandCliente = (id: number) => {
    setExpandedCliente(expandedCliente === id ? null : id);
  };

  const handleOpenAdminDialog = (admin?: any) => {
    if (admin) {
      setEditingAdmin(admin);
      setAdminFormData({
        nombre: admin.nombre,
        email: admin.email,
        password: '',
        rol: admin.rol
      });
    } else {
      setEditingAdmin(null);
      setAdminFormData({
        nombre: '',
        email: '',
        password: '',
        rol: 'Moderador'
      });
    }
    setIsAdminDialogOpen(true);
  };

  const handleSubmitAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Admin form data:', adminFormData);
    // Aquí implementarás la lógica para crear/editar admin
    setIsAdminDialogOpen(false);
  };

  const handleDeleteAdmin = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este administrador?')) {
      console.log('Eliminar admin:', id);
      // Aquí implementarás la lógica para eliminar admin
    }
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(searchClientes.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchClientes.toLowerCase())
  );

  const filteredAdmins = mockAdmins.filter(admin =>
    admin.nombre.toLowerCase().includes(searchAdmins.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchAdmins.toLowerCase())
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        
        <main className="flex-1 flex flex-col bg-gray-50">
          <AdminHeader title="Gestión de Usuarios" />

          {/* Main Content */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8">
            {/* Sección Clientes */}
            <section>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-6 w-6 text-[#F97316]" />
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Clientes</h1>
                </div>
                <p className="text-gray-600">Gestiona los usuarios clientes de tu tienda</p>
              </div>

              <Card className="shadow-sm">
                <CardContent className="p-4 sm:p-6">
                  {/* Search Bar */}
                  <div className="mb-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Buscar clientes por nombre o email..."
                        value={searchClientes}
                        onChange={(e) => setSearchClientes(e.target.value)}
                        className="pl-10 w-full"
                      />
                    </div>
                  </div>

                  {/* Desktop Table */}
                  <div className="hidden lg:block overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Teléfono</TableHead>
                          <TableHead className="text-center">Órdenes</TableHead>
                          <TableHead>Registro</TableHead>
                          <TableHead className="text-center">Estado</TableHead>
                          <TableHead className="text-center">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredClientes.map((cliente) => (
                          <React.Fragment key={cliente.id}>
                            <TableRow className="hover:bg-gray-50">
                              <TableCell className="font-medium">{cliente.nombre}</TableCell>
                              <TableCell className="text-gray-600">{cliente.email}</TableCell>
                              <TableCell className="text-gray-600">{cliente.telefono}</TableCell>
                              <TableCell className="text-center font-semibold text-[#F97316]">
                                {cliente.ordenes}
                              </TableCell>
                              <TableCell className="text-gray-600">{cliente.fechaRegistro}</TableCell>
                              <TableCell className="text-center">
                                <Switch
                                  checked={cliente.activo}
                                  onCheckedChange={() => handleClienteToggle(cliente.id)}
                                />
                              </TableCell>
                              <TableCell className="text-center">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleExpandCliente(cliente.id)}
                                  className="text-[#F97316] hover:text-[#F97316] hover:bg-[#F97316]/10"
                                >
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {expandedCliente === cliente.id ? 'Ocultar' : 'Ver'} Direcciones
                                </Button>
                              </TableCell>
                            </TableRow>
                            {expandedCliente === cliente.id && (
                              <TableRow>
                                <TableCell colSpan={7} className="bg-gray-50">
                                  <div className="p-4 space-y-3">
                                    <h4 className="font-semibold text-gray-900 mb-3">Direcciones del Cliente</h4>
                                    <div className="grid gap-3 md:grid-cols-2">
                                      {cliente.direcciones.map((direccion) => (
                                        <div key={direccion.id} className="bg-white p-4 rounded-lg border">
                                          <div className="flex items-start justify-between mb-2">
                                            <Badge variant="outline" className="bg-[#F97316]/10 text-[#F97316] border-[#F97316]/20">
                                              {direccion.tipo}
                                            </Badge>
                                          </div>
                                          <p className="text-sm text-gray-900 font-medium">{direccion.calle}</p>
                                          <p className="text-sm text-gray-600">{direccion.ciudad}, {direccion.codigoPostal}</p>
                                          <p className="text-sm text-gray-600">{direccion.pais}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </React.Fragment>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile/Tablet Card View */}
                  <div className="lg:hidden space-y-4">
                    {filteredClientes.map((cliente) => (
                      <div key={cliente.id} className="border rounded-lg p-4 bg-white">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{cliente.nombre}</h4>
                            <p className="text-sm text-gray-600 break-all">{cliente.email}</p>
                            <p className="text-sm text-gray-600 mt-1">{cliente.telefono}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2 ml-2">
                            <Badge variant={cliente.activo ? 'default' : 'secondary'} className={
                              cliente.activo 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }>
                              {cliente.activo ? 'Activo' : 'Inactivo'}
                            </Badge>
                            <Switch
                              checked={cliente.activo}
                              onCheckedChange={() => handleClienteToggle(cliente.id)}
                            />
                          </div>
                        </div>
                        
                        <Separator className="my-3" />
                        
                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                          <div>
                            <span className="text-gray-600">Órdenes:</span>
                            <span className="ml-1 font-semibold text-[#F97316]">{cliente.ordenes}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Registro:</span>
                            <span className="ml-1 text-gray-900">{cliente.fechaRegistro}</span>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleExpandCliente(cliente.id)}
                          className="w-full text-[#F97316] border-[#F97316]/20 hover:bg-[#F97316]/10"
                        >
                          <MapPin className="h-4 w-4 mr-1" />
                          {expandedCliente === cliente.id ? 'Ocultar' : 'Ver'} Direcciones ({cliente.direcciones.length})
                        </Button>

                        {expandedCliente === cliente.id && (
                          <div className="mt-3 space-y-2">
                            {cliente.direcciones.map((direccion) => (
                              <div key={direccion.id} className="bg-gray-50 p-3 rounded-lg border text-sm">
                                <Badge variant="outline" className="bg-[#F97316]/10 text-[#F97316] border-[#F97316]/20 mb-2">
                                  {direccion.tipo}
                                </Badge>
                                <p className="text-gray-900 font-medium">{direccion.calle}</p>
                                <p className="text-gray-600">{direccion.ciudad}, {direccion.codigoPostal}</p>
                                <p className="text-gray-600">{direccion.pais}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Separator */}
            <Separator className="my-8" />

            {/* Sección Administradores */}
            <section>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-6 w-6 text-[#F97316]" />
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Administradores</h1>
                </div>
                <p className="text-gray-600">Gestiona los usuarios administradores del sistema</p>
              </div>

              <Card className="shadow-sm">
                <CardContent className="p-4 sm:p-6">
                  {/* Header with Search and Add */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Buscar administradores..."
                        value={searchAdmins}
                        onChange={(e) => setSearchAdmins(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button 
                      onClick={() => handleOpenAdminDialog()}
                      className="bg-[#F97316] hover:bg-[#F97316]/90 text-white w-full sm:w-auto"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Nuevo Admin
                    </Button>
                  </div>

                  {/* Desktop Table */}
                  <div className="hidden lg:block overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Rol</TableHead>
                          <TableHead>Fecha Creación</TableHead>
                          <TableHead>Último Acceso</TableHead>
                          <TableHead className="text-center">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAdmins.map((admin) => (
                          <TableRow key={admin.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium">{admin.nombre}</TableCell>
                            <TableCell className="text-gray-600">{admin.email}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                                {admin.rol}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-gray-600">{admin.fechaCreacion}</TableCell>
                            <TableCell className="text-gray-600">{admin.ultimoAcceso}</TableCell>
                            <TableCell className="text-center">
                              <div className="flex justify-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleOpenAdminDialog(admin)}
                                  className="text-[#F97316] hover:text-[#F97316] hover:bg-[#F97316]/10"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteAdmin(admin.id)}
                                  className="text-red-600 hover:text-red-600 hover:bg-red-50"
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
                  <div className="lg:hidden space-y-4">
                    {filteredAdmins.map((admin) => (
                      <div key={admin.id} className="border rounded-lg p-4 bg-white">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{admin.nombre}</h4>
                            <p className="text-sm text-gray-600 break-all mb-2">{admin.email}</p>
                            <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                              {admin.rol}
                            </Badge>
                          </div>
                        </div>
                        
                        <Separator className="my-3" />
                        
                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                          <div>
                            <p className="text-gray-600">Creación:</p>
                            <p className="text-gray-900">{admin.fechaCreacion}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Último acceso:</p>
                            <p className="text-gray-900">{admin.ultimoAcceso}</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenAdminDialog(admin)}
                            className="flex-1 text-[#F97316] border-[#F97316]/20 hover:bg-[#F97316]/10"
                          >
                            <Pencil className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteAdmin(admin.id)}
                            className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </main>
      </div>

      {/* Admin Create/Edit Modal */}
      <Dialog open={isAdminDialogOpen} onOpenChange={setIsAdminDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {editingAdmin ? 'Editar Administrador' : 'Crear Nuevo Administrador'}
            </DialogTitle>
            <DialogDescription>
              {editingAdmin 
                ? 'Modifica los datos del administrador' 
                : 'Completa la información para crear un nuevo administrador'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitAdmin} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre completo *</Label>
              <Input
                id="nombre"
                placeholder="Ej: Juan Pérez"
                value={adminFormData.nombre}
                onChange={(e) => setAdminFormData({ ...adminFormData, nombre: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@toysandbricks.com"
                value={adminFormData.email}
                onChange={(e) => setAdminFormData({ ...adminFormData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                {editingAdmin ? 'Nueva Contraseña (dejar vacío para mantener)' : 'Contraseña *'}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={adminFormData.password}
                onChange={(e) => setAdminFormData({ ...adminFormData, password: e.target.value })}
                required={!editingAdmin}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rol">Rol *</Label>
              <select
                id="rol"
                value={adminFormData.rol}
                onChange={(e) => setAdminFormData({ ...adminFormData, rol: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              >
                <option value="Moderador">Moderador</option>
                <option value="Super Admin">Super Admin</option>
              </select>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAdminDialogOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                className="bg-[#F97316] hover:bg-[#F97316]/90 text-white w-full sm:w-auto"
              >
                {editingAdmin ? 'Guardar Cambios' : 'Crear Administrador'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default AdminUsuarios;
