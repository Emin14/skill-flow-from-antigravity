import { create } from 'zustand';
import { BacklogItem, BacklogTopic, SaveBacklogTopicDto, CreateBacklogItemDto, UpdateBacklogItemDto } from './types';
import { backlogApi } from '../api/backlogApi';
import { useToastStore } from '@/shared/ui';
import { useTaskStore } from '@/entities/task';
import { useActivityStore } from '@/entities/activity';
import type { AddTaskParams } from '@/entities/task/model/store';

// Retain successful creations until deletion succeeds so a retry only removes the note.
const createdConversions = new Set<string>();
const pendingConversions = new Map<string, Promise<void>>();

interface BacklogState {
  items: BacklogItem[];
  topics: BacklogTopic[];
  isLoading: boolean;
  error: string | null;

  fetchItems: () => Promise<void>;
  addItem: (dto: CreateBacklogItemDto) => Promise<BacklogItem>;
  updateItem: (id: string, updates: UpdateBacklogItemDto) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  convertToTask: (id: string, data: AddTaskParams) => Promise<void>;
  renameTopic: (oldTopic: string, newTopic: string) => Promise<void>;
  saveTopic: (dto: SaveBacklogTopicDto, id?: string) => Promise<BacklogTopic>;
  deleteTopic: (id: string) => Promise<void>;
}

export const useBacklogStore = create<BacklogState>((set, get) => ({
  items: [],
  topics: [],
  isLoading: false,
  error: null,

  fetchItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const [items, topics] = await Promise.all([backlogApi.getAll(), backlogApi.getTopics()]);
      set({ items, topics, isLoading: false });
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
    }
  },

  addItem: async (dto: CreateBacklogItemDto) => {
    try {
      const saved = await backlogApi.create(dto);
      set((state) => ({ items: [saved, ...state.items] }));
      const topics = await backlogApi.getTopics().catch(() => null);
      if (topics) set({ topics });
      useToastStore.getState().showToast('Заметка добавлена в бэклог', 'success');
      useActivityStore.getState().logActivity('task_created', `Добавлена заметка в бэклог: "${dto.title}"`);
      return saved;
    } catch (err: any) {
      useToastStore.getState().showToast(err?.message || 'Ошибка добавления заметки', 'error');
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
      useToastStore.getState().showToast('Заметка обновлена', 'success');
    } catch (err: any) {
      set({ items: previous });
      useToastStore.getState().showToast(err?.message || 'Ошибка обновления заметки', 'error');
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
        'Заметка удалена',
        'undo',
        async () => {
          const restored = await backlogApi.create({
            topic: deletedItem.topic,
            topicId: deletedItem.topicId,
            title: deletedItem.title,
            description: deletedItem.description,
            status: deletedItem.status,
            priority: deletedItem.priority,
            tags: deletedItem.tags,
            link: deletedItem.link,
          });
          set((state) => ({ items: [restored, ...state.items] }));
          useToastStore.getState().showToast('Заметка восстановлена', 'success');
        }
      );
    } catch (err) {
      set({ items: previous });
      useToastStore.getState().showToast('Ошибка удаления заметки', 'error');
    }
  },

  convertToTask: async (id: string, data: AddTaskParams) => {
    const pending = pendingConversions.get(id);
    if (pending) return pending;
    const item = get().items.find((i) => i.id === id);
    if (!item) return;
    const conversion = (async () => {
      if (!createdConversions.has(id)) {
        const taskPriority = item.priority === 'high' ? 'P1' : item.priority === 'low' ? 'P3' : 'P2';
        await useTaskStore.getState().addTask(data, taskPriority);
        createdConversions.add(id);
      }
      try {
        // Conversion removes the source permanently; ordinary delete's undo would restore it.
        await backlogApi.delete(id);
      } catch {
        throw new Error('Задача создана, но заметку не удалось удалить. Нажмите «Создать» ещё раз, чтобы завершить перенос без повторного создания задачи.');
      }
      set(state => ({ items: state.items.filter(note => note.id !== id) }));
      createdConversions.delete(id);
      useToastStore.getState().showToast('Заметка перенесена в задачи', 'success');
    })();
    pendingConversions.set(id, conversion);
    try {
      await conversion;
    } finally {
      pendingConversions.delete(id);
    }
  },

  saveTopic: async (dto, id) => {
    try {
      const saved = await backlogApi.saveTopic(dto, id);
      set(state => ({
        topics: [...state.topics.filter(topic => topic.id !== saved.id), saved].sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name)),
        items: state.items.map(item => item.topicId === saved.id ? { ...item, topic: saved.name } : item),
      }));
      useToastStore.getState().showToast(id ? 'Тема сохранена' : 'Тема создана', 'success');
      return saved;
    } catch (error) {
      useToastStore.getState().showToast(error instanceof Error ? error.message : 'Не удалось сохранить тему', 'error');
      throw error;
    }
  },
  deleteTopic: async (id) => {
    try {
      await backlogApi.deleteTopic(id);
      set(state => ({ topics: state.topics.filter(topic => topic.id !== id) }));
      useToastStore.getState().showToast('Тема удалена', 'success');
    } catch (error) {
      useToastStore.getState().showToast(error instanceof Error ? error.message : 'Не удалось удалить тему', 'error');
      throw error;
    }
  },
  renameTopic: async (oldTopic, newTopic) => {
    const topic = get().topics.find(topic => topic.name === oldTopic);
    if (topic) await get().saveTopic({ name: newTopic }, topic.id);
  },
}));
