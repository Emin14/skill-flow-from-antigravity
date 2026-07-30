'use client';

import React, { useEffect, useMemo } from 'react';
import { Card, Typography } from '@/shared/ui';
import { useTaskStore } from '@/entities/task';
import { useActivityStore } from '@/entities/activity';
import { TodayActivity } from '@/widgets/today-activity/ui/TodayActivity';
import { TASK_CATEGORIES } from '@/shared/config/categories';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import styles from './StatisticsPage.module.css';

export const StatisticsPage: React.FC = () => {
  const { tasks, fetchTasks } = useTaskStore();
  const { logs, fetchLogs } = useActivityStore();

  useEffect(() => {
    fetchTasks();
    fetchLogs();
  }, [fetchTasks, fetchLogs]);

  // Category completion statistics (only showing completed count)
  const categoryStats = useMemo(() => {
    return TASK_CATEGORIES.map((cat) => {
      const completedCount = tasks.filter((t) => t.category === cat && t.status === 'Done').length;
      return {
        category: cat,
        completedCount,
      };
    });
  }, [tasks]);

  // 7-day Task completion chart data
  const chartData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric' });

      const tasksDone = tasks.filter((t) => t.status === 'Done' && t.completedAt?.startsWith(dateStr)).length;

      days.push({
        day: dayLabel,
        'Выполнено задач': tasksDone,
      });
    }
    return days;
  }, [tasks]);

  // 30-day Activity Heatmap data
  const heatmapData = useMemo(() => {
    const cells = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      const tasksDone = tasks.filter((t) => t.status === 'Done' && t.completedAt?.startsWith(dateStr)).length;

      cells.push({
        date: dateStr,
        dayNum: d.getDate(),
        count: tasksDone,
      });
    }
    return cells;
  }, [tasks]);

  const totalDoneTasks = useMemo(() => {
    return tasks.filter((t) => t.status === 'Done').length;
  }, [tasks]);

  return (
    <div className={styles.container}>
      {/* Header */}
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <Typography variant="h1">📊 Аналитика Задач</Typography>
        <Typography variant="body" style={{ color: 'var(--color-text-muted)' }}>
          Статистика выполненных задач по категориям, динамика и регулярность
        </Typography>
      </Card>

      {/* Category Accomplishment Statistics - 2 Items Per Row */}
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          <Typography variant="h2">🏷 Выполнено задач по категориям</Typography>
          <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'bold', color: 'var(--color-success)' }}>
            Всего: {totalDoneTasks} ✅
          </span>
        </div>

        {/* Strictly 2 Columns Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 'var(--space-3)',
            width: '100%',
          }}
        >
          {categoryStats.map(({ category, completedCount }) => (
            <div
              key={category}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                padding: '16px 18px',
                borderRadius: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--color-border)',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ fontSize: '12px', color: '#818cf8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                🏷 {category}
              </div>
              <div style={{ fontSize: '26px', fontWeight: '800', color: '#10b981', lineHeight: '1.2' }}>
                {completedCount}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                выполнено задач
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 7-day Task Productivity Chart */}
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <Typography variant="h2">📈 Продуктивность за 7 дней</Typography>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="day" stroke="var(--color-text-muted)" />
              <YAxis stroke="var(--color-text-muted)" allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                }}
              />
              <Bar dataKey="Выполнено задач" fill="var(--color-success)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 30-day Activity Heatmap */}
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <Typography variant="h2">🔥 Календарь выполненных задач (30 дней)</Typography>

        <div className={styles.heatmapGrid}>
          {heatmapData.map((cell) => {
            const cellClass =
              cell.count === 0
                ? styles.heatmapCell
                : cell.count <= 2
                ? `${styles.heatmapCell} ${styles.heatmapCellLow}`
                : cell.count <= 5
                ? `${styles.heatmapCell} ${styles.heatmapCellMed}`
                : `${styles.heatmapCell} ${styles.heatmapCellHigh}`;

            return (
              <div key={cell.date} className={cellClass} title={`${cell.date}: ${cell.count} задач`}>
                {cell.dayNum}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Recent Activity Timeline */}
      <TodayActivity logs={logs} />
    </div>
  );
};
