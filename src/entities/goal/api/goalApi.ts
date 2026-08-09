import { Goal } from '../model/types';

export const goalApi = {
  async getAll(): Promise<Goal[]> {
    const res = await fetch('/api/goals');
    if (!res.ok) throw new Error(`Failed to fetch goals: ${res.statusText}`);
    return res.json();
  },

  async create(goal: Goal): Promise<Goal> {
    const res = await fetch('/api/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goal),
    });
    if (!res.ok) throw new Error(`Failed to create goal: ${res.statusText}`);
    return res.json();
  },

  async update(id: string, updates: Partial<Goal>): Promise<Goal> {
    const res = await fetch('/api/goals', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates }),
    });
    if (!res.ok) throw new Error(`Failed to update goal: ${res.statusText}`);
    return res.json();
  },

  async delete(id: string): Promise<boolean> {
    const res = await fetch(`/api/goals?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(`Failed to delete goal: ${res.statusText}`);
    const data = await res.json();
    return data.success;
  },
};
