import { create } from 'zustand';
import { Goal } from './types';
import { goalRepository } from '@/shared/repository';
import { useToastStore } from '@/shared/ui';
import { useActivityStore } from '@/entities/activity';
import { v4 as uuidv4 } from 'uuid';

interface GoalState {
  goals: Goal[];
  isLoading: boolean;
  error: string | null;

  fetchGoals: () => Promise<void>;
  addGoal: (title: string, color?: string, description?: string) => Promise<Goal>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<Goal | null>;
  archiveGoal: (id: string) => Promise<void>;
  unarchiveGoal: (id: string) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
}

export const useGoalStore = create<GoalState>((set, get) => ({
  goals: [],
  isLoading: false,
  error: null,

  fetchGoals: async () => {
    set({ isLoading: true, error: null });
    try {
      const goals = await goalRepository.getAll();
      set({ goals, isLoading: false });
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
    }
  },

  addGoal: async (title: string, color = '#6366f1', description = '') => {
    const newGoal: Goal = {
      id: uuidv4(),
      title,
      description,
      color,
      status: 'Active',
      createdAt: new Date().toISOString(),
    };

    const saved = await goalRepository.save(newGoal);
    set((state) => ({ goals: [saved, ...state.goals] }));
    useToastStore.getState().showToast(`Цель "${title}" создана`, 'success');
    useActivityStore.getState().logActivity('goal_created', `Создана цель: "${title}"`);
    return saved;
  },

  updateGoal: async (id: string, updates: Partial<Goal>) => {
    try {
      const updated = await goalRepository.update(id, updates);
      set((state) => ({
        goals: state.goals.map((g) => (g.id === id ? updated : g)),
      }));
      return updated;
    } catch (e) {
      set({ error: (e as Error).message });
      return null;
    }
  },

  archiveGoal: async (id: string) => {
    const goal = get().goals.find((g) => g.id === id);
    await get().updateGoal(id, { status: 'Archived' });
    if (goal) {
      useToastStore.getState().showToast(`Цель "${goal.title}" отправлена в архив`, 'info');
    }
  },

  unarchiveGoal: async (id: string) => {
    const goal = get().goals.find((g) => g.id === id);
    await get().updateGoal(id, { status: 'Active' });
    if (goal) {
      useToastStore.getState().showToast(`Цель "${goal.title}" восстановлена из архива`, 'success');
    }
  },

  deleteGoal: async (id: string) => {
    const deletedGoal = get().goals.find((g) => g.id === id);
    if (!deletedGoal) return;

    set((state) => ({ goals: state.goals.filter((g) => g.id !== id) }));
    await goalRepository.delete(id);

    useToastStore.getState().showToast(
      `Цель "${deletedGoal.title}" удалена`,
      'undo',
      async () => {
        await goalRepository.save(deletedGoal);
        set((state) => ({ goals: [deletedGoal, ...state.goals] }));
        useToastStore.getState().showToast('Цель восстановлена', 'success');
      }
    );
  },
}));
