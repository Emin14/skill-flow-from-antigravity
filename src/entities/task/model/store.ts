import { create } from 'zustand';
import { Task, TaskPriority, TaskStatus, TaskOccurrence, TaskRepetitionRecord, RepeatStatus } from './types';
import { TaskCategory } from '@/shared/config/categories';
import { RepetitionMode, ScheduleFrequency, SmartRating, SPACED_INTERVAL_STEPS } from '@/shared/config/repetitionRules';
import { taskApi } from '../api/taskApi';
import { useToastStore } from '@/shared/ui';
import { useActivityStore } from '@/entities/activity';
import { getTodayStr, getTomorrowStr, formatDateDisplay } from '@/shared/lib/dateUtils';
import { playTaskCompletionSound } from '@/shared/lib/soundUtils';
import { v4 as uuidv4 } from 'uuid';

/**
 * ARCHITECTURE VARIANT A: SINGLE CENTRAL NORMALIZER FOR OCCURRENCES
 * Guarantees:
 * 1. Unique dates (1 occurrence per date max). If duplicates exist, 'Done' status takes precedence.
 * 2. Strict chronological sorting by date ascending (a.date.localeCompare(b.date)).
 * 3. Non-null IDs and valid fields.
 */
export const normalizeOccurrences = (
  occurrences: TaskOccurrence[] = [],
  taskId?: string
): TaskOccurrence[] => {
  if (!occurrences || occurrences.length === 0) return [];

  const dateMap = new Map<string, TaskOccurrence>();

  for (const occ of occurrences) {
    if (!occ || !occ.date) continue;
    const dateStr = occ.date.trim();
    if (!dateStr || !dateStr.includes('-')) continue;

    const existing = dateMap.get(dateStr);

    if (!existing) {
      dateMap.set(dateStr, {
        id: occ.id || uuidv4(),
        taskId: occ.taskId || taskId || '',
        date: dateStr,
        status: occ.status || 'Todo',
        completedAt: occ.completedAt || null,
        smartRating: occ.smartRating,
        pomodorosCount: occ.pomodorosCount,
        activeMinutes: occ.activeMinutes,
        note: occ.note || null,
      });
    } else {
      if (occ.status === 'Done' && existing.status !== 'Done') {
        dateMap.set(dateStr, {
          ...existing,
          status: 'Done',
          completedAt: occ.completedAt || new Date().toISOString(),
          smartRating: occ.smartRating || existing.smartRating,
          pomodorosCount: occ.pomodorosCount || existing.pomodorosCount,
          activeMinutes: occ.activeMinutes || existing.activeMinutes,
          note: occ.note || existing.note || null,
        });
      } else if (occ.status === 'Done' && existing.status === 'Done') {
        dateMap.set(dateStr, {
          ...existing,
          completedAt: occ.completedAt || existing.completedAt,
          smartRating: occ.smartRating || existing.smartRating,
          note: occ.note || existing.note || null,
        });
      }
    }
  }

  const normalized = Array.from(dateMap.values());
  // INVARIANT 2: Always sort strictly by date ascending
  normalized.sort((a, b) => a.date.localeCompare(b.date));
  return normalized;
};

/**
 * Derived helper: Returns the date of the next uncompleted occurrence, or latest occurrence date
 */
export const getDerivedScheduledDate = (task: Task): string => {
  const norm = normalizeOccurrences(task.occurrences, task.id);
  if (norm.length === 0) return task.scheduledDate || getTodayStr();

  const upcomingTodo = norm.find((o) => o.status === 'Todo');
  if (upcomingTodo) return upcomingTodo.date;

  return norm[norm.length - 1].date;
};

/**
 * Derived helper: Returns exact completed count from occurrences
 */
export const getDerivedRepetitionsCount = (task: Task): number => {
  const norm = normalizeOccurrences(task.occurrences, task.id);
  return norm.filter((o) => o.status === 'Done').length;
};

/**
 * Single Source of Truth Helper: Returns last smart rating from occurrences
 */
export const getDerivedLastSmartRating = (task: Task): SmartRating | undefined => {
  if (!task.isRepeating) return task.lastSmartRating;
  const doneOccs = (task.occurrences || []).filter((o) => o.status === 'Done' && o.smartRating);
  if (doneOccs.length > 0) {
    return doneOccs[doneOccs.length - 1].smartRating;
  }
  return task.lastSmartRating;
};

/**
 * Single Source of Truth Helper: Returns pomodoros for repeating occurrence or task total
 */
export const getDerivedTaskPomodoros = (task: Task, dateStr?: string): number => {
  if (!task.isRepeating) return task.pomodorosCount || 1;
  const occs = task.occurrences || [];
  if (dateStr) {
    const occ = occs.find((o) => o.date === dateStr);
    return occ?.pomodorosCount || task.pomodorosCount || 1;
  }
  const sum = occs.reduce((acc, o) => acc + (o.pomodorosCount || 0), 0);
  return sum > 0 ? sum : (task.pomodorosCount || 1);
};

/**
 * Single Source of Truth Helper: Returns task status for date or task status
 */
