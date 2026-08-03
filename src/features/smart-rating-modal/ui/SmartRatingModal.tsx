'use client';

import React, { useState, useEffect } from 'react';
import { Task } from '@/entities/task/model/types';
import { SmartRating } from '@/shared/config/repetitionRules';
import { Typography } from '@/shared/ui';
import { useTaskStore } from '@/entities/task';
import { lockBodyScroll, unlockBodyScroll } from '@/shared/lib/scrollLock';

interface SmartRatingModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectRating: (rating: SmartRating, pomodorosCount?: number) => void;
}

export const SmartRatingModal: React.FC<SmartRatingModalProps> = ({
  task,
  isOpen,
  onClose,
  onSelectRating,
}) => {
  const [selectedRating, setSelectedRating] = useState<SmartRating>('normal');
  const [selectedPomodoros, setSelectedPomodoros] = useState<number>(task?.pomodorosCount || 1);
  const { updateTaskPomodoros } = useTaskStore();

  // BUG-CRIT-06: Esc key handler & background scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    lockBodyScroll();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      unlockBodyScroll();
    };
  }, [isOpen, onClose]);

  if (!isOpen || !task) return null;

  const handleConfirm = () => {
    updateTaskPomodoros(task.id, selectedPomodoros);
    onSelectRating(selectedRating, selectedPomodoros);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 'var(--z-index-modal, 100000)' as any,
        padding: '16px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '400px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h3">🧠 Оценка выполнения повторения</Typography>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-muted)',
              fontSize: '20px',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        {/* Task Title */}
        <Typography variant="body" style={{ color: 'var(--color-text-primary)', fontSize: '14px', fontWeight: 600 }}>
          «{task.title}»
        </Typography>

        {/* Step 1: Emojis on ONE SINGLE LINE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
            Насколько было легко?
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', width: '100%' }}>
            {[
              { id: 'easy', emoji: '😄', label: 'Легко', color: '#10b981' },
              { id: 'normal', emoji: '🙂', label: 'Норм', color: '#0ea5e9' },
              { id: 'hard', emoji: '😣', label: 'Сложно', color: '#f59e0b' },
              { id: 'again', emoji: '❌', label: 'Забыл', color: '#ef4444' },
            ].map((opt) => {
              const isActive = selectedRating === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedRating(opt.id as SmartRating)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    padding: '10px 4px',
                    borderRadius: '12px',
                    border: isActive ? `1.5px solid ${opt.color}` : '1px solid var(--color-border)',
                    backgroundColor: isActive ? `${opt.color}20` : 'rgba(255, 255, 255, 0.03)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ fontSize: '22px', lineHeight: 1 }}>{opt.emoji}</span>
                  <span style={{ fontSize: '11px', fontWeight: isActive ? 700 : 500, color: isActive ? opt.color : 'var(--color-text-muted)' }}>
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Pomodoro Time Spent Selection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
            Сколько времени заняло?
          </span>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: '4px',
              padding: '4px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--color-border)',
            }}
          >
            {[
              { label: '⅓', val: 0.33 },
              { label: '½', val: 0.5 },
              { label: '1 🍅', val: 1 },
              { label: '2 🍅', val: 2 },
              { label: '3 🍅', val: 3 },
              { label: '4 🍅', val: 4 },
            ].map((pItem) => {
              const isActive = selectedPomodoros === pItem.val;
              return (
                <button
                  key={pItem.val}
                  type="button"
                  onClick={() => setSelectedPomodoros(pItem.val)}
                  style={{
                    height: '38px',
                    borderRadius: '9px',
                    border: 'none',
                    background: isActive ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'transparent',
                    color: isActive ? '#ffffff' : 'var(--color-text-muted)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '12px',
                    cursor: 'pointer',
                    boxShadow: isActive ? '0 4px 12px rgba(239, 68, 68, 0.35)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {pItem.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons: Confirm & Cancel */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1,
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              color: 'var(--color-text-muted)',
              border: '1px solid var(--color-border)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            style={{
              flex: 2,
              height: '42px',
              borderRadius: '12px',
              backgroundColor: '#0ea5e9',
              color: '#ffffff',
              border: 'none',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(14, 165, 233, 0.35)',
            }}
          >
            ✓ Подтвердить
          </button>
        </div>
      </div>
    </div>
  );
};
