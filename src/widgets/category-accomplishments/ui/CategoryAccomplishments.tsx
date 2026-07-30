'use client';

import React from 'react';
import { Typography } from '@/shared/ui';
import { useTaskStore } from '@/entities/task';
import { TASK_CATEGORIES } from '@/shared/config/categories';
import styles from './CategoryAccomplishments.module.css';

export const CategoryAccomplishments: React.FC = () => {
  const tasks = useTaskStore((s) => s.tasks);

  return (
    <div className={styles.card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h2">📊 Достижения по категориям</Typography>
        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
          Выполнено задач
        </span>
      </div>

      <div className={styles.grid}>
        {TASK_CATEGORIES.map((cat) => {
          const completedCount = tasks.filter((t) => t.category === cat && t.status === 'Done').length;

          return (
            <div key={cat} className={styles.categoryItem}>
              <span className={styles.catLabel}>🏷 {cat}</span>
              <span className={styles.catVal}>{completedCount}</span>
              <span className={styles.catDesc}>выполнено</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
