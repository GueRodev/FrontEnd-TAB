import React, { useState, useEffect } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/AdminSidebar';
import AdminHeader from '@/components/AdminHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, GripVertical, Edit2, Trash2, ChevronDown, ChevronRight, Save } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { useCategories, Category, Subcategory } from '@/contexts/CategoriesContext';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';

// Esquemas de validación
const categorySchema = z.object({
  name: z.string().trim().min(1, 'El nombre es requerido').max(50, 'El nombre debe tener máximo 50 caracteres'),
  description: z.string().trim().min(1, 'La descripción es requerida').max(200, 'La descripción debe tener máximo 200 caracteres'),
});

const subcategorySchema = z.object({
  name: z.string().trim().min(1, 'El nombre es requerido').max(50, 'El nombre debe tener máximo 50 caracteres'),
  description: z.string().trim().min(1, 'La descripción es requerida').max(200, 'La descripción debe tener máximo 200 caracteres'),
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
            <span className="font-medium">{category.name}</span>
          </div>
        </td>
        <td className="px-6 py-4 text-muted-foreground">{category.description}</td>
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
              <span className="text-sm">{sub.name}</span>
            </div>
          </td>
          <td className="px-6 py-3 text-sm text-muted-foreground">{sub.description}</td>
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
      <div className="p-4">
        <div className="flex items-start gap-2">
          <div className="flex flex-col items-center gap-1 flex-shrink-0 pt-1">
            <button
              className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-manipulation"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-5 w-5" />
            </button>
            <button
              onClick={() => onToggleExpand(category.id)}
              className="text-muted-foreground hover:text-foreground touch-manipulation"
            >
              {category.isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="mb-2">
              <h3 className="font-semibold text-base mb-1">{category.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {category.description}
              </p>
            </div>
            
            <div className="flex items-center justify-between mt-3 pt-2 border-t">
              <span className="text-sm text-muted-foreground">
                {category.subcategories.length} subcategorías
              </span>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(category)}
                  className="h-9 w-9 p-0"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(category.id)}
                  className="text-destructive hover:text-destructive h-9 w-9 p-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Subcategories */}
        {category.isExpanded && category.subcategories.length > 0 && (
          <div className="mt-3 ml-7 space-y-2">
            {category.subcategories.map((sub) => (
              <div key={sub.id} className="bg-muted/30 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <span className="text-xs text-muted-foreground flex-shrink-0 mt-1">└─</span>
                  <div className="flex-1 min-w-0">
                    <div className="mb-1">
                      <h4 className="font-medium text-sm mb-1">{sub.name}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">{sub.description}</p>
                    </div>
                    <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-border/50">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditSubcategory(category.id, sub)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteSubcategory(category.id, sub.id)}
                        className="text-destructive hover:text-destructive h-8 w-8 p-0"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
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
  const { categories, setCategories, updateCategoryOrder } = useCategories();
  const [searchQuery, setSearchQuery] = useState('');
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
    description: '',
  });

  // Estados para el formulario de agregar
  const [addFormData, setAddFormData] = useState({
    name: '',
    description: '',
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

  const handleSaveChanges = () => {
    updateCategoryOrder(pendingCategories);
    setHasUnsavedChanges(false);
    
    toast({
      title: "Cambios guardados",
      description: "El orden de las categorías se ha actualizado en el sitio web",
    });
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
    setAddFormData({ name: '', description: '' });
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
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (modalType === 'category') {
        // Validar datos de categoría
        const validatedData = categorySchema.parse(addFormData);
        
        const newCategory: Category = {
          id: `cat-${Date.now()}`,
          name: validatedData.name,
          description: validatedData.description,
          order: categories.length + 1,
          slug: generateSlug(validatedData.name),
          subcategories: [],
          isExpanded: false,
        };

        const updatedCategories = [...categories, newCategory];
        setCategories(updatedCategories);
        setPendingCategories(updatedCategories);

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

        const parentCategory = categories.find(cat => cat.id === selectedCategoryId);
        
        if (!parentCategory) {
          toast({
            title: "Error",
            description: "No se encontró la categoría padre",
            variant: "destructive",
          });
          return;
        }

        const newSubcategory: Subcategory = {
          id: `sub-${Date.now()}`,
          name: validatedData.name,
          description: validatedData.description,
          order: parentCategory.subcategories.length + 1,
          slug: generateSlug(validatedData.name, parentCategory.slug),
        };

        const updatedCategories = categories.map(cat => {
          if (cat.id === selectedCategoryId) {
            return {
              ...cat,
              subcategories: [...cat.subcategories, newSubcategory],
            };
          }
          return cat;
        });

        setCategories(updatedCategories);
        setPendingCategories(updatedCategories);

        toast({
          title: "Subcategoría creada",
          description: `La subcategoría "${validatedData.name}" se ha creado exitosamente`,
        });
      }

      // Resetear formulario y cerrar modal
      setAddFormData({ name: '', description: '' });
      setIsModalOpen(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast({
          title: "Error de validación",
          description: firstError.message,
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
      description: category.description,
    });
    setIsEditCategoryOpen(true);
  };

  const handleDelete = (id: string) => {
    console.log('Delete category:', id);
  };

  const handleEditSubcategory = (categoryId: string, subcategory: Subcategory) => {
    setSelectedCategoryId(categoryId);
    setEditingSubcategory(subcategory);
    setEditFormData({
      name: subcategory.name,
      description: subcategory.description,
    });
    setIsEditSubcategoryOpen(true);
  };

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

    // Eliminar la subcategoría
    const updatedCategories = categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          subcategories: cat.subcategories.filter(sub => sub.id !== subcategoryId),
        };
      }
      return cat;
    });

    setCategories(updatedCategories);
    setPendingCategories(updatedCategories);

    toast({
      title: "Subcategoría eliminada",
      description: `La subcategoría "${subcategory.name}" se ha eliminado exitosamente`,
    });
  };

  const handleUpdateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí implementarás la lógica para actualizar la categoría
    console.log('Updating category:', editingCategory?.id, editFormData);
    setIsEditCategoryOpen(false);
    setEditingCategory(null);
    setEditFormData({ name: '', description: '' });
  };

  const handleUpdateSubcategory = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí implementarás la lógica para actualizar la subcategoría
    console.log('Updating subcategory:', editingSubcategory?.id, editFormData);
    setIsEditSubcategoryOpen(false);
    setEditingSubcategory(null);
    setEditFormData({ name: '', description: '' });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <SidebarInset className="flex-1">
          <AdminHeader title="Gestión de Categorías" />

          <div className="flex-1 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
              <div className="mb-4 md:mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold mb-1 md:mb-2">Categorías y Subcategorías</h1>
                <p className="text-muted-foreground text-sm md:text-base">
                  Gestiona las categorías de productos. Arrastra para cambiar el orden de visualización.
                </p>
              </div>

              <div className="bg-card rounded-lg shadow-sm border">
                <div className="p-4 md:p-6 border-b space-y-3">
                  <div className="flex flex-col gap-3 items-center">
                    <div className="flex flex-col sm:flex-row gap-2 w-full max-w-2xl">
                      <Button 
                        onClick={() => handleOpenModal('category')}
                        className="w-full sm:flex-1"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Categoría
                      </Button>
                      <Button 
                        variant="outline"
                        className="w-full sm:flex-1"
                        onClick={() => {
                          if (categories.length > 0) {
                            handleOpenModal('subcategory', categories[0].id);
                          }
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Subcategoría
                      </Button>
                    </div>

                    {hasUnsavedChanges && (
                      <div className="flex flex-col sm:flex-row gap-2 w-full max-w-2xl">
                        <Button 
                          onClick={handleSaveChanges}
                          className="w-full sm:flex-1"
                          variant="default"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Guardar Cambios
                        </Button>
                        <Button 
                          onClick={handleCancelChanges}
                          variant="outline"
                          className="w-full sm:flex-1"
                        >
                          Descartar Cambios
                        </Button>
                      </div>
                    )}
                    
                    <div className="relative w-full max-w-2xl">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        type="text"
                        placeholder="Buscar categorías..."
                        className="pl-10 w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium">Nombre</th>
                        <th className="px-6 py-3 text-left text-sm font-medium">Descripción</th>
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
        <DialogContent className="max-w-md mx-4">
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

            <div className="space-y-2">
              <Label htmlFor="description">Descripción *</Label>
              <Input
                id="description"
                placeholder="Breve descripción"
                value={addFormData.description}
                onChange={(e) => setAddFormData({ ...addFormData, description: e.target.value })}
                maxLength={200}
                required
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsModalOpen(false);
                setAddFormData({ name: '', description: '' });
              }} 
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleAddItem} 
              className="w-full sm:w-auto"
              disabled={!addFormData.name.trim() || !addFormData.description.trim() || (modalType === 'subcategory' && !selectedCategoryId)}
            >
              Guardar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para Editar Categoría */}
      <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
        <DialogContent className="max-w-md mx-4">
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

            <div className="space-y-2">
              <Label htmlFor="edit-cat-description">Descripción *</Label>
              <Input
                id="edit-cat-description"
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                placeholder="Breve descripción"
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
        <DialogContent className="max-w-md mx-4">
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

            <div className="space-y-2">
              <Label htmlFor="edit-sub-description">Descripción *</Label>
              <Input
                id="edit-sub-description"
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                placeholder="Breve descripción"
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
    </SidebarProvider>
  );
};

export default AdminCategorias;
