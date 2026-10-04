import { create } from 'zustand';
import type { AddTaskParams } from '@/entities/task/model/store';

export interface QuickCreateOptions {
  initialData: AddTaskParams;
  onCreate: (data: AddTaskParams) => Promise<void>;
  onCancel?: () => void;
}

export type QuickCreateType = 'Task' | 'Goal' | 'Topic' | 'Material' | 'Inbox';

interface QuickCreateModalState {
  isOpen: boolean;
  initialType: QuickCreateType;
  options: QuickCreateOptions | null;
  openModal: (type?: QuickCreateType, options?: QuickCreateOptions) => void;
  closeModal: (created?: boolean) => void;
}

export const useQuickCreateModalStore = create<QuickCreateModalState>((set, get) => ({
  isOpen: false,
  initialType: 'Task',
  options: null,
  openModal: (type = 'Task', options) => {
    if (get().isOpen) return;
    set({ isOpen: true, initialType: type, options: options ?? null });
  },
  closeModal: (created = false) => {
    const onCancel = get().options?.onCancel;
    set({ isOpen: false, options: null });
    if (!created) onCancel?.();
  },
}));
