'use client';

import React, { useMemo } from 'react';
import { Task } from '@/entities/task/model/types';
import { useTaskStore } from '@/entities/task';
import { Typography } from '@/shared/ui';
import styles from './EditTaskModal.module.css';

interface RepeatingTaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenEdit: () => void;
}

export const RepeatingTaskDetailModal: React.FC<RepeatingTaskDetailModalProps> = ({
  task,
  isOpen,
  onClose,
  onOpenEdit,
}) => {
  const tasks = useTaskStore((s) => s.tasks);

  // Dynamically resolve the LATEST state of the task series across all task instances
  const masterTask = useMemo(() => {
    if (!task) return null;

    const seriesKey = task.seriesId || task.title.toLowerCase().trim();
    const seriesTasks = tasks.filter(
      (t) => (t.seriesId && t.seriesId === task.seriesId) || t.title.toLowerCase().trim() === seriesKey
    );

    if (seriesTasks.length === 0) return task;

    // Combine all history records across series and deduplicate by date
    const allHistory = seriesTasks
      .flatMap((t) => t.repetitionHistory || [])
      .filter((h, idx, self) => self.findIndex((x) => x.date === h.date) === idx)
      .sort((a, b) => a.date.localeCompare(b.date));

    // Find max repetitionsCount across all instances or history length
    const maxCount = Math.max(
      ...seriesTasks.map((t) => t.repetitionsCount || 0),
      allHistory.length
    );

    const latestInstance = seriesTasks.reduce((prev, curr) => {
      return (curr.repetitionsCount || 0) >= (prev.repetitionsCount || 0) ? curr : prev;
    }, task);

    return {
      ...latestInstance,
      repetitionsCount: maxCount,
      repetitionHistory: allHistory,
    };
  }, [task, tasks]);

  if (!isOpen || !masterTask) return null;

  const currentCount = masterTask.repetitionsCount || 0;
  const targetCount = masterTask.targetRepetitions || 8;
  const progressPercent = Math.min(100, Math.round((currentCount / targetCount) * 100));
  const history = masterTask.repetitionHistory || [];

  const historyDatesSet = new Set(history.map((h) => h.date));

  // Calculate current streak
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dStr = d.toISOString().split('T')[0];
    if (historyDatesSet.has(dStr)) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header with Title, Pencil Edit ✏️ on Top, and Close */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', minWidth: 0 }}>
            <span style={{ fontSize: '20px' }}>🔄</span>
            <Typography variant="h2" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {masterTask.title}
            </Typography>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={onOpenEdit}
              className={styles.closeBtn}
              title="Редактировать параметры задачи (Карандашик ✏️)"
              style={{ fontSize: '18px', color: 'var(--color-accent)' }}
            >
              ✏️
            </button>
            <button
              onClick={onClose}
              className={styles.closeBtn}
              title="Закрыть"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Category & Date Info */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className={styles.categoryBadge}>🏷 {masterTask.category}</span>
          <span style={{ fontSize: '12px', color: '#60a5fa', fontWeight: 600 }}>
            🔥 Стрик: {streak} дн.
          </span>
        </div>

        {/* Completion Progress Bar */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-3)',
            padding: '14px 16px',
            borderRadius: '16px',
            backgroundColor: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13.5px', fontWeight: 'bold', color: 'var(--color-success)' }}>
              📊 Выполнено: {currentCount} из {targetCount} повторений
            </span>
            <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--color-success)' }}>
              {progressPercent}%
            </span>
          </div>

          {/* Segment Blocks */}
          <div style={{ display: 'flex', gap: '5px', width: '100%' }}>
            {Array.from({ length: Math.max(8, targetCount) }).map((_, index) => {
              const isFilled = index < currentCount;
              return (
                <div
                  key={index}
                  style={{
                    flex: 1,
                    height: '14px',
                    borderRadius: '4px',
                    backgroundColor: isFilled ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
                    border: isFilled ? '1px solid #059669' : '1px solid var(--color-border)',
                    boxShadow: isFilled ? '0 0 8px rgba(16, 185, 129, 0.4)' : 'none',
                  }}
                  title={isFilled ? `Повторение #${index + 1} выполнено` : `Повторение #${index + 1}`}
                />
              );
            })}
          </div>
        </div>

        {/* History List Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <Typography variant="h3" style={{ fontSize: '13.5px', color: 'var(--color-text-muted)' }}>
            📅 История повторений и статистика:
          </Typography>

          {history.length === 0 ? (
            <div style={{ padding: 'var(--space-4)', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '13px', border: '1px dashed var(--color-border)', borderRadius: '12px' }}>
              Пока нет завершенных повторений.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
              {history.map((record, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    fontSize: '12.5px',
                  }}
                >
                  <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>
                    ✓ Повторение #{idx + 1} • {record.date}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)' }}>
                    <span>🍅 {record.pomodorosCount || 1}</span>
                    {record.activeMinutes && <span>⏱ {record.activeMinutes} мин</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
