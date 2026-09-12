export type BacklogStatus = 'idea' | 'backlog' | 'planned' | 'done';
export type BacklogPriority = 'high' | 'medium' | 'low';

export interface BacklogItem {
  id: string;
  topic: string;
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
