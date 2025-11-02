/**
 * Account Page Business Logic Hook
 * Handles profile editing state and actions
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts';
import type { ProfileFormData } from '@/lib/validations';

export const useAccountPage = () => {
  const navigate = useNavigate();
  const { user, updateProfile, logout, isClient } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => setIsEditing(true);
  
  const handleCancel = () => setIsEditing(false);

  const handleSave = async (data: ProfileFormData) => {
    await updateProfile(data);
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
