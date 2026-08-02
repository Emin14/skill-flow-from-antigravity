import { create } from 'zustand';
import { Task, TaskPriority, TaskStatus, TaskOccurrence, TaskRepetitionRecord } from './types';
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
  toggleTaskStatus: (id: string, smartRating?: SmartRating, occurrenceDate?: string) => Promise<void>;
  updateTaskStatus: (id: string, newStatus: TaskStatus, smartRating?: SmartRating, occurrenceDate?: string) => Promise<void>;
  updateTaskParent: (id: string, parentTaskId: string | null) => Promise<void>;
  updateTaskDetails: (id: string, updates: Partial<Task>) => Promise<void>;
  updateTaskPomodoros: (id: string, count: number) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  completeRepetition: (id: string, smartRating?: SmartRating, occurrenceDate?: string) => Promise<void>;
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
      const rawTasks = await taskRepository.getAll();

      // Clean up legacy cloned series tasks: group by title/seriesId and merge into single Task entity
      const cleanedMap = new Map<string, Task>();
      for (const t of rawTasks) {
        const legacySeriesId = (t as { seriesId?: string }).seriesId;
        const key = legacySeriesId || (t.isRepeating ? t.title.toLowerCase().trim() : t.id);
        if (!cleanedMap.has(key)) {
          const occurrences: TaskOccurrence[] = t.occurrences || [];
          if (t.isRepeating && occurrences.length === 0) {
            occurrences.push({
              id: uuidv4(),
              taskId: t.id,
              date: t.scheduledDate || new Date().toISOString().split('T')[0],
              status: t.status || 'Todo',
              completedAt: t.completedAt,
              smartRating: t.lastSmartRating,
            });
          }
          cleanedMap.set(key, { ...t, occurrences });
        } else {
          const existing = cleanedMap.get(key)!;
          const mergedOccurrences: TaskOccurrence[] = [
            ...(existing.occurrences || []),
            ...(t.occurrences || []),
          ];

          if (t.status === 'Done' || t.scheduledDate) {
            const hasOcc = mergedOccurrences.some((o) => o.date === t.scheduledDate);
            if (!hasOcc && t.scheduledDate) {
              mergedOccurrences.push({
                id: uuidv4(),
                taskId: existing.id,
                date: t.scheduledDate,
                status: t.status,
                completedAt: t.completedAt,
                smartRating: t.lastSmartRating,
              });
            }
          }

          mergedOccurrences.sort((a, b) => a.date.localeCompare(b.date));
          const doneCount = mergedOccurrences.filter((o) => o.status === 'Done').length;

          cleanedMap.set(key, {
            ...existing,
            repetitionsCount: Math.max(existing.repetitionsCount || 0, doneCount),
            occurrences: mergedOccurrences,
          });
        }
      }

      set({ tasks: Array.from(cleanedMap.values()), isLoading: false });
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
    }
  },

  addTask: async (titleOrParams: string | AddTaskParams, priorityFallback: TaskPriority = 'P3') => {
    const today = new Date().toISOString().split('T')[0];
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
        repetitionMode = 'none',
        scheduleFrequency = 'daily',
        afterCompletionDays = 3,
        hasSubtasks = false,
        targetRepetitions = 8,
      } = titleOrParams;

      const effectiveHasSubtasks = hasSubtasks;
      const effectiveIsRepeating = effectiveHasSubtasks ? false : (isRepeating && repetitionMode !== 'none');
      const effectiveMode: RepetitionMode = effectiveIsRepeating ? (repetitionMode === 'none' ? 'spaced' : repetitionMode) : 'none';

      const occurrences: TaskOccurrence[] = effectiveIsRepeating
        ? [
            {
              id: uuidv4(),
              taskId,
              date: scheduledDate || today,
              status: 'Todo',
            },
          ]
        : [];

      newTask = {
        id: taskId,
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
        afterCompletionDays: Math.max(1, afterCompletionDays),
        currentIntervalDays: 1.0,
        hasSubtasks: effectiveHasSubtasks,
        targetRepetitions,
        repetitionsCount: 0,
        occurrences,
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

  toggleTaskStatus: async (id: string, smartRating?: SmartRating, occurrenceDate?: string) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;

    if (task.isRepeating) {
      const targetDate = occurrenceDate || task.scheduledDate || new Date().toISOString().split('T')[0];
      const occurrences = task.occurrences || [];
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
    occurrenceDate?: string
  ) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;

    const nowIso = new Date().toISOString();
    const todayStr = nowIso.split('T')[0];
    const targetDate = occurrenceDate || task.scheduledDate || todayStr;

    // REPEAT ARCHITECTURE: Occurrences Management
    if (task.isRepeating) {
      const legacyHistory: TaskOccurrence[] = (task.repetitionHistory || []).map((h) => ({
        id: uuidv4(),
        taskId: task.id,
        date: h.date,
        status: h.completed ? 'Done' : 'Todo',
        smartRating: h.smartRating,
        pomodorosCount: h.pomodorosCount,
        activeMinutes: h.activeMinutes,
      }));

      const currentOccurrences: TaskOccurrence[] = [
        ...legacyHistory,
        ...(task.occurrences || []),
      ].filter((o, idx, self) => self.findIndex((x) => x.date === o.date) === idx);

      let occIndex = currentOccurrences.findIndex((o) => o.date === targetDate);

      let updatedOccurrences = [...currentOccurrences];
      if (occIndex === -1) {
        const newOcc: TaskOccurrence = {
          id: uuidv4(),
          taskId: id,
          date: targetDate,
          status: newStatus,
          completedAt: newStatus === 'Done' ? nowIso : null,
          smartRating,
        };
        updatedOccurrences.push(newOcc);
      } else {
        updatedOccurrences[occIndex] = {
          ...updatedOccurrences[occIndex],
          status: newStatus,
          completedAt: newStatus === 'Done' ? nowIso : null,
          smartRating: smartRating || updatedOccurrences[occIndex].smartRating,
        };
      }

      let nextScheduledDate = task.scheduledDate;

      if (newStatus === 'Done') {
        const doneCount = updatedOccurrences.filter((o) => o.status === 'Done').length;
        const { nextIntervalFloat, daysToAdd } = calculateNextInterval(task, doneCount, smartRating);
        nextScheduledDate = addDaysToDateStr(targetDate, daysToAdd);

        const hasNextOcc = updatedOccurrences.some((o) => o.date === nextScheduledDate);
        if (!hasNextOcc) {
          updatedOccurrences.push({
            id: uuidv4(),
            taskId: id,
            date: nextScheduledDate,
            status: 'Todo',
          });
        }
      } else if (newStatus === 'Todo') {
        // RULE 5 (Un-checking Completion Rule):
        // Check all occurrences after targetDate
        const hasSubsequentDone = updatedOccurrences.some(
          (o) => o.date > targetDate && o.status === 'Done'
        );

        if (!hasSubsequentDone) {
          // All subsequent occurrences are uncompleted -> delete all future occurrences after targetDate
          updatedOccurrences = updatedOccurrences.filter((o) => o.date <= targetDate);
          nextScheduledDate = targetDate;
        }
      }

      updatedOccurrences.sort((a, b) => a.date.localeCompare(b.date));
      const doneCount = updatedOccurrences.filter((o) => o.status === 'Done').length;

      const updates: Partial<Task> = {
        scheduledDate: nextScheduledDate,
        occurrences: updatedOccurrences,
        repetitionsCount: doneCount,
        lastSmartRating: smartRating || task.lastSmartRating,
      };

      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      }));

      await taskRepository.update(id, updates);

      if (newStatus === 'Done') {
        useToastStore
          .getState()
          .showToast(`Следующее повторение: ${nextScheduledDate}`, 'success');
      }
      return;
    }

    // NON-REPEATING TASK LOGIC
    const updates: Partial<Task> = { status: newStatus };
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

    set((state) => ({
      tasks: state.tasks.map((t) => {
        if (t.id === id) return { ...t, ...updates };
        if (descendantIds.includes(t.id)) return { ...t, status: 'Done', completedAt: nowIso };
        return t;
      }),
    }));

    await taskRepository.update(id, updates);
    for (const st of descendantTasks) {
      await taskRepository.update(st.id, { status: 'Done', completedAt: nowIso });
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

        await taskRepository.update(id, { parentTaskId });
        await taskRepository.update(parentTaskId, updates);
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

  // SINGLE TASK UPDATE: Updates 1 record in O(1)! All occurrences instantly show updated title/category/description
  updateTaskDetails: async (id: string, updates: Partial<Task>) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;

    const hasSubtasksNow = updates.hasSubtasks !== undefined ? updates.hasSubtasks : (task.hasSubtasks || get().tasks.some((t) => t.parentTaskId === id));

    if (hasSubtasksNow && updates.isRepeating) {
      useToastStore.getState().showToast('Родительские задачи с подзадачами не могут быть повторяющимися', 'warning');
      updates.isRepeating = false;
      updates.repetitionMode = 'none';
    }

    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));

    try {
      await taskRepository.update(id, updates);
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

    useToastStore.getState().showToast(
      `Задача "${deletedTask.title}" удалена`,
      'undo',
      async () => {
        for (const t of allToDelete) {
          await taskRepository.save(t);
        }
        const currentTasks = get().tasks;
        const restoredIds = new Set(allToDelete.map((t) => t.id));
        const nextTasks = [...allToDelete, ...currentTasks].map((t) => {
          const hasChildren = [...allToDelete, ...currentTasks].some((c) => c.parentTaskId === t.id && c.id !== t.id);
          if (hasChildren) {
            return { ...t, hasSubtasks: true };
          }
          return t;
        });

        for (const t of nextTasks) {
          if (restoredIds.has(t.id) || t.hasSubtasks) {
            await taskRepository.update(t.id, { hasSubtasks: t.hasSubtasks });
          }
        }

        set({ tasks: nextTasks });
        useToastStore.getState().showToast('Задача восстановлена', 'success');
      }
    );
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

    await taskRepository.update(id, { targetRepetitions: newTarget });
    useToastStore.getState().showToast(`Цель повторений изменена на ${newTarget}`, 'info');
  },
}));
