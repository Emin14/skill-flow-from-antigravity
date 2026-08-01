'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Card, Typography } from '@/shared/ui';
import { useTaskStore } from '@/entities/task';
import { Task } from '@/entities/task/model/types';
import styles from './RepeatsPage.module.css';

type SortOption = 'overdue' | 'alphabetical' | 'count_asc';

export const RepeatsPage: React.FC = () => {
  const { tasks, isLoading, fetchTasks } = useTaskStore();
  const [sortOption, setSortOption] = useState<SortOption>('overdue');

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const uniqueRepeatingTasks = useMemo(() => {
    const repeatingTasks = tasks.filter((t) => t.isRepeating);
    const seriesMap = new Map<string, Task>();

    repeatingTasks.forEach((t) => {
      const key = t.seriesId || t.title.toLowerCase().trim();
      if (!seriesMap.has(key)) {
        seriesMap.set(key, t);
      } else {
        const existing = seriesMap.get(key)!;
        const mergedHistory = [
          ...(existing.repetitionHistory || []),
          ...(t.repetitionHistory || []),
        ].filter((h, idx, self) => self.findIndex((x) => x.date === h.date) === idx)
         .sort((a, b) => a.date.localeCompare(b.date));

        const maxCount = Math.max(existing.repetitionsCount || 0, t.repetitionsCount || 0, mergedHistory.length);
        const latestInstance = t.scheduledDate > existing.scheduledDate ? t : existing;

        seriesMap.set(key, {
          ...latestInstance,
          repetitionsCount: maxCount,
          repetitionHistory: mergedHistory,
        });
      }
    });

    return Array.from(seriesMap.values());
  }, [tasks]);

  const sortedRepeatingTasks = useMemo(() => {
    const list = [...uniqueRepeatingTasks];
    if (sortOption === 'overdue') {
      list.sort((a, b) => {
        const dateA = a.scheduledDate || '9999-99-99';
        const dateB = b.scheduledDate || '9999-99-99';
        return dateA.localeCompare(dateB);
      });
    } else if (sortOption === 'alphabetical') {
      list.sort((a, b) => a.title.localeCompare(b.title, 'ru'));
    } else if (sortOption === 'count_asc') {
      list.sort((a, b) => {
        const countA = a.repetitionHistory?.length || a.repetitionsCount || 0;
        const countB = b.repetitionHistory?.length || b.repetitionsCount || 0;
        return countA - countB;
      });
    }
    return list;
  }, [uniqueRepeatingTasks, sortOption]);

  return (
    <div className={styles.container}>
      {/* Header Card */}
      <Card style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderRadius: '20px' }}>
        <Typography variant="h2" style={{ color: 'var(--color-text-primary)' }}>
          🔄 Трек прогресса привычек
        </Typography>

        {/* Top Sorting Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
          <span style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
            Сортировка:
          </span>
          <button
            type="button"
            onClick={() => setSortOption('overdue')}
            style={{
              background: sortOption === 'overdue' ? 'rgba(14, 165, 233, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              border: sortOption === 'overdue' ? '1px solid #0ea5e9' : '1px solid var(--color-border)',
              color: sortOption === 'overdue' ? '#38bdf8' : 'var(--color-text-muted)',
              borderRadius: '8px',
              padding: '3px 9px',
              fontSize: '11.5px',
              cursor: 'pointer',
              fontWeight: sortOption === 'overdue' ? 600 : 400,
            }}
          >
            ⏰ Давно не повторялись
          </button>
          <button
            type="button"
            onClick={() => setSortOption('alphabetical')}
            style={{
              background: sortOption === 'alphabetical' ? 'rgba(14, 165, 233, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              border: sortOption === 'alphabetical' ? '1px solid #0ea5e9' : '1px solid var(--color-border)',
              color: sortOption === 'alphabetical' ? '#38bdf8' : 'var(--color-text-muted)',
              borderRadius: '8px',
              padding: '3px 9px',
              fontSize: '11.5px',
              cursor: 'pointer',
              fontWeight: sortOption === 'alphabetical' ? 600 : 400,
            }}
          >
            🔤 По алфавиту
          </button>
          <button
            type="button"
            onClick={() => setSortOption('count_asc')}
            style={{
              background: sortOption === 'count_asc' ? 'rgba(14, 165, 233, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              border: sortOption === 'count_asc' ? '1px solid #0ea5e9' : '1px solid var(--color-border)',
              color: sortOption === 'count_asc' ? '#38bdf8' : 'var(--color-text-muted)',
              borderRadius: '8px',
              padding: '3px 9px',
              fontSize: '11.5px',
              cursor: 'pointer',
              fontWeight: sortOption === 'count_asc' ? 600 : 400,
            }}
          >
            📊 Меньше повторов
          </button>
        </div>
      </Card>

      {/* List of Timeline Step Progression Cards */}
      {isLoading ? (
        <Card style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          <Typography variant="body" style={{ color: 'var(--color-text-muted)' }}>
            Загрузка повторений...
          </Typography>
        </Card>
      ) : sortedRepeatingTasks.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          <Typography variant="body" style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-3)' }}>
            🌱 У вас пока нет повторяющихся задач.
          </Typography>
          <Typography variant="caption" style={{ color: 'var(--color-text-muted)' }}>
            Создайте задачу и выберите режим повторения.
          </Typography>
        </Card>
      ) : (
        <div className={styles.repeatsList}>
          {sortedRepeatingTasks.map((task, idx) => (
            <TimelineRepeatCard key={`${task.id}-${idx}`} task={task} allTasks={tasks} />
          ))}
        </div>
      )}
    </div>
  );
};

