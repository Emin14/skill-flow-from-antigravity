'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import styles from './ConfirmDialog.module.css';

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  /** Consequence text. Keep it to what the user loses, not a restatement of the title. */
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** `danger` paints the confirm button red and is the default for deletions. */
  tone?: 'danger' | 'primary';
  /** Replaces the warning triangle, e.g. a topic or trash glyph. */
  icon?: React.ReactNode;
  /** Blocks both buttons and swaps the confirm label for a progress label. */
  isPending?: boolean;
  pendingLabel?: string;
  confirmDisabled?: boolean;
  /**
   * Requires typing this exact word before the confirm button unlocks, for the
   * few actions whose cost is not a single misclick but a lost account's worth
   * of data.
   */
  requireTypedConfirmation?: string;
  onConfirm: () => void;
  onCancel: () => void;
  /** An alternative that avoids the destructive path, e.g. "archive instead". */
  alternativeAction?: { label: string; onClick: () => void };
}

/**
 * In-app replacement for window.confirm(): same tokens as the rest of the UI,
 * real verbs instead of OK/Отмена, and room to explain the consequence.
 *
 * It deliberately does not lock body scroll — it is always opened on top of a
 * modal that already locked it, and unlocking here would let the page scroll
 * behind the parent while the dialog is still visible.
 */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  description,
  confirmLabel = 'Удалить',
  cancelLabel = 'Отмена',
  tone = 'danger',
  icon,
  isPending = false,
  pendingLabel = 'Удаление…',
  confirmDisabled = false,
  requireTypedConfirmation,
  onConfirm,
  onCancel,
  alternativeAction,
}) => {
  const titleId = useId();
  const descriptionId = useId();
  const typedId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const typedRef = useRef<HTMLInputElement>(null);
  const backdropRef = useRef(false);
  const [typed, setTyped] = useState('');

  // A fresh dialog must never open pre-unlocked because of a previous attempt.
  useEffect(() => {
    if (!isOpen) setTyped('');
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    // Capture phase + stopImmediatePropagation: the modal underneath also listens
    // for Escape on window, and without this one keypress closes both.
    // Enter is left to the focused button, so Enter on "Отмена" still cancels.
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.stopImmediatePropagation();
      event.preventDefault();
      if (!isPending) onCancel();
    };
    window.addEventListener('keydown', handleKeyDown, true);
    // With a typed gate the first thing the user must do is type, so the field
    // takes focus; otherwise focus lands on the safe "cancel" action.
    if (requireTypedConfirmation) typedRef.current?.focus();
    else cancelRef.current?.focus();
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen, isPending, onCancel, requireTypedConfirmation]);

  if (!isOpen) return null;

  const typedOk = !requireTypedConfirmation
    || typed.trim().toLowerCase() === requireTypedConfirmation.toLowerCase();
  const confirmBlocked = isPending || confirmDisabled || !typedOk;

  return (
    <div
      className={styles.overlay}
      onMouseDown={event => { backdropRef.current = event.target === event.currentTarget; }}
      onClick={event => {
        if (backdropRef.current && event.target === event.currentTarget && !isPending) onCancel();
        backdropRef.current = false;
      }}
    >
      <div
        className={styles.dialog}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        onClick={event => event.stopPropagation()}
      >
        <div className={styles.iconSlot}>
          {icon ?? <AlertTriangle size={18} />}
        </div>
        <h2 id={titleId} className={styles.title}>{title}</h2>
        {description && <div id={descriptionId} className={styles.description}>{description}</div>}
        {requireTypedConfirmation && (
          <div className={styles.typedRow}>
            <label htmlFor={typedId} className={styles.typedLabel}>
              Введите <strong>{requireTypedConfirmation}</strong> для подтверждения
            </label>
            <input
              id={typedId}
              ref={typedRef}
              type="text"
              className={styles.typedInput}
              value={typed}
              onChange={event => setTyped(event.target.value)}
              placeholder={requireTypedConfirmation}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              disabled={isPending}
            />
          </div>
        )}
        <div className={styles.actions}>
          {alternativeAction && (
            <button
              type="button"
              className={`${styles.btnSecondary} ${styles.btnAlt}`}
              onClick={alternativeAction.onClick}
              disabled={isPending}
            >
              {alternativeAction.label}
            </button>
          )}
          <button
            type="button"
            ref={cancelRef}
            className={`${styles.btnSecondary} ${styles.btnCancel}`}
            onClick={onCancel}
            disabled={isPending}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`${tone === 'danger' ? styles.btnDanger : styles.btnPrimary} ${styles.btnConfirm}`}
            onClick={onConfirm}
            disabled={confirmBlocked}
            aria-disabled={confirmBlocked}
          >
            {isPending ? pendingLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
