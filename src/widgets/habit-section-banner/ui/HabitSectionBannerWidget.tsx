'use client';

import React from 'react';

export const HabitSectionBannerWidget: React.FC = () => {
  return (
    <div style={{ width: '100%', marginBottom: '12px', boxSizing: 'border-box' }}>
      {/* Container Style & Text from Variant 10, Title & Icon from Variant 6 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '3px',
          padding: '12px 16px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, var(--color-accent-light) 0%, var(--color-surface) 100%)',
          border: '1px solid var(--color-accent-border)',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>🔄 Повторяющиеся Задачи</h2>
        <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', margin: '2px 0 0 0', lineHeight: 1.4 }}>
          Организуйте вашу рутину и отслеживайте постоянный прогресс выполнения регулярных дел.
        </p>
      </div>
    </div>
  );
};
