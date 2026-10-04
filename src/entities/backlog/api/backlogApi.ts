import { BacklogItem, BacklogTopic, SaveBacklogTopicDto, CreateBacklogItemDto, UpdateBacklogItemDto } from '../model/types';

export const backlogApi = {
  async getAll(): Promise<BacklogItem[]> {
    const res = await fetch('/api/backlog');
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.error || `Failed to fetch backlog items: ${res.statusText}`);
    }
    return res.json();
  },

  async create(dto: CreateBacklogItemDto): Promise<BacklogItem> {
    const res = await fetch('/api/backlog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.error || `Failed to create backlog item: ${res.statusText}`);
    }
    return res.json();
  },

  async update(id: string, updates: UpdateBacklogItemDto): Promise<BacklogItem> {
    const res = await fetch('/api/backlog', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.error || `Failed to update backlog item: ${res.statusText}`);
    }
    return res.json();
  },

  async delete(id: string): Promise<boolean> {
    const res = await fetch(`/api/backlog?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.error || `Failed to delete backlog item: ${res.statusText}`);
    }
    const data = await res.json();
    return data.success;
  },

  async getTopics(): Promise<BacklogTopic[]> {
    const res = await fetch('/api/backlog/topics');
    if (!res.ok) throw new Error('Не удалось загрузить темы');
    return res.json();
  },

  async saveTopic(dto: SaveBacklogTopicDto, id?: string): Promise<BacklogTopic> {
    const res = await fetch('/api/backlog/topics', {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...dto, ...(id ? { id } : {}) }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.error || 'Не удалось сохранить тему');
    }
    return res.json();
  },
};
