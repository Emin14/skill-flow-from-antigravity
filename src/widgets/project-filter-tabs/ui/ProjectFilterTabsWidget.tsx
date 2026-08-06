'use client';

import React from 'react';
import { Layers, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import styles from './ProjectFilterTabsWidget.module.css';

export type ProjectFilterType = 'all' | 'active' | 'completed' | 'has_overdue';
export type ProjectProgressMode = 'today' | 'all_time';

interface ProjectFilterTabsWidgetProps {
  activeFilter: ProjectFilterType;
  onSelectFilter: (filter: ProjectFilterType) => void;
  progressMode: ProjectProgressMode;
  onToggleProgressMode: (mode: ProjectProgressMode) => void;
}

const TABS: { id: ProjectFilterType; label: string; shortLabel: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'Все', shortLabel: 'Все', icon: <Layers size={13} /> },
  { id: 'active', label: 'Активные', shortLabel: 'Актив', icon: <Clock size={13} /> },
  { id: 'completed', label: 'Завершенные', shortLabel: 'Готово', icon: <CheckCircle2 size={13} /> },
  { id: 'has_overdue', label: 'Просроченные', shortLabel: 'Просрочено', icon: <AlertTriangle size={13} color="#f87171" /> },
];

export const ProjectFilterTabsWidget: React.FC<ProjectFilterTabsWidgetProps> = ({
  activeFilter,
  onSelectFilter,
  progressMode,
  onToggleProgressMode,
}) => {
  return (
    <div style={{ width: '100%' }}>
      {/* 💡 Sub-Header Badge Bar with Dual Compact Rows */}
      <div className={styles.v9DualRowSubHeader}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
          <span className={styles.widgetTitle}>📁 Крупные задачи</span>

          {/* Toggle Progress Mode: Today vs All Time */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: 'var(--color-surface-hover)',
              border: '1px solid var(--color-border)',
              borderRadius: '20px',
              padding: '2px',
              gap: '2px',
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
                padding: '3px 9px',
                borderRadius: '16px',
                border: 'none',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                background: progressMode === 'today' ? 'var(--color-accent)' : 'transparent',
                color: progressMode === 'today' ? '#ffffff' : 'var(--color-text-muted)',
                boxShadow: progressMode === 'today' ? '0 2px 8px var(--color-accent-border)' : 'none',
                transition: 'all 0.15s ease',
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
                padding: '3px 9px',
                borderRadius: '16px',
                border: 'none',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                background: progressMode === 'all_time' ? 'var(--color-accent)' : 'transparent',
                color: progressMode === 'all_time' ? '#ffffff' : 'var(--color-text-muted)',
                boxShadow: progressMode === 'all_time' ? '0 2px 8px var(--color-accent-border)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <span>♾️</span>
              <span>Всё время</span>
            </button>
          </div>
        </div>

        <div className={styles.equalTrackRow}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`${styles.filterBtn} ${styles.equalBtn} ${activeFilter === tab.id ? styles.filterBtnActive : ''}`}
              onClick={() => onSelectFilter(tab.id)}
            >
              {tab.icon}
              <span>{tab.shortLabel}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
