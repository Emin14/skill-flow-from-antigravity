'use client';

import React from 'react';
import { Button } from '@/shared/ui';

interface AchievementSectionBannerWidgetProps {
  count?: number;
  onAddClick?: () => void;
}

export const AchievementSectionBannerWidget: React.FC<AchievementSectionBannerWidgetProps> = ({
  count = 0,
  onAddClick,
}) => {
  return (
    <div style={{ width: '100%', marginBottom: '16px', boxSizing: 'border-box' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '12px 16px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, var(--color-accent-light) 0%, var(--color-surface) 100%)',
          border: '1px solid var(--color-accent-border)',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>
              🏆 Достижения и рекорды
            </h2>
            {count > 0 && (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  color: '#10b981',
                }}
              >
                {count} {count === 1 ? 'победа' : count < 5 ? 'победы' : 'побед'}
              </span>
            )}
          </div>
          <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', margin: '2px 0 0 0', lineHeight: 1.4 }}>
            Твой личный зал славы: фиксируй главные жизненные победы, спортивные рекорды и ключевые вехи.
          </p>
        </div>

        {onAddClick && (
          <Button
            variant="primary"
            onClick={onAddClick}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            <span>➕</span>
            <span>Зафиксировать</span>
          </Button>
        )}
      </div>
    </div>
  );
};
