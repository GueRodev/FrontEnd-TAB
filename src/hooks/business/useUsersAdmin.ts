/**
 * Users Admin Business Logic Hook
 * Manages all business logic for admin users page
 */

import { useState } from 'react';
import { useNotifications } from '@/contexts/NotificationsContext';
import { toast } from '@/hooks/use-toast';
import { adminSchema, type AdminFormData } from '@/lib/validations/user.validation';

// Mock data - will be replaced with API calls
const mockClientes = [
  {
    id: 1,
    nombre: 'Juan Pérez',
    email: 'juan.perez@email.com',
    telefono: '+506 8888 8901',
    activo: true,
    fechaRegistro: '2024-01-15',
    ordenes: 12,
    direccion: {
      provincia: 'San José',
      canton: 'Central',
      distrito: 'Carmen',
      direccion: 'Av. Principal 123'
    }
  },
  {
    id: 2,
    nombre: 'María García',
    email: 'maria.garcia@email.com',
    telefono: '+506 8888 8902',
    activo: true,
    fechaRegistro: '2024-02-20',
    ordenes: 8,
    direccion: {
      provincia: 'Heredia',
      canton: 'San Pablo',
      distrito: 'Rincón',
      direccion: 'Av. Reforma 789'
    }
  },
  {
    id: 3,
    nombre: 'Carlos López',
    email: 'carlos.lopez@email.com',
    telefono: '+506 8888 8903',
    activo: false,
    fechaRegistro: '2023-12-10',
    ordenes: 3,
    direccion: {
      provincia: 'Alajuela',
      canton: 'Alajuela',
      distrito: 'Centro',
      direccion: 'Calle Norte 321'
    }
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

interface UseUsersAdminReturn {
  // State
  clientes: typeof mockClientes;
  admins: typeof mockAdmins;
  searchClientes: string;
  searchAdmins: string;
  expandedCliente: number | null;
  isAdminDialogOpen: boolean;
  editingAdmin: any;
  adminFormData: AdminFormData;
  filteredClientes: typeof mockClientes;
  filteredAdmins: typeof mockAdmins;
  
  // Setters
  setSearchClientes: (search: string) => void;
  setSearchAdmins: (search: string) => void;
  setAdminFormData: (data: AdminFormData) => void;
  
  // Handlers
  handleClienteToggle: (id: number) => void;
  handleExpandCliente: (id: number) => void;
  handleOpenAdminDialog: (admin?: any) => void;
  handleCloseAdminDialog: () => void;
  handleSubmitAdmin: (e: React.FormEvent) => void;
  handleDeleteAdmin: (id: number) => void;
}

export const useUsersAdmin = (): UseUsersAdminReturn => {
  const { addNotification } = useNotifications();
  
  const [clientes, setClientes] = useState(mockClientes);
  const [searchClientes, setSearchClientes] = useState('');
  const [searchAdmins, setSearchAdmins] = useState('');
  const [expandedCliente, setExpandedCliente] = useState<number | null>(null);
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<any>(null);
  const [adminFormData, setAdminFormData] = useState<AdminFormData>({
    name: '',
    email: '',
    password: '',
    role: 'moderador'
  });

  const handleClienteToggle = (id: number) => {
    setClientes(prevClientes => 
      prevClientes.map(cliente => {
        if (cliente.id === id) {
          const nuevoEstado = !cliente.activo;
          
          // Add notification
          addNotification({
            type: 'user',
            title: nuevoEstado ? 'Cliente activado' : 'Cliente desactivado',
            message: `${cliente.nombre} ha sido ${nuevoEstado ? 'activado' : 'desactivado'}`,
            time: 'Ahora',
          });
          
          // Show toast
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
        name: admin.nombre,
        email: admin.email,
        password: '',
        role: admin.rol.toLowerCase()
      });
    } else {
      setEditingAdmin(null);
      setAdminFormData({
        name: '',
        email: '',
        password: '',
        role: 'moderador'
      });
    }
    setIsAdminDialogOpen(true);
  };

  const handleCloseAdminDialog = () => {
    setIsAdminDialogOpen(false);
    setEditingAdmin(null);
  };

  const handleSubmitAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const validation = adminSchema.safeParse(adminFormData);
    if (!validation.success) {
      const firstError = validation.error.errors[0];
      toast({
        title: "Error de validación",
        description: firstError.message,
        variant: "destructive",
      });
      return;
    }
    
    // TODO: Call usersService.createAdmin or updateAdmin
    toast({
      title: editingAdmin ? "Administrador actualizado" : "Administrador creado",
      description: `${adminFormData.name} ha sido ${editingAdmin ? 'actualizado' : 'creado'} exitosamente`,
    });
    
    setIsAdminDialogOpen(false);
  };

  const handleDeleteAdmin = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este administrador?')) {
      // TODO: Call usersService.deleteAdmin
      toast({
        title: "Administrador eliminado",
        description: "El administrador ha sido eliminado exitosamente",
      });
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

  return {
    clientes,
    admins: mockAdmins,
    searchClientes,
    searchAdmins,
    expandedCliente,
    isAdminDialogOpen,
    editingAdmin,
    adminFormData,
    filteredClientes,
    filteredAdmins,
    setSearchClientes,
    setSearchAdmins,
    setAdminFormData,
    handleClienteToggle,
    handleExpandCliente,
    handleOpenAdminDialog,
    handleCloseAdminDialog,
    handleSubmitAdmin,
    handleDeleteAdmin,
  };
};
