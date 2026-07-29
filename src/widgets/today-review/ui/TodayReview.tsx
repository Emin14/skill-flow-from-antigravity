'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { Card, Typography, Button } from '@/shared/ui';

interface TodayReviewProps {
  dueCardsCount: number;
  reviewedTodayCount: number;
}

export const TodayReview: React.FC<TodayReviewProps> = memo(({
  dueCardsCount,
  reviewedTodayCount,
}) => {
  return (
    <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h2">🧠 Повторение знаний</Typography>
        <Link href="/review" style={{ textDecoration: 'none' }}>
          <Button variant="primary" disabled={dueCardsCount === 0}>
            {dueCardsCount > 0 ? `Начать повторение (${dueCardsCount})` : 'Все карточки повторены ✓'}
          </Button>
        </Link>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
        <span>⏳ К повторению сегодня: <strong style={{ color: dueCardsCount > 0 ? 'var(--color-warning)' : 'var(--color-success)' }}>{dueCardsCount}</strong></span>
        <span>✅ Повторено сегодня: <strong>{reviewedTodayCount}</strong></span>
      </div>
    </Card>
  );
});

TodayReview.displayName = 'TodayReview';
