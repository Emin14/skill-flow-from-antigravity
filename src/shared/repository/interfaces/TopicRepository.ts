import { Topic } from '@/entities/topic/model/types';

export interface TopicRepository {
  getAll(): Promise<Topic[]>;
  getByGoalId(goalId: string): Promise<Topic[]>;
  getById(id: string): Promise<Topic | null>;
  save(topic: Topic): Promise<Topic>;
  update(id: string, updates: Partial<Topic>): Promise<Topic>;
  delete(id: string): Promise<boolean>;
}
