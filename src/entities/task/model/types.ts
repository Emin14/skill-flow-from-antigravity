import { TaskCategory } from '@/shared/config/categories';
import { RepetitionMode, ScheduleFrequency, SmartRating } from '@/shared/config/repetitionRules';

export type TaskStatus = 'Todo' | 'InProgress' | 'Done';
export type TaskPriority = 'P1' | 'P2' | 'P3' | 'P4';
export type TaskState = 'active' | 'paused' | 'completed' | null;
export type RepeatStatus = 'Active' | 'Paused' | 'Completed';

export interface TagItem {
  id: string;
  name: string;
  color?: string | null;
  icon?: string | null;
  createdAt?: string;
}

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
  note?: string | null;
  startedAt?: string | null;
  activeMinutes?: number;
  pomodorosCount?: number;
  smartRating?: SmartRating;
  completedAt?: string | null;
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
  sortOrder?: number | null;
  
  isRepeating?: boolean;
  taskState?: TaskState;
  repeatStatus?: RepeatStatus;
  repetitionMode?: RepetitionMode | null;
  scheduleFrequency?: ScheduleFrequency | null;
  afterCompletionDays?: number | null;
  currentIntervalDays?: number | null;
  spacedStepIndex?: number | null;
  targetRepetitions?: number | null;
  
  // Time tracking backward compatibility
  startedAt?: string | null;
  totalActiveSeconds?: number;
  
  // Derived/Calculated fields
  hasSubtasks?: boolean;
  repetitionsCount?: number;
  lastSmartRating?: SmartRating;
  completedAt?: string | null;
  pomodorosCount?: number;
  repetitionHistory?: TaskRepetitionRecord[];
  
  tags?: TagItem[];
  occurrences?: TaskOccurrence[];
  topicId?: string | null;
  goalId?: string | null;
  createdAt: string;
  updatedAt?: string;
}

/** Derived Helper Computations (Single Source of Truth) */

export const getDerivedRepetitionsCount = (task: Partial<Task>): number => {
  if (!task.occurrences) return task.repetitionsCount || 0;
  return task.occurrences.filter((o) => o.status === 'Done').length;
};

export const getDerivedLastSmartRating = (task: Partial<Task>): SmartRating | undefined => {
  if (!task.occurrences || task.occurrences.length === 0) return task.lastSmartRating;
  const doneWithRatings = task.occurrences.filter((o) => o.status === 'Done' && o.smartRating);
  if (doneWithRatings.length === 0) return task.lastSmartRating;
  return doneWithRatings[doneWithRatings.length - 1].smartRating as SmartRating;
};

export const getHasSubtasks = (taskId: string, allTasks: Task[]): boolean => {
  return allTasks.some((t) => t.parentTaskId === taskId);
};
