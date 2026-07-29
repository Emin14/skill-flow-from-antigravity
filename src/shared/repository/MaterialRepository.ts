export interface MaterialEntity {
  id: string;
  topicId: string;
  title: string;
  type: 'Note' | 'Article' | 'Video' | 'Link';
  content: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface MaterialRepository {
  getAll(): Promise<MaterialEntity[]>;
  getByTopicId(topicId: string): Promise<MaterialEntity[]>;
  save(material: MaterialEntity): Promise<MaterialEntity>;
  delete(id: string): Promise<boolean>;
}
