import { create } from 'zustand';
import { BacklogItem, CreateBacklogItemDto, UpdateBacklogItemDto } from './types';
import { backlogApi } from '../api/backlogApi';
import { useToastStore } from '@/shared/ui';
import { useTaskStore } from '@/entities/task';
import { useActivityStore } from '@/entities/activity';
import { getTodayStr } from '@/shared/lib/dateUtils';

interface BacklogState {
  items: BacklogItem[];
  isLoading: boolean;
  error: string | null;

  fetchItems: () => Promise<void>;
  addItem: (dto: CreateBacklogItemDto) => Promise<BacklogItem>;
  updateItem: (id: string, updates: UpdateBacklogItemDto) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  convertToTask: (id: string, targetDate?: string) => Promise<void>;
}

export const useBacklogStore = create<BacklogState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const items = await backlogApi.getAll();
      set({ items, isLoading: false });
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
    }
  },

  addItem: async (dto: CreateBacklogItemDto) => {
    try {
      const saved = await backlogApi.create(dto);
      set((state) => ({ items: [saved, ...state.items] }));
      useToastStore.getState().showToast('Идея добавлена в бэклог', 'success');
      useActivityStore.getState().logActivity('task_created', `Добавлена идея в бэклог: "${dto.title}"`);
      return saved;
    } catch (err) {
      useToastStore.getState().showToast('Ошибка добавления идеи', 'error');
      throw err;
    }
  },

  updateItem: async (id: string, updates: UpdateBacklogItemDto) => {
    const previous = get().items;
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, ...updates } : i)),
    }));
    try {
      const updated = await backlogApi.update(id, updates);
      set((state) => ({
        items: state.items.map((i) => (i.id === id ? updated : i)),
      }));
      useToastStore.getState().showToast('Идея обновлена', 'success');
    } catch (err) {
      set({ items: previous });
      useToastStore.getState().showToast('Ошибка обновления идеи', 'error');
      throw err;
    }
  },

  deleteItem: async (id: string) => {
    const deletedItem = get().items.find((i) => i.id === id);
    if (!deletedItem) return;

    const previous = get().items;
    set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
    try {
      await backlogApi.delete(id);
      useToastStore.getState().showToast(
        'Идея удалена',
        'undo',
        async () => {
          const restored = await backlogApi.create({
            topic: deletedItem.topic,
            title: deletedItem.title,
            description: deletedItem.description,
            status: deletedItem.status,
            priority: deletedItem.priority,
            tags: deletedItem.tags,
            link: deletedItem.link,
          });
          set((state) => ({ items: [restored, ...state.items] }));
          useToastStore.getState().showToast('Идея восстановлена', 'success');
        }
      );
    } catch (err) {
      set({ items: previous });
      useToastStore.getState().showToast('Ошибка удаления идеи', 'error');
    }
  },

  convertToTask: async (id: string, targetDate?: string) => {
    const item = get().items.find((i) => i.id === id);
    if (!item) return;

    const effectiveDate = targetDate || getTodayStr();

    try {
      // Create task in taskStore
      const taskPriority: 'P1' | 'P2' | 'P3' = item.priority === 'high' ? 'P1' : item.priority === 'low' ? 'P3' : 'P2';
      await useTaskStore.getState().addTask(
        {
          title: item.title,
          description: item.description || undefined,
          link: item.link || undefined,
          category: item.topic || 'Без категории',
          scheduledDate: effectiveDate,
          isRepeating: false,
        },
        taskPriority
      );

      // Update backlog item status to 'planned'
      await get().updateItem(id, { status: 'planned' });

      useToastStore.getState().showToast('Идея превращена в задачу!', 'success');
      useActivityStore.getState().logActivity('task_created', `Идея "${item.title}" взята в работу как задача`);
    } catch (err) {
      console.error('Failed to convert idea to task:', err);
      useToastStore.getState().showToast('Ошибка создания задачи из идеи', 'error');
    }
  },
}));
