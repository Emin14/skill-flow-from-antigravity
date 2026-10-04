export type BacklogStatus = 'idea' | 'planned' | 'done';
export type BacklogPriority = 'high' | 'medium' | 'low';

export interface BacklogTopic {
  id: string;
  name: string;
  description: string | null;
  sortOrder: number;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SaveBacklogTopicDto {
  name: string;
  description?: string | null;
  sortOrder?: number;
  archived?: boolean;
}

export interface BacklogItem {
  id: string;
  topic: string;
  topicId?: string;
  title: string;
  description?: string | null;
  status: BacklogStatus;
  priority?: BacklogPriority | null;
  tags?: string[] | null;
  link?: string | null;
  sortOrder?: number | null;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateBacklogItemDto {
  topic: string;
  topicId?: string;
  title: string;
  description?: string | null;
  status?: BacklogStatus;
  priority?: BacklogPriority | null;
  tags?: string[] | null;
  link?: string | null;
}

export interface UpdateBacklogItemDto extends Partial<CreateBacklogItemDto> {
  sortOrder?: number | null;
}
