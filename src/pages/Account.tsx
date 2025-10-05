import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  memberSince: string;
}

const Account: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Usuario Demo',
    email: 'usuario@toysandbricks.com',
    phone: '+1 234 567 8900',
    address: 'Calle Principal 123, Ciudad',
    memberSince: 'Enero 2024'
  });

  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile(profile);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(profile);
  };

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    toast({
      title: "Perfil actualizado",
      description: "Tus cambios han sido guardados exitosamente",
    });
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setEditedProfile({ ...editedProfile, [field]: value });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero-style background section */}
      <section className="pt-24 md:pt-32 pb-8 bg-gradient-to-b from-brand-yellow to-white relative overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute -right-24 -top-24 w-64 h-64 rounded-full bg-brand-orange opacity-10"></div>
          <div className="absolute left-1/3 top-1/3 w-32 h-32 rounded-full bg-brand-purple opacity-10"></div>
          <div className="absolute right-1/4 bottom-1/4 w-48 h-48 rounded-full bg-brand-skyBlue opacity-10"></div>
        </div>
        
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="bg-brand-darkBlue text-white py-3 px-6 rounded-lg inline-block mb-6">
            <div className="flex items-center gap-2 text-sm uppercase font-semibold">
              <Link to="/" className="hover:text-brand-orange transition-colors">
                INICIO
              </Link>
              <span>/</span>
              <span>MI PERFIL</span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="container mx-auto px-4 py-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-brand-orange rounded-full flex items-center justify-center text-white">
                  <User size={40} />
                </div>
                <div>
                  <h1 className="text-3xl font-display font-bold text-brand-darkBlue">
                    Mi Perfil
                  </h1>
                  <p className="text-gray-600">Administra tu información personal</p>
                </div>
              </div>
              {!isEditing && (
                <Button
                  onClick={handleEdit}
                  className="bg-brand-darkBlue hover:bg-brand-orange"
                >
                  <Edit2 className="mr-2" size={18} />
                  Editar Perfil
                </Button>
              )}
            </div>

            {/* Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>
                  {isEditing 
                    ? 'Actualiza tu información personal' 
                    : 'Tu información personal y datos de contacto'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2 text-brand-darkBlue">
                    <User size={18} />
                    Nombre Completo
                  </Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editedProfile.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="border-gray-300 focus:border-brand-orange"
                    />
                  ) : (
                    <p className="text-gray-700 py-2">{profile.name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2 text-brand-darkBlue">
                    <Mail size={18} />
                    Correo Electrónico
                  </Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={editedProfile.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="border-gray-300 focus:border-brand-orange"
                    />
                  ) : (
                    <p className="text-gray-700 py-2">{profile.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2 text-brand-darkBlue">
                    <Phone size={18} />
                    Teléfono
                  </Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      type="tel"
                      value={editedProfile.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="border-gray-300 focus:border-brand-orange"
                    />
                  ) : (
                    <p className="text-gray-700 py-2">{profile.phone}</p>
                  )}
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2 text-brand-darkBlue">
                    <MapPin size={18} />
                    Dirección
                  </Label>
                  {isEditing ? (
                    <Input
                      id="address"
                      value={editedProfile.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="border-gray-300 focus:border-brand-orange"
                    />
                  ) : (
                    <p className="text-gray-700 py-2">{profile.address}</p>
                  )}
                </div>

                {/* Member Since */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-brand-darkBlue">
                    <Calendar size={18} />
                    Miembro Desde
                  </Label>
                  <p className="text-gray-700 py-2">{profile.memberSince}</p>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleSave}
                      className="bg-brand-darkBlue hover:bg-brand-orange flex-1"
                    >
                      <Save className="mr-2" size={18} />
                      Guardar Cambios
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="flex-1"
                    >
                      <X className="mr-2" size={18} />
                      Cancelar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Cards */}
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mis Pedidos</CardTitle>
                  <CardDescription>Historial de compras</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">No tienes pedidos recientes</p>
                  <Link to="/orders">
                    <Button variant="outline" className="w-full">
                      Ver Historial
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Favoritos</CardTitle>
                  <CardDescription>Productos guardados</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Explora tus productos favoritos</p>
                  <Link to="/wishlist">
                    <Button variant="outline" className="w-full">
                      Ver Favoritos
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Account;
