export interface Achievement {
  id: string;
  title: string;
  date: string; // 'YYYY-MM-DD'
  category?: string;
  icon?: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}
