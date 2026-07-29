import { Material } from '@/entities/material/model/types';

export interface MaterialRepository {
  getAll(): Promise<Material[]>;
  getByTopicId(topicId: string): Promise<Material[]>;
  getById(id: string): Promise<Material | null>;
  save(material: Material): Promise<Material>;
  update(id: string, updates: Partial<Material>): Promise<Material>;
  delete(id: string): Promise<boolean>;
}