interface StepNode {
  stepIndex: number;
  label: string;
  subLabel?: string;
  isCompleted: boolean;
  isNext: boolean;
  isFuture: boolean;
  isOverdue: boolean;
  smartRatingEmoji?: string;
}

const formatDateNumeric = (dateStr?: string | null): string => {
  if (!dateStr || !dateStr.includes('-')) return '';
  const parts = dateStr.split('-').map(Number);
  const day = String(parts[2]).padStart(2, '0');
  const month = String(parts[1]).padStart(2, '0');
  return `${day}.${month}`;
};

const getSmartRatingEmoji = (rating?: string): string => {
  switch (rating) {
    case 'easy':
      return '😄';
    case 'hard':
      return '😣';
    case 'again':
      return '❌';
    case 'normal':
    default:
      return '🙂';
  }
};

const formatRepetitionCount = (count: number): { numStr: string; textStr: string } => {
  const mod10 = count % 10;
  const mod100 = count % 100;
  let word = 'повторов';
  if (mod100 >= 11 && mod100 <= 19) {
    word = 'повторов';
  } else if (mod10 === 1) {
    word = 'повтор';
  } else if (mod10 >= 2 && mod10 <= 4) {
    word = 'повтора';
  }
  return { numStr: String(count), textStr: word };
};

