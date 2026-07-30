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
    let newTask: Task;

    if (typeof titleOrParams === 'string') {
      newTask = {
        id: uuidv4(),
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
    const updates: Partial<Task> = { status: newStatus };

    if (newStatus === 'InProgress') {
      if (!task.startedAt) {
        updates.startedAt = nowIso;
      }
    } else if (newStatus === 'Done') {
      updates.completedAt = nowIso;
      if (!task.startedAt) {
        updates.startedAt = nowIso;
      }
      if (task.startedAt) {
        const diffMinutes = Math.max(
          1,
          Math.round((new Date(nowIso).getTime() - new Date(task.startedAt).getTime()) / (1000 * 60))
        );
        const pomodoros = Math.max(1, Math.ceil(diffMinutes / 25));
        updates.pomodorosCount = task.pomodorosCount || pomodoros;
      }
    } else if (newStatus === 'Todo') {
      updates.startedAt = null;
      updates.completedAt = null;
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

        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + intervalDays);
        const nextScheduledDateStr = nextDate.toISOString().split('T')[0];

        const todayStr = new Date().toISOString().split('T')[0];
        const newHistory = [...(task.repetitionHistory || []), { date: todayStr, completed: true }];

        // Create duplicated task instance for the future date
        const duplicatedTask: Task = {
          id: uuidv4(),
          title: task.title,
          status: 'Todo',
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
        };

        await taskRepository.save(duplicatedTask);
        set((state) => ({ tasks: [duplicatedTask, ...state.tasks] }));
        useToastStore
          .getState()
          .showToast(
            `Повторение #${newCount}: задача продублирована на ${nextScheduledDateStr} (+${intervalDays} дн.)`,
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

    const today = new Date().toISOString().split('T')[0];
    const newCount = (task.repetitionsCount || 0) + 1;
    const intervalDays = getRepetitionIntervalDays(newCount);

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + intervalDays);
    const nextReviewStr = nextDate.toISOString().split('T')[0];

    const newHistory = [...(task.repetitionHistory || []), { date: today, completed: true }];

    const updates: Partial<Task> = {
      repetitionsCount: newCount,
      lastReviewedAt: today,
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
