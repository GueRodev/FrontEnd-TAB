/**
 * Account Page Business Logic Hook
 * Handles profile editing state and actions
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts';
import type { ProfileFormData } from '../validations';

export const useAccountPage = () => {
  const navigate = useNavigate();
  const { user, updateProfile, logout, isClient } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => setIsEditing(true);
  
  const handleCancel = () => setIsEditing(false);

  const handleSave = async (data: ProfileFormData) => {
    // Limpiar password vacío para no enviarlo al backend
    const cleanData = {
      ...data,
      password: data.password?.trim() || undefined,
    };
    
    // Remover el campo si está vacío
    if (!cleanData.password) {
      delete cleanData.password;
    }
    
    // Eliminar password_confirmation (solo es frontend)
    delete (cleanData as any).password_confirmation;
    
    await updateProfile(cleanData);
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return {
    user,
    isClient,
    isEditing,
    handleEdit,
    handleCancel,
    handleSave,
    handleLogout,
  };
};
