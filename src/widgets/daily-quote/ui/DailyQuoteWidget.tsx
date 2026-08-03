'use client';

import React, { useMemo } from 'react';
import { DAILY_MESSAGES } from '@/shared/config/dailyMessages';
import styles from './DailyQuoteWidget.module.css';

export const DailyQuoteWidget: React.FC = () => {
  const dailyMessage = useMemo(() => {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 0);
    const diff = today.getTime() - startOfYear.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const index = dayOfYear % DAILY_MESSAGES.length;
    return DAILY_MESSAGES[index];
  }, []);

  return (
    <div className={styles.quoteContainerBox}>
      {/* 💡 Selected Final Variant #15: Minimalist Hairline Underline Caption */}
      <div className={styles.v15DashedUnderline}>
        <span>💡 {dailyMessage}</span>
      </div>
    </div>
  );
};
