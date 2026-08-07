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
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px', boxSizing: 'border-box' }}>
      {/* Repeat Status Segmented Pills Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '3px',
          padding: '4px',
          borderRadius: '14px',
          background: 'var(--color-surface-hover)',
          border: '1px solid var(--color-border)',
          width: '100%',
          boxSizing: 'border-box',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation',
        }}
      >
        {STATUS_ITEMS.map((item) => {
          const isActive = repeatStatusFilter === item.id;
          const count = statusCounts && item.countKey ? statusCounts[item.countKey] : null;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectRepeatStatusFilter(item.id)}
              style={{
                flex: 1,
                padding: '6px 8px',
                borderRadius: '10px',
                border: 'none',
                fontSize: '11.5px',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                background: isActive ? 'var(--color-accent)' : 'transparent',
                color: isActive ? '#ffffff' : 'var(--color-text-muted)',
                boxShadow: isActive ? '0 2px 8px var(--color-accent-border)' : 'none',
                transition: 'all 0.12s ease',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation',
              }}
            >
              {item.label} {count !== null ? `(${count})` : ''}
            </button>
          );
        })}
      </div>

      {/* Sort Key Segmented Bar + Direction Toggle Button */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '6px',
          padding: '4px',
          borderRadius: '14px',
          background: 'var(--color-surface-hover)',
          border: '1px solid var(--color-border)',
          width: '100%',
          boxSizing: 'border-box',
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation',
        }}
      >
        <div style={{ display: 'flex', gap: '3px', flex: 1, minWidth: 0, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {SORT_ITEMS.map((item) => {
            const isActive = sortKey === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectSortKey(item.id)}
                style={{
                  flex: 1,
                  padding: '5px 6px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '11.5px',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  background: isActive ? 'var(--color-accent)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--color-text-muted)',
                  boxShadow: isActive ? '0 2px 8px var(--color-accent-border)' : 'none',
                  transition: 'all 0.12s ease',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation',
                }}
              >
                {item.label}
              </button>
            );
          })}
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
            padding: '5px 9px',
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
