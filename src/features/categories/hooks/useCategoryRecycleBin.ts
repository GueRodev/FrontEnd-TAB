/**
 * useCategoryRecycleBin Hook
 * Business logic for managing deleted categories in recycle bin
 */

import { useMemo } from 'react';
import { useCategories } from '../contexts';
import { useApi } from '@/hooks/useApi';
import { categoriesService } from '../services';
import { toast } from '@/hooks/use-toast';
import type { Category } from '../types';

export const useCategoryRecycleBin = () => {
  const { categories, restoreCategory, forceDeleteCategory } = useCategories();
  const { execute, isLoading } = useApi();

  /**
   * Get all soft-deleted categories
   */
  const deletedCategories = useMemo(() => {
    return categories.filter(cat => cat.deleted_at !== null && cat.deleted_at !== undefined);
  }, [categories]);

  /**
   * Count of deleted categories
   */
  const deletedCount = deletedCategories.length;

  /**
   * Restore a deleted category
   */
  const handleRestore = async (id: string) => {
    const category = deletedCategories.find(c => c.id === id);
    
    if (!category) {
      toast({
        title: 'Error',
        description: 'Categoría no encontrada',
        variant: 'destructive',
      });
      return;
    }

    await execute(
      async () => {
        const restoredCategory = await restoreCategory(id);
        return restoredCategory;
      },
      {
        successMessage: `La categoría "${category.name}" ha sido restaurada exitosamente`,
        errorMessage: 'No se pudo restaurar la categoría',
      }
    );
  };

  /**
   * Permanently delete a category (force delete)
   */
  const handleForceDelete = async (id: string) => {
    const category = deletedCategories.find(c => c.id === id);
    
    if (!category) {
      toast({
        title: 'Error',
        description: 'Categoría no encontrada',
        variant: 'destructive',
      });
      return;
    }

    // Confirmation is handled by parent component
    await execute(
      async () => {
        await forceDeleteCategory(id);
      },
      {
        successMessage: `La categoría "${category.name}" ha sido eliminada permanentemente`,
        errorMessage: 'No se pudo eliminar permanentemente la categoría',
      }
    );
  };

  /**
   * Get category by ID from recycle bin
   */
  const getDeletedCategory = (id: string): Category | undefined => {
    return deletedCategories.find(c => c.id === id);
  };

  /**
   * Check if category is in recycle bin
   */
  const isInRecycleBin = (id: string): boolean => {
    return deletedCategories.some(c => c.id === id);
  };

  /**
   * Get categories that will be auto-deleted soon (deleted > 25 days ago)
   */
  const expiringCategories = useMemo(() => {
    const twentyFiveDaysAgo = new Date();
    twentyFiveDaysAgo.setDate(twentyFiveDaysAgo.getDate() - 25);

    return deletedCategories.filter(cat => {
      if (!cat.deleted_at) return false;
      const deletedDate = new Date(cat.deleted_at);
      return deletedDate <= twentyFiveDaysAgo;
    });
  }, [deletedCategories]);

  return {
    // Data
    deletedCategories,
    deletedCount,
    expiringCategories,
    isLoading,

    // Actions
    handleRestore,
    handleForceDelete,

    // Utilities
    getDeletedCategory,
    isInRecycleBin,
  };
};
