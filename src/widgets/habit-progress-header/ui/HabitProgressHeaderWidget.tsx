'use client';

import React from 'react';
import { Calendar, ArrowUpDown, BarChart2, Clock, ArrowDown, ArrowUp } from 'lucide-react';
import styles from './HabitProgressHeaderWidget.module.css';

export type HabitSortKey = 'overdue' | 'alphabetical' | 'count' | 'created';
export type HabitSortDirection = 'desc' | 'asc';

interface HabitProgressHeaderWidgetProps {
  sortKey: HabitSortKey;
  sortDirection: HabitSortDirection;
  onSelectSortKey: (key: HabitSortKey) => void;
  onToggleDirection: () => void;
}

export const HabitProgressHeaderWidget: React.FC<HabitProgressHeaderWidgetProps> = ({
  sortKey,
  sortDirection,
  onSelectSortKey,
  onToggleDirection,
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
        {/* Row 1: Title on Left, Direction Flip Button on Right */}
        <div className={styles.titleRow}>
          <span className={styles.widgetTitle}>🔄 Привычки & Сортировка</span>
          <button
            type="button"
            className={styles.v1CircleFlipBtn}
            onClick={onToggleDirection}
            title={isDesc ? 'Сменить на По возрастанию' : 'Сменить на По убыванию'}
          >
            {isDesc ? <ArrowDown size={16} /> : <ArrowUp size={16} />}
          </button>
        </div>

        {/* Row 2: All 4 Filters Strictly on 1 Single Equal Horizontal Line */}
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
