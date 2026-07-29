import { create } from 'zustand';
import { ActivityLog, ActivityType } from './types';
import { activityRepository } from '@/shared/repository';

interface ActivityState {
  logs: ActivityLog[];
  isLoading: boolean;

  fetchLogs: () => Promise<void>;
  logActivity: (type: ActivityType, title: string) => Promise<void>;
}

export const useActivityStore = create<ActivityState>((set) => ({
  logs: [],
  isLoading: false,

  fetchLogs: async () => {
    set({ isLoading: true });
    try {
      const logs = await activityRepository.getAll();
      set({ logs, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  logActivity: async (type: ActivityType, title: string) => {
    const newEntry = await activityRepository.log({ type, title });
    set((state) => ({ logs: [newEntry, ...state.logs].slice(0, 20) }));
  },
}));
