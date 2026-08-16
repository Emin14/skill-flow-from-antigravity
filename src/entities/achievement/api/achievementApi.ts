import { Achievement } from '../model/types';

export const achievementApi = {
  async getAll(): Promise<Achievement[]> {
    const res = await fetch('/api/achievements', { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Failed to fetch achievements: ${res.statusText}`);
    }
    return res.json();
  },

  async create(data: Partial<Achievement>): Promise<Achievement> {
    const res = await fetch('/api/achievements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error(`Failed to create achievement: ${res.statusText}`);
    }
    return res.json();
  },

  async update(id: string, updates: Partial<Achievement>): Promise<Achievement> {
    const res = await fetch('/api/achievements', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates }),
    });
    if (!res.ok) {
      throw new Error(`Failed to update achievement: ${res.statusText}`);
    }
    return res.json();
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`/api/achievements?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw new Error(`Failed to delete achievement: ${res.statusText}`);
    }
  },
};
