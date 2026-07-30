import { create } from 'zustand';
import { Task, TaskPriority, TaskStatus } from './types';
import { TaskCategory } from '@/shared/config/categories';
import { taskRepository } from '@/shared/repository';
import { useToastStore } from '@/shared/ui';
import { v4 as uuidv4 } from 'uuid';

interface AddTaskParams {
  title: string;
  category?: TaskCategory;
  scheduledDate?: string;
  description?: string;
  link?: string;
  parentTaskId?: string | null;
  isRepeating?: boolean;
  targetRepetitions?: number;
}

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;

  fetchTasks: () => Promise<void>;
  addTask: (titleOrParams: string | AddTaskParams, priorityFallback?: TaskPriority) => Promise<Task>;
  toggleTaskStatus: (id: string) => Promise<void>;
  updateTaskStatus: (id: string, newStatus: TaskStatus) => Promise<void>;
  updateTaskDetails: (id: string, updates: Partial<Task>) => Promise<void>;
  updateTaskPomodoros: (id: string, count: number) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  completeRepetition: (id: string) => Promise<void>;
  updateTargetRepetitions: (id: string, newTarget: number) => Promise<void>;
}

// Spaced repetition intervals:
// 1st completion -> +1 day
// 2nd completion -> +3 days
// 3rd completion -> +7 days
// 4th completion -> +14 days
// 5th completion -> +30 days
// 6th completion -> +90 days
// 7th and more -> +180 days
const getRepetitionIntervalDays = (completionNumber: number): number => {
  if (completionNumber === 1) return 1;
  if (completionNumber === 2) return 3;
  if (completionNumber === 3) return 7;
  if (completionNumber === 4) return 14;
  if (completionNumber === 5) return 30;
  if (completionNumber === 6) return 90;
  return 180;
};

// Timezone-safe YYYY-MM-DD date arithmetic helper
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
        targetRepetitions: 8,
        repetitionsCount: 0,
        repetitionHistory: [],
        createdAt: new Date().toISOString(),
        pomodorosCount: 1,
        totalActiveSeconds: 0,
      };
    } else {
      const {
        title,
        category = 'Задача',
        scheduledDate = today,
        description = '',
        link = '',
        parentTaskId = null,
        isRepeating = false,
        targetRepetitions = 8,
      } = titleOrParams;

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
        isRepeating,
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

  toggleTaskStatus: async (id: string) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;

    const newStatus: TaskStatus = task.status === 'Done' ? 'Todo' : 'Done';
    await get().updateTaskStatus(id, newStatus);
  },

  updateTaskStatus: async (id: string, newStatus: TaskStatus) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;

    const nowIso = new Date().toISOString();
    const todayStr = nowIso.split('T')[0];
    const nowMs = new Date(nowIso).getTime();
    const updates: Partial<Task> = { status: newStatus };

    // Accumulated Active Time Calculation
    let currentActiveSec = task.totalActiveSeconds || 0;
    if (task.status === 'InProgress' && task.lastStartedAt) {
      const startedMs = new Date(task.lastStartedAt).getTime();
      const elapsedSec = Math.max(0, Math.round((nowMs - startedMs) / 1000));
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

    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));

    try {
      await taskRepository.update(id, updates);

      // Handle Task Duplication for Spaced Repetition if task.isRepeating === true
      if (newStatus === 'Done' && task.isRepeating && task.status !== 'Done') {
        const newCount = (task.repetitionsCount || 0) + 1;
        const intervalDays = getRepetitionIntervalDays(newCount);

        // Always base future duplication date strictly on the task's initial scheduledDate
        const baseDateStr = task.scheduledDate || todayStr;
        const nextScheduledDateStr = addDaysToDateStr(baseDateStr, intervalDays);

        const historyDateStr = task.scheduledDate || todayStr;
        const activeMins = Math.max(1, Math.round(currentActiveSec / 60));
        const newHistoryRecord = {
          date: historyDateStr,
          completed: true,
          pomodorosCount: task.pomodorosCount || 1,
          activeMinutes: activeMins,
        };
        const newHistory = [...(task.repetitionHistory || []), newHistoryRecord];

        // Also update history record on current task
        await taskRepository.update(id, { repetitionHistory: newHistory, repetitionsCount: newCount });
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, repetitionHistory: newHistory, repetitionsCount: newCount } : t)),
        }));

        // Create duplicated task instance for the future date with status: 'Todo' (UNCHECKED!)
        const duplicatedTask: Task = {
          id: uuidv4(),
          seriesId: task.seriesId || task.id,
          title: task.title,
          status: 'Todo', // Unchecked!
          priority: task.priority || 'P3',
          category: task.category || 'Задача',
          scheduledDate: nextScheduledDateStr,
          description: task.description || '',
          link: task.link || '',
          parentTaskId: task.parentTaskId || null,
          isRepeating: true,
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
            `Повторение #${newCount}: задача продублирована на ${nextScheduledDateStr} (+${intervalDays} дн. от ${baseDateStr})`,
            'success'
          );
      } else if (newStatus === 'Done') {
        useToastStore.getState().showToast(`Задача "${task.title}" выполнена!`, 'success');
      } else if (newStatus === 'InProgress') {
        useToastStore.getState().showToast(`Задача "${task.title}" переведена в процесс`, 'info');
      }
    } catch (e) {
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? task : t)),
        error: (e as Error).message,
      }));
    }
  },

  updateTaskDetails: async (id: string, updates: Partial<Task>) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;

    // Unified editing: if task has seriesId or isRepeating, update metadata across series
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
            isRepeating: updates.isRepeating !== undefined ? updates.isRepeating : t.isRepeating,
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
            isRepeating: updates.isRepeating !== undefined ? updates.isRepeating : st.isRepeating,
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

    const safeCount = Math.max(1, count);
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, pomodorosCount: safeCount } : t)),
    }));

    await taskRepository.update(id, { pomodorosCount: safeCount });
  },

  deleteTask: async (id: string) => {
    const deletedTask = get().tasks.find((t) => t.id === id);
    if (!deletedTask) return;

    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
    await taskRepository.delete(id);

    useToastStore.getState().showToast(
      `Задача "${deletedTask.title}" удалена`,
      'undo',
      async () => {
        await taskRepository.save(deletedTask);
        set((state) => ({ tasks: [deletedTask, ...state.tasks] }));
        useToastStore.getState().showToast('Задача восстановлена', 'success');
      }
    );
  },

  completeRepetition: async (id: string) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;

    const baseDateStr = task.scheduledDate || new Date().toISOString().split('T')[0];
    const newCount = (task.repetitionsCount || 0) + 1;
    const intervalDays = getRepetitionIntervalDays(newCount);
    const nextReviewStr = addDaysToDateStr(baseDateStr, intervalDays);

    const newHistory = [...(task.repetitionHistory || []), { date: baseDateStr, completed: true }];

    const updates: Partial<Task> = {
      repetitionsCount: newCount,
      lastReviewedAt: baseDateStr,
      nextReviewDate: nextReviewStr,
      repetitionHistory: newHistory,
    };

    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));

    await taskRepository.update(id, updates);
    useToastStore
      .getState()
      .showToast(`Повторение #${newCount} засчитано! Следующее через ${intervalDays} дн. (${nextReviewStr})`, 'success');
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
