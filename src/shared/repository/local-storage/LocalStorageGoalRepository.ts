import { Goal } from '@/entities/goal/model/types';
import { GoalRepository } from '../interfaces/GoalRepository';

const STORAGE_KEY = 'skillflow_goals';

export class LocalStorageGoalRepository implements GoalRepository {
  private getStorage(): Goal[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private setStorage(goals: Goal[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
    } catch (e) {
      console.error('Failed to save goals to LocalStorage', e);
    }
  }

  async getAll(): Promise<Goal[]> {
    return this.getStorage();
  }

  async getById(id: string): Promise<Goal | null> {
    const goals = this.getStorage();
    return goals.find((g) => g.id === id) || null;
  }

  async save(goal: Goal): Promise<Goal> {
    const goals = this.getStorage();
    const index = goals.findIndex((g) => g.id === goal.id);
    if (index >= 0) {
      goals[index] = goal;
    } else {
      goals.push(goal);
    }
    this.setStorage(goals);
    return goal;
  }

  async update(id: string, updates: Partial<Goal>): Promise<Goal> {
    const goals = this.getStorage();
    const index = goals.findIndex((g) => g.id === id);
    if (index === -1) {
      throw new Error(`Goal with id ${id} not found`);
    }

    const updated = { ...goals[index], ...updates };
    goals[index] = updated;
    this.setStorage(goals);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const goals = this.getStorage();
    const filtered = goals.filter((g) => g.id !== id);
    if (filtered.length === goals.length) return false;

    this.setStorage(filtered);
    return true;
  }
}

export const goalRepository = new LocalStorageGoalRepository();
