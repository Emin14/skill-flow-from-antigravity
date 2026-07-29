'use client';

import React from 'react';
import { useToastStore, ToastItem } from './toastStore';
import { Button } from '../button/Button';
import styles from './ToastContainer.module.css';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className={styles.container} role="region" aria-live="polite" aria-label="Уведомления">
      {toasts.map((toast) => (
        <ToastNode key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

const ToastNode: React.FC<{ toast: ToastItem; onClose: () => void }> = ({ toast, onClose }) => {
  const handleUndo = () => {
    if (toast.onUndo) {
      toast.onUndo();
    }
    onClose();
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'undo':
        return '🗑';
      default:
        return 'ℹ️';
    }
  };

  const getStyleClass = () => {
    if (toast.type === 'success') return styles.toastSuccess;
    if (toast.type === 'error') return styles.toastError;
    if (toast.type === 'undo') return styles.toastUndo;
    return '';
  };

  return (
    <div className={`${styles.toast} ${getStyleClass()}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <span>{getIcon()}</span>
        <span>{toast.message}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        {toast.onUndo && (
          <Button variant="primary" size="sm" onClick={handleUndo}>
            Отменить
          </Button>
        )}
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            fontSize: '14px',
          }}
          aria-label="Закрыть уведомление"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
