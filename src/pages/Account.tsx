import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Edit2, Save, X } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DecorativeBackground from '@/components/DecorativeBackground';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import type { UserProfile } from '@/types/user.types';

const Account: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Usuario Demo',
    email: 'usuario@toysandbricks.com',
    phone: '+506 8888 8888',
    province: 'San José',
    canton: 'Central',
    district: 'Carmen',
    address: 'Calle Principal 123, Ciudad'
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
        <DecorativeBackground />
        
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
                      placeholder="+506 8888 8888"
                    />
                  ) : (
                    <p className="text-gray-700 py-2">{profile.phone}</p>
                  )}
                </div>

                {/* Provincia */}
                <div className="space-y-2">
                  <Label htmlFor="province" className="flex items-center gap-2 text-brand-darkBlue">
                    <MapPin size={18} />
                    Provincia
                  </Label>
                  {isEditing ? (
                    <Input
                      id="province"
                      value={editedProfile.province}
                      onChange={(e) => handleInputChange('province', e.target.value)}
                      className="border-gray-300 focus:border-brand-orange"
                      placeholder="Provincia"
                    />
                  ) : (
                    <p className="text-gray-700 py-2">{profile.province}</p>
                  )}
                </div>

                {/* Canton */}
                <div className="space-y-2">
                  <Label htmlFor="canton" className="text-brand-darkBlue">
                    Cantón
                  </Label>
                  {isEditing ? (
                    <Input
                      id="canton"
                      value={editedProfile.canton}
                      onChange={(e) => handleInputChange('canton', e.target.value)}
                      className="border-gray-300 focus:border-brand-orange"
                      placeholder="Cantón"
                    />
                  ) : (
                    <p className="text-gray-700 py-2">{profile.canton}</p>
                  )}
                </div>

                {/* Distrito */}
                <div className="space-y-2">
                  <Label htmlFor="district" className="text-brand-darkBlue">
                    Distrito
                  </Label>
                  {isEditing ? (
                    <Input
                      id="district"
                      value={editedProfile.district}
                      onChange={(e) => handleInputChange('district', e.target.value)}
                      className="border-gray-300 focus:border-brand-orange"
                      placeholder="Distrito"
                    />
                  ) : (
                    <p className="text-gray-700 py-2">{profile.district}</p>
                  )}
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-brand-darkBlue">
                    Dirección Exacta
                  </Label>
                  {isEditing ? (
                    <Input
                      id="address"
                      value={editedProfile.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="border-gray-300 focus:border-brand-orange"
                      placeholder="Dirección completa"
                    />
                  ) : (
                    <p className="text-gray-700 py-2">{profile.address}</p>
                  )}
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
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Account;
