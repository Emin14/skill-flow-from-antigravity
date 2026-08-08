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
    <div style={{ width: '100%', marginBottom: '12px', boxSizing: 'border-box' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          padding: '4px',
          borderRadius: '16px',
          background: 'var(--color-surface-hover)',
          border: '1px solid var(--color-border)',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {/* Filter Dropdown Select */}
        <select
          value={activeFilter}
          onChange={(e) => onSelectFilter(e.target.value as ProjectFilterType)}
          style={{
            flex: 1,
            minWidth: 0,
            padding: '7px 12px',
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
          <option value="all">🥞 Все задачи</option>
          <option value="active">🔘 Активные</option>
          <option value="completed">🎯 Завершенные</option>
          <option value="has_overdue">⚠️ Просроченные</option>
        </select>

        {/* Mode Switcher: Today / All Time */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            padding: '2px',
            gap: '2px',
            flexShrink: 0,
          }}
        >
          <button
            type="button"
            onClick={() => onToggleProgressMode('today')}
            title="Проценты на сегодня"
            style={{
              padding: '4px 9px',
              borderRadius: '9px',
              border: 'none',
              fontSize: '11px',
              fontWeight: progressMode === 'today' ? 700 : 500,
              cursor: 'pointer',
              background: progressMode === 'today' ? 'var(--color-accent)' : 'transparent',
              color: progressMode === 'today' ? '#ffffff' : 'var(--color-text-muted)',
              transition: 'all 0.12s ease',
              whiteSpace: 'nowrap',
            }}
          >
            📅 Сегодня
          </button>
          <button
            type="button"
            onClick={() => onToggleProgressMode('all_time')}
            title="Проценты за всё время"
            style={{
              padding: '4px 9px',
              borderRadius: '9px',
              border: 'none',
              fontSize: '11px',
              fontWeight: progressMode === 'all_time' ? 700 : 500,
              cursor: 'pointer',
              background: progressMode === 'all_time' ? 'var(--color-accent)' : 'transparent',
              color: progressMode === 'all_time' ? '#ffffff' : 'var(--color-text-muted)',
              transition: 'all 0.12s ease',
              whiteSpace: 'nowrap',
            }}
          >
            ♾️ Всё время
          </button>
        </div>
      </div>
    </div>
  );
};
