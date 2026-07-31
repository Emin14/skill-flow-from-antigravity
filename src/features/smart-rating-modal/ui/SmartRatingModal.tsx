'use client';

import React from 'react';
import { Task } from '@/entities/task/model/types';
import { SmartRating, SMART_RATING_OPTIONS } from '@/shared/config/repetitionRules';
import { Typography } from '@/shared/ui';

interface SmartRatingModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectRating: (rating: SmartRating) => void;
}

export const SmartRatingModal: React.FC<SmartRatingModalProps> = ({
  task,
  isOpen,
  onClose,
  onSelectRating,
}) => {
  if (!isOpen || !task) return null;

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
        zIndex: 9999,
        padding: '16px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '380px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h3">🧠 Оценка повторения</Typography>
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

        <Typography variant="body" style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>
          Насколько легко вам было вспомнить: <strong>«{task.title}»</strong>?
        </Typography>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {SMART_RATING_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                onSelectRating(opt.id);
                onClose();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '14px 12px',
                borderRadius: '12px',
                border: '1px solid var(--color-border)',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-accent)';
                e.currentTarget.style.backgroundColor = 'var(--color-accent-light)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
              }}
            >
              <span style={{ fontSize: '22px' }}>{opt.icon}</span>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
                {opt.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
