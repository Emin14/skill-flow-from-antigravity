import { Goal } from '@/entities/goal/model/types';

export interface GoalRepository {
  getAll(): Promise<Goal[]>;
  getById(id: string): Promise<Goal | null>;
  save(goal: Goal): Promise<Goal>;
  update(id: string, updates: Partial<Goal>): Promise<Goal>;
  delete(id: string): Promise<boolean>;
}
