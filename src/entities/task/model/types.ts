export type TaskStatus = 'Todo' | 'InProgress' | 'Done' | 'Canceled';
export type TaskPriority = 'P1' | 'P2' | 'P3' | 'P4';
export type TaskType = 'Study' | 'Practice' | 'Repeat' | 'Note' | 'General';

export interface Task {
  id: string;
  title: string;
  type?: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  topicId?: string | null;
  goalId?: string | null;
  materialId?: string | null;
  scheduledDate?: string | null; // YYYY-MM-DD
  dueDate?: string | null;
  complexity?: number;
  completedAt?: string | null;
  createdAt: string;
}
