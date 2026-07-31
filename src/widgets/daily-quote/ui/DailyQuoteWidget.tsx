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
        gap: '12px',
        padding: '14px 16px',
        borderRadius: '16px',
        backgroundColor: 'rgba(14, 165, 233, 0.06)',
        border: '1px solid rgba(14, 165, 233, 0.18)',
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.04)',
        width: '100%',
        marginBottom: '12px',
      }}
    >
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          backgroundColor: 'rgba(14, 165, 233, 0.14)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          flexShrink: 0,
        }}
      >
        💡
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1, minWidth: 0 }}>
        <span
          style={{
            fontSize: '10.5px',
            fontWeight: 700,
            color: '#38bdf8',
            textTransform: 'uppercase',
            letterSpacing: '0.6px',
          }}
        >
          Мысль дня
        </span>
        <span
          style={{
            fontSize: '13.5px',
            color: 'var(--color-text-primary)',
            fontWeight: 500,
            fontStyle: 'normal',
            lineHeight: 1.45,
          }}
        >
          {dailyMessage}
        </span>
      </div>
    </div>
  );
};
