import { Task } from '../model/types';

export const taskApi = {
  async getAll(): Promise<Task[]> {
    const res = await fetch('/api/tasks');
    if (!res.ok) {
      throw new Error(`Failed to fetch tasks: ${res.statusText}`);
    }
    return res.json();
  },

  async create(task: Task): Promise<Task> {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    if (!res.ok) {
      throw new Error(`Failed to create task: ${res.statusText}`);
    }
    return res.json();
  },

  async update(id: string, updates: Partial<Task>): Promise<Task> {
    const res = await fetch('/api/tasks', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates }),
    });
    if (!res.ok) {
      throw new Error(`Failed to update task: ${res.statusText}`);
    }
    return res.json();
  },

  async delete(id: string, deleteSubtasks: boolean = false): Promise<boolean> {
    const url = `/api/tasks?id=${encodeURIComponent(id)}${deleteSubtasks ? '&deleteSubtasks=true' : ''}`;
    const res = await fetch(url, {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw new Error(`Failed to delete task: ${res.statusText}`);
    }
    const data = await res.json();
    return data.success;
  },
};
