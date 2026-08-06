'use client';

import React from 'react';
import { Calendar, ArrowUpDown, BarChart2, Clock, ArrowDown, ArrowUp, PlayCircle, PauseCircle, CheckCircle, Layers, Filter } from 'lucide-react';
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
        {/* Header Title Row */}
        <div className={styles.titleRow}>
          <span className={styles.widgetTitle}>🔄 Привычки & Повторения</span>
          <button
            type="button"
            className={styles.v1CircleFlipBtn}
            onClick={onToggleDirection}
            title={isDesc ? 'Сменить на По возрастанию' : 'Сменить на По убыванию'}
          >
            {isDesc ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
          </button>
        </div>

        {/* Section 1: STATUS FILTER (4 Equal Columns Grid) */}
        <div>
          <div className={styles.sectionLabel}>
            <Filter size={10} />
            <span>Фильтр по статусу</span>
          </div>
          <div className={styles.equal4Grid}>
            <button
              type="button"
              className={`${styles.sortBtn} ${repeatStatusFilter === 'Active' ? styles.sortBtnActive : ''}`}
              onClick={() => onSelectRepeatStatusFilter('Active')}
            >
              <PlayCircle size={12} color={repeatStatusFilter === 'Active' ? 'currentColor' : '#10b981'} />
              <span>Актив {statusCounts ? `(${statusCounts.active})` : ''}</span>
            </button>

            <button
              type="button"
              className={`${styles.sortBtn} ${repeatStatusFilter === 'Paused' ? styles.sortBtnActive : ''}`}
              onClick={() => onSelectRepeatStatusFilter('Paused')}
            >
              <PauseCircle size={12} color={repeatStatusFilter === 'Paused' ? 'currentColor' : '#f59e0b'} />
              <span>Пауза {statusCounts ? `(${statusCounts.paused})` : ''}</span>
            </button>

            <button
              type="button"
              className={`${styles.sortBtn} ${repeatStatusFilter === 'Completed' ? styles.sortBtnActive : ''}`}
              onClick={() => onSelectRepeatStatusFilter('Completed')}
            >
              <CheckCircle size={12} color={repeatStatusFilter === 'Completed' ? 'currentColor' : '#6366f1'} />
              <span>Готово {statusCounts ? `(${statusCounts.completed})` : ''}</span>
            </button>

            <button
              type="button"
              className={`${styles.sortBtn} ${repeatStatusFilter === 'all' ? styles.sortBtnActive : ''}`}
              onClick={() => onSelectRepeatStatusFilter('all')}
            >
              <Layers size={12} />
              <span>Все {statusCounts ? `(${statusCounts.total})` : ''}</span>
            </button>
          </div>
        </div>

        {/* Section 2: SORTING OPTIONS (4 Equal Columns Grid) */}
        <div>
          <div className={styles.sectionLabel}>
            <ArrowUpDown size={10} />
            <span>Сортировка</span>
          </div>
          <div className={styles.equal4Grid}>
            <button
              type="button"
              className={`${styles.sortBtn} ${sortKey === 'overdue' ? styles.sortBtnActive : ''}`}
              onClick={() => handleCategoryClick('overdue')}
            >
              <Calendar size={12} />
              <span>Срок</span>
            </button>

            <button
              type="button"
              className={`${styles.sortBtn} ${sortKey === 'alphabetical' ? styles.sortBtnActive : ''}`}
              onClick={() => handleCategoryClick('alphabetical')}
            >
              <ArrowUpDown size={12} />
              <span>А-Я</span>
            </button>

            <button
              type="button"
              className={`${styles.sortBtn} ${sortKey === 'count' ? styles.sortBtnActive : ''}`}
              onClick={() => handleCategoryClick('count')}
            >
              <BarChart2 size={12} />
              <span>Повторы</span>
            </button>

            <button
              type="button"
              className={`${styles.sortBtn} ${sortKey === 'created' ? styles.sortBtnActive : ''}`}
              onClick={() => handleCategoryClick('created')}
            >
              <Clock size={12} />
              <span>Дата</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
