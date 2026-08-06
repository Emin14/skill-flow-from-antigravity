'use client';

import React from 'react';
import { Layers, Clock, CheckCircle2, AlertTriangle, LayoutList, RefreshCw, BarChart } from 'lucide-react';
import styles from './ProjectFilterTabsWidget.module.css';

export type ProjectFilterType = 'all' | 'active' | 'completed' | 'has_overdue';
export type SubtaskViewMode = 'standard' | 'accent_card' | 'timeline';

interface ProjectFilterTabsWidgetProps {
  activeFilter: ProjectFilterType;
  onSelectFilter: (filter: ProjectFilterType) => void;
  subtaskViewMode: SubtaskViewMode;
  onSelectSubtaskViewMode: (mode: SubtaskViewMode) => void;
}

const TABS: { id: ProjectFilterType; label: string; shortLabel: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'Все', shortLabel: 'Все', icon: <Layers size={13} /> },
  { id: 'active', label: 'Активные', shortLabel: 'Актив', icon: <Clock size={13} /> },
  { id: 'completed', label: 'Завершенные', shortLabel: 'Готово', icon: <CheckCircle2 size={13} /> },
  { id: 'has_overdue', label: 'Просроченные', shortLabel: 'Просрочено', icon: <AlertTriangle size={13} color="#f87171" /> },
];

const VIEW_MODES: { id: SubtaskViewMode; label: string; icon: React.ReactNode }[] = [
  { id: 'standard', label: 'Стандарт', icon: <LayoutList size={12} /> },
  { id: 'accent_card', label: 'Акцент', icon: <RefreshCw size={12} /> },
  { id: 'timeline', label: 'Таймлайн', icon: <BarChart size={12} /> },
];

export const ProjectFilterTabsWidget: React.FC<ProjectFilterTabsWidgetProps> = ({
  activeFilter,
  onSelectFilter,
  subtaskViewMode,
  onSelectSubtaskViewMode,
}) => {
  return (
    <div style={{ width: '100%' }}>
      <div className={styles.v9DualRowSubHeader}>
        {/* Row 1: Header title & Active Filter Name */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className={styles.widgetTitle}>📁 Крупные задачи</span>
          <span className={styles.widgetBadge}>
            {TABS.find((t) => t.id === activeFilter)?.label}
          </span>
        </div>

        {/* Row 2: Filter Tabs (4 Columns Grid) */}
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

        {/* Row 3: Subtask View Mode Selector */}
        <div style={{ paddingTop: '6px', borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>🔁 Вид повторяющихся подзадач:</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', width: '100%' }}>
            {VIEW_MODES.map((mode) => (
              <button
                key={mode.id}
                type="button"
                className={`${styles.filterBtn} ${styles.equalBtn} ${subtaskViewMode === mode.id ? styles.filterBtnActive : ''}`}
                onClick={() => onSelectSubtaskViewMode(mode.id)}
                title={`Переключить вид на ${mode.label}`}
              >
                {mode.icon}
                <span>{mode.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
