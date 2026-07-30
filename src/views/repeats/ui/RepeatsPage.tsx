'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Card, Typography } from '@/shared/ui';
import { useTaskStore } from '@/entities/task';
import { Task } from '@/entities/task/model/types';
import styles from './RepeatsPage.module.css';

type ViewMode = '7' | '365';

export const RepeatsPage: React.FC = () => {
  const { tasks, isLoading, fetchTasks } = useTaskStore();
  const [globalViewMode, setGlobalViewMode] = useState<ViewMode>('365');

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Group repeating tasks by seriesId or title so each repeating task series appears EXACTLY ONCE
  const uniqueRepeatingTasks = useMemo(() => {
    const repeatingTasks = tasks.filter((t) => t.isRepeating);
    const seriesMap = new Map<string, Task>();

    repeatingTasks.forEach((t) => {
      const key = t.seriesId || t.title.toLowerCase().trim();
      if (!seriesMap.has(key)) {
        seriesMap.set(key, t);
      } else {
        const existing = seriesMap.get(key)!;
        const mergedHistory = [
          ...(existing.repetitionHistory || []),
          ...(t.repetitionHistory || []),
        ].filter((h, idx, self) => self.findIndex((x) => x.date === h.date) === idx);

        const maxCount = Math.max(existing.repetitionsCount || 0, t.repetitionsCount || 0, mergedHistory.length);

        seriesMap.set(key, {
          ...existing,
          repetitionsCount: maxCount,
          repetitionHistory: mergedHistory,
        });
      }
    });

    return Array.from(seriesMap.values());
  }, [tasks]);

  return (
    <div className={styles.container}>
      {/* Header */}
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <Typography variant="h1">🔄 Повторить</Typography>
        <Typography variant="body" style={{ color: 'var(--color-text-muted)' }}>
          Матрица привычек и повторений без скролла
        </Typography>
      </Card>

      {/* List of Unique Repeating Task Matrix Cards */}
      {isLoading ? (
        <Card style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          <Typography variant="body" style={{ color: 'var(--color-text-muted)' }}>
            Загрузка задач...
          </Typography>
        </Card>
      ) : uniqueRepeatingTasks.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          <Typography variant="body" style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-3)' }}>
            🌱 У вас пока нет задач в разделе повторения.
          </Typography>
          <Typography variant="caption" style={{ color: 'var(--color-text-muted)' }}>
            Создайте новую задачу и включите иконку «Повторять».
          </Typography>
        </Card>
      ) : (
        <div className={styles.repeatsList}>
          {uniqueRepeatingTasks.map((task, idx) => (
            <RepeatingMatrixCard
              key={`${task.id}-${idx}`}
              task={task}
              viewMode={globalViewMode}
            />
          ))}
        </div>
      )}

      {/* Icon-Only Switcher at the bottom */}
      <div className={styles.bottomToggleWrapper}>
        <div className={styles.pillSegmentControl} role="tablist" aria-label="Режим отображения">
          {/* Icon 1: 7 days view (Grid Icon) */}
          <button
            title="Последние 7 дней"
            className={`${styles.iconBtn} ${globalViewMode === '7' ? styles.iconBtnActive : ''}`}
            onClick={() => setGlobalViewMode('7')}
            role="tab"
            aria-selected={globalViewMode === '7'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <rect x="4" y="4" width="7" height="7" rx="2" />
              <rect x="13" y="4" width="7" height="7" rx="2" />
              <rect x="4" y="13" width="7" height="7" rx="2" />
              <rect x="13" y="13" width="7" height="7" rx="2" />
            </svg>
          </button>

          {/* Icon 2: Full Matrix view (List/3-bar Icon) */}
          <button
            title="Матричный вид (без скролла)"
            className={`${styles.iconBtn} ${globalViewMode === '365' ? styles.iconBtnActive : ''}`}
            onClick={() => setGlobalViewMode('365')}
            role="tab"
            aria-selected={globalViewMode === '365'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="5" width="18" height="3" rx="1.5" />
              <rect x="3" y="11" width="18" height="3" rx="1.5" />
              <rect x="3" y="17" width="18" height="3" rx="1.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const formatDateStr = (y: number, m: number, d: number): string => {
  const year = y;
  const month = String(m + 1).padStart(2, '0');
  const day = String(d).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const RepeatingMatrixCard: React.FC<{
  task: Task;
  viewMode: ViewMode;
}> = ({ task, viewMode }) => {
  const currentCount = task.repetitionsCount || 0;
  const targetCount = task.targetRepetitions || 8;

  // 7-day cells OR 24-column Matrix
  const cols = viewMode === '7' ? 1 : 24;
  const totalDays = cols * 7;

  const gridCells = [];
  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = formatDateStr(d.getFullYear(), d.getMonth(), d.getDate());
    const isDone = task.repetitionHistory?.some((h) => h.date === dateStr && h.completed);

    gridCells.push({
      date: dateStr,
      dayNum: d.getDate(),
      isDone,
    });
  }

  // Get icon for task based on category
  const getCategoryIcon = (cat?: string) => {
    if (cat === 'Здоровье') return '🏃';
    if (cat === 'Опыт на камеру') return '📹';
    if (cat === 'Теория') return '📚';
    if (cat === 'Практика Frontend') return '💻';
    return '⭐';
  };

  return (
    <div className={styles.matrixCard}>
      {/* Card Header */}
      <div className={styles.cardHeader}>
        <div className={styles.iconBadge}>
          {getCategoryIcon(task.category)}
        </div>
        <div className={styles.headerText}>
          <span className={styles.taskTitle}>{task.title}</span>
          <span className={styles.categoryBadge}>
            🏷 {task.category} • {currentCount}/{targetCount} повторений
          </span>
        </div>
      </div>

      {/* Grid Display */}
      {viewMode === '7' ? (
        <div className={styles.grid7}>
          {gridCells.map((cell) => (
            <div
              key={cell.date}
              className={`${styles.gridCell7} ${cell.isDone ? styles.gridCell7Done : ''}`}
              title={`${cell.date}: ${cell.isDone ? 'Выполнено' : 'Пропущено'}`}
            >
              {cell.dayNum}
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.matrixGrid}>
          {gridCells.map((cell) => (
            <div
              key={cell.date}
              className={`${styles.matrixDot} ${cell.isDone ? styles.matrixDotDone : ''}`}
              title={`${cell.date}: ${cell.isDone ? 'Выполнено' : 'Пропущено'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
