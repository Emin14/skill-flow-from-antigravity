import { RepeatCard } from '@/entities/repeat-card/model/types';
import { RepeatCardRepository } from '../interfaces/RepeatCardRepository';

const STORAGE_KEY = 'skillflow_repeat_cards';

export class LocalStorageRepeatCardRepository implements RepeatCardRepository {
  private getStorage(): RepeatCard[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private setStorage(cards: RepeatCard[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    } catch (e) {
      console.error('Failed to save repeat cards to LocalStorage', e);
    }
  }

  async getAll(): Promise<RepeatCard[]> {
    return this.getStorage();
  }

  async getById(id: string): Promise<RepeatCard | null> {
    const cards = this.getStorage();
    return cards.find((c) => c.id === id) || null;
  }

  async getByMaterialId(materialId: string): Promise<RepeatCard[]> {
    const cards = this.getStorage();
    return cards.filter((c) => c.materialId === materialId);
  }

  async save(card: RepeatCard): Promise<RepeatCard> {
    const cards = this.getStorage();
    const index = cards.findIndex((c) => c.id === card.id);
    if (index >= 0) {
      cards[index] = card;
    } else {
      cards.push(card);
    }
    this.setStorage(cards);
    return card;
  }

  async update(id: string, updates: Partial<RepeatCard>): Promise<RepeatCard> {
    const cards = this.getStorage();
    const index = cards.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`RepeatCard with id ${id} not found`);
    }

    const updated = { ...cards[index], ...updates };
    cards[index] = updated;
    this.setStorage(cards);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const cards = this.getStorage();
    const filtered = cards.filter((c) => c.id !== id);
    if (filtered.length === cards.length) return false;

    this.setStorage(filtered);
    return true;
  }
}

export const repeatCardRepository = new LocalStorageRepeatCardRepository();
