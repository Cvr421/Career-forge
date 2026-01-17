import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { Company, Section } from '@/types';
import { useCompanyStore } from '@/store/companyStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { GripVertical, Plus, Edit, Trash2, Eye, EyeOff, LayoutGrid, Users, Heart, Gift, FileText } from 'lucide-react';

interface SectionsManagerProps {
  company: Company;
}

const sectionTypes = [
  { type: 'hero' as const, label: 'Hero', icon: LayoutGrid },
  { type: 'about' as const, label: 'About Us', icon: Users },
  { type: 'culture' as const, label: 'Culture & Values', icon: Heart },
  { type: 'perks' as const, label: 'Perks & Benefits', icon: Gift },
  { type: 'custom' as const, label: 'Custom Section', icon: FileText },
];

interface SortableItemProps {
  section: Section;
  onEdit: () => void;
  onDelete: () => void;
  onToggleVisibility: () => void;
}

const SortableItem = ({ section, onEdit, onDelete, onToggleVisibility }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const sectionType = sectionTypes.find((t) => t.type === section.type);
  const Icon = sectionType?.icon || FileText;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-3 rounded-lg border border-border bg-card p-3 ${
        isDragging ? 'opacity-50' : ''
      }`}
      layout
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-5 w-5" />
      </button>

      <div className="flex flex-1 items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-muted">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {sectionType?.label || section.type}
            </Badge>
          </div>
          <p className="truncate text-sm text-muted-foreground">
            {section.data.title}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleVisibility}
          className="text-muted-foreground hover:text-foreground"
          aria-label={section.visible ? 'Hide section' : 'Show section'}
        >
          {section.visible ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
        </button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export const SectionsManager = ({ company }: SectionsManagerProps) => {
  const { updateCompany } = useCompanyStore();
  const [sections, setSections] = useState<Section[]>(company.sections);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);

      const newSections = arrayMove(sections, oldIndex, newIndex).map(
        (s, i) => ({ ...s, order: i })
      );

      setSections(newSections);
      await updateCompany(company.id, { sections: newSections });
      toast.success('Sections reordered');
    }
  };

  const handleAddSection = async (type: Section['type']) => {
    const newSection: Section = {
      id: Date.now().toString(),
      type,
      visible: true,
      order: sections.length,
      data: {
        title: sectionTypes.find((t) => t.type === type)?.label || 'New Section',
        content: '',
      },
    };

    const newSections = [...sections, newSection];
    setSections(newSections);
    await updateCompany(company.id, { sections: newSections });
    toast.success('Section added');
    setEditingSection(newSection);
    setIsDialogOpen(true);
  };

  const handleEditSection = (section: Section) => {
    setEditingSection({ ...section });
    setIsDialogOpen(true);
  };

  const handleSaveSection = async () => {
    if (!editingSection) return;

    const newSections = sections.map((s) =>
      s.id === editingSection.id ? editingSection : s
    );

    setSections(newSections);
    await updateCompany(company.id, { sections: newSections });
    toast.success('Section saved');
    setIsDialogOpen(false);
    setEditingSection(null);
  };

  const handleDeleteSection = async (id: string) => {
    const newSections = sections
      .filter((s) => s.id !== id)
      .map((s, i) => ({ ...s, order: i }));

    setSections(newSections);
    await updateCompany(company.id, { sections: newSections });
    toast.success('Section deleted');
  };

  const handleToggleVisibility = async (id: string) => {
    const newSections = sections.map((s) =>
      s.id === id ? { ...s, visible: !s.visible } : s
    );

    setSections(newSections);
    await updateCompany(company.id, { sections: newSections });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">Page Sections</h3>
          <p className="text-sm text-muted-foreground">
            Drag to reorder, click to edit
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {sectionTypes.map((type) => (
              <DropdownMenuItem
                key={type.type}
                onClick={() => handleAddSection(type.type)}
                className="gap-2"
              >
                <type.icon className="h-4 w-4" />
                {type.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sections.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            <AnimatePresence>
              {sections
                .sort((a, b) => a.order - b.order)
                .map((section) => (
                  <SortableItem
                    key={section.id}
                    section={section}
                    onEdit={() => handleEditSection(section)}
                    onDelete={() => handleDeleteSection(section.id)}
                    onToggleVisibility={() => handleToggleVisibility(section.id)}
                  />
                ))}
            </AnimatePresence>
          </div>
        </SortableContext>
      </DndContext>

      {/* Edit Section Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Section</DialogTitle>
            <DialogDescription>
              Customize the content for this section
            </DialogDescription>
          </DialogHeader>
          {editingSection && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {sectionTypes.find((t) => t.type === editingSection.type)?.label}
                </Badge>
              </div>

              <div className="space-y-2">
                <Label htmlFor="section-title">Title</Label>
                <Input
                  id="section-title"
                  value={editingSection.data.title}
                  onChange={(e) =>
                    setEditingSection({
                      ...editingSection,
                      data: { ...editingSection.data, title: e.target.value },
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="section-content">Content</Label>
                <Textarea
                  id="section-content"
                  rows={6}
                  value={editingSection.data.content}
                  onChange={(e) =>
                    setEditingSection({
                      ...editingSection,
                      data: { ...editingSection.data, content: e.target.value },
                    })
                  }
                  placeholder="Enter section content..."
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="section-visible"
                  checked={editingSection.visible}
                  onCheckedChange={(checked) =>
                    setEditingSection({ ...editingSection, visible: checked })
                  }
                />
                <Label htmlFor="section-visible">Visible on page</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSection}>Save Section</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
