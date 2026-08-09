import { InboxItem } from '../model/types';

export const inboxApi = {
  async getAll(): Promise<InboxItem[]> {
    const res = await fetch('/api/inbox');
    if (!res.ok) throw new Error(`Failed to fetch inbox items: ${res.statusText}`);
    return res.json();
  },

  async create(item: InboxItem): Promise<InboxItem> {
    const res = await fetch('/api/inbox', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error(`Failed to create inbox item: ${res.statusText}`);
    return res.json();
  },

  async update(id: string, updates: Partial<InboxItem>): Promise<InboxItem> {
    const res = await fetch('/api/inbox', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates }),
    });
    if (!res.ok) throw new Error(`Failed to update inbox item: ${res.statusText}`);
    return res.json();
  },

  async delete(id: string): Promise<boolean> {
    const res = await fetch(`/api/inbox?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(`Failed to delete inbox item: ${res.statusText}`);
    const data = await res.json();
    return data.success;
  },
};
