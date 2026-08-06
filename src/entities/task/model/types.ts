import { TaskCategory } from '@/shared/config/categories';
import { RepetitionMode, ScheduleFrequency, SmartRating } from '@/shared/config/repetitionRules';

export type TaskStatus = 'Todo' | 'InProgress' | 'Done';
export type TaskPriority = 'P1' | 'P2' | 'P3' | 'P4';
export type RepeatStatus = 'Active' | 'Paused' | 'Completed';

export interface TaskRepetitionRecord {
  date: string;
  completed: boolean;
  pomodorosCount?: number;
  activeMinutes?: number;
  smartRating?: SmartRating;
}

export interface TaskOccurrence {
  id: string;
  taskId: string;
  date: string;
  status: TaskStatus;
  completedAt?: string | null;
  smartRating?: SmartRating;
  pomodorosCount?: number;
  activeMinutes?: number;
}

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  description?: string;
  link?: string;
  parentTaskId?: string | null;
  scheduledDate: string;
  isRepeating?: boolean;
  repeatStatus?: RepeatStatus;
  repetitionMode?: RepetitionMode;
  scheduleFrequency?: ScheduleFrequency;
  afterCompletionDays?: number;
  currentIntervalDays?: number;
  lastSmartRating?: SmartRating;
  spacedStepIndex?: number;
  hasSubtasks?: boolean;
  targetRepetitions?: number;
  repetitionsCount?: number;
  lastReviewedAt?: string | null;
  nextReviewDate?: string | null;
  repetitionHistory?: TaskRepetitionRecord[];
  occurrences?: TaskOccurrence[];
  topicId?: string | null;
  goalId?: string | null;
  createdAt: string;
  startedAt?: string | null;
  lastStartedAt?: string | null;
  totalActiveSeconds?: number;
  completedAt?: string | null;
  pomodorosCount?: number;
}
