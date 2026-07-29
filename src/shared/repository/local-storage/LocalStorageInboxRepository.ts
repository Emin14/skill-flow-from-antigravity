import { InboxItem } from '@/entities/inbox/model/types';
import { InboxRepository } from '../interfaces/InboxRepository';

const STORAGE_KEY = 'skillflow_inbox';

export class LocalStorageInboxRepository implements InboxRepository {
  private getStorage(): InboxItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private setStorage(items: InboxItem[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save inbox items to LocalStorage', e);
    }
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
    this.setStorage(items);
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
