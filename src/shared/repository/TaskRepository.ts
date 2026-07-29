import { Task } from '@/entities/task/model/types';

export interface TaskRepository {
  getAll(): Promise<Task[]>;
  getById(id: string): Promise<Task | null>;
  getByDate(dateStr: string): Promise<Task[]>;
  save(task: Task): Promise<Task>;
  update(id: string, updates: Partial<Task>): Promise<Task>;
  delete(id: string): Promise<boolean>;
}