export const getDerivedTaskStatus = (task: Task, dateStr?: string): TaskStatus => {
  if (!task.isRepeating) return task.status;
  const targetDate = dateStr || getTodayStr();
  const occ = task.occurrences?.find((o) => o.date === targetDate);
  return occ ? occ.status : 'Todo';
};

export interface AddTaskParams {
  title: string;
  category?: TaskCategory;
  scheduledDate?: string;
  description?: string;
  link?: string;
  parentTaskId?: string | null;
  topicId?: string | null;
  isRepeating?: boolean;
  repeatStatus?: RepeatStatus;
  repetitionMode?: RepetitionMode;
  scheduleFrequency?: ScheduleFrequency;
  afterCompletionDays?: number;
  hasSubtasks?: boolean;
  targetRepetitions?: number;
}

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;

  fetchTasks: () => Promise<void>;
  addTask: (titleOrParams: string | AddTaskParams, priorityFallback?: TaskPriority) => Promise<Task>;
  toggleTaskStatus: (id: string, smartRating?: SmartRating, occurrenceDate?: string) => Promise<void>;
  updateTaskStatus: (id: string, newStatus: TaskStatus, smartRating?: SmartRating, occurrenceDate?: string, pomodorosCount?: number) => Promise<void>;
  updateTaskParent: (id: string, parentTaskId: string | null) => Promise<void>;
  updateTaskDetails: (id: string, updates: Partial<Task>) => Promise<void>;
  updateRepeatStatus: (id: string, repeatStatus: RepeatStatus) => Promise<void>;
  updateTaskPomodoros: (id: string, count: number, dateStr?: string) => Promise<void>;
  updateOccurrenceNote: (id: string, note: string, dateStr?: string) => Promise<void>;
  deleteTaskOccurrence: (id: string, dateStr: string) => Promise<void>;
  updateOccurrenceDate: (id: string, currentDateStr: string, newDateStr: string) => Promise<void>;
  deleteTaskSeries: (id: string, confirmed?: boolean) => Promise<void>;
  deleteTask: (id: string, confirmed?: boolean, deleteSubtasks?: boolean) => Promise<void>;
  rescheduleTaskToToday: (id: string) => Promise<void>;
  completeRepetition: (id: string, smartRating?: SmartRating, occurrenceDate?: string) => Promise<void>;
  updateTargetRepetitions: (id: string, newTarget: number) => Promise<void>;
  updateTaskCategoryBatch: (oldCategory: string, newCategory: string) => Promise<void>;
}

