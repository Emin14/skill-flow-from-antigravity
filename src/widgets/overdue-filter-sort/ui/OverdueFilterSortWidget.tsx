'use client';

import React, { startTransition } from 'react';
import { ArrowDown, ArrowUp, ChevronDown } from 'lucide-react';

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

  const handleCategoryChange = (val: string) => {
    startTransition(() => {
      onSelectCategoryFilter(val);
    });
  };

  const handleSortChange = (val: OverdueSortKey) => {
    startTransition(() => {
      onSelectSortKey(val);
    });
  };

  return (
    <div style={{ width: '100%', marginBottom: '10px', boxSizing: 'border-box' }}>
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
        {/* Category Filter Dropdown */}
        <div style={{ position: 'relative', flex: 1, minWidth: 0, display: 'flex', alignItems: 'center' }}>
          <select
            value={categoryFilter}
            onChange={(e) => handleCategoryChange(e.target.value)}
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
            <option value="all">🥞 Все категории</option>
            {availableCategories.map((cat) => (
              <option key={cat} value={cat}>
                📁 {cat}
              </option>
            ))}
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
            onChange={(e) => handleSortChange(e.target.value as OverdueSortKey)}
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
            <option value="date">📅 По дате</option>
            <option value="alphabetical">🔤 По алфавиту</option>
            <option value="count">📊 По выполнению</option>
          </select>
          <ChevronDown
            size={13}
            color="var(--color-text-muted)"
            style={{ position: 'absolute', right: '8px', pointerEvents: 'none' }}
          />
        </div>

        {/* Sort Direction Toggle Button */}
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
