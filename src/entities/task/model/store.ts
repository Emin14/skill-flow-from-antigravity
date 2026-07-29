import { create } from 'zustand';
import { Task, TaskPriority } from './types';
import { taskRepository } from '@/shared/repository';
import { useToastStore } from '@/shared/ui';
import { v4 as uuidv4 } from 'uuid';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;

  fetchTasks: () => Promise<void>;
  addTask: (title: string, priority?: TaskPriority, scheduledDate?: string) => Promise<Task>;
  toggleTaskStatus: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

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

  addTask: async (title: string, priority: TaskPriority = 'P3', scheduledDate?: string) => {
    const today = new Date().toISOString().split('T')[0];
    const newTask: Task = {
      id: uuidv4(),
      title,
      status: 'Todo',
      priority,
      scheduledDate: scheduledDate || today,
      createdAt: new Date().toISOString(),
    };

    const saved = await taskRepository.save(newTask);
    set((state) => ({ tasks: [saved, ...state.tasks] }));
    useToastStore.getState().showToast(`Задача "${title}" создана`, 'success');
    return saved;
  },

  toggleTaskStatus: async (id: string) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;

    const newStatus = task.status === 'Done' ? 'Todo' : 'Done';
    const completedAt = newStatus === 'Done' ? new Date().toISOString() : null;

    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, status: newStatus, completedAt } : t)),
    }));

    try {
      await taskRepository.update(id, { status: newStatus, completedAt });
      if (newStatus === 'Done') {
        useToastStore.getState().showToast(`Задача "${task.title}" выполнена!`, 'success');
      }
    } catch (e) {
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? task : t)),
        error: (e as Error).message,
      }));
    }
  },

  deleteTask: async (id: string) => {
    const deletedTask = get().tasks.find((t) => t.id === id);
    if (!deletedTask) return;

    const previousTasks = get().tasks;

    // Optimistic delete
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    }));

    await taskRepository.delete(id);

    // Stage 4: Undo Toast Notification
    useToastStore.getState().showToast(
      `Задача "${deletedTask.title}" удалена`,
      'undo',
      async () => {
        // Undo callback -> Restore task
        await taskRepository.save(deletedTask);
        set((state) => ({ tasks: [deletedTask, ...state.tasks] }));
        useToastStore.getState().showToast('Задача восстановлена', 'success');
      }
    );
  },
}));