const addDaysToDateStr = (dateStr: string, days: number): string => {
  if (!dateStr || !dateStr.includes('-')) {
    const today = new Date();
    today.setDate(today.getDate() + days);
    return today.toISOString().split('T')[0];
  }
  const parts = dateStr.split('-').map(Number);
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  d.setDate(d.getDate() + days);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const isSubtaskDoneForProject = (task: Task, todayStr: string): boolean => {
  if (task.repeatStatus === 'Completed') {
    return true;
  }
  if (task.isRepeating) {
    const occs = task.occurrences || [];
    const hasPendingDueOrOverdue = occs.some((o) => o.date <= todayStr && o.status === 'Todo');
    if (hasPendingDueOrOverdue) {
      return false;
    }
    if (task.scheduledDate <= todayStr) {
      const todayOcc = occs.find((o) => o.date === todayStr);
      if (todayOcc) return todayOcc.status === 'Done';
      return false;
    }
    return true;
  }
  return task.status === 'Done';
};

export const getAllDescendantTasks = (parentId: string, allTasks: Task[]): Task[] => {
  const directChildren = allTasks.filter((t) => t.parentTaskId === parentId);
  let descendants: Task[] = [];
  for (const child of directChildren) {
    descendants.push(child);
    descendants = descendants.concat(getAllDescendantTasks(child.id, allTasks));
  }
  return descendants;
};

/**
 * Cycle prevention check: Returns true if assigning proposedParentId to taskId creates a loop.
 */
export const wouldCreateCycle = (
  taskId: string,
  proposedParentId: string | null,
  allTasks: Task[]
): boolean => {
  if (!proposedParentId) return false;
  if (taskId === proposedParentId) return true;

  const descendants = getAllDescendantTasks(taskId, allTasks);
  return descendants.some((d) => d.id === proposedParentId);
};

/**
 * Returns full path of parent tasks from root to immediate parent: [RootProject, Subproject, Parent]
 */
export const getTaskParentPath = (task: Task, tasksMap: Map<string, Task>): Task[] => {
  const path: Task[] = [];
  let curr = task.parentTaskId ? tasksMap.get(task.parentTaskId) : null;
  const visited = new Set<string>();

  while (curr && !visited.has(curr.id)) {
    visited.add(curr.id);
    path.unshift(curr);
    curr = curr.parentTaskId ? tasksMap.get(curr.parentTaskId) : null;
  }
  return path;
};

export const getDynamicSmartBaseInterval = (task: Task): number => {
  const history = task.occurrences?.filter((o) => o.status === 'Done') || [];
  if (history.length === 0) return 1.0;

  history.sort((a, b) => (a.completedAt || a.date).localeCompare(b.completedAt || b.date));

  let interval = 1.0;
  for (const occ of history) {
    const rating = occ.smartRating || task.lastSmartRating || 'normal';
    if (rating === 'again') {
      interval = 1.0;
    } else if (rating === 'hard') {
      interval *= 1.2;
    } else if (rating === 'normal') {
      interval *= 1.7;
    } else if (rating === 'easy') {
      interval *= 2.5;
    }
  }

  return interval;
};

export const calculateNextInterval = (
  task: Task,
  newCount: number,
  smartRating?: SmartRating
): { nextIntervalFloat: number; daysToAdd: number } => {
  const mode = task.repetitionMode || (task.isRepeating ? 'spaced' : 'none');

  if (mode === 'none' && !smartRating) {
    return { nextIntervalFloat: 0, daysToAdd: 0 };
  }

  if (mode === 'spaced' && !smartRating) {
    const index = Math.min(Math.max(0, newCount - 1), SPACED_INTERVAL_STEPS.length - 1);
    const days = SPACED_INTERVAL_STEPS[index] || 90;
    return { nextIntervalFloat: days, daysToAdd: days };
  }

  if (mode === 'schedule' && !smartRating) {
    const freq = task.scheduleFrequency || 'daily';
    let days = 1;
    if (freq === 'daily') days = 1;
    else if (freq === 'weekly') days = 7;
    else if (freq === 'monthly') days = 30;
    else if (freq === 'yearly') days = 365;
    return { nextIntervalFloat: days, daysToAdd: days };
  }

  if (mode === 'after_completion' && !smartRating) {
    const days = Math.max(1, task.afterCompletionDays || 3);
    return { nextIntervalFloat: days, daysToAdd: days };
  }

  const baseInterval = getDynamicSmartBaseInterval(task);

  let nextFloat = 1.0;
  if (smartRating === 'again') {
    nextFloat = 1.0;
  } else if (smartRating === 'hard') {
    nextFloat = baseInterval * 1.2;
  } else if (smartRating === 'normal') {
    nextFloat = baseInterval * 1.7;
  } else if (smartRating === 'easy') {
    nextFloat = baseInterval * 2.5;
  } else {
    nextFloat = baseInterval * 2.0;
  }

  const daysToAdd = Math.max(1, Math.floor(nextFloat));
  return { nextIntervalFloat: nextFloat, daysToAdd };
};

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const rawTasks = await taskApi.getAll();

      const cleanedTasks = rawTasks.map((t) => {
        const rawOccs: TaskOccurrence[] = t.occurrences ? [...t.occurrences] : [];
        if (rawOccs.length === 0) {
          rawOccs.push({
            id: uuidv4(),
            taskId: t.id,
            date: t.scheduledDate || getTodayStr(),
            status: t.status || 'Todo',
            completedAt: t.completedAt,
            smartRating: t.lastSmartRating,
          });
        }
        const normalized = normalizeOccurrences(rawOccs, t.id);
        return {
          ...t,
          occurrences: normalized,
          scheduledDate: getDerivedScheduledDate({ ...t, occurrences: normalized }),
          repetitionsCount: getDerivedRepetitionsCount({ ...t, occurrences: normalized }),
          lastSmartRating: getDerivedLastSmartRating({ ...t, occurrences: normalized }),
        };
      });

      set({ tasks: cleanedTasks, isLoading: false });
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
    }
  },

  addTask: async (titleOrParams: string | AddTaskParams, priorityFallback: TaskPriority = 'P3') => {
    const today = getTodayStr();
    const taskId = uuidv4();
    let newTask: Task;

    if (typeof titleOrParams === 'string') {
      newTask = {
        id: taskId,
        title: titleOrParams,
        status: 'Todo',
        priority: priorityFallback,
        category: 'Без категории',
        scheduledDate: today,
        isRepeating: false,
        repetitionMode: 'none',
        hasSubtasks: false,
        targetRepetitions: 8,
        repetitionsCount: 0,
        createdAt: new Date().toISOString(),
        pomodorosCount: 1,
        totalActiveSeconds: 0,
        currentIntervalDays: 1.0,
      };
    } else {
      const {
        title,
        category = 'Без категории',
        scheduledDate = today,
        description = '',
        link = '',
        parentTaskId = null,
        topicId = null,
        isRepeating = false,
        repeatStatus: customRepeatStatus = 'Active',
        repetitionMode = 'none',
        scheduleFrequency = 'daily',
        afterCompletionDays = 3,
        hasSubtasks = false,
        targetRepetitions = 8,
      } = titleOrParams;

      const effectiveHasSubtasks = hasSubtasks;
      const effectiveIsRepeating = effectiveHasSubtasks ? false : (isRepeating && repetitionMode !== 'none');
      const effectiveMode: RepetitionMode = effectiveIsRepeating ? (repetitionMode === 'none' ? 'spaced' : repetitionMode) : 'none';

      const rawOccs: TaskOccurrence[] = [
        {
          id: uuidv4(),
          taskId,
          date: scheduledDate || today,
          status: 'Todo',
        },
      ];

      const normOccs = normalizeOccurrences(rawOccs, taskId);

      newTask = {
        id: taskId,
        title,
        status: 'Todo',
        priority: 'P3',
        category,
        scheduledDate: effectiveIsRepeating ? (normOccs[0]?.date || scheduledDate) : scheduledDate,
        description,
        link,
        parentTaskId,
        topicId,
        isRepeating: effectiveIsRepeating,
        repeatStatus: effectiveIsRepeating ? customRepeatStatus : undefined,
        repetitionMode: effectiveMode,
        scheduleFrequency,
        afterCompletionDays: Math.max(1, afterCompletionDays),
        currentIntervalDays: 1.0,
        hasSubtasks: effectiveHasSubtasks,
        targetRepetitions,
        repetitionsCount: 0,
        occurrences: normOccs,
        createdAt: new Date().toISOString(),
        pomodorosCount: 1,
        totalActiveSeconds: 0,
      };
    }

    const saved = await taskApi.create(newTask);
    set((state) => ({ tasks: [saved, ...state.tasks] }));
    useToastStore.getState().showToast(`Задача "${newTask.title}" создана`, 'success');
    useActivityStore.getState().logActivity('task_created', `Создана задача: "${newTask.title}"`);
    return saved;
  },

  toggleTaskStatus: async (id: string, smartRating?: SmartRating, occurrenceDate?: string) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;

    if (task.isRepeating) {
      const occurrences = task.occurrences || [];
      const todayStr = getTodayStr();

      let targetDate = occurrenceDate;
      if (!targetDate) {
        // If no occurrenceDate provided, prefer today's occurrence if present, else derived scheduledDate
        const occToday = occurrences.find((o) => o.date === todayStr);
        if (occToday) {
          targetDate = todayStr;
        } else {
          targetDate = task.scheduledDate || todayStr;
        }
      }

      const occ = occurrences.find((o) => o.date === targetDate);
      const isDoneNow = occ ? occ.status === 'Done' : false;
      const nextStatus: TaskStatus = isDoneNow ? 'Todo' : 'Done';
      await get().updateTaskStatus(id, nextStatus, smartRating, targetDate);
    } else {
      const nextStatus: TaskStatus = task.status === 'Done' ? 'Todo' : 'Done';
      await get().updateTaskStatus(id, nextStatus, smartRating);
    }
  },

  updateTaskStatus: async (
    id: string,
    newStatus: TaskStatus,
    smartRating?: SmartRating,
    occurrenceDate?: string,
    pomodorosCount?: number
  ) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;

    const nowIso = new Date().toISOString();
    const todayStr = nowIso.split('T')[0];
    const targetDate = occurrenceDate || task.scheduledDate || todayStr;

    // REPEAT ARCHITECTURE: Occurrences Management (Variant A)
    if (task.isRepeating) {
      let occs = normalizeOccurrences(task.occurrences || [], id);

      let targetOcc = occs.find((o) => o.date === targetDate);
      if (!targetOcc) {
        targetOcc = {
          id: uuidv4(),
          taskId: id,
          date: targetDate,
          status: newStatus,
          completedAt: newStatus === 'Done' ? nowIso : null,
          smartRating,
          pomodorosCount: pomodorosCount ?? 1,
        };
        occs.push(targetOcc);
      } else {
        occs = occs.map((o) =>
          o.date === targetDate
            ? {
                ...o,
                status: newStatus,
                completedAt: newStatus === 'Done' ? nowIso : null,
                smartRating: smartRating || (newStatus === 'Todo' ? undefined : o.smartRating),
                pomodorosCount: pomodorosCount ?? o.pomodorosCount ?? 1,
              }
            : o
        );
      }

      if (newStatus === 'Done') {
        const isStopped = task.repeatStatus === 'Paused' || task.repeatStatus === 'Completed';
        if (!isStopped) {
          const doneCount = occs.filter((o) => o.status === 'Done').length;
          const { daysToAdd } = calculateNextInterval(task, doneCount, smartRating);
          let nextDate = addDaysToDateStr(targetDate, daysToAdd);
          if (nextDate < todayStr) {
            nextDate = todayStr;
          }

          // Remove any future uncompleted occurrences that were beyond targetDate to prevent ghost skips
          occs = occs.filter((o) => o.status === 'Done' || o.date <= targetDate || o.date === nextDate);

          const hasNext = occs.some((o) => o.date === nextDate);
          if (!hasNext) {
            occs.push({
              id: uuidv4(),
              taskId: id,
              date: nextDate,
              status: 'Todo',
            });
          }
        }
      } else if (newStatus === 'Todo') {
        // UNCOMPLETING AN OCCURRENCE:
        // Remove future auto-generated 'Todo' occurrences that came after this targetDate
        // because un-completing this occurrence makes targetDate the active head again.
        occs = occs.filter((o) => o.status === 'Done' || o.date <= targetDate);
      }

      // INVARIANT 2 & 6: Run through central normalizer
      const normalized = normalizeOccurrences(occs, id);

      const derivedScheduledDate = getDerivedScheduledDate({ ...task, occurrences: normalized });
      const derivedDoneCount = getDerivedRepetitionsCount({ ...task, occurrences: normalized });

      const updates: Partial<Task> = {
        occurrences: normalized,
        scheduledDate: derivedScheduledDate,
        repetitionsCount: derivedDoneCount,
        lastSmartRating: smartRating || task.lastSmartRating,
      };

      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      }));

      await taskApi.update(id, updates);

      if (newStatus === 'Done') {
        playTaskCompletionSound();
        const nextOcc = normalized.find((o) => o.date > targetDate && o.status === 'Todo');
        const toastDate = nextOcc ? nextOcc.date : derivedScheduledDate;
        useToastStore.getState().showToast(`Следующее повторение: ${toastDate}`, 'success');
        useActivityStore.getState().logActivity('task_completed', `Выполнено повторение: "${task.title}"`);
      } else {
        useToastStore.getState().showToast(`Отменено выполнение за ${targetDate}`, 'info');
      }
      return;
    }

    // NON-REPEATING TASK LOGIC
    let updatedOccs = (task.occurrences || []).map((o) => ({
      ...o,
      status: newStatus,
      completedAt: newStatus === 'Done' ? nowIso : null,
    }));
    if (updatedOccs.length === 0) {
      updatedOccs = [
        {
          id: uuidv4(),
          taskId: id,
          date: task.scheduledDate || todayStr,
          status: newStatus,
          completedAt: newStatus === 'Done' ? nowIso : null,
        },
      ];
    }

    const updates: Partial<Task> = {
      status: newStatus,
      occurrences: updatedOccs,
    };
    if (newStatus === 'Done') {
      updates.completedAt = nowIso;
      if (!task.scheduledDate || task.scheduledDate === '' || task.scheduledDate === 'anytime') {
        updates.scheduledDate = todayStr;
      }
    } else if (newStatus === 'Todo') {
      updates.completedAt = null;
    }

    const descendantTasks = newStatus === 'Done' ? getAllDescendantTasks(id, get().tasks) : [];
    const descendantIds = descendantTasks.map((t) => t.id);

    const updatedSubtasksMap = new Map<string, Task>();

    set((state) => ({
      tasks: state.tasks.map((t) => {
        if (t.id === id) return { ...t, ...updates };
        if (descendantIds.includes(t.id)) {
          if (!t.isRepeating) {
            const updated = { ...t, status: 'Done' as TaskStatus, completedAt: nowIso };
            updatedSubtasksMap.set(t.id, updated);
            return updated;
          }
          let occs = normalizeOccurrences(t.occurrences || [], t.id);
          let targetOcc = occs.find((o) => o.date === targetDate);
          if (!targetOcc) {
            targetOcc = {
              id: uuidv4(),
              taskId: t.id,
              date: targetDate,
              status: 'Done',
              completedAt: nowIso,
            };
            occs.push(targetOcc);
          } else {
            occs = occs.map((o) =>
              o.date === targetDate
                ? { ...o, status: 'Done', completedAt: nowIso }
                : o
            );
          }
          const isStopped = t.repeatStatus === 'Paused' || t.repeatStatus === 'Completed';
          if (!isStopped) {
            const doneCount = occs.filter((o) => o.status === 'Done').length;
            const { daysToAdd } = calculateNextInterval(t, doneCount);
            let nextDate = addDaysToDateStr(targetDate, daysToAdd);
            if (nextDate < todayStr) {
              nextDate = todayStr;
            }
            occs = occs.filter((o) => o.status === 'Done' || o.date <= targetDate || o.date === nextDate);
            if (!occs.some((o) => o.date === nextDate)) {
              occs.push({
                id: uuidv4(),
                taskId: t.id,
                date: nextDate,
                status: 'Todo',
              });
            }
          }
          const normalized = normalizeOccurrences(occs, t.id);
          const derivedScheduledDate = getDerivedScheduledDate({ ...t, occurrences: normalized });
          const derivedDoneCount = getDerivedRepetitionsCount({ ...t, occurrences: normalized });
          const updated = {
            ...t,
            occurrences: normalized,
            scheduledDate: derivedScheduledDate,
            repetitionsCount: derivedDoneCount,
          };
          updatedSubtasksMap.set(t.id, updated);
          return updated;
        }
        return t;
      }),
    }));

    await taskApi.update(id, updates);
    if (newStatus === 'Done') {
      playTaskCompletionSound();
      useActivityStore.getState().logActivity('task_completed', `Выполнена задача: "${task.title}"`);
    }
    for (const st of descendantTasks) {
      const updatedSub = updatedSubtasksMap.get(st.id);
      if (updatedSub) {
        await taskApi.update(st.id, {
          status: updatedSub.status,
          completedAt: updatedSub.completedAt,
          occurrences: updatedSub.occurrences,
          scheduledDate: updatedSub.scheduledDate,
          repetitionsCount: updatedSub.repetitionsCount,
        });
      } else {
        await taskApi.update(st.id, { status: 'Done', completedAt: nowIso });
      }
    }

    if (newStatus === 'Done') {
      useToastStore.getState().showToast(`Задача "${task.title}" выполнена!`, 'success');
    }
  },

  updateTaskParent: async (id: string, parentTaskId: string | null) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;

    if (parentTaskId) {
      if (parentTaskId === id) {
        useToastStore.getState().showToast('Задача не может быть подзадачей самой себя', 'error');
        return;
      }
      const descendants = getAllDescendantTasks(id, get().tasks);
      if (descendants.some((d) => d.id === parentTaskId)) {
        useToastStore.getState().showToast('Нельзя сделать задачу подзадачей её собственного потомка!', 'error');
        return;
      }
    }

    const previousParentId = task.parentTaskId;

    if (parentTaskId) {
      const parentTask = get().tasks.find((t) => t.id === parentTaskId);
      if (parentTask) {
        const isConvertingToProject = !parentTask.hasSubtasks;
        const updates: Partial<Task> = {
          hasSubtasks: true,
          isRepeating: false,
          repetitionMode: 'none',
        };

        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.id === id) return { ...t, parentTaskId };
            if (t.id === parentTaskId) return { ...t, ...updates };
            return t;
          }),
        }));

        await taskApi.update(id, { parentTaskId });
        await taskApi.update(parentTaskId, updates);
        if (isConvertingToProject) {
          useToastStore.getState().showToast(`Задача "${parentTask.title}" преобразована в проект`, 'success');
        } else {
          useToastStore.getState().showToast(`Подзадача привязана к проекту "${parentTask.title}"`, 'info');
        }

        // BUG-002 fix: also clean up the previous parent if it now has no subtasks
        if (previousParentId && previousParentId !== parentTaskId) {
          const remainingSubtasks = get().tasks.filter((t) => t.parentTaskId === previousParentId);
          if (remainingSubtasks.length === 0) {
            set((state) => ({
              tasks: state.tasks.map((t) => (t.id === previousParentId ? { ...t, hasSubtasks: false } : t)),
            }));
            await taskApi.update(previousParentId, { hasSubtasks: false });
          }
        }

        return;
      }
    }

    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, parentTaskId } : t)),
    }));

    await taskApi.update(id, { parentTaskId });

    if (previousParentId) {
      const remainingSubtasks = get().tasks.filter((t) => t.parentTaskId === previousParentId);
      if (remainingSubtasks.length === 0) {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === previousParentId ? { ...t, hasSubtasks: false } : t)),
        }));
        await taskApi.update(previousParentId, { hasSubtasks: false });
      }
    }
  },

  // SINGLE TASK UPDATE: Updates 1 record in O(1)! All occurrences instantly show updated title/category/description
  updateTaskDetails: async (id: string, updates: Partial<Task>) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;

    if (updates.parentTaskId && wouldCreateCycle(id, updates.parentTaskId, get().tasks)) {
      useToastStore.getState().showToast('⚠️ Циклическая привязка запрещена!', 'error');
      return;
    }

    const hasSubtasksNow = updates.hasSubtasks !== undefined ? updates.hasSubtasks : (task.hasSubtasks || get().tasks.some((t) => t.parentTaskId === id));

    if (hasSubtasksNow && updates.isRepeating) {
      useToastStore.getState().showToast('Родительские задачи с подзадачами не могут быть повторяющимися', 'warning');
      updates.isRepeating = false;
      updates.repetitionMode = 'none';
    }

    if (updates.isRepeating && (!task.occurrences || task.occurrences.length === 0)) {
      const today = getTodayStr();
      const targetDate = updates.scheduledDate || task.scheduledDate || today;
      updates.occurrences = normalizeOccurrences(
        [
          {
            id: uuidv4(),
            taskId: id,
            date: targetDate,
            status: 'Todo',
          },
        ],
        id
      );
    } else if (updates.scheduledDate && task.occurrences && task.occurrences.length > 0) {
      const occs = task.occurrences.map((o) =>
        o.status === 'Todo' ? { ...o, date: updates.scheduledDate! } : o
      );
      updates.occurrences = occs;
    }

    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));

    try {
      await taskApi.update(id, updates);
    } catch (e) {
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? task : t)),
        error: (e as Error).message,
      }));
    }
  },

  updateRepeatStatus: async (id: string, repeatStatus: RepeatStatus) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;

    const oldTask = { ...task };
    const updates: Partial<Task> = { repeatStatus, isRepeating: true };

    let createdNewOccDate: string | null = null;

    // If resuming to Active, ensure at least 1 upcoming Todo occurrence exists
    let newOccurrences = task.occurrences ? [...task.occurrences] : [];
    if (repeatStatus === 'Active') {
      const todayStr = getTodayStr();
      const normOccs = normalizeOccurrences(newOccurrences, id);
      const hasUpcomingTodo = normOccs.some((o) => o.status === 'Todo');

      if (!hasUpcomingTodo) {
        // Last occurrence was completed! Generate next instance based on interval rules.
        const doneOccs = normOccs.filter((o) => o.status === 'Done');
        const lastDoneOcc = doneOccs.length > 0 ? doneOccs[doneOccs.length - 1] : null;

        const targetStartDate = lastDoneOcc ? lastDoneOcc.date : todayStr;
        const doneCount = doneOccs.length;
        const { daysToAdd } = calculateNextInterval(task, doneCount, task.lastSmartRating);
        let nextDate = addDaysToDateStr(targetStartDate, daysToAdd);

        // Ensure next occurrence date is not in the past
        if (nextDate < todayStr) {
          nextDate = todayStr;
        }

        normOccs.push({
          id: uuidv4(),
          taskId: id,
          date: nextDate,
          status: 'Todo',
        });

        createdNewOccDate = nextDate;
        const finalOccs = normalizeOccurrences(normOccs, id);
        updates.occurrences = finalOccs;
        updates.scheduledDate = getDerivedScheduledDate({ ...task, occurrences: finalOccs });
      }
    }

    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));

    try {
      await taskApi.update(id, updates);
      if (repeatStatus === 'Paused') {
        useToastStore.getState().showToast(`Повторение "${task.title}" приостановлено ⏸️`, 'info');
      } else if (repeatStatus === 'Completed') {
        useToastStore.getState().showToast(`Повторение "${task.title}" завершено ✅`, 'success');
      } else {
        if (createdNewOccDate) {
          playTaskCompletionSound();
          const todayStr = getTodayStr();
          const tomorrowStr = getTomorrowStr();
          const dateText = createdNewOccDate === todayStr ? 'Сегодня' : createdNewOccDate === tomorrowStr ? 'Завтра' : formatDateDisplay(createdNewOccDate);
          useToastStore.getState().showToast(`Повторение "${task.title}" возобновлено! Следующий экземпляр: ${dateText} 🔄`, 'success');
        } else {
          useToastStore.getState().showToast(`Повторение "${task.title}" возобновлено ▶️`, 'success');
        }
      }
    } catch (e) {
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? oldTask : t)),
        error: (e as Error).message,
      }));
    }
  },

  updateTaskPomodoros: async (id: string, count: number, dateStr?: string) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;

    const safeCount = Math.max(0.1, count);
    const targetDate = dateStr || task.scheduledDate || getTodayStr();

    const currentOccs = task.occurrences || [];
    const existingOcc = currentOccs.find((o) => o.date === targetDate) || currentOccs[0];
    let updatedOccs: TaskOccurrence[];

    if (existingOcc) {
      updatedOccs = currentOccs.map((o) => (o.id === existingOcc.id || o.date === targetDate ? { ...o, pomodorosCount: safeCount } : o));
    } else {
      updatedOccs = [
        ...currentOccs,
        {
          id: uuidv4(),
          taskId: id,
          date: targetDate,
          status: 'Todo',
          pomodorosCount: safeCount,
        },
      ];
    }

    const normalized = normalizeOccurrences(updatedOccs, id);
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, occurrences: normalized, pomodorosCount: safeCount } : t)),
    }));

    await taskApi.update(id, { occurrences: normalized });
  },

  updateOccurrenceNote: async (id: string, note: string, dateStr?: string) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;

    const targetDate = dateStr || getTodayStr();
    const currentOccs = task.occurrences || [];
    const existingOcc = currentOccs.find((o) => o.date === targetDate);
    let updatedOccs: TaskOccurrence[];

    if (existingOcc) {
      updatedOccs = currentOccs.map((o) => (o.date === targetDate ? { ...o, note } : o));
    } else {
      updatedOccs = [
        ...currentOccs,
        {
          id: uuidv4(),
          taskId: id,
          date: targetDate,
          status: 'Todo',
          note,
        },
      ];
    }

    const normalized = normalizeOccurrences(updatedOccs, id);
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, occurrences: normalized } : t)),
    }));

    await taskApi.update(id, { occurrences: normalized });
  },

  deleteTaskOccurrence: async (id: string, dateStr: string) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;

    if (!task.isRepeating) {
      await get().deleteTask(id);
      return;
    }

    const currentOccs = task.occurrences || [];
    const remainingOccs = currentOccs.filter((o) => o.date !== dateStr);

    if (remainingOccs.length === 0) {
      await get().deleteTask(id, true);
      return;
    }

    const normOccs = normalizeOccurrences(remainingOccs, id);

    if (normOccs.length === 0) {
      await get().deleteTask(id, true);
      return;
    }

    const derivedDate = getDerivedScheduledDate({ ...task, occurrences: normOccs });
    const derivedDoneCount = getDerivedRepetitionsCount({ ...task, occurrences: normOccs });

    const updates: Partial<Task> = {
      occurrences: normOccs,
      scheduledDate: derivedDate,
      repetitionsCount: derivedDoneCount,
    };

    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));

    await taskApi.update(id, updates);
  },

  updateOccurrenceDate: async (id: string, currentDateStr: string, newDateStr: string) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task || !newDateStr || currentDateStr === newDateStr) return;

    const currentOccs = task.occurrences || [];
    let found = false;
    const updatedOccs = currentOccs.map((o) => {
      if (o.date === currentDateStr) {
        found = true;
        return { ...o, date: newDateStr };
      }
      return o;
    });

    if (!found) {
      updatedOccs.push({
        id: uuidv4(),
        taskId: id,
        date: newDateStr,
        status: 'Todo',
      });
    }

    const normOccs = normalizeOccurrences(updatedOccs, id);
    const derivedDate = getDerivedScheduledDate({ ...task, occurrences: normOccs });
    const derivedDoneCount = getDerivedRepetitionsCount({ ...task, occurrences: normOccs });

    const updates: Partial<Task> = {
      occurrences: normOccs,
      scheduledDate: derivedDate,
      repetitionsCount: derivedDoneCount,
    };

    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));

    await taskApi.update(id, updates);
    useToastStore.getState().showToast(`Экземпляр перенесен на ${newDateStr}`, 'success');
  },

  deleteTaskSeries: async (id: string, confirmed?: boolean) => {
    await get().deleteTask(id, confirmed);
  },

  deleteTask: async (id: string, confirmed?: boolean, deleteSubtasks: boolean = true) => {
    const deletedTask = get().tasks.find((t) => t.id === id);
    if (!deletedTask) return;

    const descendantTasks = getAllDescendantTasks(id, get().tasks);

    // Если у задачи есть подзадачи и подтверждение не получено — запрашиваем выбор у пользователя
    if (descendantTasks.length > 0 && confirmed !== true) {
      if (typeof window !== 'undefined') {
        const promptMsg = 'Задача "' + deletedTask.title + '" содержит ' + descendantTasks.length + ' подзадач(и).\n\nУдалить родительскую задачу ВМЕСТЕ со всеми подзадачами?';
        const shouldDeleteSubtasks = window.confirm(promptMsg);

        if (shouldDeleteSubtasks) {
          return get().deleteTask(id, true, true);
        } else {
          const shouldKeepSubtasks = window.confirm(
            'Сохранить подзадачи как основные задачи в общем списке?'
          );
          if (shouldKeepSubtasks) {
            return get().deleteTask(id, true, false);
          } else {
            return; // Пользователь отменил действие
          }
        }
      }
      return;
    }

    // ВАРИАНТ А: Пользователь решил сохранить подзадачи — отвязываем их от родителя
    if (descendantTasks.length > 0 && !deleteSubtasks) {
      const directChildren = get().tasks.filter((t) => t.parentTaskId === id);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.parentTaskId === id ? { ...t, parentTaskId: null } : t)),
      }));

      for (const child of directChildren) {
        await taskApi.update(child.id, { parentTaskId: null });
      }

      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
      }));
      await taskApi.delete(id);

      useToastStore.getState().showToast(`Задача "${deletedTask.title}" удалена. Подзадачи сохранены как основные.`, 'info');
      return;
    }

    // ВАРИАНТ Б: Стандартное удаление родителя и всех его потомков
    const allToDelete = [deletedTask, ...descendantTasks];
    const allDeleteIds = allToDelete.map((t) => t.id);
    const parentTaskId = deletedTask.parentTaskId;

    set((state) => {
      let nextTasks = state.tasks.filter((t) => !allDeleteIds.includes(t.id));
      if (parentTaskId) {
        const remainingSubtasks = nextTasks.filter((t) => t.parentTaskId === parentTaskId);
        if (remainingSubtasks.length === 0) {
          const parentObj = state.tasks.find((t) => t.id === parentTaskId);
          if (parentObj && parentObj.hasSubtasks) {
            nextTasks = nextTasks.map((t) => (t.id === parentTaskId ? { ...t, hasSubtasks: false } : t));
          }
        }
      }
      return { tasks: nextTasks };
    });

    for (const t of allToDelete) {
      await taskApi.delete(t.id);
    }

    useToastStore.getState().showToast(
      `Задача "${deletedTask.title}" удалена`,
      'undo',
      async () => {
        for (const t of allToDelete) {
          await taskApi.create(t);
        }
        set((state) => ({
          tasks: [...get().tasks, ...allToDelete.filter((t) => !get().tasks.some((existing) => existing.id === t.id))],
        }));
        useToastStore.getState().showToast('Задача и подзадачи восстановлены', 'success');
      }
    );
  },

  rescheduleTaskToToday: async (id: string) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;

    const todayStr = getTodayStr();

    if (task.isRepeating) {
      const currentOccs = task.occurrences || [];
      const updatedOccs = currentOccs.map((o) => {
        if (o.date < todayStr && o.status !== 'Done') {
          return { ...o, date: todayStr };
        }
        return o;
      });

      const normOccs = normalizeOccurrences(updatedOccs, id);
      const derivedDate = getDerivedScheduledDate({ ...task, occurrences: normOccs });
      const derivedDoneCount = getDerivedRepetitionsCount({ ...task, occurrences: normOccs });

      const updates: Partial<Task> = {
        occurrences: normOccs,
        scheduledDate: derivedDate,
        repetitionsCount: derivedDoneCount,
      };

      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      }));

      await taskApi.update(id, updates);
    } else {
      const updates: Partial<Task> = { scheduledDate: todayStr };

      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      }));

      await taskApi.update(id, updates);
    }

    useToastStore.getState().showToast(`Задача "${task.title}" перенесена на сегодня ☀️`, 'success');
  },

  completeRepetition: async (id: string, smartRating?: SmartRating, occurrenceDate?: string) => {
    await get().updateTaskStatus(id, 'Done', smartRating, occurrenceDate);
  },

  updateTargetRepetitions: async (id: string, newTarget: number) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;

    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, targetRepetitions: newTarget } : t)),
    }));

    await taskApi.update(id, { targetRepetitions: newTarget });
    useToastStore.getState().showToast(`Цель повторений изменена на ${newTarget}`, 'info');
  },

  updateTaskCategoryBatch: async (oldCategory: string, newCategory: string) => {
    if (!oldCategory || oldCategory === newCategory) return;
    set((state) => ({
      tasks: state.tasks.map((t) => (t.category === oldCategory ? { ...t, category: newCategory } : t)),
    }));

    try {
      await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'batchUpdateCategory',
          oldCategory,
          newCategory,
        }),
      });
    } catch (e) {
      console.warn('Failed to update categories batch on server', e);
    }
  },
}));
