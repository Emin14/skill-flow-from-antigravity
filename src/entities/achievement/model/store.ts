import { create } from 'zustand';
import { Achievement } from './types';
import { achievementApi } from '../api/achievementApi';
import { STORAGE_KEYS } from '@/shared/config/storageKeys';
import { useToastStore } from '@/shared/ui';
import { useActivityStore } from '@/entities/activity';
import { v4 as uuidv4 } from 'uuid';

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    title: 'Жим лёжа 100 кг',
    date: '2026-08-15',
    category: 'Здоровье',
    icon: '🏋️‍♂️',
    description: 'Шёл к этому результату 4 месяца. Пожал с идеальной техникой!',
    createdAt: '2026-08-15T12:00:00.000Z',
  },
  {
    id: 'ach-2',
    title: 'Сдал IELTS на 7.5',
    date: '2026-07-20',
    category: 'Теория',
    icon: '🇬🇧',
    description: 'Разделы Listening и Reading закрыты на максимум.',
    createdAt: '2026-07-20T10:30:00.000Z',
  },
  {
    id: 'ach-3',
    title: 'Первые $1,000 на фрилансе',
    date: '2026-06-10',
    category: 'Практика Frontend',
    icon: '💼',
    description: 'Успешно завершил и сдал крупный проект для клиента.',
    createdAt: '2026-06-10T18:00:00.000Z',
  },
];

interface AchievementState {
  achievements: Achievement[];
  isLoading: boolean;
  error: string | null;

  fetchAchievements: () => Promise<void>;
  addAchievement: (data: {
    title: string;
    date: string;
    category?: string;
    icon?: string;
    description?: string;
  }) => Promise<Achievement>;
  updateAchievement: (id: string, updates: Partial<Achievement>) => Promise<Achievement | null>;
  deleteAchievement: (id: string) => Promise<void>;
}

const loadLocalAchievements = (): Achievement[] => {
  if (typeof window === 'undefined') return INITIAL_ACHIEVEMENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse local achievements:', e);
  }
  return INITIAL_ACHIEVEMENTS;
};

const saveLocalAchievements = (list: Achievement[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save local achievements:', e);
  }
};

export const useAchievementStore = create<AchievementState>((set, get) => ({
  achievements: typeof window !== 'undefined' ? loadLocalAchievements() : INITIAL_ACHIEVEMENTS,
  isLoading: false,
  error: null,

  fetchAchievements: async () => {
    set({ isLoading: true, error: null });
    try {
      const remote = await achievementApi.getAll();
      if (remote && remote.length > 0) {
        set({ achievements: remote, isLoading: false });
        saveLocalAchievements(remote);
      } else {
        const local = loadLocalAchievements();
        set({ achievements: local, isLoading: false });
        if (local.length > 0) {
          // Sync local seeds to DB
          for (const item of local) {
            try {
              await achievementApi.create(item);
            } catch {}
          }
        }
      }
    } catch (e) {
      const local = loadLocalAchievements();
      set({ achievements: local, isLoading: false, error: (e as Error).message });
    }
  },

  addAchievement: async (data) => {
    const newAch: Achievement = {
      id: uuidv4(),
      title: data.title.trim(),
      date: data.date,
      category: data.category?.trim() || undefined,
      icon: data.icon?.trim() || '🏆',
      description: data.description?.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    // Optimistic update
    const updatedList = [newAch, ...get().achievements].sort((a, b) => b.date.localeCompare(a.date));
    set({ achievements: updatedList });
    saveLocalAchievements(updatedList);

    try {
      const saved = await achievementApi.create(newAch);
      set((state) => ({
        achievements: state.achievements.map((a) => (a.id === newAch.id ? saved : a)),
      }));
      useToastStore.getState().showToast(`🏆 Победа "${data.title}" зафиксирована!`, 'success');
      useActivityStore.getState().logActivity('achievement_created', `Зафиксирована победа: "${data.title}"`);
      return saved;
    } catch (e) {
      useToastStore.getState().showToast(`🏆 Победа "${data.title}" сохранена локально`, 'success');
      return newAch;
    }
  },

  updateAchievement: async (id: string, updates: Partial<Achievement>) => {
    // Optimistic update
    const updatedList = get()
      .achievements.map((a) => (a.id === id ? { ...a, ...updates } : a))
      .sort((a, b) => b.date.localeCompare(a.date));

    set({ achievements: updatedList });
    saveLocalAchievements(updatedList);

    try {
      const updated = await achievementApi.update(id, updates);
      useToastStore.getState().showToast('Достижение обновлено', 'info');
      return updated;
    } catch (e) {
      return updatedList.find((a) => a.id === id) || null;
    }
  },

  deleteAchievement: async (id: string) => {
    const ach = get().achievements.find((a) => a.id === id);
    const updatedList = get().achievements.filter((a) => a.id !== id);

    set({ achievements: updatedList });
    saveLocalAchievements(updatedList);

    try {
      await achievementApi.delete(id);
      if (ach) {
        useToastStore.getState().showToast(`"${ach.title}" удалено`, 'info');
      }
    } catch (e) {
      if (ach) {
        useToastStore.getState().showToast(`"${ach.title}" удалено локально`, 'info');
      }
    }
  },
}));
