import { Task } from '@/entities/task/model/types';
import { TaskRepository } from './TaskRepository';

const STORAGE_KEY = 'skillflow_tasks';

export class LocalStorageTaskRepository implements TaskRepository {
  private getStorage(): Task[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private setStorage(tasks: Task[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks to LocalStorage', e);
    }
  }

  async getAll(): Promise<Task[]> {
    return this.getStorage();
  }

  async getById(id: string): Promise<Task | null> {
    const tasks = this.getStorage();
    return tasks.find((t) => t.id === id) || null;
  }

  async getByDate(dateStr: string): Promise<Task[]> {
    const tasks = this.getStorage();
    return tasks.filter((t) => t.scheduledDate === dateStr);
  }

  async save(task: Task): Promise<Task> {
    const tasks = this.getStorage();
    const existingIndex = tasks.findIndex((t) => t.id === task.id);

    if (existingIndex >= 0) {
      tasks[existingIndex] = task;
    } else {
      tasks.push(task);
    }

    this.setStorage(tasks);
    return task;
  }

  async update(id: string, updates: Partial<Task>): Promise<Task> {
    const tasks = this.getStorage();
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error(`Task with id ${id} not found`);
    }

    const updatedTask = { ...tasks[index], ...updates };
    tasks[index] = updatedTask;
    this.setStorage(tasks);
    return updatedTask;
  }

  async delete(id: string): Promise<boolean> {
    const tasks = this.getStorage();
    const filtered = tasks.filter((t) => t.id !== id);
    if (filtered.length === tasks.length) return false;

    this.setStorage(filtered);
    return true;
  }
}

export const taskRepository = new LocalStorageTaskRepository();
