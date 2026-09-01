import { create } from 'zustand';
import { getTodayStr } from '@/shared/lib/dateUtils';
import {
  EnglishSessionResponse,
  EnglishSettingsConfig,
  OxfordWord,
  ReviewRating,
  SessionWordCard,
} from './types';

interface EnglishState {
  session: EnglishSessionResponse | null;
  settings: EnglishSettingsConfig;
  isLoadingSession: boolean;
  isLoadingSettings: boolean;
  error: string | null;

  // Dictionary state
  dictionaryWords: OxfordWord[];
  totalDictionaryWords: number;
  isLoadingDictionary: boolean;
  isLoadingMoreDictionary: boolean;
  hasMoreDictionary: boolean;
  dictionaryPage: number;

  // Actions
  fetchSession: () => Promise<void>;
  submitReview: (wordId: string, rating: ReviewRating) => Promise<void>;
  resetTodayProgress: () => Promise<void>;
  fetchSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<EnglishSettingsConfig>) => Promise<void>;
  searchDictionary: (query?: string, level?: string, status?: string, page?: number) => Promise<void>;
  loadMoreDictionary: (query?: string, level?: string, status?: string) => Promise<void>;
  fetchRandomWords: (count?: number) => Promise<SessionWordCard[]>;
}

const DEFAULT_SETTINGS: EnglishSettingsConfig = {
  dailyNewWords: 5,
  maxReviewsPerDay: 30,
  activeLevels: ['A1', 'A2', 'B1', 'B2', 'C1'],
  autoPronounce: true,
  accent: 'us',
};

export const useEnglishStore = create<EnglishState>((set, get) => ({
  session: null,
  settings: DEFAULT_SETTINGS,
  isLoadingSession: false,
  isLoadingSettings: false,
  error: null,

  dictionaryWords: [],
  totalDictionaryWords: 0,
  isLoadingDictionary: false,
  isLoadingMoreDictionary: false,
  hasMoreDictionary: false,
  dictionaryPage: 1,

  fetchSession: async () => {
    set({ isLoadingSession: true, error: null });
    try {
      const clientDate = typeof window !== 'undefined' ? getTodayStr() : '';
      const tzOffset = typeof window !== 'undefined' ? new Date().getTimezoneOffset() : 0;
      const res = await fetch(`/api/english/session?clientDate=${encodeURIComponent(clientDate)}&tzOffset=${tzOffset}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load English session');
      const data: EnglishSessionResponse = await res.json();
      set({ session: data, isLoadingSession: false });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error loading session';
      set({ error: msg, isLoadingSession: false });
    }
  },

  submitReview: async (wordId: string, rating: ReviewRating) => {
    try {
      const res = await fetch('/api/english/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wordId, rating }),
      });
      if (!res.ok) throw new Error('Failed to submit review');
      
      const current = get().session;
      if (current) {
        // Exclude learned word from remaining newWords / reviewWords
        const filterOut = (list: SessionWordCard[]) => list.filter((c) => c.id !== wordId);
        const newWords = filterOut(current.newWords || []);
        const reviewWords = filterOut(current.reviewWords || []);
        const isCompleted = newWords.length === 0 && reviewWords.length === 0;

        set({
          session: {
            ...current,
            newWords,
            reviewWords,
            dailyLearnedCount: Math.min(current.dailyTargetCount, (current.dailyLearnedCount || 0) + 1),
            totalLearned: current.totalLearned + 1,
            isCompletedToday: isCompleted,
          },
        });
      }
    } catch (err) {
      console.error('Error submitting review:', err);
    }
  },

  resetTodayProgress: async () => {
    try {
      set({ isLoadingSession: true });
      const clientDate = typeof window !== 'undefined' ? getTodayStr() : '';
      const tzOffset = typeof window !== 'undefined' ? new Date().getTimezoneOffset() : 0;
      const res = await fetch('/api/english/reset-today', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientDate, tzOffset }),
      });
      if (res.ok) {
        await get().fetchSession();
      } else {
        set({ isLoadingSession: false });
      }
    } catch (err) {
      console.error('Error resetting today English progress:', err);
      set({ isLoadingSession: false });
    }
  },

  fetchSettings: async () => {
    set({ isLoadingSettings: true });
    try {
      const res = await fetch('/api/english/settings', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        set({ settings: data, isLoadingSettings: false });
      }
    } catch {
      set({ isLoadingSettings: false });
    }
  },

  updateSettings: async (newSettings: Partial<EnglishSettingsConfig>) => {
    try {
      const updated = { ...get().settings, ...newSettings };
      set({ settings: updated });
      await fetch('/api/english/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      get().fetchSession();
    } catch (err) {
      console.error('Failed to update settings:', err);
    }
  },

  searchDictionary: async (query = '', level = 'ALL', status = 'ALL', page = 1) => {
    set({ isLoadingDictionary: true });
    try {
      const params = new URLSearchParams({
        q: query,
        level,
        status,
        page: page.toString(),
        limit: '30',
      });
      const res = await fetch(`/api/english/dictionary?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        set({
          dictionaryWords: data.words || [],
          totalDictionaryWords: data.total || 0,
          dictionaryPage: page,
          hasMoreDictionary: data.hasMore ?? false,
          isLoadingDictionary: false,
        });
      }
    } catch {
      set({ isLoadingDictionary: false });
    }
  },

  loadMoreDictionary: async (query = '', level = 'ALL', status = 'ALL') => {
    const { dictionaryPage, hasMoreDictionary, isLoadingMoreDictionary, dictionaryWords } = get();
    if (!hasMoreDictionary || isLoadingMoreDictionary) return;

    set({ isLoadingMoreDictionary: true });
    try {
      const nextPage = dictionaryPage + 1;
      const params = new URLSearchParams({
        q: query,
        level,
        status,
        page: nextPage.toString(),
        limit: '30',
      });
      const res = await fetch(`/api/english/dictionary?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        set({
          dictionaryWords: [...dictionaryWords, ...(data.words || [])],
          totalDictionaryWords: data.total || 0,
          dictionaryPage: nextPage,
          hasMoreDictionary: data.hasMore ?? false,
          isLoadingMoreDictionary: false,
        });
      }
    } catch {
      set({ isLoadingMoreDictionary: false });
    }
  },

  fetchRandomWords: async (count = 5): Promise<SessionWordCard[]> => {
    try {
      const res = await fetch(`/api/english/random?count=${count}`);
      if (res.ok) {
        const data = await res.json();
        return data.words || [];
      }
    } catch (err) {
      console.error('Failed to fetch random English words:', err);
    }
    return [];
  },
}));
