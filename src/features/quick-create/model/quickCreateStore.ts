import { create } from 'zustand';

export type QuickCreateType = 'Task' | 'Goal' | 'Topic' | 'Material' | 'Inbox';

interface QuickCreateModalState {
  isOpen: boolean;
  initialType: QuickCreateType;
  openModal: (type?: QuickCreateType) => void;
  closeModal: () => void;
}

export const useQuickCreateModalStore = create<QuickCreateModalState>((set) => ({
  isOpen: false,
  initialType: 'Task',
  openModal: (type = 'Task') => set({ isOpen: true, initialType: type }),
  closeModal: () => set({ isOpen: false }),
}));
