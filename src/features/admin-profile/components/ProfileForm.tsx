/**
 * ProfileForm Component
 * Form for editing user profile information
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Phone, Lock, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { profileSchema, type ProfileFormData } from '@/features/auth/validations';
import { APP_CONFIG } from '@/config/app.config';

interface ProfileFormProps {
  defaultValues: ProfileFormData;
  onSubmit: (data: ProfileFormData) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
  isEditing = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  const handleFormSubmit = async (data: ProfileFormData) => {
    await onSubmit(data);
  };

  if (!isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
          <CardDescription>
            Tu información personal y datos de contacto
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-brand-darkBlue">
              <User size={18} />
              Nombre Completo
            </Label>
            <p className="text-gray-700 py-2">{defaultValues.name}</p>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-brand-darkBlue">
              <Mail size={18} />
              Correo Electrónico
            </Label>
            <p className="text-gray-700 py-2">{defaultValues.email}</p>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-brand-darkBlue">
              <Phone size={18} />
              Teléfono
            </Label>
            <p className="text-gray-700 py-2">{defaultValues.phone || 'No especificado'}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información Personal</CardTitle>
        <CardDescription>
          Actualiza tu información personal
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2 text-brand-darkBlue">
              <User size={18} />
              Nombre Completo
            </Label>
            <Input
              id="name"
              {...register('name')}
              className="border-gray-300 focus:border-brand-orange"
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2 text-brand-darkBlue">
              <Mail size={18} />
              Correo Electrónico
            </Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              className="border-gray-300 focus:border-brand-orange"
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2 text-brand-darkBlue">
              <Phone size={18} />
              Teléfono
            </Label>
            <Input
              id="phone"
              type="tel"
              {...register('phone')}
              className="border-gray-300 focus:border-brand-orange"
              placeholder={`${APP_CONFIG.whatsapp.countryCode} 8888 8888`}
            />
            {errors.phone && (
              <p className="text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2 text-brand-darkBlue">
              <Lock size={18} />
              Nueva Contraseña (opcional)
            </Label>
            <Input
              id="password"
              type="password"
              {...register('password')}
              className="border-gray-300 focus:border-brand-orange"
              placeholder="Dejar en blanco para mantener la actual"
              disabled={!isEditing}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password_confirmation" className="flex items-center gap-2 text-brand-darkBlue">
              <Lock size={18} />
              Confirmar Contraseña
            </Label>
            <Input
              id="password_confirmation"
              type="password"
              {...register('password_confirmation')}
              className="border-gray-300 focus:border-brand-orange"
              placeholder="Repite la contraseña"
              disabled={!isEditing}
            />
            {errors.password_confirmation && (
              <p className="text-sm text-red-600">{errors.password_confirmation.message}</p>
            )}
            <p className="text-xs text-gray-500">
              Las contraseñas deben coincidir
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-brand-darkBlue hover:bg-brand-orange flex-1"
            >
              <Save className="mr-2" size={18} />
              {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="flex-1"
              disabled={isSubmitting}
            >
              <X className="mr-2" size={18} />
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};