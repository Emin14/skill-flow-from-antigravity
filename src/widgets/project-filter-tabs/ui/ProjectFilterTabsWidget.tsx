'use client';

import React, { startTransition } from 'react';
import { ChevronDown } from 'lucide-react';

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
  const handleSelectChange = (val: ProjectFilterType) => {
    startTransition(() => {
      onSelectFilter(val);
    });
  };

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
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
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
          padding: '4px 9px',
          borderRadius: '10px',
          border: 'none',
          fontSize: '11px',
          fontWeight: 700,
          cursor: 'pointer',
          background: progressMode === 'today' ? 'var(--color-accent)' : 'transparent',
          color: progressMode === 'today' ? '#ffffff' : 'var(--color-text-muted)',
          boxShadow: progressMode === 'today' ? '0 2px 8px var(--color-accent-border)' : 'none',
          transition: 'all 0.15s ease',
          whiteSpace: 'nowrap',
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation',
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
          padding: '4px 9px',
          borderRadius: '10px',
          border: 'none',
          fontSize: '11px',
          fontWeight: 700,
          cursor: 'pointer',
          background: progressMode === 'all_time' ? 'var(--color-accent)' : 'transparent',
          color: progressMode === 'all_time' ? '#ffffff' : 'var(--color-text-muted)',
          boxShadow: progressMode === 'all_time' ? '0 2px 8px var(--color-accent-border)' : 'none',
          transition: 'all 0.15s ease',
          whiteSpace: 'nowrap',
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation',
        }}
      >
        <span>♾️</span>
        <span>Всё время</span>
      </button>
    </div>
  );

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px', boxSizing: 'border-box' }}>
      {/* iOS Segmented Bar with Native Smooth Select */}
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
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation',
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: 0, display: 'flex', alignItems: 'center' }}>
          <select
            value={activeFilter}
            onChange={(e) => handleSelectChange(e.target.value as ProjectFilterType)}
            style={{
              width: '100%',
              padding: '7px 26px 7px 10px',
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
            <option value="all">🥞 Все задачи</option>
            <option value="active">🕒 Активные</option>
            <option value="completed">🎯 Завершенные</option>
            <option value="has_overdue">⚠️ Просроченные</option>
          </select>
          <ChevronDown
            size={13}
            color="var(--color-text-muted)"
            style={{ position: 'absolute', right: '9px', pointerEvents: 'none' }}
          />
        </div>

        {renderModeSwitcher()}
      </div>
    </div>
  );
};
