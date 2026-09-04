import { TaskCategory } from '@/shared/config/categories';
import { RepetitionMode, ScheduleFrequency, SmartRating } from '@/shared/config/repetitionRules';

export type TaskStatus = 'Todo' | 'InProgress' | 'Done';
export type TaskPriority = 'P1' | 'P2' | 'P3' | 'P4';
export type TaskState = 'active' | 'paused' | 'completed';
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

export interface Tag {
  id: string;
  name: string;
  color?: string | null;
  icon?: string | null;
}

export interface TaskOccurrence {
  id: string;
  taskId: string;
  date: string;
  status: TaskStatus;
  note?: string | null;
  startedAt?: string | null;
  pomodorosCount?: number | null;
  activeMinutes?: number | null;
  smartRating?: SmartRating | null;
  completedAt?: string | null;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  category: TaskCategory;
  tags?: Tag[];
  priority: TaskPriority;
  parentTaskId?: string | null;
  sortOrder?: number | null;
  currentIntervalDays?: number | null;
  taskState?: TaskState | null;
  isRepeating?: boolean;
  repetitionMode?: string | RepetitionMode | null;
  targetRepetitions?: number | null;
  scheduleFrequency?: ScheduleFrequency | null;
  createdAt: string;
  updatedAt?: string;
  link?: string | null;
  topicId?: string | null;
  goalId?: string | null;
  afterCompletionDays?: number | null;
  weeklyDays?: number[] | null;
  spacedStepIndex?: number | null;
  excludeFromStats?: boolean;

  occurrences?: TaskOccurrence[];

  // Dynamically calculated getters/properties (NOT stored in DB)
  hasSubtasks?: boolean;
  repetitionsCount?: number;
  lastSmartRating?: SmartRating | null;

  // Backward compatibility derived getters
  scheduledDate?: string;
  status?: TaskStatus;
  repeatStatus?: RepeatStatus;
  completedAt?: string | null;
  pomodorosCount?: number;
  repetitionHistory?: any[];
}

export const getDerivedRepetitionsCount = (task: Partial<Task>): number => {
  if (!task.occurrences) return task.repetitionsCount || 0;
  return task.occurrences.filter((o) => o.status === 'Done').length;
};

export const getDerivedLastSmartRating = (task: Partial<Task>): SmartRating | null => {
  if (!task.occurrences || task.occurrences.length === 0) return task.lastSmartRating ?? null;
  const doneWithRatings = task.occurrences
    .filter((o) => o.status === 'Done' && o.smartRating != null)
    .sort((a, b) => (b.completedAt || b.date).localeCompare(a.completedAt || a.date));
  return (doneWithRatings[0]?.smartRating as SmartRating) ?? task.lastSmartRating ?? null;
};

export const getHasSubtasks = (taskId: string, allTasks: Task[]): boolean => {
  return allTasks.some((t) => t.parentTaskId === taskId);
};
