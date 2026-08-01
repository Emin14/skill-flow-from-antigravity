import { create } from 'zustand';
import { Task, TaskPriority, TaskStatus, TaskRepetitionRecord } from './types';
import { TaskCategory } from '@/shared/config/categories';
import { RepetitionMode, ScheduleFrequency, SmartRating, SPACED_INTERVAL_STEPS } from '@/shared/config/repetitionRules';
import { taskRepository } from '@/shared/repository';
import { useToastStore } from '@/shared/ui';
import { v4 as uuidv4 } from 'uuid';

export interface AddTaskParams {
  title: string;
  category?: TaskCategory;
  scheduledDate?: string;
  description?: string;
  link?: string;
  parentTaskId?: string | null;
  topicId?: string | null;
  isRepeating?: boolean;
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
  toggleTaskStatus: (id: string, smartRating?: SmartRating) => Promise<void>;
  updateTaskStatus: (id: string, newStatus: TaskStatus, smartRating?: SmartRating) => Promise<void>;
  updateTaskParent: (id: string, parentTaskId: string | null) => Promise<void>;
  updateTaskDetails: (id: string, updates: Partial<Task>) => Promise<void>;
  updateTaskPomodoros: (id: string, count: number) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  completeRepetition: (id: string, smartRating?: SmartRating) => Promise<void>;
  updateTargetRepetitions: (id: string, newTarget: number) => Promise<void>;
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

export const getAllDescendantTasks = (parentId: string, allTasks: Task[]): Task[] => {
  const directChildren = allTasks.filter((t) => t.parentTaskId === parentId);
  let descendants: Task[] = [];
  for (const child of directChildren) {
    descendants.push(child);
    descendants = descendants.concat(getAllDescendantTasks(child.id, allTasks));
  }
  return descendants;
};

export const getDynamicSmartBaseInterval = (allTasks: Task[], currentTask: Task): number => {
  const seriesKey = currentTask.seriesId || currentTask.title.toLowerCase().trim();

  const seriesCompletedTasks = allTasks.filter(
    (t) =>
      t.id !== currentTask.id &&
      t.status === 'Done' &&
      ((t.seriesId && (t.seriesId === currentTask.seriesId || t.seriesId === currentTask.id)) ||
        t.title.toLowerCase().trim() === seriesKey)
  );

  if (seriesCompletedTasks.length === 0) {
    return 1.0;
  }

  seriesCompletedTasks.sort((a, b) => {
    const timeA = a.completedAt || a.scheduledDate;
    const timeB = b.completedAt || b.scheduledDate;
    return timeA.localeCompare(timeB);
  });

  let interval = 1.0;
  for (const t of seriesCompletedTasks) {
    const rating = t.lastSmartRating || 'normal';
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
  allTasks: Task[],
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

  const baseInterval = getDynamicSmartBaseInterval(allTasks, task);

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
    nextFloat = baseInterval * 1.7;
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
      const tasks = await taskRepository.getAll();
      set({ tasks, isLoading: false });
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
    }
  },

