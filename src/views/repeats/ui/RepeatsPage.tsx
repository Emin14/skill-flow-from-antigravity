'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Card, Typography } from '@/shared/ui';
import { useTaskStore } from '@/entities/task';
import { Task } from '@/entities/task/model/types';
import { HabitProgressHeaderWidget, HabitSortKey, HabitSortDirection, RepeatStatusFilter } from '@/widgets/habit-progress-header/ui/HabitProgressHeaderWidget';
import { HabitSectionBannerWidget } from '@/widgets/habit-section-banner/ui/HabitSectionBannerWidget';
import { getTodayStr } from '@/shared/lib/dateUtils';
import { getCategoryColor } from '@/shared/config/categoryColors';
import styles from './RepeatsPage.module.css';

export const RepeatsPage: React.FC = () => {
  const { tasks, isLoading, fetchTasks } = useTaskStore();
  const [sortKey, setSortKey] = useState<HabitSortKey>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('repeats-sort-key') as HabitSortKey;
      if (saved && ['overdue', 'alphabetical', 'count', 'created'].includes(saved)) return saved;
    }
    return 'overdue';
  });
  const [sortDirection, setSortDirection] = useState<HabitSortDirection>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('repeats-sort-direction') as HabitSortDirection;
      if (saved && ['asc', 'desc'].includes(saved)) return saved;
    }
    return 'desc';
  });
  const [repeatStatusFilter, setRepeatStatusFilter] = useState<RepeatStatusFilter>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('repeats-status-filter') as RepeatStatusFilter;
      if (saved && ['Active', 'Paused', 'Completed', 'all'].includes(saved)) return saved;
    }
    return 'Active';
  });

  const handleSelectSortKey = (key: HabitSortKey) => {
    setSortKey(key);
    if (typeof window !== 'undefined') {
      localStorage.setItem('repeats-sort-key', key);
    }
  };

  const handleToggleDirection = () => {
    setSortDirection((prev) => {
      const next = prev === 'desc' ? 'asc' : 'desc';
      if (typeof window !== 'undefined') {
        localStorage.setItem('repeats-sort-direction', next);
      }
      return next;
    });
  };

  const handleSelectRepeatStatusFilter = (filter: RepeatStatusFilter) => {
    setRepeatStatusFilter(filter);
    if (typeof window !== 'undefined') {
      localStorage.setItem('repeats-status-filter', filter);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // SINGLE TASK ARCHITECTURE: Each repeating task exists as 1 single Task record
  const allRepeatingTasks = useMemo(() => {
    return tasks.filter((t) => t.isRepeating);
  }, [tasks]);

  const statusCounts = useMemo(() => {
    let active = 0;
    let paused = 0;
    let completed = 0;
    for (const t of allRepeatingTasks) {
      const st = t.repeatStatus || 'Active';
      if (st === 'Paused') paused++;
      else if (st === 'Completed') completed++;
      else active++;
    }
    return { active, paused, completed, total: allRepeatingTasks.length };
  }, [allRepeatingTasks]);

  const filteredRepeatingTasks = useMemo(() => {
    if (repeatStatusFilter === 'all') return allRepeatingTasks;
    return allRepeatingTasks.filter((t) => {
      const st = t.repeatStatus || 'Active';
      return st === repeatStatusFilter;
    });
  }, [allRepeatingTasks, repeatStatusFilter]);

  const sortedRepeatingTasks = useMemo(() => {
    const list = [...filteredRepeatingTasks];

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
  }, [filteredRepeatingTasks, sortKey, sortDirection]);

  return (
    <div className={styles.container}>
      {/* 0. Habit Section Banner Widget (10 Theme Gradient Variants) */}
      <HabitSectionBannerWidget />

      {/* 1. Header Widget Locked to Variant 3 */}
      <HabitProgressHeaderWidget
        sortKey={sortKey}
        sortDirection={sortDirection}
        repeatStatusFilter={repeatStatusFilter}
        onSelectSortKey={handleSelectSortKey}
        onToggleDirection={handleToggleDirection}
        onSelectRepeatStatusFilter={handleSelectRepeatStatusFilter}
        statusCounts={statusCounts}
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
            {repeatStatusFilter === 'Active'
              ? '🌱 У вас пока нет активных повторяющихся задач.'
              : repeatStatusFilter === 'Paused'
              ? '⏸️ Нет повторяющихся задач на паузе.'
              : repeatStatusFilter === 'Completed'
              ? '✅ Нет завершённых повторений.'
              : '🌱 Повторяющиеся задачи отсутствуют.'}
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
      return '📐 Интервальный повтор';
    case 'schedule': {
      const freqMap: Record<string, string> = {
        daily: 'Каждый день',
        weekly: 'Каждую неделю',
        monthly: 'Каждый месяц',
        yearly: 'Каждый год',
      };
      const freq = freqMap[task.scheduleFrequency || 'daily'] || 'По расписанию';
      return `📅 ${freq}`;
    }
    case 'after_completion':
      return `⏱ Через ${task.afterCompletionDays || 3} дн. после выполнения`;
    default:
      return '🔁 Повторение';
  }
};

export const TimelineRepeatCard: React.FC<{ task: Task; allTasks?: Task[]; onClick?: () => void }> = ({ task, onClick }) => {
  const todayStr = useMemo(() => getTodayStr(), []);
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
    if (mode === 'after_completion') {
      const days = task.afterCompletionDays || 3;
      return ['0', ...Array.from({ length: 15 }, (_, i) => `${(i + 1) * days}д`)];
    }
    if (mode === 'schedule') {
      const freq = task.scheduleFrequency || 'daily';
      if (freq === 'daily') {
        return ['0', ...Array.from({ length: 15 }, (_, i) => `${i + 1}д`)];
      }
      if (freq === 'weekly') {
        return ['0', ...Array.from({ length: 15 }, (_, i) => `${(i + 1) * 7}д`)];
      }
      if (freq === 'yearly') {
        return ['0', ...Array.from({ length: 15 }, (_, i) => `${(i + 1) * 365}д`)];
      }
      // Monthly schedule fallback
      return ['0', ...Array.from({ length: 15 }, (_, i) => `~${(i + 1) * 30}д`)];
    }
    if (mode === 'spaced' || mode === 'smart') {
      return ['0', '1д', '3д', '7д', '14д', '30д', '90д', '120д', '150д', '180д', '210д', '240д'];
    }
    return ['0', '1д', '2д', '3д', '4д', '5д', '6д', '7д', '8д', '9д'];
  }, [mode, task.scheduleFrequency, task.afterCompletionDays]);

  const totalSteps = useMemo(() => {
    const activeCount = Math.max(completedCount + 1, occurrences.length);
    return activeCount > 6 ? activeCount : 6;
  }, [completedCount, occurrences.length]);

  const steps: StepNode[] = useMemo(() => {
    const list: StepNode[] = [];
    for (let i = 0; i < totalSteps; i++) {
      const isCompleted = i < completedCount;
      const isNext = i === completedCount;
      const isFuture = i > completedCount;

      const isUnknownFuture = mode === 'smart' && isFuture;

      let label = '';
      if (!isUnknownFuture) {
        label = defaultLabels[i] || `+${i}д`;
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
      } else if (occurrences[i]?.date) {
        subLabel = formatDateNumeric(occurrences[i].date);
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
  }, [totalSteps, completedCount, completedOccurrences, nextDateRaw, isOverdue, mode, defaultLabels, task, occurrences]);

  const { numStr, textStr } = formatRepetitionCount(completedCount);
  const createdDateStr = task.createdAt ? formatDateNumeric(task.createdAt.split('T')[0]) : '';
  const catColor = getCategoryColor(task.category);

  return (
    <Card className={styles.repeatCard} onClick={onClick}>
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
          <div className={styles.categoryRow}>
            <span className={styles.catDot} style={{ backgroundColor: catColor }} />
            <span className={styles.categoryText} style={{ color: catColor }}>
              {task.category || 'Без категории'}
            </span>
          </div>
          <div className={styles.repetitionCounter}>
            <span className={styles.repetitionNum}>{numStr}</span> {textStr}
          </div>
        </div>
      </div>

      {/* Timeline Track */}
      <div className={styles.timelineTrackContainer} style={{ overflowX: steps.length > 6 ? 'auto' : 'hidden' }}>
        {/* Repeat Type Label */}
        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '4px', fontWeight: 600 }}>
          {getRepeatTypeLabel(task)}
        </div>

        <div className={styles.timelineTrack} style={{ minWidth: steps.length > 6 ? `${steps.length * 68}px` : '100%' }}>
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
                    ? styles.nodeNext
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
    </Card>
  );
};
