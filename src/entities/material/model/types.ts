export type MaterialType = 'Note' | 'Article' | 'Video' | 'Link';

export interface Material {
  id: string;
  topicId: string;
  title: string;
  description?: string;
  readTimeMinutes?: number;
  type: MaterialType;
  content?: string;
  isCompleted: boolean;
  completedAt?: string | null;
  createdAt: string;
}
