import React, { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/AdminSidebar';
import AdminHeader from '@/components/AdminHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Camera, Mail, Phone, User as UserIcon, Lock } from 'lucide-react';

interface AdminProfile {
  name: string;
  email: string;
  phone: string;
  role: string;
  password: string;
  avatarUrl: string;
}

const AdminProfile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [profile, setProfile] = useState<AdminProfile>({
    name: 'Admin Usuario',
    email: 'admin@toysandbricks.com',
    phone: '+1 (555) 123-4567',
    role: 'Administrador Principal',
    password: '••••••••',
    avatarUrl: '',
  });

  useEffect(() => {
    // Load profile from localStorage
    const savedProfile = localStorage.getItem('adminProfile');
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile);
      setProfile(parsedProfile);
      if (parsedProfile.avatarUrl) {
        setAvatarPreview(parsedProfile.avatarUrl);
      }
    }
  }, []);

  const handleInputChange = (field: keyof AdminProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Por favor selecciona un archivo de imagen válido",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "La imagen debe ser menor a 2MB",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setAvatarPreview(base64String);
      setProfile(prev => ({ ...prev, avatarUrl: base64String }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    localStorage.setItem('adminProfile', JSON.stringify(profile));
    setIsEditing(false);
    toast({
      title: "Perfil actualizado",
      description: "Los cambios se han guardado correctamente",
    });
  };

  const handleCancel = () => {
    const savedProfile = localStorage.getItem('adminProfile');
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile);
      setProfile(parsedProfile);
      setAvatarPreview(parsedProfile.avatarUrl || null);
    }
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <div className="flex-1">
          <AdminHeader title="Mi Perfil" />
          
          <main className="p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Profile Header Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Información Personal</CardTitle>
                  <CardDescription>
                    Administra tu información de perfil y datos de contacto
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={avatarPreview || undefined} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                          {getInitials(profile.name)}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <label
                          htmlFor="avatar-upload"
                          className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-colors shadow-lg"
                        >
                          <Camera className="h-4 w-4" />
                          <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{profile.name}</h3>
                      <p className="text-muted-foreground">{profile.role}</p>
                    </div>
                  </div>

                  <div className="h-px bg-border" />

                  {/* Profile Form */}
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4" />
                        Nombre Completo
                      </Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Tu nombre completo"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Correo Electrónico
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={!isEditing}
                        placeholder="tu@email.com"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Teléfono
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        disabled={!isEditing}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <Label htmlFor="password" className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Contraseña
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={profile.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        disabled={!isEditing}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    {!isEditing ? (
                      <Button onClick={() => setIsEditing(true)} className="flex-1">
                        Editar Perfil
                      </Button>
                    ) : (
                      <>
                        <Button onClick={handleSave} className="flex-1">
                          Guardar Cambios
                        </Button>
                        <Button onClick={handleCancel} variant="outline" className="flex-1">
                          Cancelar
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Additional Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Información de la Cuenta</CardTitle>
                  <CardDescription>
                    Detalles sobre tu cuenta de administrador
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label className="text-sm text-muted-foreground">Rol</Label>
                      <p className="font-medium">{profile.role}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Estado</Label>
                      <p className="font-medium text-green-600">Activo</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Miembro desde</Label>
                      <p className="font-medium">Enero 2024</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Último acceso</Label>
                      <p className="font-medium">Hoy, {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminProfile;
