/**
 * CategoryCard Component
 * Sortable card for mobile view with subcategories
 */

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { GripVertical, Edit2, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import type { Category, Subcategory } from '@/features/products';

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  onToggleExpand: (id: string) => void;
  onEditSubcategory: (categoryId: string, subcategory: Subcategory) => void;
  onDeleteSubcategory: (categoryId: string, subcategoryId: string) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
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
