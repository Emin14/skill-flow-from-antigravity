import { InboxItem } from '@/entities/inbox/model/types';
import { InboxRepository } from '../interfaces/InboxRepository';
import { STORAGE_KEYS } from '@/shared/config/storageKeys';

export class LocalStorageInboxRepository implements InboxRepository {
  private cache: InboxItem[] | null = null;
  private writeQueue: Promise<void> = Promise.resolve();

  private getStorage(): InboxItem[] {
    if (this.cache) return [...this.cache];
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INBOX);
      this.cache = data ? JSON.parse(data) : [];
      return [...(this.cache || [])];
    } catch {
      this.cache = [];
      return [];
    }
  }

  private setStorage(items: InboxItem[]): Promise<void> {
    this.cache = [...items];
    this.writeQueue = this.writeQueue.then(() => {
      if (typeof window === 'undefined') return;
      try {
        localStorage.setItem(STORAGE_KEYS.INBOX, JSON.stringify(items));
      } catch (e) {
        console.error('Failed to save inbox items to LocalStorage', e);
      }
    });
    return this.writeQueue;
  }

  async getAll(): Promise<InboxItem[]> {
    return this.getStorage();
  }

  async getById(id: string): Promise<InboxItem | null> {
    const items = this.getStorage();
    return items.find((i) => i.id === id) || null;
  }

  async save(item: InboxItem): Promise<InboxItem> {
    const items = this.getStorage();
    const existingIndex = items.findIndex((i) => i.id === item.id);
    if (existingIndex >= 0) {
      items[existingIndex] = item;
    } else {
      items.unshift(item);
    }
    await this.setStorage(items);
    return item;
  }

  async update(id: string, updates: Partial<InboxItem>): Promise<InboxItem> {
    const items = this.getStorage();
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) {
      throw new Error(`InboxItem with id ${id} not found`);
    }

    const updated = { ...items[index], ...updates };
    items[index] = updated;
    this.setStorage(items);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const items = this.getStorage();
    const filtered = items.filter((i) => i.id !== id);
    if (filtered.length === items.length) return false;

    this.setStorage(filtered);
    return true;
  }
}

export const inboxRepository = new LocalStorageInboxRepository();
