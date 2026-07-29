import { RepeatCard } from '@/entities/repeat-card/model/types';

export interface RepeatCardRepository {
  getAll(): Promise<RepeatCard[]>;
  getById(id: string): Promise<RepeatCard | null>;
  getByMaterialId(materialId: string): Promise<RepeatCard[]>;
  save(card: RepeatCard): Promise<RepeatCard>;
  update(id: string, updates: Partial<RepeatCard>): Promise<RepeatCard>;
  delete(id: string): Promise<boolean>;
}
