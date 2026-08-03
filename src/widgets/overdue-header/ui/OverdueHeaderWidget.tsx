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
          <div className={styles.titleWrapper}>
            <AlertCircle size={18} className={styles.alertIcon} />
            <span className={styles.widgetTitle}>Просрочено ({overdueCount})</span>
          </div>
          <span className={styles.widgetBadge}>Срок выполнения прошёл</span>
        </div>

        <div className={styles.dashedDivider} />

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
