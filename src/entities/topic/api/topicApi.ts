import { Topic } from '../model/types';

export const topicApi = {
  async getAll(): Promise<Topic[]> {
    const res = await fetch('/api/topics');
    if (!res.ok) throw new Error(`Failed to fetch topics: ${res.statusText}`);
    return res.json();
  },

  async create(topic: Topic): Promise<Topic> {
    const res = await fetch('/api/topics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(topic),
    });
    if (!res.ok) throw new Error(`Failed to create topic: ${res.statusText}`);
    return res.json();
  },

  async update(id: string, updates: Partial<Topic>): Promise<Topic> {
    const res = await fetch('/api/topics', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates }),
    });
    if (!res.ok) throw new Error(`Failed to update topic: ${res.statusText}`);
    return res.json();
  },

  async delete(id: string): Promise<boolean> {
    const res = await fetch(`/api/topics?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(`Failed to delete topic: ${res.statusText}`);
    const data = await res.json();
    return data.success;
  },
};
