'use client';

import { create } from 'zustand';

export type ConfirmChoice = 'confirm' | 'alternative' | 'cancel';

export interface ConfirmRequestOptions {
  title: string;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'danger' | 'primary';
  icon?: React.ReactNode;
  /** Adds a second, non-destructive path (e.g. "keep subtasks" / "archive"). */
  alternativeAction?: { label: string };
  requireTypedConfirmation?: string;
}

interface PendingRequest extends ConfirmRequestOptions {
  id: string;
  resolve: (choice: ConfirmChoice) => void;
}

interface ConfirmRequestState {
  request: PendingRequest | null;
  open: (options: ConfirmRequestOptions) => Promise<ConfirmChoice>;
  settle: (choice: ConfirmChoice) => void;
}

/**
 * Imperative confirmation for code that is not a React component — notably
 * zustand stores, which cannot render a dialog but still need to ask before a
 * destructive branch. `ConfirmDialogHost` renders whatever is requested here.
 */
export const useConfirmRequestStore = create<ConfirmRequestState>((set, get) => ({
  request: null,

  open: (options) => new Promise<ConfirmChoice>((resolve) => {
    const previous = get().request;
    // A second request supersedes the first instead of stacking dialogs.
    if (previous) previous.resolve('cancel');
    set({ request: { ...options, id: `${Date.now()}-${Math.random()}`, resolve } });
  }),

  settle: (choice) => {
    const current = get().request;
    set({ request: null });
    current?.resolve(choice);
  },
}));

export const requestConfirm = (options: ConfirmRequestOptions) =>
  useConfirmRequestStore.getState().open(options);
