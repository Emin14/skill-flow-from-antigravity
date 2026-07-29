export interface GoalEntity {
  id: string;
  title: string;
  description?: string;
  color: string;
  status: 'Active' | 'Paused' | 'Completed' | 'Archived';
  createdAt: string;
}

export interface GoalRepository {
  getAll(): Promise<GoalEntity[]>;
  getById(id: string): Promise<GoalEntity | null>;
  save(goal: GoalEntity): Promise<GoalEntity>;
  delete(id: string): Promise<boolean>;
}
