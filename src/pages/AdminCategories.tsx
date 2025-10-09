import React, { useState, useEffect } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/AdminSidebar';
import AdminHeader from '@/components/AdminHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, GripVertical, Edit2, Trash2, ChevronDown, ChevronRight, Save } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useCategories } from '@/contexts/CategoriesContext';
import type { Category, Subcategory } from '@/types/product.types';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';

// Esquemas de validación
const categorySchema = z.object({
  name: z.string().trim().min(1, 'El nombre es requerido').max(50, 'El nombre debe tener máximo 50 caracteres'),
});

const subcategorySchema = z.object({
  name: z.string().trim().min(1, 'El nombre es requerido').max(50, 'El nombre debe tener máximo 50 caracteres'),
  categoryId: z.string().min(1, 'Debe seleccionar una categoría padre'),
});

interface SortableRowProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  onToggleExpand: (id: string) => void;
  onEditSubcategory: (categoryId: string, subcategory: Subcategory) => void;
  onDeleteSubcategory: (categoryId: string, subcategoryId: string) => void;
}

const SortableRow: React.FC<SortableRowProps> = ({ 
  category, 
  onEdit, 
  onDelete, 
  onToggleExpand,
  onEditSubcategory,
  onDeleteSubcategory
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <>
      <tr ref={setNodeRef} style={style} className="border-b hover:bg-muted/50">
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <button
              className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-5 w-5" />
            </button>
            <button
              onClick={() => onToggleExpand(category.id)}
              className="text-muted-foreground hover:text-foreground"
            >
              {category.isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            <div>
              <div className="font-medium">{category.name}</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 text-center">{category.subcategories.length}</td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(category)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(category.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </td>
      </tr>
      {category.isExpanded && category.subcategories.map((sub) => (
        <tr key={sub.id} className="border-b bg-muted/30 hover:bg-muted/50">
          <td className="px-6 py-3">
            <div className="flex items-center gap-2 pl-12">
              <span className="text-sm text-muted-foreground">└─</span>
              <div>
                <div className="text-sm font-medium">{sub.name}</div>
              </div>
            </div>
          </td>
          <td className="px-6 py-3"></td>
          <td className="px-6 py-3">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEditSubcategory(category.id, sub)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeleteSubcategory(category.id, sub.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};

// Mobile Sortable Card Component
const SortableCard: React.FC<SortableRowProps> = ({ 
  category, 
  onEdit, 
  onDelete, 
  onToggleExpand,
  onEditSubcategory,
  onDeleteSubcategory
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className="border-b last:border-b-0"
    >
      <div className="p-3">
        <div className="flex items-start gap-2">
          <div className="flex flex-col items-center gap-1 flex-shrink-0 pt-0.5">
            <button
              className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-manipulation"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-4 w-4" />
            </button>
            <button
              onClick={() => onToggleExpand(category.id)}
              className="text-muted-foreground hover:text-foreground touch-manipulation"
            >
              {category.isExpanded ? (
                <ChevronDown className="h-3.5 w-3.5" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="mb-2">
              <h3 className="font-semibold text-sm mb-0.5">{category.name}</h3>
            </div>
            
            <div className="flex items-center justify-between mt-2 pt-2 border-t">
              <span className="text-xs text-muted-foreground">
                {category.subcategories.length} subcategorías
              </span>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(category)}
                  className="h-7 w-7 p-0"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(category.id)}
                  className="text-destructive hover:text-destructive h-7 w-7 p-0"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Subcategories */}
        {category.isExpanded && category.subcategories.length > 0 && (
          <div className="mt-2 ml-6 space-y-2">
            {category.subcategories.map((sub) => (
              <div key={sub.id} className="bg-muted/30 rounded-lg p-2.5">
                <div className="flex items-start gap-2">
                  <span className="text-xs text-muted-foreground flex-shrink-0 mt-0.5">└─</span>
                  <div className="flex-1 min-w-0">
                    <div className="mb-1">
                      <h4 className="font-medium text-xs mb-0.5">{sub.name}</h4>
                    </div>
                    <div className="flex items-center justify-end gap-1 mt-1.5 pt-1.5 border-t border-border/50">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditSubcategory(category.id, sub)}
                        className="h-6 w-6 p-0"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteSubcategory(category.id, sub.id)}
                        className="text-destructive hover:text-destructive h-6 w-6 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const AdminCategorias: React.FC = () => {
  const { 
    categories, 
    loading,
    setCategories, 
    addCategory,
    updateCategory,
    deleteCategory,
    addSubcategory,
    updateSubcategory,
    deleteSubcategory,
    reorderCategories,
  } = useCategories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'category' | 'subcategory'>('category');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  
  // Estados para cambios pendientes
  const [pendingCategories, setPendingCategories] = useState<Category[]>(categories);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Estados para edición
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [isEditSubcategoryOpen, setIsEditSubcategoryOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
  });

  // Estados para el formulario de agregar
  const [addFormData, setAddFormData] = useState({
    name: '',
  });

  // Estados para confirmación de eliminación de subcategoría
  const [deleteSubcategoryDialog, setDeleteSubcategoryDialog] = useState<{
    open: boolean;
    categoryId: string;
    subcategoryId: string;
    subcategoryName: string;
  }>({
    open: false,
    categoryId: '',
    subcategoryId: '',
    subcategoryName: '',
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Sincronizar pendingCategories cuando categories cambie desde el contexto
  useEffect(() => {
    if (!hasUnsavedChanges) {
      setPendingCategories(categories);
    }
  }, [categories, hasUnsavedChanges]);

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

  const handleOpenModal = (type: 'category' | 'subcategory', categoryId?: string) => {
    setModalType(type);
    if (categoryId) setSelectedCategoryId(categoryId);
    setAddFormData({ name: '' });
    setIsModalOpen(true);
  };

  // Función auxiliar para generar slug
  const generateSlug = (name: string, parentSlug?: string): string => {
    const baseSlug = name
      .toLowerCase()
      .trim()
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/ñ/g, 'n')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    return parentSlug ? `${parentSlug}/${baseSlug}` : baseSlug;
  };

  // Función para agregar categoría o subcategoría
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (modalType === 'category') {
        // Validar datos de categoría
        const validatedData = categorySchema.parse(addFormData);
        
        await addCategory({ name: validatedData.name });

        toast({
          title: "Categoría creada",
          description: `La categoría "${validatedData.name}" se ha creado exitosamente`,
        });
      } else {
        // Validar datos de subcategoría
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

      // Resetear formulario y cerrar modal
      setAddFormData({ name: '' });
      setIsModalOpen(false);
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

  const handleToggleExpand = (id: string) => {
    setPendingCategories(
      pendingCategories.map((cat) =>
        cat.id === id ? { ...cat, isExpanded: !cat.isExpanded } : cat
      )
    );
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setEditFormData({
      name: category.name,
    });
    setIsEditCategoryOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      setPendingCategories(pendingCategories.filter(cat => cat.id !== id));
      toast({
        title: "Categoría eliminada",
        description: "La categoría se ha eliminado exitosamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la categoría",
        variant: "destructive",
      });
    }
  };

  const handleEditSubcategory = (categoryId: string, subcategory: Subcategory) => {
    setSelectedCategoryId(categoryId);
    setEditingSubcategory(subcategory);
    setEditFormData({
      name: subcategory.name,
    });
    setIsEditSubcategoryOpen(true);
  };

  // Abrir diálogo de confirmación para eliminar subcategoría
  const handleDeleteSubcategory = (categoryId: string, subcategoryId: string) => {
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

    // Abrir diálogo de confirmación antes de eliminar
    setDeleteSubcategoryDialog({
      open: true,
      categoryId,
      subcategoryId,
      subcategoryName: subcategory.name,
    });
  };

  // Confirmar eliminación de subcategoría
  const confirmDeleteSubcategory = async () => {
    const { categoryId, subcategoryId, subcategoryName } = deleteSubcategoryDialog;

    try {
      await deleteSubcategory(categoryId, subcategoryId);
      
      setPendingCategories(pendingCategories.map(cat => 
        cat.id === categoryId
          ? { ...cat, subcategories: cat.subcategories.filter(sub => sub.id !== subcategoryId) }
          : cat
      ));

      // Cerrar el diálogo
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

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <SidebarInset className="flex-1">
          <AdminHeader title="Gestión de Categorías" />

          <div className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
              {/* Page Header */}
              <div className="flex flex-col gap-4">
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 md:mb-2">
                    Categorías
                  </h1>
                  <p className="text-gray-600 text-sm md:text-base lg:text-lg">
                    Gestiona la Categoría de Productos
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <Button 
                  onClick={() => handleOpenModal('category')}
                  className="w-full sm:w-auto"
                  disabled={loading}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Categoría
                </Button>
                <Button 
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    if (categories.length > 0) {
                      handleOpenModal('subcategory', categories[0].id);
                    }
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Subcategoría
                </Button>
                
                {hasUnsavedChanges && (
                  <>
                    <Button 
                      onClick={handleSaveChanges}
                      className="w-full sm:w-auto"
                      variant="default"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Guardar Cambios
                    </Button>
                    <Button 
                      onClick={handleCancelChanges}
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      Descartar Cambios
                    </Button>
                  </>
                )}
              </div>

              {/* Categories Table/Cards */}
              <div className="bg-card rounded-lg shadow-sm border">

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium">Nombre</th>
                        <th className="px-6 py-3 text-center text-sm font-medium">Subcategorías</th>
                        <th className="px-6 py-3 text-left text-sm font-medium">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                      >
                        <SortableContext
                          items={pendingCategories.map((cat) => cat.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          {pendingCategories.map((category) => (
                            <SortableRow
                              key={category.id}
                              category={category}
                              onEdit={handleEdit}
                              onDelete={handleDelete}
                              onToggleExpand={handleToggleExpand}
                              onEditSubcategory={handleEditSubcategory}
                              onDeleteSubcategory={handleDeleteSubcategory}
                            />
                          ))}
                        </SortableContext>
                      </DndContext>
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={pendingCategories.map((cat) => cat.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {pendingCategories.map((category) => (
                        <SortableCard
                          key={category.id}
                          category={category}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          onToggleExpand={handleToggleExpand}
                          onEditSubcategory={handleEditSubcategory}
                          onDeleteSubcategory={handleDeleteSubcategory}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>

      {/* Modal para Agregar */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md w-[calc(100%-2rem)] sm:w-full">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl">
              {modalType === 'category' ? 'Agregar Categoría' : 'Agregar Subcategoría'}
            </DialogTitle>
            <DialogDescription className="text-sm">
              {modalType === 'category' 
                ? 'Completa los datos de la nueva categoría'
                : 'Completa los datos de la nueva subcategoría'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {modalType === 'subcategory' && (
              <div className="space-y-2">
                <Label htmlFor="parent-category">Categoría Padre</Label>
                <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                placeholder={modalType === 'category' ? 'Ej: Sets de Construcción' : 'Ej: Star Wars'}
                value={addFormData.name}
                onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
                maxLength={50}
                required
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsModalOpen(false);
                setAddFormData({ name: '' });
              }} 
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleAddItem} 
              className="w-full sm:w-auto"
              disabled={!addFormData.name.trim() || (modalType === 'subcategory' && !selectedCategoryId) || loading}
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para Editar Categoría */}
      <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
        <DialogContent className="max-w-md w-[calc(100%-2rem)] sm:w-full">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl">
              Editar Categoría
            </DialogTitle>
            <DialogDescription className="text-sm">
              Modifica los datos de la categoría
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateCategory} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-cat-name">Nombre *</Label>
              <Input
                id="edit-cat-name"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                placeholder="Ej: Sets de Construcción"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditCategoryOpen(false)} 
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button type="submit" className="w-full sm:w-auto">
                Actualizar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal para Editar Subcategoría */}
      <Dialog open={isEditSubcategoryOpen} onOpenChange={setIsEditSubcategoryOpen}>
        <DialogContent className="max-w-md w-[calc(100%-2rem)] sm:w-full">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl">
              Editar Subcategoría
            </DialogTitle>
            <DialogDescription className="text-sm">
              Modifica los datos de la subcategoría
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateSubcategory} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-sub-category">Categoría Padre</Label>
              <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-sub-name">Nombre *</Label>
              <Input
                id="edit-sub-name"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                placeholder="Ej: Star Wars"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditSubcategoryOpen(false)} 
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button type="submit" className="w-full sm:w-auto">
                Actualizar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* AlertDialog para confirmar eliminación de subcategoría */}
      {/* NOTA IMPORTANTE PARA BASE DE DATOS:
          Cuando se conecte a Supabase/base de datos, este diálogo debe:
          1. Validar si existen productos asociados a la subcategoría antes de mostrar
          2. Si hay productos, mostrar opción de reasignar o prevenir eliminación
          3. Mostrar cantidad de productos afectados en el mensaje
          4. Implementar rollback en caso de error durante la eliminación
      */}
      <AlertDialog 
        open={deleteSubcategoryDialog.open} 
        onOpenChange={(open) => 
          setDeleteSubcategoryDialog({ ...deleteSubcategoryDialog, open })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de eliminar la subcategoría <strong>"{deleteSubcategoryDialog.subcategoryName}"</strong>.
              <br /><br />
              Esta acción no se puede deshacer. 
              {/* TODO: Cuando se conecte a BD, agregar aquí: */}
              {/* "Esto también afectará a X productos asociados." */}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteSubcategory}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
};

export default AdminCategorias;
