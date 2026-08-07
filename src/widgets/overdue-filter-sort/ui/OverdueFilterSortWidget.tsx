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
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px', boxSizing: 'border-box' }}>
      {/* Category Pills Bar (Horizontal Scrollable iOS Pill Strip) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
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
        <button
          type="button"
          onClick={() => onSelectCategoryFilter('all')}
          style={{
            padding: '5px 10px',
            borderRadius: '10px',
            border: 'none',
            fontSize: '11.5px',
            fontWeight: categoryFilter === 'all' ? 700 : 500,
            cursor: 'pointer',
            background: categoryFilter === 'all' ? 'var(--color-accent)' : 'transparent',
            color: categoryFilter === 'all' ? '#ffffff' : 'var(--color-text-muted)',
            boxShadow: categoryFilter === 'all' ? '0 2px 8px var(--color-accent-border)' : 'none',
            transition: 'all 0.12s ease',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation',
          }}
        >
          🥞 Все
        </button>

        {availableCategories.map((cat) => {
          const isActive = categoryFilter === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategoryFilter(cat)}
              style={{
                padding: '5px 10px',
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
              📁 {cat}
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
        <div style={{ display: 'flex', gap: '3px', flex: 1, minWidth: 0 }}>
          {SORT_ITEMS.map((item) => {
            const isActive = sortKey === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectSortKey(item.id)}
                style={{
                  flex: 1,
                  padding: '5px 8px',
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
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation',
                }}
              >
                {item.label}
              </button>
            );
          })}
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
