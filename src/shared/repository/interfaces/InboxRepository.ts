import { InboxItem } from '@/entities/inbox/model/types';

export interface InboxRepository {
  getAll(): Promise<InboxItem[]>;
  getById(id: string): Promise<InboxItem | null>;
  save(item: InboxItem): Promise<InboxItem>;
  update(id: string, updates: Partial<InboxItem>): Promise<InboxItem>;
  delete(id: string): Promise<boolean>;
}
