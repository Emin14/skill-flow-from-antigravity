'use client';

import React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { RepeatStatus } from '@/entities/task/model/types';

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

const STATUS_ITEMS: { id: RepeatStatusFilter; label: string; countKey?: 'active' | 'paused' | 'completed' | 'total' }[] = [
  { id: 'Active', label: '▶️ Активные', countKey: 'active' },
  { id: 'Paused', label: '⏸️ Пауза', countKey: 'paused' },
  { id: 'Completed', label: '✅ Готово', countKey: 'completed' },
  { id: 'all', label: '🥞 Все', countKey: 'total' },
];

const SORT_ITEMS: { id: HabitSortKey; label: string }[] = [
  { id: 'overdue', label: '📅 Сроку' },
  { id: 'alphabetical', label: '🔤 Алфавиту' },
  { id: 'count', label: '📊 Повторам' },
  { id: 'created', label: '🕒 Созданию' },
];

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

  return (
    <div style={{ width: '100%', marginBottom: '14px', boxSizing: 'border-box' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px',
          borderRadius: '16px',
          background: 'var(--color-surface-hover)',
          border: '1px solid var(--color-border)',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {/* Status Filter Select */}
        <select
          value={repeatStatusFilter}
          onChange={(e) => onSelectRepeatStatusFilter(e.target.value as RepeatStatusFilter)}
          style={{
            flex: 1,
            minWidth: 0,
            padding: '7px 10px',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            color: 'var(--color-text-primary)',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          <option value="Active">▶️ Активные ({statusCounts?.active ?? 0})</option>
          <option value="Paused">⏸️ Пауза ({statusCounts?.paused ?? 0})</option>
          <option value="Completed">✅ Готово ({statusCounts?.completed ?? 0})</option>
          <option value="all">🥞 Все ({statusCounts?.total ?? 0})</option>
        </select>

        {/* Sort Key Select */}
        <select
          value={sortKey}
          onChange={(e) => onSelectSortKey(e.target.value as HabitSortKey)}
          style={{
            flex: 1,
            minWidth: 0,
            padding: '7px 10px',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            color: 'var(--color-text-primary)',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          <option value="overdue">📅 По сроку</option>
          <option value="alphabetical">🔤 По названию</option>
          <option value="count">📊 По повторам</option>
          <option value="created">🕒 По созданию</option>
        </select>

        {/* Direction Toggle Button */}
        <button
          type="button"
          onClick={onToggleDirection}
          title={isDesc ? 'Сменить на По возрастанию' : 'Сменить на По убыванию'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '7px 10px',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            color: 'var(--color-text-primary)',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          {isDesc ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
        </button>
      </div>
    </div>
  );
};
