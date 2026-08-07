'use client';

import React from 'react';
import { Calendar, ArrowUpDown, BarChart2, Clock, ArrowDown, ArrowUp, PlayCircle, PauseCircle, CheckCircle, Layers, Filter } from 'lucide-react';
import { RepeatStatus } from '@/entities/task/model/types';
import styles from './HabitProgressHeaderWidget.module.css';

export type HabitSortKey = 'overdue' | 'alphabetical' | 'count' | 'created';
export type HabitSortDirection = 'desc' | 'asc';
export type RepeatStatusFilter = RepeatStatus | 'all';

export type RepeatsFontMode = 'default' | 'force400';

interface HabitProgressHeaderWidgetProps {
  sortKey: HabitSortKey;
  sortDirection: HabitSortDirection;
  repeatStatusFilter: RepeatStatusFilter;
  onSelectSortKey: (key: HabitSortKey) => void;
  onToggleDirection: () => void;
  onSelectRepeatStatusFilter: (filter: RepeatStatusFilter) => void;
  statusCounts?: { active: number; paused: number; completed: number; total: number };
  repeatsFontMode?: RepeatsFontMode;
  onToggleRepeatsFontMode?: (mode: RepeatsFontMode) => void;
}

export const HabitProgressHeaderWidget: React.FC<HabitProgressHeaderWidgetProps> = ({
  sortKey,
  sortDirection,
  repeatStatusFilter,
  onSelectSortKey,
  onToggleDirection,
  onSelectRepeatStatusFilter,
  statusCounts,
  repeatsFontMode = 'default',
  onToggleRepeatsFontMode,
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {onToggleRepeatsFontMode && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: 'var(--color-surface-hover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '20px',
                  padding: '2px',
                  gap: '2px',
                }}
              >
                <button
                  type="button"
                  onClick={() => onToggleRepeatsFontMode('default')}
                  title="Шрифт: По умолчанию (как есть)"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 8px',
                    borderRadius: '16px',
                    border: 'none',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: repeatsFontMode === 'default' ? 'var(--color-accent)' : 'transparent',
                    color: repeatsFontMode === 'default' ? '#ffffff' : 'var(--color-text-muted)',
                    boxShadow: repeatsFontMode === 'default' ? '0 2px 8px var(--color-accent-border)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>🔤</span>
                  <span>Обычный</span>
                </button>

                <button
                  type="button"
                  onClick={() => onToggleRepeatsFontMode('force400')}
                  title="Шрифт: Заголовок жирный, остальное 400"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 8px',
                    borderRadius: '16px',
                    border: 'none',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: repeatsFontMode === 'force400' ? 'var(--color-accent)' : 'transparent',
                    color: repeatsFontMode === 'force400' ? '#ffffff' : 'var(--color-text-muted)',
                    boxShadow: repeatsFontMode === 'force400' ? '0 2px 8px var(--color-accent-border)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>🔤</span>
                  <span>Все 400</span>
                </button>
              </div>
            )}

            <button
              type="button"
              className={styles.v1CircleFlipBtn}
              onClick={onToggleDirection}
              title={isDesc ? 'Сменить на По возрастанию' : 'Сменить на По убыванию'}
            >
              {isDesc ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
            </button>
          </div>
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
