/**
 * useAdminProfile Hook
 * Manages admin profile state and operations
 */

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/api/services/auth.service';
import { adminProfileSchema, type AdminProfileFormData } from '@/lib/validations/user.validation';
import type { UserProfile } from '@/types/user.types';

interface UseAdminProfileReturn {
  isEditing: boolean;
  avatarFile: File | null;
  avatarPreview: string | null;
  formData: AdminProfileFormData;
  isUploading: boolean;
  errors: Record<string, string>;
  handleEdit: () => void;
  handleCancel: () => void;
  handleSave: () => Promise<void>;
  handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFieldChange: (field: keyof AdminProfileFormData, value: string) => void;
}

export const useAdminProfile = (user: UserProfile | null): UseAdminProfileReturn => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<AdminProfileFormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  // Initialize form data from user
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        password: '',
      });
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
    setErrors({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setAvatarFile(null);
    setAvatarPreview(null);
    setErrors({});
    
    // Restore original data
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        password: '',
      });
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Error',
        description: 'Por favor selecciona una imagen válida',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'La imagen no debe superar los 5MB',
        variant: 'destructive',
      });
      return;
    }

    setAvatarFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFieldChange = (field: keyof AdminProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSave = async () => {
    try {
      setIsUploading(true);
      setErrors({});

      // Validate form data
      const result = adminProfileSchema.safeParse(formData);
      
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.errors.forEach((error) => {
          if (error.path[0]) {
            fieldErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(fieldErrors);
        toast({
          title: 'Error de validación',
          description: 'Por favor corrige los errores en el formulario',
          variant: 'destructive',
        });
        return;
      }

      // Upload avatar if changed
      let avatarUrl: string | undefined;
      if (avatarFile) {
        const avatarResponse = await authService.uploadAvatar(avatarFile);
        avatarUrl = avatarResponse.data.avatarUrl;
      }

      // Update profile
      const updateData: Partial<UserProfile> = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '',
      };

      await authService.updateAdminProfile(updateData);

      toast({
        title: 'Éxito',
        description: 'Perfil actualizado correctamente',
      });

      setIsEditing(false);
      setAvatarFile(null);
      setAvatarPreview(null);
      setFormData(prev => ({ ...prev, password: '' }));
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al actualizar el perfil',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isEditing,
    avatarFile,
    avatarPreview,
    formData,
    isUploading,
    errors,
    handleEdit,
    handleCancel,
    handleSave,
    handleAvatarChange,
    handleFieldChange,
  };
};
