export interface TopicEntity {
  id: string;
  goalId: string;
  parentId?: string | null;
  title: string;
  weight: number;
  createdAt: string;
}

export interface TopicRepository {
  getAll(): Promise<TopicEntity[]>;
  getByGoalId(goalId: string): Promise<TopicEntity[]>;
  save(topic: TopicEntity): Promise<TopicEntity>;
  delete(id: string): Promise<boolean>;
}
