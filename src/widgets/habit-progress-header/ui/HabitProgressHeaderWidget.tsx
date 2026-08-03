'use client';

import React from 'react';
import { Calendar, ArrowUpDown, BarChart2 } from 'lucide-react';
import styles from './HabitProgressHeaderWidget.module.css';

export type HabitSortOption = 'overdue' | 'alphabetical' | 'count_asc';

interface HabitProgressHeaderWidgetProps {
  sortOption: HabitSortOption;
  onSelectSort: (opt: HabitSortOption) => void;
}

export const HabitProgressHeaderWidget: React.FC<HabitProgressHeaderWidgetProps> = ({
  sortOption,
  onSelectSort,
}) => {
  return (
    <div style={{ width: '100%' }}>
      {/* 💡 Selected Final Variant #5: Two-Row Compact Header with Full-Width Equal Segment Track */}
      <div className={styles.v5TwoRowFullWidth}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className={styles.widgetTitle}>🔄 Трек прогресса привычек</span>
          <span className={styles.widgetBadge}>Интервалы</span>
        </div>

        <div className={styles.equalTrack}>
          <button
            type="button"
            className={`${styles.sortBtn} ${styles.equalBtn} ${sortOption === 'overdue' ? styles.sortBtnActive : ''}`}
            onClick={() => onSelectSort('overdue')}
          >
            <Calendar size={13} />
            <span>Ближайшие</span>
          </button>
          <button
            type="button"
            className={`${styles.sortBtn} ${styles.equalBtn} ${sortOption === 'alphabetical' ? styles.sortBtnActive : ''}`}
            onClick={() => onSelectSort('alphabetical')}
          >
            <ArrowUpDown size={13} />
            <span>По алфавиту</span>
          </button>
          <button
            type="button"
            className={`${styles.sortBtn} ${styles.equalBtn} ${sortOption === 'count_asc' ? styles.sortBtnActive : ''}`}
            onClick={() => onSelectSort('count_asc')}
          >
            <BarChart2 size={13} />
            <span>Повторы</span>
          </button>
        </div>
      </div>
    </div>
  );
};
