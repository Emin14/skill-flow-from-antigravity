import { create } from 'zustand';
import { getCategoryColor } from '@/shared/config/categoryColors';
import { Task } from '@/entities/task/model/types';

export interface CategoryItem {
  id: string;
  name: string;
  color: string;
  isSystem?: boolean;
}

const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: 'cat-0', name: 'Без категории', color: 'rgba(255, 255, 255, 0.45)', isSystem: true },
  { id: 'cat-1', name: 'Задачи', color: getCategoryColor('Задачи') },
  { id: 'cat-2', name: 'Опыт на камеру', color: getCategoryColor('Опыт на камеру') },
  { id: 'cat-3', name: 'Теория', color: getCategoryColor('Теория') },
  { id: 'cat-4', name: 'Здоровье', color: getCategoryColor('Здоровье') },
  { id: 'cat-5', name: 'Практика Frontend', color: getCategoryColor('Практика Frontend') },
  { id: 'cat-6', name: 'Моковое собес-ние', color: getCategoryColor('Моковое собес-ние') },
  { id: 'cat-7', name: 'Крупная задача', color: getCategoryColor('Крупная задача') },
];

const STORAGE_KEY = 'skillflow_custom_categories_v2';

const loadCategoriesFromStorage = (): CategoryItem[] => {
  if (typeof window === 'undefined') return DEFAULT_CATEGORIES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: CategoryItem[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure system 'Без категории' is present
        const hasNoCat = parsed.some((c) => c.name.trim().toLowerCase() === 'без категории');
        if (!hasNoCat) {
          return [DEFAULT_CATEGORIES[0], ...parsed];
        }
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load categories from storage', e);
  }
  return DEFAULT_CATEGORIES;
};

const saveCategoriesToStorage = (categories: CategoryItem[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.error('Failed to save categories', e);
  }
};

interface CategoryState {
  categories: CategoryItem[];
  fetchCategories: () => Promise<void>;
  syncCategoriesWithTasks: (tasks: Task[]) => void;
  addCategory: (name: string, color: string) => Promise<void>;
  updateCategory: (id: string, name: string, color: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  getCategoryByName: (name: string) => CategoryItem | undefined;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: loadCategoriesFromStorage(),

  fetchCategories: async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const dbCategories: CategoryItem[] = await res.json();
        if (dbCategories.length > 0) {
          const hasNoCat = dbCategories.some((c) => c.name.trim().toLowerCase() === 'без категории');
          const merged = hasNoCat ? dbCategories : [DEFAULT_CATEGORIES[0], ...dbCategories];
          set({ categories: merged });
          saveCategoriesToStorage(merged);
          return;
        }
      }
    } catch (e) {
      console.warn('API /api/categories unavailable, using local storage fallback');
    }
  },

  syncCategoriesWithTasks: (tasks: Task[]) => {
    if (!tasks || tasks.length === 0) return;
    const currentList = get().categories;
    const existingNames = new Set(currentList.map((c) => c.name.trim().toLowerCase()));

    const newItems: CategoryItem[] = [];
    tasks.forEach((t) => {
      if (t.category && t.category.trim()) {
        const nameClean = t.category.trim();
        if (!existingNames.has(nameClean.toLowerCase())) {
          existingNames.add(nameClean.toLowerCase());
          newItems.push({
            id: `cat-auto-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            name: nameClean,
            color: getCategoryColor(nameClean),
          });
        }
      }
    });

    if (newItems.length > 0) {
      const merged = [...currentList, ...newItems];
      set({ categories: merged });
      saveCategoriesToStorage(merged);

      newItems.forEach((cat) => {
        if (cat.name !== 'Без категории') {
          fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: cat.name, color: cat.color }),
          }).catch(() => {});
        }
      });
    }
  },

  addCategory: async (name: string, color: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const existing = get().categories.find((c) => c.name.toLowerCase() === trimmed.toLowerCase());
    if (existing) return;

    const newCategory: CategoryItem = {
      id: `cat-${Date.now()}`,
      name: trimmed,
      color: color || getCategoryColor(trimmed),
    };

    const updated = [...get().categories, newCategory];
    set({ categories: updated });
    saveCategoriesToStorage(updated);

    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed, color: color || getCategoryColor(trimmed) }),
      });
    } catch (e) {
      console.warn('Failed to sync added category with DB', e);
    }
  },

  updateCategory: async (id: string, name: string, color: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    const oldCategory = get().categories.find((c) => c.id === id);
    const oldName = oldCategory ? oldCategory.name : null;

    const updated = get().categories.map((c) => (c.id === id ? { ...c, name: trimmed, color } : c));
    set({ categories: updated });
    saveCategoriesToStorage(updated);

    // Cascade rename to all existing tasks if name changed
    if (oldName && oldName !== trimmed) {
      try {
        const { useTaskStore } = await import('@/entities/task');
        useTaskStore.getState().updateTaskCategoryBatch(oldName, trimmed);
      } catch (e) {
        console.warn('Failed to cascade rename category to tasks', e);
      }
    }

    try {
      await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name: trimmed, color }),
      });
    } catch (e) {
      console.warn('Failed to sync updated category with DB', e);
    }
  },

  deleteCategory: async (id: string) => {
    const target = get().categories.find((c) => c.id === id);
    if (target?.isSystem) return; // Prevent deleting system 'Без категории'

    const oldName = target ? target.name : null;

    const updated = get().categories.filter((c) => c.id !== id);
    set({ categories: updated });
    saveCategoriesToStorage(updated);

    // Cascade reset tasks to 'Без категории' when category is deleted
    if (oldName) {
      try {
        const { useTaskStore } = await import('@/entities/task');
        useTaskStore.getState().updateTaskCategoryBatch(oldName, 'Без категории');
      } catch (e) {
        console.warn('Failed to reset tasks category to Без категории', e);
      }
    }

    try {
      const query = oldName
        ? `id=${encodeURIComponent(id)}&name=${encodeURIComponent(oldName)}`
        : `id=${encodeURIComponent(id)}`;
      await fetch(`/api/categories?${query}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.warn('Failed to sync deleted category with DB', e);
    }
  },

  getCategoryByName: (name: string) => {
    return get().categories.find((c) => c.name.toLowerCase() === name.trim().toLowerCase());
  },
}));
