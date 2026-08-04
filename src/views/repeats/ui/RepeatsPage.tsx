'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Card, Typography } from '@/shared/ui';
import { useTaskStore } from '@/entities/task';
import { Task } from '@/entities/task/model/types';
import { HabitProgressHeaderWidget, HabitSortKey, HabitSortDirection } from '@/widgets/habit-progress-header/ui/HabitProgressHeaderWidget';
import styles from './RepeatsPage.module.css';

export const RepeatsPage: React.FC = () => {
  const { tasks, isLoading, fetchTasks } = useTaskStore();
  const [sortKey, setSortKey] = useState<HabitSortKey>('overdue');
  const [sortDirection, setSortDirection] = useState<HabitSortDirection>('desc');

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // SINGLE TASK ARCHITECTURE: Each repeating task exists as 1 single Task record
  const uniqueRepeatingTasks = useMemo(() => {
    return tasks.filter((t) => t.isRepeating);
  }, [tasks]);

  const sortedRepeatingTasks = useMemo(() => {
    const list = [...uniqueRepeatingTasks];

    list.sort((a, b) => {
      let res = 0;
      if (sortKey === 'overdue') {
        const dateA = a.scheduledDate || '9999-99-99';
        const dateB = b.scheduledDate || '9999-99-99';
        res = dateA.localeCompare(dateB);
      } else if (sortKey === 'alphabetical') {
        res = a.title.localeCompare(b.title, 'ru');
      } else if (sortKey === 'count') {
        const countA = a.occurrences?.filter((o) => o.status === 'Done').length || a.repetitionsCount || 0;
        const countB = b.occurrences?.filter((o) => o.status === 'Done').length || b.repetitionsCount || 0;
        res = countA - countB;
      } else if (sortKey === 'created') {
        const createdA = a.createdAt || '';
        const createdB = b.createdAt || '';
        res = createdA.localeCompare(createdB);
      }

      return sortDirection === 'desc' ? -res : res;
    });

    return list;
  }, [uniqueRepeatingTasks, sortKey, sortDirection]);

  return (
    <div className={styles.container}>
      {/* Header Widget Locked to Variant 1 */}
      <HabitProgressHeaderWidget
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSelectSortKey={setSortKey}
        onToggleDirection={() => setSortDirection((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
      />

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

const getRepeatTypeLabel = (task: Task): string => {
  const mode = task.repetitionMode || (task.isRepeating ? 'spaced' : 'none');
  switch (mode) {
    case 'smart':
      return '🧠 Умный адаптивный повтор';
    case 'spaced':
      return '🧠 Интервальный повтор';
    case 'schedule': {
      const freqMap: Record<string, string> = {
        daily: 'Каждый день',
        weekly: 'Каждую неделю',
        monthly: 'Каждый месяц',
        yearly: 'Каждый год',
      };
      const freq = freqMap[task.scheduleFrequency || ''] || 'По расписанию';
      return `📅 ${freq}`;
    }
    case 'after_completion':
      return `⏱ Через ${task.afterCompletionDays || 3} дн. после выполнения`;
    default:
      return '🔁 Повторение';
  }
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
  const freqStr = String(task.scheduleFrequency || mode);

  // Point 3 & Point 4: Start at 0, and show exact intervals (30-31 days for month, 365 for year, 7 for week)
  const defaultLabels = useMemo(() => {
    if (freqStr === 'monthly' || freqStr === 'month' || mode === 'schedule') {
      return ['0', '~30д', '~60д', '~90д', '~120д', '~150д'];
    }
    if (freqStr === 'yearly' || freqStr === 'year') {
      return ['0', '365д', '730д', '1095д', '1460д', '1825д'];
    }
    if (freqStr === 'weekly' || freqStr === 'week') {
      return ['0', '7д', '14д', '21д', '28д', '35д'];
    }
    if (freqStr === 'daily' || freqStr === 'day') {
      return ['0', '1д', '2д', '3д', '4д', '5д'];
    }
    if (mode === 'after_completion') {
      const days = task.afterCompletionDays || 3;
      return ['0', ...[1, 2, 3, 4, 5].map((n) => `${n * days}д`)];
    }
    // Spaced repetition interval labels (starts at 0)
    return ['0', '1д', '3д', '7д', '14д', '30д'];
  }, [mode, freqStr, task.afterCompletionDays]);

  const steps: StepNode[] = useMemo(() => {
    const list: StepNode[] = [];
    for (let i = 0; i < 6; i++) {
      const isCompleted = i < completedCount;
      const isNext = i === completedCount;
      const isFuture = i > completedCount;

      const isUnknownFuture = mode === 'smart' && isFuture;

      let label = '';
      if (!isUnknownFuture) {
        label = defaultLabels[i] || String(i);
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
        stepIndex: i,
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
        {/* Repeat Type Label where red cross mark was placed */}
        <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.45)', marginBottom: '8px', fontWeight: 500 }}>
          {getRepeatTypeLabel(task)}
        </div>

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
