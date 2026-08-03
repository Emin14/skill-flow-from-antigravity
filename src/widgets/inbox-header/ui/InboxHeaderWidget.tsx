'use client';

import React from 'react';
import { Zap } from 'lucide-react';
import styles from './InboxHeaderWidget.module.css';

interface InboxHeaderWidgetProps {
  itemCount: number;
  quickInput: string;
  setQuickInput: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const InboxHeaderWidget: React.FC<InboxHeaderWidgetProps> = ({
  itemCount,
  quickInput,
  setQuickInput,
  onSubmit,
}) => {
  return (
    <div style={{ width: '100%' }}>
      {/* 💡 Selected Final Variant #6: Sub-header Badge Pill Panel */}
      <div className={styles.v6PillPanel}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={18} className={styles.titleIcon} />
            <span className={styles.widgetTitle}>Входящие идеи</span>
          </div>
          <span className={styles.widgetBadge}>{itemCount} не разобранных</span>
        </div>

        <form onSubmit={onSubmit}>
          <input
            type="text"
            className={styles.cleanInput}
            placeholder="Введите мысль или заметочный тезис..."
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
          />
        </form>
      </div>
    </div>
  );
};
