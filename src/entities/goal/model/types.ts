export interface Goal {
  id: string;
  title: string;
  description?: string;
  color: string;
  status: 'Active' | 'Paused' | 'Completed' | 'Archived';
  createdAt: string;
}