  addTask: async (titleOrParams: string | AddTaskParams, priorityFallback: TaskPriority = 'P3') => {
    const today = new Date().toISOString().split('T')[0];
    const seriesId = uuidv4();
    let newTask: Task;

    if (typeof titleOrParams === 'string') {
      newTask = {
        id: uuidv4(),
        seriesId,
        title: titleOrParams,
        status: 'Todo',
        priority: priorityFallback,
        category: 'Задача',
        scheduledDate: today,
        isRepeating: false,
        repetitionMode: 'none',
        hasSubtasks: false,
        targetRepetitions: 8,
        repetitionsCount: 0,
        repetitionHistory: [],
        createdAt: new Date().toISOString(),
        pomodorosCount: 1,
        totalActiveSeconds: 0,
        currentIntervalDays: 1.0,
      };
    } else {
      const {
        title,
        category = 'Задача',
        scheduledDate = today,
        description = '',
        link = '',
        parentTaskId = null,
        topicId = null,
        isRepeating = false,
        repetitionMode = 'none',
        scheduleFrequency = 'daily',
        afterCompletionDays = 3,
        hasSubtasks = false,
        targetRepetitions = 8,
      } = titleOrParams;

      const effectiveHasSubtasks = hasSubtasks;
      const effectiveIsRepeating = effectiveHasSubtasks ? false : (isRepeating && repetitionMode !== 'none');
      const effectiveMode: RepetitionMode = effectiveIsRepeating ? (repetitionMode === 'none' ? 'spaced' : repetitionMode) : 'none';

      newTask = {
        id: uuidv4(),
        seriesId,
        title,
        status: 'Todo',
        priority: 'P3',
        category,
        scheduledDate,
        description,
        link,
        parentTaskId,
        topicId,
        isRepeating: effectiveIsRepeating,
        repetitionMode: effectiveMode,
        scheduleFrequency,
        afterCompletionDays,
        currentIntervalDays: 1.0,
        hasSubtasks: effectiveHasSubtasks,
        targetRepetitions,
        repetitionsCount: 0,
        repetitionHistory: [],
        createdAt: new Date().toISOString(),
        pomodorosCount: 1,
        totalActiveSeconds: 0,
      };
    }

    const saved = await taskRepository.save(newTask);
    set((state) => ({ tasks: [saved, ...state.tasks] }));
    useToastStore.getState().showToast(`Задача "${newTask.title}" создана`, 'success');
    return saved;
  },

  toggleTaskStatus: async (id: string, smartRating?: SmartRating) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;

