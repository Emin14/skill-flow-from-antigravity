'use client';

import React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';

export type OverdueSortKey = 'date' | 'alphabetical' | 'count';
export type OverdueSortDirection = 'asc' | 'desc';

interface OverdueFilterSortWidgetProps {
  categoryFilter: string;
  onSelectCategoryFilter: (category: string) => void;
  availableCategories: string[];
  sortKey: OverdueSortKey;
  onSelectSortKey: (key: OverdueSortKey) => void;
  sortDirection: OverdueSortDirection;
  onToggleDirection: () => void;
}

const SORT_ITEMS: { id: OverdueSortKey; label: string }[] = [
  { id: 'date', label: '📅 Дате' },
  { id: 'alphabetical', label: '🔤 Алфавиту' },
  { id: 'count', label: '📊 Выполнению' },
];

export const OverdueFilterSortWidget: React.FC<OverdueFilterSortWidgetProps> = ({
  categoryFilter,
  onSelectCategoryFilter,
  availableCategories,
  sortKey,
  onSelectSortKey,
  sortDirection,
  onToggleDirection,
}) => {
  const isDesc = sortDirection === 'desc';

  return (
    <div style={{ width: '100%', marginBottom: '12px', boxSizing: 'border-box' }}>
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
        {/* Category Filter Select */}
        <select
          value={categoryFilter}
          onChange={(e) => onSelectCategoryFilter(e.target.value)}
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
          <option value="all">🥞 Все категории</option>
          {availableCategories.map((cat) => (
            <option key={cat} value={cat}>
              📁 {cat}
            </option>
          ))}
        </select>

        {/* Sort Key Select */}
        <select
          value={sortKey}
          onChange={(e) => onSelectSortKey(e.target.value as OverdueSortKey)}
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
          <option value="date">📅 По дате</option>
          <option value="alphabetical">🔤 По алфавиту</option>
          <option value="count">📊 По выполнению</option>
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
