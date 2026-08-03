'use client';

import React from 'react';
import { AlertCircle, Calendar } from 'lucide-react';
import styles from './OverdueHeaderWidget.module.css';

interface OverdueHeaderWidgetProps {
  overdueCount: number;
  onRescheduleAll: () => void;
}

export const OverdueHeaderWidget: React.FC<OverdueHeaderWidgetProps> = ({
  overdueCount,
  onRescheduleAll,
}) => {
  return (
    <div style={{ width: '100%' }}>
      {/* 💡 Selected Final Variant #7: Double Line Card with Hairline Divider */}
      <div className={styles.v7DoubleLineCard}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} color="#ef4444" />
            <span>Просрочено ({overdueCount})</span>
          </div>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>Срок выполнения прошёл</span>
        </div>

        <div style={{ borderTop: '1px dashed rgba(255,255,255,0.12)', margin: '2px 0' }} />

        {overdueCount > 0 && (
          <button type="button" className={styles.bulkActionBtn} onClick={onRescheduleAll} style={{ width: '100%', justifyContent: 'center' }}>
            <Calendar size={14} />
            Перенести все задачи на сегодня ☀️
          </button>
        )}
      </div>
    </div>
  );
};
