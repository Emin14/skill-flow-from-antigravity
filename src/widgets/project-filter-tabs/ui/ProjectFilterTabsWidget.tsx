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

export const ProjectFilterTabsWidget: React.FC<ProjectFilterTabsWidgetProps> = ({
  activeFilter,
  onSelectFilter,
  progressMode,
  onToggleProgressMode,
}) => {
  const renderModeSwitcher = () => (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '12px',
        padding: '2px',
        gap: '2px',
        maxWidth: '100%',
        boxSizing: 'border-box',
        flexShrink: 0,
      }}
    >
      <button
        type="button"
        onClick={() => onToggleProgressMode('today')}
        title="Проценты на сегодня (по текущим экземплярам)"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '3px 8px',
          borderRadius: '10px',
          border: 'none',
          fontSize: '10.5px',
          fontWeight: 700,
          cursor: 'pointer',
          background: progressMode === 'today' ? 'var(--color-accent)' : 'transparent',
          color: progressMode === 'today' ? '#ffffff' : 'var(--color-text-muted)',
          boxShadow: progressMode === 'today' ? '0 2px 8px var(--color-accent-border)' : 'none',
          transition: 'all 0.15s ease',
          whiteSpace: 'nowrap',
        }}
      >
        <span>📅</span>
        <span>Сегодня</span>
      </button>

      <button
        type="button"
        onClick={() => onToggleProgressMode('all_time')}
        title="Проценты за всё время (только мастер-статус)"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '3px 8px',
          borderRadius: '10px',
          border: 'none',
          fontSize: '10.5px',
          fontWeight: 700,
          cursor: 'pointer',
          background: progressMode === 'all_time' ? 'var(--color-accent)' : 'transparent',
          color: progressMode === 'all_time' ? '#ffffff' : 'var(--color-text-muted)',
          boxShadow: progressMode === 'all_time' ? '0 2px 8px var(--color-accent-border)' : 'none',
          transition: 'all 0.15s ease',
          whiteSpace: 'nowrap',
        }}
      >
        <span>♾️</span>
        <span>Всё время</span>
      </button>
    </div>
  );

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px', boxSizing: 'border-box' }}>
      {/* Locked Variant 5: Segmented Embedded Select Bar (No title, no variant selector bar) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '6px',
          padding: '4px',
          borderRadius: '16px',
          background: 'var(--color-surface-hover)',
          border: '1px solid var(--color-border)',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <select
          value={activeFilter}
          onChange={(e) => onSelectFilter(e.target.value as ProjectFilterType)}
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
          <option value="all">🥞 Все задачи</option>
          <option value="active">🕒 Активные</option>
          <option value="completed">🎯 Завершенные</option>
          <option value="has_overdue">⚠️ Просроченные</option>
        </select>
        {renderModeSwitcher()}
      </div>
    </div>
  );
};
