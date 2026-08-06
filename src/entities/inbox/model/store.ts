import { create } from 'zustand';
import { InboxItem } from './types';
import { inboxRepository } from '@/shared/repository';
import { useToastStore } from '@/shared/ui';
import { useActivityStore } from '@/entities/activity';
import { v4 as uuidv4 } from 'uuid';

interface InboxState {
  items: InboxItem[];
  isLoading: boolean;
  error: string | null;

  fetchItems: () => Promise<void>;
  addItem: (text: string) => Promise<InboxItem>;
  updateItem: (id: string, text: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
}

export const useInboxStore = create<InboxState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const items = await inboxRepository.getAll();
      set({ items, isLoading: false });
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
    }
  },

  addItem: async (text: string) => {
    const newItem: InboxItem = {
      id: uuidv4(),
      text,
      isPinned: false,
      createdAt: new Date().toISOString(),
    };

    const saved = await inboxRepository.save(newItem);
    set((state) => {
      const exists = state.items.some((i) => i.id === saved.id);
      if (exists) return { items: state.items };
      return { items: [saved, ...state.items] };
    });
    useToastStore.getState().showToast('Мысль сохранена во Входящие', 'success');
    useActivityStore.getState().logActivity('task_created', `Добавлена мысль: "${text}"`);
    return saved;
  },

  updateItem: async (id: string, text: string) => {
    const previousItems = get().items;
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, text } : i)),
    }));
    try {
      await inboxRepository.update(id, { text });
      useToastStore.getState().showToast('Заметка обновлена', 'success');
    } catch (e) {
      set({ items: previousItems });
      useToastStore.getState().showToast('Ошибка сохранения заметки', 'error');
    }
  },

  togglePin: async (id: string) => {
    const item = get().items.find((i) => i.id === id);
    if (!item) return;

    const previousItems = get().items;
    const newPinned = !item.isPinned;
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, isPinned: newPinned } : i)),
    }));
    try {
      await inboxRepository.update(id, { isPinned: newPinned });
      useToastStore.getState().showToast(newPinned ? 'Заметка закреплена' : 'Заметка откреплена', 'info');
    } catch (e) {
      set({ items: previousItems });
      useToastStore.getState().showToast('Ошибка изменения закрепления', 'error');
    }
  },

  deleteItem: async (id: string) => {
    const deletedItem = get().items.find((i) => i.id === id);
    if (!deletedItem) return;

    const previousItems = get().items;
    set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
    try {
      await inboxRepository.delete(id);
    } catch (e) {
      set({ items: previousItems });
      useToastStore.getState().showToast('Ошибка удаления заметки', 'error');
      return;
    }

    // Undo toast for Inbox
    useToastStore.getState().showToast(
      'Мысль удалена',
      'undo',
      async () => {
        await inboxRepository.save(deletedItem);
        set((state) => ({ items: [deletedItem, ...state.items] }));
        useToastStore.getState().showToast('Мысль восстановлена', 'success');
      }
    );
  },
}));
