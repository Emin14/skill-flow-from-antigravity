import { create } from 'zustand';
import { Topic } from './types';
import { topicRepository } from '@/shared/repository';
import { useActivityStore } from '@/entities/activity';
import { v4 as uuidv4 } from 'uuid';

interface TopicState {
  topics: Topic[];
  isLoading: boolean;
  error: string | null;

  fetchTopics: () => Promise<void>;
  addTopic: (title: string, goalId: string, parentId?: string | null, weight?: number) => Promise<Topic>;
  updateTopic: (id: string, updates: Partial<Topic>) => Promise<Topic | null>;
  deleteTopic: (id: string) => Promise<void>;
}

export const useTopicStore = create<TopicState>((set, get) => ({
  topics: [],
  isLoading: false,
  error: null,

  fetchTopics: async () => {
    set({ isLoading: true, error: null });
    try {
      const topics = await topicRepository.getAll();
      set({ topics, isLoading: false });
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
    }
  },

  addTopic: async (title: string, goalId: string, parentId: string | null = null, weight = 1) => {
    const newTopic: Topic = {
      id: uuidv4(),
      goalId,
      parentId,
      title,
      weight,
      createdAt: new Date().toISOString(),
    };

    const saved = await topicRepository.save(newTopic);
    set((state) => ({ topics: [...state.topics, saved] }));
    useActivityStore.getState().logActivity('topic_created', `Создана тема: "${title}"`);
    return saved;
  },

  updateTopic: async (id: string, updates: Partial<Topic>) => {
    try {
      const updated = await topicRepository.update(id, updates);
      set((state) => ({
        topics: state.topics.map((t) => (t.id === id ? updated : t)),
      }));
      return updated;
    } catch (e) {
      set({ error: (e as Error).message });
      return null;
    }
  },

  deleteTopic: async (id: string) => {
    const previous = get().topics;
    set((state) => ({ topics: state.topics.filter((t) => t.id !== id) }));
    try {
      await topicRepository.delete(id);
    } catch (e) {
      set({ topics: previous, error: (e as Error).message });
    }
  },
}));
