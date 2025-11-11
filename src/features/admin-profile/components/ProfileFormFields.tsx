/**
 * ProfileFormFields Component
 * Reusable form fields for profile editing
 */

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Lock } from 'lucide-react';
import type { AdminProfileFormData } from '../validations';

interface ProfileFormFieldsProps {
  formData: AdminProfileFormData;
  isEditing: boolean;
  onChange: (field: keyof AdminProfileFormData, value: string) => void;
  errors?: Record<string, string>;
}

export const ProfileFormFields: React.FC<ProfileFormFieldsProps> = ({
  formData,
  isEditing,
  onChange,
  errors = {},
}) => {
  return (
    <div className="space-y-4">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Nombre completo
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onChange('name', e.target.value)}
          disabled={!isEditing}
          placeholder="Ingresa tu nombre completo"
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Correo electrónico
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => onChange('email', e.target.value)}
          disabled={!isEditing}
          placeholder="tu@email.com"
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email}</p>
        )}
      </div>

      {/* Password (only when editing) */}
      {isEditing && (
        <div className="space-y-2">
          <Label htmlFor="password" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Nueva contraseña (opcional)
          </Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => onChange('password', e.target.value)}
            placeholder="Dejar en blanco para mantener la actual"
          />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password}</p>
          )}
        </div>
      )}
    </div>
  );
};