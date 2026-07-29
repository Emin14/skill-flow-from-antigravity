'use client';

import React, { memo } from 'react';
import { Card } from '@/shared/ui';
import styles from './TodaySummary.module.css';

interface TodaySummaryProps {
  goalsCount: number;
  activeTopicsCount: number;
  materialsCount: number;
  fsrsCardsCount: number;
  tasksCompletedToday: number;
}

export const TodaySummary: React.FC<TodaySummaryProps> = memo(({
  goalsCount,
  activeTopicsCount,
  materialsCount,
  fsrsCardsCount,
  tasksCompletedToday,
}) => {
  return (
    <div className={styles.summaryGrid}>
      <Card className={styles.summaryCard}>
        <div className={styles.cardValue}>{goalsCount}</div>
        <div className={styles.cardLabel}>🏆 Всего целей</div>
      </Card>
      <Card className={styles.summaryCard}>
        <div className={styles.cardValue}>{activeTopicsCount}</div>
        <div className={styles.cardLabel}>🐘 Активных тем</div>
      </Card>
      <Card className={styles.summaryCard}>
        <div className={styles.cardValue}>{materialsCount}</div>
        <div className={styles.cardLabel}>📚 Материалов</div>
      </Card>
      <Card className={styles.summaryCard}>
        <div className={styles.cardValue}>{fsrsCardsCount}</div>
        <div className={styles.cardLabel}>🧠 Карточек повторения</div>
      </Card>
      <Card className={styles.summaryCard}>
        <div className={styles.cardValue}>{tasksCompletedToday}</div>
        <div className={styles.cardLabel}>✅ Выполнено сегодня</div>
      </Card>
    </div>
  );
});

TodaySummary.displayName = 'TodaySummary';
