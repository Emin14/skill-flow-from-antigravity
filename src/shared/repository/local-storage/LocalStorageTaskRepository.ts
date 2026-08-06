import { Task } from '@/entities/task/model/types';
import { TaskRepository } from '../interfaces/TaskRepository';
import { STORAGE_KEYS } from '@/shared/config/storageKeys';

export class LocalStorageTaskRepository implements TaskRepository {
  private cache: Task[] | null = null;
  private writeQueue: Promise<void> = Promise.resolve();

  private getStorage(): Task[] {
    if (this.cache) return this.cache;
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASKS);
      this.cache = data ? JSON.parse(data) : [];
      return this.cache || [];
    } catch {
      this.cache = [];
      return [];
    }
  }

  private setStorage(tasks: Task[]): Promise<void> {
    this.cache = tasks;
    this.writeQueue = this.writeQueue.then(() => {
      if (typeof window === 'undefined') return;
      try {
        localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
      } catch (e) {
        console.error('Failed to save tasks to LocalStorage', e);
      }
    });
    return this.writeQueue;
  }

  async getAll(): Promise<Task[]> {
    return this.getStorage();
  }

  async getById(id: string): Promise<Task | null> {
    const tasks = this.getStorage();
    return tasks.find((t) => t.id === id) || null;
  }

  async getByTopicId(topicId: string): Promise<Task[]> {
    const tasks = this.getStorage();
    return tasks.filter((t) => t.topicId === topicId);
  }

  async getByDate(dateStr: string): Promise<Task[]> {
    const tasks = this.getStorage();
    return tasks.filter((t) => t.scheduledDate === dateStr);
  }

  async save(task: Task): Promise<Task> {
    const tasks = [...this.getStorage()];
    const existingIndex = tasks.findIndex((t) => t.id === task.id);

    if (existingIndex >= 0) {
      tasks[existingIndex] = task;
    } else {
      tasks.push(task);
    }

    await this.setStorage(tasks);
    return task;
  }

  async update(id: string, updates: Partial<Task>): Promise<Task> {
    const tasks = [...this.getStorage()];
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error(`Task with id ${id} not found`);
    }

    const updatedTask = { ...tasks[index], ...updates };
    tasks[index] = updatedTask;
    await this.setStorage(tasks);
    return updatedTask;
  }

  async delete(id: string): Promise<boolean> {
    const tasks = [...this.getStorage()];
    const filtered = tasks.filter((t) => t.id !== id);
    if (filtered.length === tasks.length) return false;

    await this.setStorage(filtered);
    return true;
  }
}

export const taskRepository = new LocalStorageTaskRepository();
