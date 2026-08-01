'use client';

import React, { useMemo } from 'react';
import { DAILY_MESSAGES } from '@/shared/config/dailyMessages';

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
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 16px',
        borderRadius: '16px',
        backgroundColor: 'rgba(14, 165, 233, 0.05)',
        border: '1px solid rgba(14, 165, 233, 0.18)',
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)',
        width: '100%',
        marginBottom: '12px',
      }}
    >
      <span style={{ fontSize: '16px', flexShrink: 0 }}>💬</span>
      <span
        style={{
          fontSize: '13.5px',
          color: 'var(--color-text-primary)',
          fontWeight: 500,
          lineHeight: 1.45,
        }}
      >
        {dailyMessage}
      </span>
    </div>
  );
};
