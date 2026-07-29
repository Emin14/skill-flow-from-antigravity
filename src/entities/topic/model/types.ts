export interface Topic {
  id: string;
  goalId: string;
  parentId?: string | null;
  title: string;
  weight: number;
  createdAt: string;
}
