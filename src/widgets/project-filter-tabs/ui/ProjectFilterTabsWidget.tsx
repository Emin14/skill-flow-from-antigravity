'use client';

import React from 'react';
import { Layers, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import styles from './ProjectFilterTabsWidget.module.css';

export type ProjectFilterType = 'all' | 'active' | 'completed' | 'has_overdue';

interface ProjectFilterTabsWidgetProps {
  activeFilter: ProjectFilterType;
  onSelectFilter: (filter: ProjectFilterType) => void;
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
}) => {
  return (
    <div style={{ width: '100%' }}>
      {/* 💡 Selected Final Variant #9: Sub-Header Badge Bar with Dual Compact Rows */}
      <div className={styles.v9DualRowSubHeader}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>📁 Фильтр Проектов</span>
          <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 800 }}>
            {TABS.find((t) => t.id === activeFilter)?.label}
          </span>
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
