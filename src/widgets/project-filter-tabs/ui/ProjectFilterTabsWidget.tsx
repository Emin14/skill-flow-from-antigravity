'use client';

import React from 'react';

export type ProjectFilterType = 'all' | 'active' | 'completed' | 'has_overdue';
export type ProjectProgressMode = 'today' | 'all_time';

interface ProjectFilterTabsWidgetProps {
  activeFilter: ProjectFilterType;
  onSelectFilter: (filter: ProjectFilterType) => void;
  progressMode: ProjectProgressMode;
  onToggleProgressMode: (mode: ProjectProgressMode) => void;
}

const FILTER_ITEMS: { id: ProjectFilterType; label: string }[] = [
  { id: 'all', label: '🥞 Все' },
  { id: 'active', label: '🕒 Активные' },
  { id: 'completed', label: '🎯 Готово' },
  { id: 'has_overdue', label: '⚠️ Просрочено' },
];

export const ProjectFilterTabsWidget: React.FC<ProjectFilterTabsWidgetProps> = ({
  activeFilter,
  onSelectFilter,
  progressMode,
  onToggleProgressMode,
}) => {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px', boxSizing: 'border-box' }}>
      {/* Upper Bar: Smooth iOS Segmented Tabs for Project Filter */}
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
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}
      >
        {/* iOS Segmented Pills Bar */}
        <div style={{ display: 'flex', gap: '3px', flex: 1, minWidth: 0 }}>
          {FILTER_ITEMS.map((item) => {
            const isActive = activeFilter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectFilter(item.id)}
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
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Mode Switcher: Today / All Time */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '10px',
            padding: '2px',
            gap: '2px',
            flexShrink: 0,
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation',
          }}
        >
          <button
            type="button"
            onClick={() => onToggleProgressMode('today')}
            title="Проценты на сегодня (по текущим экземплярам)"
            style={{
              padding: '4px 8px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '11px',
              fontWeight: progressMode === 'today' ? 700 : 500,
              cursor: 'pointer',
              background: progressMode === 'today' ? 'var(--color-accent)' : 'transparent',
              color: progressMode === 'today' ? '#ffffff' : 'var(--color-text-muted)',
              transition: 'all 0.12s ease',
              whiteSpace: 'nowrap',
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation',
            }}
          >
            📅 Сегодня
          </button>
          <button
            type="button"
            onClick={() => onToggleProgressMode('all_time')}
            title="Проценты за всё время (только мастер-статус)"
            style={{
              padding: '4px 8px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '11px',
              fontWeight: progressMode === 'all_time' ? 700 : 500,
              cursor: 'pointer',
              background: progressMode === 'all_time' ? 'var(--color-accent)' : 'transparent',
              color: progressMode === 'all_time' ? '#ffffff' : 'var(--color-text-muted)',
              transition: 'all 0.12s ease',
              whiteSpace: 'nowrap',
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation',
            }}
          >
            ♾️ Всё время
          </button>
        </div>
      </div>
    </div>
  );
};
