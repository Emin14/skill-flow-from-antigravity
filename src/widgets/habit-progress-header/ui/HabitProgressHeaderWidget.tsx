'use client';

import React, { startTransition } from 'react';
import { ArrowDown, ArrowUp, ChevronDown } from 'lucide-react';
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

  const handleStatusChange = (val: RepeatStatusFilter) => {
    startTransition(() => {
      onSelectRepeatStatusFilter(val);
    });
  };

  const handleSortChange = (val: HabitSortKey) => {
    startTransition(() => {
      onSelectSortKey(val);
    });
  };

  return (
    <div style={{ width: '100%', marginBottom: '16px', boxSizing: 'border-box' }}>
      {/* iOS Segmented Bar with Native Smooth Select Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '5px',
          borderRadius: '16px',
          background: 'var(--color-surface-hover)',
          border: '1px solid var(--color-border)',
          width: '100%',
          boxSizing: 'border-box',
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation',
        }}
      >
        {/* Status Filter Dropdown */}
        <div style={{ position: 'relative', flex: 1, minWidth: 0, display: 'flex', alignItems: 'center' }}>
          <select
            value={repeatStatusFilter}
            onChange={(e) => handleStatusChange(e.target.value as RepeatStatusFilter)}
            style={{
              width: '100%',
              padding: '7px 24px 7px 10px',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              color: 'var(--color-text-primary)',
              fontSize: '16px', // 16px prevents iOS Safari auto-zoom lag
              fontWeight: 700,
              cursor: 'pointer',
              outline: 'none',
              appearance: 'none',
              WebkitAppearance: 'none',
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation',
              height: '34px',
              lineHeight: '20px',
            }}
          >
            <option value="Active">▶️ Активные {statusCounts ? `(${statusCounts.active})` : ''}</option>
            <option value="Paused">⏸️ На паузе {statusCounts ? `(${statusCounts.paused})` : ''}</option>
            <option value="Completed">✅ Завершенные {statusCounts ? `(${statusCounts.completed})` : ''}</option>
            <option value="all">🥞 Все {statusCounts ? `(${statusCounts.total})` : ''}</option>
          </select>
          <ChevronDown
            size={13}
            color="var(--color-text-muted)"
            style={{ position: 'absolute', right: '8px', pointerEvents: 'none' }}
          />
        </div>

        {/* Sort Key Dropdown */}
        <div style={{ position: 'relative', flex: 1, minWidth: 0, display: 'flex', alignItems: 'center' }}>
          <select
            value={sortKey}
            onChange={(e) => handleSortChange(e.target.value as HabitSortKey)}
            style={{
              width: '100%',
              padding: '7px 24px 7px 10px',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              color: 'var(--color-text-primary)',
              fontSize: '16px', // 16px prevents iOS Safari auto-zoom lag
              fontWeight: 700,
              cursor: 'pointer',
              outline: 'none',
              appearance: 'none',
              WebkitAppearance: 'none',
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation',
              height: '34px',
              lineHeight: '20px',
            }}
          >
            <option value="overdue">📅 По сроку</option>
            <option value="alphabetical">🔤 По алфавиту</option>
            <option value="count">📊 По повторам</option>
            <option value="created">🕒 По дате создания</option>
          </select>
          <ChevronDown
            size={13}
            color="var(--color-text-muted)"
            style={{ position: 'absolute', right: '8px', pointerEvents: 'none' }}
          />
        </div>

        {/* Direction Toggle Button */}
        <button
          type="button"
          onClick={onToggleDirection}
          title={isDesc ? 'Сменить на По возрастанию' : 'Сменить на По убыванию'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '34px',
            height: '34px',
            borderRadius: '10px',
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            color: 'var(--color-text-primary)',
            cursor: 'pointer',
            flexShrink: 0,
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation',
          }}
        >
          {isDesc ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
        </button>
      </div>
    </div>
  );
};
