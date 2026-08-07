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
    <div style={{ width: '100%', marginBottom: '10px', boxSizing: 'border-box' }}>
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
        }}
      >
        {/* Category Filter Dropdown */}
        <select
          value={categoryFilter}
          onChange={(e) => onSelectCategoryFilter(e.target.value)}
          style={{
            flex: 1,
            minWidth: 0,
            padding: '6px 10px',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            color: 'var(--color-text-primary)',
            fontSize: '11.5px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <option value="all">🥞 Все категории</option>
          {availableCategories.map((cat) => (
            <option key={cat} value={cat}>
              📁 {cat}
            </option>
          ))}
        </select>

        {/* Sort Key Dropdown */}
        <select
          value={sortKey}
          onChange={(e) => onSelectSortKey(e.target.value as OverdueSortKey)}
          style={{
            flex: 1,
            minWidth: 0,
            padding: '6px 10px',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            color: 'var(--color-text-primary)',
            fontSize: '11.5px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <option value="date">📅 По дате</option>
          <option value="alphabetical">🔤 По алфавиту</option>
          <option value="count">📊 По выполнению</option>
        </select>

        {/* Sort Direction Toggle Button */}
        <button
          type="button"
          onClick={onToggleDirection}
          title={isDesc ? 'Сменить на По возрастанию' : 'Сменить на По убыванию'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: '10px',
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
