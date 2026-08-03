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

  // SINGLE TASK ARCHITECTURE: Each repeating task exists as 1 single Task record
  const uniqueRepeatingTasks = useMemo(() => {
    return tasks.filter((t) => t.isRepeating);
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
        const countA = a.occurrences?.filter((o) => o.status === 'Done').length || a.repetitionsCount || 0;
        const countB = b.occurrences?.filter((o) => o.status === 'Done').length || b.repetitionsCount || 0;
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
            📅 Сначала ближайшие
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
          {sortedRepeatingTasks.map((task) => (
            <TimelineRepeatCard key={task.id} task={task} allTasks={tasks} />
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

const TimelineRepeatCard: React.FC<{ task: Task; allTasks: Task[] }> = ({ task }) => {
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const occurrences = useMemo(() => {
    return (task.occurrences || []).slice().sort((a, b) => a.date.localeCompare(b.date));
  }, [task.occurrences]);

  const completedOccurrences = useMemo(() => occurrences.filter((o) => o.status === 'Done'), [occurrences]);
  const completedCount = completedOccurrences.length;

  const nextOcc = occurrences.find((o) => o.status !== 'Done');
  const nextDateRaw = nextOcc ? nextOcc.date : task.scheduledDate || null;
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
        const occ = completedOccurrences[i];
        const rating = occ?.smartRating || task.lastSmartRating || 'normal';
        smartRatingEmoji = getSmartRatingEmoji(rating);
        if (occ?.date) {
          subLabel = formatDateNumeric(occ.date);
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
  }, [completedCount, completedOccurrences, nextDateRaw, isOverdue, mode, defaultLabels, task]);

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
          <span className={styles.categoryTag}>🏷 {task.category || 'Без категории'}</span>
          <div className={styles.repetitionCounter}>
            <span className={styles.repetitionNum}>{numStr}</span> {textStr}
          </div>
        </div>
      </div>

      {/* Timeline Track */}
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

          {/* Milestone Step Nodes */}
          {steps.map((step) => (
            <div
              key={step.stepIndex}
              className={`${styles.stepColumn} ${step.isNext ? styles.stepColumnNextActive : ''}`}
            >
              <span
                className={`${styles.stepLabel} ${
                  step.isCompleted
                    ? styles.stepLabelCompleted
                    : step.isNext
                    ? styles.stepLabelNext
                    : styles.stepLabelFuture
                }`}
              >
                {step.label}
              </span>

              <div
                className={`${styles.nodeCircle} ${
                  step.isCompleted
                    ? styles.nodeCompleted
                    : step.isNext
                    ? step.isOverdue
                      ? styles.nodeNextOverdue
                      : styles.nodeNext
                    : styles.nodeFuture
                }`}
              >
                {step.isCompleted ? (
                  <>
                    <span className={styles.checkmarkIcon}>✓</span>
                    {step.smartRatingEmoji && (
                      <span className={styles.smartRatingBadge} title={`Оценка: ${step.smartRatingEmoji}`}>
                        {step.smartRatingEmoji}
                      </span>
                    )}
                  </>
                ) : step.isNext ? (
                  <span className={styles.pulseDot} />
                ) : (
                  <span className={styles.emptyDot} />
                )}
              </div>

              <span
                className={`${styles.subLabel} ${
                  step.isCompleted
                    ? styles.subLabelCompleted
                    : step.isNext
                    ? step.isOverdue
                      ? styles.subLabelOverdue
                      : styles.subLabelNext
                    : styles.subLabelFuture
                }`}
              >
                {step.subLabel}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
