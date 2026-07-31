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
  const { tasks, updateTaskPomodoros, updateTaskStatus } = useTaskStore();

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
  const activeRating = masterTask.lastSmartRating;
  const currentPomodoros = masterTask.pomodorosCount || 1;

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
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} style={{ gap: '16px' }}>
        {/* Header with Title, Pencil Edit ✏️ on Top, and Close */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', minWidth: 0 }}>
            <span style={{ fontSize: '20px' }}>{masterTask.isRepeating ? '🔄' : '📌'}</span>
            <Typography variant="h2" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {masterTask.title}
            </Typography>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={onOpenEdit}
              className={styles.closeBtn}
              title="Редактировать параметры задачи"
              style={{ fontSize: '18px', color: 'var(--color-accent)' }}
            >
              ✏️
            </button>
            <button
              onClick={onClose}
              className={styles.closeBtn}
              title="Закрыть"
              style={{ fontSize: '18px' }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Category & Date Info */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className={styles.categoryBadge}>🏷 {masterTask.category}</span>
            {masterTask.scheduledDate && (
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                📅 {masterTask.scheduledDate}
              </span>
            )}
          </div>
          {masterTask.isRepeating && (
            <span style={{ fontSize: '12px', color: '#60a5fa', fontWeight: 600 }}>
              🔥 Стрик: {streak} дн.
            </span>
          )}
        </div>

        {/* Description & Link if present */}
        {(masterTask.description || masterTask.link) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '10px 12px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)' }}>
            {masterTask.description && (
              <p style={{ fontSize: '13px', color: 'var(--color-text-primary)', margin: 0, whiteSpace: 'pre-wrap' }}>
                {masterTask.description}
              </p>
            )}
            {masterTask.link && (
              <a href={masterTask.link} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#38bdf8', textDecoration: 'underline', wordBreak: 'break-all' }}>
                🔗 {masterTask.link}
              </a>
            )}
          </div>
        )}

        {/* Premium Segmented Control for Pomodoros */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
          <label style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            🍅 Время (Помидоры):
          </label>
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
            ].map((item) => {
              const isActive = currentPomodoros === item.val;
              return (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => updateTaskPomodoros(masterTask.id, item.val)}
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
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Premium Segmented Cards for Difficulty Rating */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
          <label style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            💡 Оценка сложности:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', width: '100%' }}>
            {[
              { key: 'easy', emoji: '😄', title: 'Легко', color: '#10b981', bg: 'rgba(16, 185, 129, 0.16)', border: 'rgba(16, 185, 129, 0.4)' },
              { key: 'normal', emoji: '🙂', title: 'Нормально', color: '#0ea5e9', bg: 'rgba(14, 165, 233, 0.16)', border: 'rgba(14, 165, 233, 0.4)' },
              { key: 'hard', emoji: '😣', title: 'Сложно', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.16)', border: 'rgba(245, 158, 11, 0.4)' },
              { key: 'again', emoji: '❌', title: 'Не помню', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.16)', border: 'rgba(239, 68, 68, 0.4)' },
            ].map((rating) => {
              const isActive = activeRating === rating.key;
              return (
                <button
                  key={rating.key}
                  type="button"
                  onClick={() => updateTaskStatus(masterTask.id, masterTask.status, rating.key as any)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    padding: '10px 4px',
                    borderRadius: '12px',
                    background: isActive ? rating.bg : 'rgba(255, 255, 255, 0.03)',
                    border: isActive ? `1.5px solid ${rating.border}` : '1px solid var(--color-border)',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    transform: isActive ? 'scale(1.04)' : 'none',
                    boxShadow: isActive ? `0 4px 14px ${rating.bg}` : 'none',
                  }}
                >
                  <span style={{ fontSize: '20px', lineHeight: 1 }}>{rating.emoji}</span>
                  <span style={{ fontSize: '11px', fontWeight: isActive ? 700 : 500, color: isActive ? rating.color : 'var(--color-text-muted)' }}>
                    {rating.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Completion Progress Bar for Repeating Tasks */}
        {masterTask.isRepeating && (
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
        )}

        {/* History List Section for Repeating Tasks */}
        {masterTask.isRepeating && (
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
        )}
      </div>
    </div>
  );
};