    const newStatus: TaskStatus = task.status === 'Done' ? 'Todo' : 'Done';
    await get().updateTaskStatus(id, newStatus, smartRating);
  },

  updateTaskStatus: async (id: string, newStatus: TaskStatus, smartRating?: SmartRating) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;

    const wasAlreadyDone = task.status === 'Done';
    const seriesKey = task.seriesId || task.id;
    const nowIso = new Date().toISOString();
    const todayStr = nowIso.split('T')[0];
    const nowMs = new Date(nowIso).getTime();
    const updates: Partial<Task> = { status: newStatus };

    if (smartRating) {
      updates.lastSmartRating = smartRating;
    }

    if (newStatus !== 'Done' && smartRating) {
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === id || (t.seriesId && t.seriesId === seriesKey)
            ? { ...t, lastSmartRating: smartRating }
            : t
        ),
      }));
      await taskRepository.update(id, { lastSmartRating: smartRating });
      return;
    }

    if (wasAlreadyDone && newStatus === 'Todo') {
      if (task.isRepeating || task.seriesId) {
        const currentHistory = task.repetitionHistory || [];
        const newHistory = currentHistory.length > 0 ? currentHistory.slice(0, -1) : [];
        const newCount = Math.max(0, (task.repetitionsCount || 1) - 1);
        updates.repetitionHistory = newHistory;
        updates.repetitionsCount = newCount;

        const uncompletedDuplicates = get().tasks.filter(
          (t) =>
            t.id !== id &&
            t.status === 'Todo' &&
            ((t.seriesId && (t.seriesId === seriesKey || t.seriesId === task.seriesId)) ||
              t.title.toLowerCase().trim() === task.title.toLowerCase().trim())
        );

        const dupIds = uncompletedDuplicates.map((d) => d.id);
        if (dupIds.length > 0) {
          set((state) => ({
            tasks: state.tasks.filter((t) => !dupIds.includes(t.id)),
          }));
          for (const dupId of dupIds) {
            await taskRepository.delete(dupId);
          }
        }
      }
    }

    let currentActiveSec = task.totalActiveSeconds || 0;
    if (task.status === 'InProgress' && task.lastStartedAt) {
      const startedMs = new Date(task.lastStartedAt).getTime();
      const rawElapsedSec = Math.max(0, Math.round((nowMs - startedMs) / 1000));
      const elapsedSec = Math.min(14400, rawElapsedSec);
      currentActiveSec += elapsedSec;
      updates.totalActiveSeconds = currentActiveSec;
      updates.lastStartedAt = null;
    }

    if (newStatus === 'InProgress') {
      updates.lastStartedAt = nowIso;
      if (!task.startedAt) {
        updates.startedAt = nowIso;
      }
    } else if (newStatus === 'Done') {
      updates.completedAt = nowIso;
      if (!task.startedAt) {
        updates.startedAt = nowIso;
      }
    } else if (newStatus === 'Todo') {
      updates.lastStartedAt = null;
    }

    const descendantTasks: Task[] = newStatus === 'Done' ? getAllDescendantTasks(id, get().tasks) : [];
    const descendantIds = descendantTasks.map((t) => t.id);

    set((state) => ({
      tasks: state.tasks.map((t) => {
        if (t.id === id) return { ...t, ...updates };
        if (descendantIds.includes(t.id)) return { ...t, status: 'Done', completedAt: nowIso };
        return t;
      }),
    }));

    try {
      await taskRepository.update(id, updates);

      const newDuplicatedSubtasks: Task[] = [];

      for (const st of descendantTasks) {
        if (st.status !== 'Done') {
          await taskRepository.update(st.id, { status: 'Done', completedAt: nowIso });
        }

        if (st.isRepeating && !st.hasSubtasks) {
          const newCount = (st.repetitionsCount || 0) + 1;
          const { nextIntervalFloat, daysToAdd } = calculateNextInterval(get().tasks, st, newCount, st.lastSmartRating);
          const baseDateStr = st.scheduledDate || todayStr;
          const nextScheduledDateStr = addDaysToDateStr(baseDateStr, daysToAdd);

          const duplicatedSubtask: Task = {
            id: uuidv4(),
            seriesId: st.seriesId || st.id,
            title: st.title,
            status: 'Todo',
            priority: st.priority || 'P3',
            category: st.category || 'Задача',
            scheduledDate: nextScheduledDateStr,
            description: st.description || '',
            link: st.link || '',
            parentTaskId: st.parentTaskId || null,
            isRepeating: true,
            repetitionMode: st.repetitionMode || 'spaced',
            scheduleFrequency: st.scheduleFrequency || 'daily',
            afterCompletionDays: st.afterCompletionDays || 3,
            currentIntervalDays: nextIntervalFloat,
            lastSmartRating: st.lastSmartRating,
            hasSubtasks: false,
            targetRepetitions: st.targetRepetitions || 8,
            repetitionsCount: newCount,
            repetitionHistory: st.repetitionHistory || [],
            createdAt: new Date().toISOString(),
            pomodorosCount: st.pomodorosCount || 1,
            totalActiveSeconds: 0,
          };

          await taskRepository.save(duplicatedSubtask);
          newDuplicatedSubtasks.push(duplicatedSubtask);
        }
      }

      if (newDuplicatedSubtasks.length > 0) {
        set((state) => ({ tasks: [...newDuplicatedSubtasks, ...state.tasks] }));
      }

      const mode = task.repetitionMode || (task.isRepeating ? 'spaced' : 'none');
      if (newStatus === 'Done' && mode !== 'none' && !wasAlreadyDone) {
        const newCount = (task.repetitionsCount || 0) + 1;
        const { nextIntervalFloat, daysToAdd } = calculateNextInterval(get().tasks, task, newCount, smartRating);

        const baseDateStr = task.scheduledDate || todayStr;
        const nextScheduledDateStr = addDaysToDateStr(baseDateStr, daysToAdd);

        const activeMins = Math.max(1, Math.round(currentActiveSec / 60));
        const newHistoryRecord: TaskRepetitionRecord = {
          date: baseDateStr,
          completed: true,
          pomodorosCount: task.pomodorosCount || 1,
          activeMinutes: activeMins,
          smartRating: smartRating || 'normal',
        };
        const newHistory = [...(task.repetitionHistory || []), newHistoryRecord];

        await taskRepository.update(id, {
          repetitionHistory: newHistory,
          repetitionsCount: newCount,
          currentIntervalDays: nextIntervalFloat,
          lastSmartRating: smartRating,
        });

        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  repetitionHistory: newHistory,
                  repetitionsCount: newCount,
                  currentIntervalDays: nextIntervalFloat,
                  lastSmartRating: smartRating,
                }
              : t
          ),
        }));

        const duplicatedTask: Task = {
          id: uuidv4(),
          seriesId: task.seriesId || task.id,
          title: task.title,
          status: 'Todo',
          priority: task.priority || 'P3',
          category: task.category || 'Задача',
          scheduledDate: nextScheduledDateStr,
          description: task.description || '',
          link: task.link || '',
          parentTaskId: task.parentTaskId || null,
          isRepeating: true,
          repetitionMode: mode,
          scheduleFrequency: task.scheduleFrequency || 'daily',
          afterCompletionDays: task.afterCompletionDays || 3,
          currentIntervalDays: nextIntervalFloat,
          lastSmartRating: smartRating,
          hasSubtasks: false,
          targetRepetitions: task.targetRepetitions || 8,
          repetitionsCount: newCount,
          repetitionHistory: newHistory,
          createdAt: new Date().toISOString(),
          pomodorosCount: 1,
          totalActiveSeconds: 0,
          startedAt: null,
          lastStartedAt: null,
          completedAt: null,
        };

        await taskRepository.save(duplicatedTask);
        set((state) => ({ tasks: [duplicatedTask, ...state.tasks] }));

        useToastStore
          .getState()
          .showToast(
            `Следующее повторение: ${nextScheduledDateStr} (+${daysToAdd} дн.)`,
            'success'
          );
      } else if (newStatus === 'Done' && !wasAlreadyDone) {
        useToastStore.getState().showToast(`Задача "${task.title}" выполнена!`, 'success');
      }
    } catch (e) {
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? task : t)),
        error: (e as Error).message,
      }));
    }
  },

  updateTaskParent: async (id: string, parentTaskId: string | null) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;

    // STRICT VALIDATOR: Task cannot become a subtask of its own descendant or itself
    if (parentTaskId) {
      if (parentTaskId === id) {
        useToastStore.getState().showToast('Задача не может быть подзадачей самой себя', 'error');
        return;
      }
      const descendants = getAllDescendantTasks(id, get().tasks);
      const isDescendant = descendants.some((d) => d.id === parentTaskId);
      if (isDescendant) {
        useToastStore.getState().showToast('Нельзя сделать задачу подзадачей её собственного потомка!', 'error');
        return;
      }
    }

    const previousParentId = task.parentTaskId;

    if (parentTaskId) {
      const parentTask = get().tasks.find((t) => t.id === parentTaskId);
      if (parentTask) {
        const seriesKey = parentTask.seriesId || parentTask.id;

        const updates: Partial<Task> = {
          hasSubtasks: true,
          isRepeating: false,
          repetitionMode: 'none',
        };

        const uncompletedDuplicates = get().tasks.filter(
          (t) =>
            t.id !== parentTaskId &&
            t.status === 'Todo' &&
            ((t.seriesId && (t.seriesId === seriesKey || t.seriesId === parentTask.seriesId)) ||
              t.title.toLowerCase().trim() === parentTask.title.toLowerCase().trim())
        );

        const dupIds = uncompletedDuplicates.map((d) => d.id);

        set((state) => ({
          tasks: state.tasks
            .filter((t) => !dupIds.includes(t.id))
            .map((t) => {
              if (t.id === id) return { ...t, parentTaskId };
              if (t.id === parentTaskId) return { ...t, ...updates };
              return t;
            }),
        }));

        await taskRepository.update(id, { parentTaskId });
        await taskRepository.update(parentTaskId, updates);
        for (const dupId of dupIds) {
          await taskRepository.delete(dupId);
        }

        useToastStore.getState().showToast(`Подзадача привязана к "${parentTask.title}"`, 'info');
        return;
      }
    }

    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, parentTaskId } : t)),
    }));

    await taskRepository.update(id, { parentTaskId });

    if (previousParentId) {
      const remainingSubtasks = get().tasks.filter((t) => t.parentTaskId === previousParentId);
      if (remainingSubtasks.length === 0) {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === previousParentId ? { ...t, hasSubtasks: false } : t)),
        }));
        await taskRepository.update(previousParentId, { hasSubtasks: false });
      }
    }
  },

  updateTaskDetails: async (id: string, updates: Partial<Task>) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;

    const hasSubtasksNow = updates.hasSubtasks !== undefined ? updates.hasSubtasks : (task.hasSubtasks || get().tasks.some((t) => t.parentTaskId === id));

    if (hasSubtasksNow) {
      updates.hasSubtasks = true;
      updates.isRepeating = false;
      updates.repetitionMode = 'none';

      const seriesKey = task.seriesId || task.id;
      const uncompletedDuplicates = get().tasks.filter(
        (t) =>
          t.id !== id &&
          t.status === 'Todo' &&
          ((t.seriesId && (t.seriesId === seriesKey || t.seriesId === task.seriesId)) ||
            t.title.toLowerCase().trim() === task.title.toLowerCase().trim())
      );

      const dupIds = uncompletedDuplicates.map((d) => d.id);
      if (dupIds.length > 0) {
        set((state) => ({
          tasks: state.tasks.filter((t) => !dupIds.includes(t.id)),
        }));
        for (const dupId of dupIds) {
          await taskRepository.delete(dupId);
        }
      }
    }

    const targetSeriesId = task.seriesId || (task.isRepeating ? task.id : null);

    set((state) => ({
      tasks: state.tasks.map((t) => {
        if (t.id === id) return { ...t, ...updates };
        if (targetSeriesId && (t.seriesId === targetSeriesId || t.id === targetSeriesId)) {
          return {
            ...t,
            title: updates.title !== undefined ? updates.title : t.title,
            category: updates.category !== undefined ? updates.category : t.category,
            description: updates.description !== undefined ? updates.description : t.description,
            link: updates.link !== undefined ? updates.link : t.link,
            parentTaskId: updates.parentTaskId !== undefined ? updates.parentTaskId : t.parentTaskId,
            topicId: updates.topicId !== undefined ? updates.topicId : t.topicId,
            isRepeating: updates.isRepeating !== undefined ? updates.isRepeating : t.isRepeating,
            repetitionMode: updates.repetitionMode !== undefined ? updates.repetitionMode : t.repetitionMode,
            scheduleFrequency: updates.scheduleFrequency !== undefined ? updates.scheduleFrequency : t.scheduleFrequency,
            afterCompletionDays: updates.afterCompletionDays !== undefined ? updates.afterCompletionDays : t.afterCompletionDays,
            hasSubtasks: updates.hasSubtasks !== undefined ? updates.hasSubtasks : t.hasSubtasks,
            targetRepetitions: updates.targetRepetitions !== undefined ? updates.targetRepetitions : t.targetRepetitions,
          };
        }
        return t;
      }),
    }));

    try {
      await taskRepository.update(id, updates);
      if (targetSeriesId) {
        const seriesTasks = get().tasks.filter((t) => (t.seriesId === targetSeriesId || t.id === targetSeriesId) && t.id !== id);
        for (const st of seriesTasks) {
          await taskRepository.update(st.id, {
            title: updates.title !== undefined ? updates.title : st.title,
            category: updates.category !== undefined ? updates.category : st.category,
            description: updates.description !== undefined ? updates.description : st.description,
            link: updates.link !== undefined ? updates.link : st.link,
            parentTaskId: updates.parentTaskId !== undefined ? updates.parentTaskId : st.parentTaskId,
            topicId: updates.topicId !== undefined ? updates.topicId : st.topicId,
            isRepeating: updates.isRepeating !== undefined ? updates.isRepeating : st.isRepeating,
            repetitionMode: updates.repetitionMode !== undefined ? updates.repetitionMode : st.repetitionMode,
            scheduleFrequency: updates.scheduleFrequency !== undefined ? updates.scheduleFrequency : st.scheduleFrequency,
            afterCompletionDays: updates.afterCompletionDays !== undefined ? updates.afterCompletionDays : st.afterCompletionDays,
            hasSubtasks: updates.hasSubtasks !== undefined ? updates.hasSubtasks : st.hasSubtasks,
            targetRepetitions: updates.targetRepetitions !== undefined ? updates.targetRepetitions : st.targetRepetitions,
          });
        }
      }
      useToastStore.getState().showToast(`Задача "${updates.title || task.title}" обновлена`, 'success');
    } catch (e) {
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? task : t)),
        error: (e as Error).message,
      }));
    }
  },

  updateTaskPomodoros: async (id: string, count: number) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;

    const safeCount = Math.max(0.1, count);
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, pomodorosCount: safeCount } : t)),
    }));

    await taskRepository.update(id, { pomodorosCount: safeCount });
  },

  deleteTask: async (id: string) => {
    const deletedTask = get().tasks.find((t) => t.id === id);
    if (!deletedTask) return;

    const descendantTasks = getAllDescendantTasks(id, get().tasks);
    if (descendantTasks.length > 0) {
      const confirmed = window.confirm(
        `Удалить задачу "${deletedTask.title}" и ${descendantTasks.length} её подзадач?`
      );
      if (!confirmed) return;
    }

    const allToDelete = [deletedTask, ...descendantTasks];
    const allDeleteIds = allToDelete.map((t) => t.id);
    const parentTaskId = deletedTask.parentTaskId;

    set((state) => {
      let nextTasks = state.tasks.filter((t) => !allDeleteIds.includes(t.id));
      if (parentTaskId) {
        const remainingSubtasks = nextTasks.filter((t) => t.parentTaskId === parentTaskId);
        if (remainingSubtasks.length === 0) {
          nextTasks = nextTasks.map((t) => (t.id === parentTaskId ? { ...t, hasSubtasks: false } : t));
        }
      }
      return { tasks: nextTasks };
    });

    for (const t of allToDelete) {
      await taskRepository.delete(t.id);
    }

    if (parentTaskId) {
      const remainingInRepo = get().tasks.filter((t) => t.parentTaskId === parentTaskId && !allDeleteIds.includes(t.id));
      if (remainingInRepo.length === 0) {
        await taskRepository.update(parentTaskId, { hasSubtasks: false });
      }
    }

    useToastStore.getState().showToast(
      `Задача "${deletedTask.title}" удалена`,
      'undo',
      async () => {
        for (const t of allToDelete) {
          await taskRepository.save(t);
        }
        set((state) => ({ tasks: [...allToDelete, ...state.tasks] }));
        if (parentTaskId) {
          await taskRepository.update(parentTaskId, { hasSubtasks: true });
        }
        useToastStore.getState().showToast('Задача восстановлена', 'success');
      }
    );
  },

  completeRepetition: async (id: string, smartRating?: SmartRating) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;

    const baseDateStr = task.scheduledDate || new Date().toISOString().split('T')[0];
    const newCount = (task.repetitionsCount || 0) + 1;
    const { nextIntervalFloat, daysToAdd } = calculateNextInterval(get().tasks, task, newCount, smartRating);
    const nextReviewStr = addDaysToDateStr(baseDateStr, daysToAdd);

    const newHistory: TaskRepetitionRecord[] = [
      ...(task.repetitionHistory || []),
      { date: baseDateStr, completed: true, smartRating: smartRating || 'normal' },
    ];

    const updates: Partial<Task> = {
      repetitionsCount: newCount,
      lastReviewedAt: baseDateStr,
      nextReviewDate: nextReviewStr,
      currentIntervalDays: nextIntervalFloat,
      lastSmartRating: smartRating,
      repetitionHistory: newHistory,
    };

    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));

    await taskRepository.update(id, updates);
    useToastStore
      .getState()
      .showToast(`Следующее повторение: ${nextReviewStr} (+${daysToAdd} дн.)`, 'success');
  },

  updateTargetRepetitions: async (id: string, newTarget: number) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;

    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, targetRepetitions: newTarget } : t)),
    }));

    await taskRepository.update(id, { targetRepetitions: newTarget });
    useToastStore.getState().showToast(`Цель повторений изменена на ${newTarget}`, 'info');
  },
}));
