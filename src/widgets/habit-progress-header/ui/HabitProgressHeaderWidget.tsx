'use client';

import React from 'react';
import { Calendar, ArrowUpDown, BarChart2, Clock, ArrowDown, ArrowUp, PlayCircle, PauseCircle, CheckCircle, Layers } from 'lucide-react';
import { RepeatStatus } from '@/entities/task/model/types';
import styles from './HabitProgressHeaderWidget.module.css';

export type HabitSortKey = 'overdue' | 'alphabetical' | 'count' | 'created';
export type HabitSortDirection = 'desc' | 'asc';
export type RepeatStatusFilter = RepeatStatus | 'all';

interface HabitProgressHeaderWidgetProps {
  sortKey: HabitSortKey;
  sortDirection: HabitSortDirection;
  repeatStatusFilter: RepeatStatusFilter;
  onSelectSortKey: (key: HabitSortKey) => void;
  onToggleDirection: () => void;
  onSelectRepeatStatusFilter: (filter: RepeatStatusFilter) => void;
  statusCounts?: { active: number; paused: number; completed: number; total: number };
}

export const HabitProgressHeaderWidget: React.FC<HabitProgressHeaderWidgetProps> = ({
  sortKey,
  sortDirection,
  repeatStatusFilter,
  onSelectSortKey,
  onToggleDirection,
  onSelectRepeatStatusFilter,
  statusCounts,
}) => {
  const isDesc = sortDirection === 'desc';

  const handleCategoryClick = (key: HabitSortKey) => {
    if (sortKey === key) {
      onToggleDirection();
    } else {
      onSelectSortKey(key);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerBase}>
        {/* Row 1: Title & Direction Flip Button */}
        <div className={styles.titleRow}>
          <span className={styles.widgetTitle}>🔄 Привычки & Повторения</span>
          <button
            type="button"
            className={styles.v1CircleFlipBtn}
            onClick={onToggleDirection}
            title={isDesc ? 'Сменить на По возрастанию' : 'Сменить на По убыванию'}
          >
            {isDesc ? <ArrowDown size={16} /> : <ArrowUp size={16} />}
          </button>
        </div>

        {/* Row 2: Status Filter Tabs (Active, Paused, Completed, All) */}
        <div className={styles.filterTrackSingleLine} style={{ marginBottom: '8px' }}>
          <button
            type="button"
            className={`${styles.sortBtn} ${repeatStatusFilter === 'Active' ? styles.sortBtnActive : ''}`}
            onClick={() => onSelectRepeatStatusFilter('Active')}
          >
            <PlayCircle size={13} color={repeatStatusFilter === 'Active' ? '#ffffff' : '#10b981'} />
            <span>Активные {statusCounts ? `(${statusCounts.active})` : ''}</span>
          </button>

          <button
            type="button"
            className={`${styles.sortBtn} ${repeatStatusFilter === 'Paused' ? styles.sortBtnActive : ''}`}
            onClick={() => onSelectRepeatStatusFilter('Paused')}
          >
            <PauseCircle size={13} color={repeatStatusFilter === 'Paused' ? '#ffffff' : '#f59e0b'} />
            <span>Пауза {statusCounts ? `(${statusCounts.paused})` : ''}</span>
          </button>

          <button
            type="button"
            className={`${styles.sortBtn} ${repeatStatusFilter === 'Completed' ? styles.sortBtnActive : ''}`}
            onClick={() => onSelectRepeatStatusFilter('Completed')}
          >
            <CheckCircle size={13} color={repeatStatusFilter === 'Completed' ? '#ffffff' : '#6366f1'} />
            <span>Завершено {statusCounts ? `(${statusCounts.completed})` : ''}</span>
          </button>

          <button
            type="button"
            className={`${styles.sortBtn} ${repeatStatusFilter === 'all' ? styles.sortBtnActive : ''}`}
            onClick={() => onSelectRepeatStatusFilter('all')}
          >
            <Layers size={13} />
            <span>Все {statusCounts ? `(${statusCounts.total})` : ''}</span>
          </button>
        </div>

        {/* Row 3: Sorting Options */}
        <div className={styles.filterTrackSingleLine}>
          <button
            type="button"
            className={`${styles.sortBtn} ${sortKey === 'overdue' ? styles.sortBtnActive : ''}`}
            onClick={() => handleCategoryClick('overdue')}
          >
            <Calendar size={13} />
            <span>Срок</span>
          </button>

          <button
            type="button"
            className={`${styles.sortBtn} ${sortKey === 'alphabetical' ? styles.sortBtnActive : ''}`}
            onClick={() => handleCategoryClick('alphabetical')}
          >
            <ArrowUpDown size={13} />
            <span>Алфавит</span>
          </button>

          <button
            type="button"
            className={`${styles.sortBtn} ${sortKey === 'count' ? styles.sortBtnActive : ''}`}
            onClick={() => handleCategoryClick('count')}
          >
            <BarChart2 size={13} />
            <span>Повторы</span>
          </button>

          <button
            type="button"
            className={`${styles.sortBtn} ${sortKey === 'created' ? styles.sortBtnActive : ''}`}
            onClick={() => handleCategoryClick('created')}
          >
            <Clock size={13} />
            <span>Создано</span>
          </button>
        </div>
      </div>
    </div>
  );
};
