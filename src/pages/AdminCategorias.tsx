import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, GripVertical, Edit2, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
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

interface Category {
  id: string;
  name: string;
  description: string;
  order: number;
  subcategories: Subcategory[];
  isExpanded?: boolean;
}

interface Subcategory {
  id: string;
  name: string;
  description: string;
  order: number;
}

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

const AdminCategorias: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'category' | 'subcategory'>('category');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

  const [categories, setCategories] = useState<Category[]>([
    {
      id: '1',
      name: 'Sets de Construcción',
      description: 'Todos los sets de construcción disponibles',
      order: 1,
      isExpanded: false,
      subcategories: [
        { id: 's1', name: 'Star Wars', description: 'Sets temáticos de Star Wars', order: 1 },
        { id: 's2', name: 'City', description: 'Sets de la ciudad', order: 2 },
      ],
    },
    {
      id: '2',
      name: 'Figuras',
      description: 'Minifiguras y personajes',
      order: 2,
      isExpanded: false,
      subcategories: [
        { id: 's3', name: 'Superhéroes', description: 'Figuras de superhéroes', order: 1 },
      ],
    },
    {
      id: '3',
      name: 'Accesorios',
      description: 'Accesorios y piezas sueltas',
      order: 3,
      isExpanded: false,
      subcategories: [],
    },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setCategories((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        const newItems = arrayMove(items, oldIndex, newIndex);
        return newItems.map((item, index) => ({ ...item, order: index + 1 }));
      });
    }
  };

  const handleOpenModal = (type: 'category' | 'subcategory', categoryId?: string) => {
    setModalType(type);
    if (categoryId) setSelectedCategoryId(categoryId);
    setIsModalOpen(true);
  };

  const handleToggleExpand = (id: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === id ? { ...cat, isExpanded: !cat.isExpanded } : cat
      )
    );
  };

  const handleEdit = (category: Category) => {
    console.log('Edit category:', category);
  };

  const handleDelete = (id: string) => {
    console.log('Delete category:', id);
  };

  const handleEditSubcategory = (categoryId: string, subcategory: Subcategory) => {
    console.log('Edit subcategory:', subcategory);
  };

  const handleDeleteSubcategory = (categoryId: string, subcategoryId: string) => {
    console.log('Delete subcategory:', subcategoryId);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        
        <main className="flex-1 flex flex-col bg-background">
          <header className="bg-card border-b px-6 py-4 flex items-center gap-4">
            <SidebarTrigger />
            <h2 className="text-xl font-semibold">Gestión de Categorías</h2>
          </header>

          <div className="flex-1 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Categorías y Subcategorías</h1>
                <p className="text-muted-foreground">
                  Gestiona las categorías de productos. Arrastra para cambiar el orden de visualización.
                </p>
              </div>

              <div className="bg-card rounded-lg shadow-sm border">
                <div className="p-6 border-b flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex gap-3 flex-1">
                    <Button onClick={() => handleOpenModal('category')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Categoría
                    </Button>
                    <Button 
                      variant="outline"
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
                  
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Buscar categorías..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
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
                          items={categories.map((cat) => cat.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          {categories.map((category) => (
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
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal para Agregar/Editar */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {modalType === 'category' ? 'Agregar Categoría' : 'Agregar Subcategoría'}
            </DialogTitle>
            <DialogDescription>
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
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                placeholder={modalType === 'category' ? 'Ej: Sets de Construcción' : 'Ej: Star Wars'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                placeholder="Breve descripción"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>
              Guardar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default AdminCategorias;
