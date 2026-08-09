import { RepeatCard } from '../model/types';

export const repeatCardApi = {
  async getAll(): Promise<RepeatCard[]> {
    const res = await fetch('/api/repeat-cards');
    if (!res.ok) throw new Error(`Failed to fetch repeat cards: ${res.statusText}`);
    return res.json();
  },

  async create(card: RepeatCard): Promise<RepeatCard> {
    const res = await fetch('/api/repeat-cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(card),
    });
    if (!res.ok) throw new Error(`Failed to create repeat card: ${res.statusText}`);
    return res.json();
  },

  async update(id: string, updates: Partial<RepeatCard>): Promise<RepeatCard> {
    const res = await fetch('/api/repeat-cards', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates }),
    });
    if (!res.ok) throw new Error(`Failed to update repeat card: ${res.statusText}`);
    return res.json();
  },

  async delete(id: string): Promise<boolean> {
    const res = await fetch(`/api/repeat-cards?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(`Failed to delete repeat card: ${res.statusText}`);
    const data = await res.json();
    return data.success;
  },
};
