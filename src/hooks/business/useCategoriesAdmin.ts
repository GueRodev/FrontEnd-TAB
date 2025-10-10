/**
 * Categories Admin Business Logic Hook
 * Manages all business logic for category management in admin panel
 */

import { useState, useEffect } from 'react';
import { useCategories } from '@/contexts/CategoriesContext';
import type { Category, Subcategory } from '@/types/product.types';
import { toast } from '@/hooks/use-toast';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { z } from 'zod';
import { categorySchema, subcategorySchema } from '@/lib/validations/category.validation';

export type ModalType = 'category' | 'subcategory';
export type DialogMode = 'add' | 'edit';

interface FormData {
  name: string;
}

interface DeleteSubcategoryDialog {
  open: boolean;
  categoryId: string;
  subcategoryId: string;
  subcategoryName: string;
}

interface DeleteCategoryDialog {
  open: boolean;
  categoryId: string;
  categoryName: string;
}

export const useCategoriesAdmin = () => {
  const {
    categories,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
    addSubcategory,
    updateSubcategory,
    deleteSubcategory,
    reorderCategories,
    setCategories,
  } = useCategories();

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>('category');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

  // Edit states
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [isEditSubcategoryOpen, setIsEditSubcategoryOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);

  // Form states
  const [addFormData, setAddFormData] = useState<FormData>({ name: '' });
  const [editFormData, setEditFormData] = useState<FormData>({ name: '' });

  // Drag & Drop states
  const [pendingCategories, setPendingCategories] = useState<Category[]>(categories);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Delete confirmation states
  const [deleteSubcategoryDialog, setDeleteSubcategoryDialog] = useState<DeleteSubcategoryDialog>({
    open: false,
    categoryId: '',
    subcategoryId: '',
    subcategoryName: '',
  });

  const [deleteCategoryDialog, setDeleteCategoryDialog] = useState<DeleteCategoryDialog>({
    open: false,
    categoryId: '',
    categoryName: '',
  });

  // Sync pending categories when categories change
  useEffect(() => {
    if (!hasUnsavedChanges) {
      setPendingCategories(categories);
    }
  }, [categories, hasUnsavedChanges]);

  // Drag & Drop handlers
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = pendingCategories.findIndex((item) => item.id === active.id);
      const newIndex = pendingCategories.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(pendingCategories, oldIndex, newIndex);
      setPendingCategories(newItems);
      setHasUnsavedChanges(true);
    }
  };

  const handleSaveChanges = async () => {
    try {
      await reorderCategories(pendingCategories);
      setHasUnsavedChanges(false);

      toast({
        title: "Cambios guardados",
        description: "El orden de las categorías se ha actualizado correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el orden de las categorías",
        variant: "destructive",
      });
    }
  };

  const handleCancelChanges = () => {
    setPendingCategories(categories);
    setHasUnsavedChanges(false);

    toast({
      title: "Cambios descartados",
      description: "Se ha restaurado el orden original de las categorías",
    });
  };

  // Modal handlers
  const openAddModal = (type: ModalType, categoryId?: string) => {
    setModalType(type);
    if (categoryId) setSelectedCategoryId(categoryId);
    setAddFormData({ name: '' });
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setAddFormData({ name: '' });
  };

  // Add handlers
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (modalType === 'category') {
        const validatedData = categorySchema.parse(addFormData);
        await addCategory({ name: validatedData.name });

        toast({
          title: "Categoría creada",
          description: `La categoría "${validatedData.name}" se ha creado exitosamente`,
        });
      } else {
        const validatedData = subcategorySchema.parse({
          ...addFormData,
          categoryId: selectedCategoryId,
        });

        await addSubcategory(selectedCategoryId, { name: validatedData.name });

        toast({
          title: "Subcategoría creada",
          description: `La subcategoría "${validatedData.name}" se ha creado exitosamente`,
        });
      }

      closeAddModal();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast({
          title: "Error de validación",
          description: firstError.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: modalType === 'category'
            ? "No se pudo crear la categoría"
            : "No se pudo crear la subcategoría",
          variant: "destructive",
        });
      }
    }
  };

  // Edit handlers
  const openEditCategory = (category: Category) => {
    setEditingCategory(category);
    setEditFormData({ name: category.name });
    setIsEditCategoryOpen(true);
  };

  const openEditSubcategory = (categoryId: string, subcategory: Subcategory) => {
    setSelectedCategoryId(categoryId);
    setEditingSubcategory(subcategory);
    setEditFormData({ name: subcategory.name });
    setIsEditSubcategoryOpen(true);
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingCategory) return;

    try {
      const validatedData = categorySchema.parse(editFormData);

      await updateCategory(editingCategory.id, { name: validatedData.name });

      setPendingCategories(pendingCategories.map(cat =>
        cat.id === editingCategory.id
          ? { ...cat, name: validatedData.name }
          : cat
      ));

      toast({
        title: "Categoría actualizada",
        description: "Los cambios se han guardado exitosamente",
      });

      setIsEditCategoryOpen(false);
      setEditingCategory(null);
      setEditFormData({ name: '' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast({
          title: "Error de validación",
          description: firstError.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "No se pudo actualizar la categoría",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpdateSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingSubcategory) return;

    try {
      const validatedData = subcategorySchema.parse({
        name: editFormData.name,
        categoryId: selectedCategoryId,
      });

      const currentCategory = categories.find(cat =>
        cat.subcategories.some(sub => sub.id === editingSubcategory.id)
      );

      if (!currentCategory) {
        throw new Error('Category not found');
      }

      await updateSubcategory(
        currentCategory.id,
        editingSubcategory.id,
        {
          name: validatedData.name,
          newCategoryId: selectedCategoryId !== currentCategory.id ? selectedCategoryId : undefined,
        }
      );

      toast({
        title: "Subcategoría actualizada",
        description: "Los cambios se han guardado exitosamente",
      });

      setIsEditSubcategoryOpen(false);
      setEditingSubcategory(null);
      setEditFormData({ name: '' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast({
          title: "Error de validación",
          description: firstError.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "No se pudo actualizar la subcategoría",
          variant: "destructive",
        });
      }
    }
  };

  // Delete handlers
  const openDeleteCategoryDialog = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);

    if (!category) {
      toast({
        title: "Error",
        description: "No se encontró la categoría",
        variant: "destructive",
      });
      return;
    }

    setDeleteCategoryDialog({
      open: true,
      categoryId,
      categoryName: category.name,
    });
  };

  const confirmDeleteCategory = async () => {
    const { categoryId, categoryName } = deleteCategoryDialog;

    try {
      await deleteCategory(categoryId);
      setPendingCategories(pendingCategories.filter(cat => cat.id !== categoryId));

      setDeleteCategoryDialog({
        open: false,
        categoryId: '',
        categoryName: '',
      });

      toast({
        title: "Categoría eliminada",
        description: `La categoría "${categoryName}" se ha eliminado exitosamente`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la categoría",
        variant: "destructive",
      });
    }
  };

  const openDeleteSubcategoryDialog = (categoryId: string, subcategoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    const subcategory = category?.subcategories.find(sub => sub.id === subcategoryId);

    if (!subcategory) {
      toast({
        title: "Error",
        description: "No se encontró la subcategoría",
        variant: "destructive",
      });
      return;
    }

    setDeleteSubcategoryDialog({
      open: true,
      categoryId,
      subcategoryId,
      subcategoryName: subcategory.name,
    });
  };

  const confirmDeleteSubcategory = async () => {
    const { categoryId, subcategoryId, subcategoryName } = deleteSubcategoryDialog;

    try {
      await deleteSubcategory(categoryId, subcategoryId);

      setPendingCategories(pendingCategories.map(cat =>
        cat.id === categoryId
          ? { ...cat, subcategories: cat.subcategories.filter(sub => sub.id !== subcategoryId) }
          : cat
      ));

      setDeleteSubcategoryDialog({
        open: false,
        categoryId: '',
        subcategoryId: '',
        subcategoryName: '',
      });

      toast({
        title: "Subcategoría eliminada",
        description: `La subcategoría "${subcategoryName}" se ha eliminado exitosamente`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la subcategoría",
        variant: "destructive",
      });
    }
  };

  // Toggle expand
  const handleToggleExpand = (id: string) => {
    setPendingCategories(
      pendingCategories.map((cat) =>
        cat.id === id ? { ...cat, isExpanded: !cat.isExpanded } : cat
      )
    );
  };

  return {
    // Data
    categories,
    pendingCategories,
    loading,
    hasUnsavedChanges,

    // Modal states
    isAddModalOpen,
    modalType,
    selectedCategoryId,
    setSelectedCategoryId,

    // Edit states
    isEditCategoryOpen,
    setIsEditCategoryOpen,
    isEditSubcategoryOpen,
    setIsEditSubcategoryOpen,
    editingCategory,
    editingSubcategory,

    // Form data
    addFormData,
    setAddFormData,
    editFormData,
    setEditFormData,

    // Delete dialog
    deleteSubcategoryDialog,
    setDeleteSubcategoryDialog,
    deleteCategoryDialog,
    setDeleteCategoryDialog,

    // Handlers
    handleDragEnd,
    handleSaveChanges,
    handleCancelChanges,
    openAddModal,
    closeAddModal,
    handleAddItem,
    openEditCategory,
    openEditSubcategory,
    handleUpdateCategory,
    handleUpdateSubcategory,
    openDeleteCategoryDialog,
    confirmDeleteCategory,
    openDeleteSubcategoryDialog,
    confirmDeleteSubcategory,
    handleToggleExpand,
  };
};
