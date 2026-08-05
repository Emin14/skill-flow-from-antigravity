import { create } from 'zustand';
import { RepeatCard } from './types';
import { repeatCardRepository } from '@/shared/repository';
import { calculateNextReview, ReviewRating } from '@/shared/lib/fsrs';
import { useToastStore } from '@/shared/ui';
import { useActivityStore } from '@/entities/activity';
import { v4 as uuidv4 } from 'uuid';

interface RepeatCardState {
  cards: RepeatCard[];
  isLoading: boolean;
  error: string | null;

  fetchCards: () => Promise<void>;
  addCard: (materialId: string, front: string, back: string) => Promise<RepeatCard>;
  updateCard: (id: string, updates: Partial<RepeatCard>) => Promise<RepeatCard | null>;
  deleteCard: (id: string) => Promise<void>;
  getByMaterial: (materialId: string) => RepeatCard[];
  getDueCards: () => RepeatCard[];
  answerCard: (id: string, rating: ReviewRating) => Promise<void>;
}

export const useRepeatCardStore = create<RepeatCardState>((set, get) => ({
  cards: [],
  isLoading: false,
  error: null,

  fetchCards: async () => {
    set({ isLoading: true, error: null });
    try {
      const cards = await repeatCardRepository.getAll();
      set({ cards, isLoading: false });
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
    }
  },

  addCard: async (materialId: string, front: string, back: string) => {
    const today = new Date().toISOString().split('T')[0];
    const newCard: RepeatCard = {
      id: uuidv4(),
      materialId,
      front,
      back,
      interval: 1,
      repetitions: 0,
      easeFactor: 2.5,
      nextReviewDate: today,
      lastReviewedAt: null,
      createdAt: new Date().toISOString(),
    };

    const saved = await repeatCardRepository.save(newCard);
    set((state) => ({ cards: [...state.cards, saved] }));
    useToastStore.getState().showToast('FSRS карточка создана', 'success');
    return saved;
  },

  updateCard: async (id: string, updates: Partial<RepeatCard>) => {
    try {
      const updated = await repeatCardRepository.update(id, updates);
      set((state) => ({
        cards: state.cards.map((c) => (c.id === id ? updated : c)),
      }));
      useToastStore.getState().showToast('Карточка обновлена', 'success');
      return updated;
    } catch (e) {
      set({ error: (e as Error).message });
      return null;
    }
  },

  deleteCard: async (id: string) => {
    const deletedCard = get().cards.find((c) => c.id === id);
    if (!deletedCard) return;

    set((state) => ({ cards: state.cards.filter((c) => c.id !== id) }));
    await repeatCardRepository.delete(id);

    // Undo toast for Card
    useToastStore.getState().showToast(
      'FSRS карточка удалена',
      'undo',
      async () => {
        await repeatCardRepository.save(deletedCard);
        set((state) => ({ cards: [...state.cards, deletedCard] }));
        useToastStore.getState().showToast('Карточка восстановлена', 'success');
      }
    );
  },

  getByMaterial: (materialId: string) => {
    return get().cards.filter((c) => c.materialId === materialId);
  },

  getDueCards: () => {
    const today = new Date().toISOString().split('T')[0];
    return get().cards.filter((c) => !c.nextReviewDate || c.nextReviewDate <= today);
  },

  answerCard: async (id: string, rating: ReviewRating) => {
    const card = get().cards.find((c) => c.id === id);
    if (!card) return;

    const fsrsResult = calculateNextReview(
      rating,
      card.interval,
      card.repetitions,
      card.easeFactor
    );

    const updates: Partial<RepeatCard> = {
      interval: fsrsResult.nextInterval,
      repetitions: fsrsResult.newRepetitions,
      easeFactor: fsrsResult.newEaseFactor,
      nextReviewDate: fsrsResult.nextReviewDate,
      lastReviewedAt: new Date().toISOString(),
    };

    set((state) => ({
      cards: state.cards.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));

    try {
      await repeatCardRepository.update(id, updates);
      useActivityStore.getState().logActivity('fsrs_reviewed', `Повторена карточка: "${card.front}"`);
    } catch (e) {
      set({ cards: get().cards, error: (e as Error).message });
    }
  },
}));
