'use client';

import React from 'react';
import { Typography } from '@/shared/ui';
import { useTaskStore } from '@/entities/task';
import { useCategoryStore } from '@/entities/category/model/useCategoryStore';
import styles from './CategoryAccomplishments.module.css';

export const CategoryAccomplishments: React.FC = () => {
  const tasks = useTaskStore((s) => s.tasks);
  const categories = useCategoryStore((s) => s.categories);

  return (
    <div className={styles.card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h2">📊 Достижения по категориям</Typography>
        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
          Выполнено задач
        </span>
      </div>

      <div className={styles.grid}>
        {categories.map((cat) => {
          const completedCount = tasks.filter((t) => (t.category || 'Без категории') === cat.name && t.status === 'Done').length;

          return (
            <div key={cat.id || cat.name} className={styles.categoryItem}>
              <span className={styles.catLabel} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: cat.color, flexShrink: 0 }} />
                <span>{cat.name}</span>
              </span>
              <span className={styles.catVal}>{completedCount}</span>
              <span className={styles.catDesc}>выполнено</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
