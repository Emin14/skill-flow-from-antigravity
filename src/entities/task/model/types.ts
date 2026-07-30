import { TaskCategory } from '@/shared/config/categories';

export type TaskStatus = 'Todo' | 'InProgress' | 'Done';
export type TaskPriority = 'P1' | 'P2' | 'P3' | 'P4';

export interface TaskRepetitionRecord {
  date: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority; // Legacy fallback
  category: TaskCategory;
  description?: string;
  link?: string;
  parentTaskId?: string | null;
  scheduledDate: string;
  isRepeating?: boolean;
  targetRepetitions?: number; // default: 8
  repetitionsCount?: number; // default: 0
  lastReviewedAt?: string | null;
  nextReviewDate?: string | null;
  repetitionHistory?: TaskRepetitionRecord[];
  topicId?: string | null;
  goalId?: string | null;
  createdAt: string;
  startedAt?: string | null;
  completedAt?: string | null;
  pomodorosCount?: number;
}
