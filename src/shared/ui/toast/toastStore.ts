import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'undo';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  onUndo?: () => void;
  duration?: number;
}

interface ToastState {
  toasts: ToastItem[];
  showToast: (message: string, type?: ToastType, onUndo?: () => void, duration?: number) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  showToast: (message: string, type: ToastType = 'info', onUndo?: () => void, duration = 5000) => {
    const id = uuidv4();
    const newToast: ToastItem = { id, type, message, onUndo, duration };

    set((state) => ({ toasts: [...state.toasts, newToast] }));

    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
      }, duration);
    }
  },

  removeToast: (id: string) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },
}));