const TimelineRepeatCard: React.FC<{ task: Task; allTasks: Task[] }> = ({ task, allTasks }) => {
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const history = task.repetitionHistory || [];
  const completedCount = history.length > 0 ? history.length : (task.repetitionsCount || 0);

  const seriesKey = task.seriesId || task.title.toLowerCase().trim();
  const nextUncompletedTask = allTasks.find(
    (t) =>
      t.status === 'Todo' &&
      ((t.seriesId && (t.seriesId === task.seriesId || t.seriesId === task.id)) ||
        t.title.toLowerCase().trim() === seriesKey)
  );

  const nextDateRaw = nextUncompletedTask ? nextUncompletedTask.scheduledDate : task.nextReviewDate || null;
  const isOverdue = nextDateRaw ? nextDateRaw < todayStr : false;

  const mode = task.repetitionMode || (task.isRepeating ? 'spaced' : 'none');

  const defaultLabels = useMemo(() => {
    if (mode === 'schedule') {
      return ['1', '2', '3', '4', '5', '6'];
    }
    if (mode === 'after_completion') {
      const days = task.afterCompletionDays || 3;
      return ['1', ...[1, 2, 3, 4, 5].map((n) => String(n * days))];
    }
    return ['1', '3', '7', '14', '30', '90'];
  }, [mode, task.afterCompletionDays]);

  const steps: StepNode[] = useMemo(() => {
    const list: StepNode[] = [];
    for (let i = 0; i < 6; i++) {
      const isCompleted = i < completedCount;
      const isNext = i === completedCount;
      const isFuture = i > completedCount;

      const isUnknownFuture = mode === 'smart' && isFuture;

      let label = '';
      if (!isUnknownFuture) {
        label = defaultLabels[i] || String(i + 1);
      }

      let subLabel = '';
      let smartRatingEmoji: string | undefined = undefined;

      if (isCompleted) {
        // Fallback to task.lastSmartRating or 'normal' (🙂) if history record rating is missing
        const rating = history[i]?.smartRating || task.lastSmartRating || 'normal';
        smartRatingEmoji = getSmartRatingEmoji(rating);
        if (history[i]?.date) {
          subLabel = formatDateNumeric(history[i].date);
        } else if (task.completedAt) {
          subLabel = formatDateNumeric(task.completedAt.split('T')[0]);
        } else if (task.createdAt) {
          subLabel = formatDateNumeric(task.createdAt.split('T')[0]);
        } else if (task.scheduledDate) {
          subLabel = formatDateNumeric(task.scheduledDate);
        }
      } else if (isNext && nextDateRaw) {
        subLabel = formatDateNumeric(nextDateRaw);
      }

      list.push({
        stepIndex: i + 1,
        label,
        subLabel,
        isCompleted,
        isNext,
        isFuture,
        isOverdue: isNext && isOverdue,
        smartRatingEmoji,
      });
    }
    return list;
  }, [completedCount, history, nextDateRaw, isOverdue, mode, defaultLabels]);

  const { numStr, textStr } = formatRepetitionCount(completedCount);

  const createdDateStr = task.createdAt ? formatDateNumeric(task.createdAt.split('T')[0]) : '';

  return (
    <div className={styles.repeatCard}>
      {/* 2-Line Card Header */}
      <div className={styles.cardHeader}>
        <div className={styles.line1}>
          <span className={styles.taskTitle}>{task.title}</span>

          {createdDateStr && (
            <div className={styles.statusBadgeNext} title="Дата создания задачи">
              📅 Создано: {createdDateStr}
            </div>
          )}
        </div>

        <div className={styles.line2}>
          <span className={styles.categoryTag}>🏷 {task.category}</span>
          <div className={styles.repetitionCounter}>
            <span className={styles.repetitionNum}>{numStr}</span> {textStr}
          </div>
        </div>
      </div>

      {/* Timeline Track with Option 5.7 Design */}
      <div className={styles.timelineTrackContainer}>
        <div className={styles.timelineTrack}>
          {/* Connector Bar behind nodes */}
          <div className={styles.connectorLine}>
            {steps.slice(0, -1).map((step, idx) => (
              <div
                key={idx}
                className={`${styles.lineSegment} ${
                  step.isCompleted ? styles.lineSegmentCompleted : styles.lineSegmentFuture
                }`}
              />
            ))}
          </div>

          {/* Milestone Step Nodes with Option 5.7 badge */}
          {steps.map((step) => (
            <div key={step.stepIndex} className={styles.timelineItem} style={{ position: 'relative' }}>
              <span
                className={`${styles.stepLabelTop} ${
                  step.isCompleted
                    ? styles.stepLabelTopActive
                    : step.isOverdue
                    ? styles.stepLabelTopOverdue
                    : step.isNext
                    ? styles.stepLabelTopNext
                    : ''
                }`}
              >
                {step.label}
              </span>

              {/* Option 5.7 Circle Node (28px x 28px with anchored top-right emoji badge) */}
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: step.isCompleted
                    ? '#10b981'
                    : step.isOverdue
                    ? '#ef4444'
                    : step.isNext
                    ? 'rgba(14, 165, 233, 0.2)'
                    : 'var(--color-surface)',
                  border: step.isCompleted
                    ? 'none'
                    : step.isOverdue
                    ? 'none'
                    : step.isNext
                    ? '2px solid #0ea5e9'
                    : '1.5px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  color: '#ffffff',
                  position: 'relative',
                  boxShadow: step.isCompleted
                    ? '0 0 10px rgba(16, 185, 129, 0.35)'
                    : step.isNext
                    ? '0 0 10px rgba(14, 165, 233, 0.35)'
                    : 'none',
                  transition: 'all 0.2s ease',
                }}
                title={`Шаг #${step.stepIndex}${step.label ? ` (${step.label})` : ''}: ${
                  step.isCompleted
                    ? 'Выполнено ✓'
                    : step.isOverdue
                    ? `Просрочено! Было запланировано на ${nextDateRaw}`
                    : step.isNext
                    ? `Запланировано на ${nextDateRaw || 'календарь'}`
                    : 'Будущий шаг'
                }`}
              >
                {step.isCompleted ? '✓' : step.isNext ? '●' : '○'}

                {/* Option 5.7 Anchored Top-Right Difficulty Emoji Badge - ALWAYS SHOWN FOR COMPLETED STEPS */}
                {step.isCompleted && step.smartRatingEmoji && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      fontSize: '14px',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.7))',
                      lineHeight: 1,
                      zIndex: 10,
                    }}
                  >
                    {step.smartRatingEmoji}
                  </span>
                )}
              </div>

              <span className={styles.subLabelBottom}>{step.subLabel || ''}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
