'use client';

import React, { useEffect, useMemo } from 'react';
import { Card, Typography } from '@/shared/ui';
import { useTaskStore } from '@/entities/task';
import { useActivityStore } from '@/entities/activity';
import { TodayActivity } from '@/widgets/today-activity/ui/TodayActivity';
import { TASK_CATEGORIES, TaskCategory } from '@/shared/config/categories';
import { Task } from '@/entities/task/model/types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import styles from './StatisticsPage.module.css';

interface CompletionEvent {
  taskId: string;
  category: TaskCategory;
  dateStr: string;
}

// Helper: Calculate combined completion events from active completed tasks AND repetitionHistory
const getCombinedCompletionEvents = (allTasks: Task[]): CompletionEvent[] => {
  const events: CompletionEvent[] = [];

  allTasks.forEach((t) => {
    // 1. Current completed task instance
    if (t.status === 'Done') {
      const dateStr = t.completedAt ? t.completedAt.split('T')[0] : t.scheduledDate;
      if (dateStr) {
        events.push({
          taskId: t.id,
          category: t.category || 'Задача',
          dateStr,
        });
      }
    }

    // 2. Historical repetition records from repetitionHistory
    if (t.repetitionHistory && t.repetitionHistory.length > 0) {
      t.repetitionHistory.forEach((record) => {
        if (record.date) {
          const currentDate = t.completedAt ? t.completedAt.split('T')[0] : t.scheduledDate;
          // Avoid double counting if current completedAt matches this record's date
          if (t.status === 'Done' && record.date === currentDate) {
            return;
          }
          events.push({
            taskId: t.id,
            category: t.category || 'Задача',
            dateStr: record.date,
          });
        }
      });
    }
  });

  return events;
};

export const StatisticsPage: React.FC = () => {
  const { tasks, fetchTasks } = useTaskStore();
  const { logs, fetchLogs } = useActivityStore();

  useEffect(() => {
    fetchTasks();
    fetchLogs();
  }, [fetchTasks, fetchLogs]);

  // Combined completion events (active completed tasks + repetitionHistory)
  const allCompletionEvents = useMemo(() => getCombinedCompletionEvents(tasks), [tasks]);
  const totalDoneTasks = useMemo(() => allCompletionEvents.length, [allCompletionEvents]);

  // Category completion statistics
  const categoryStats = useMemo(() => {
    return TASK_CATEGORIES.map((cat) => {
      const completedCount = allCompletionEvents.filter((ev) => ev.category === cat).length;
      return {
        category: cat,
        completedCount,
      };
    });
  }, [allCompletionEvents]);

  // 7-day Task completion chart data
  const chartData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric' });

      const tasksDone = allCompletionEvents.filter((ev) => ev.dateStr === dateStr).length;

      days.push({
        day: dayLabel,
        'Выполнено задач': tasksDone,
      });
    }
    return days;
  }, [allCompletionEvents]);

  // 30-day Activity Heatmap data
  const heatmapData = useMemo(() => {
    const cells = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      const tasksDone = allCompletionEvents.filter((ev) => ev.dateStr === dateStr).length;

      cells.push({
        date: dateStr,
        dayNum: d.getDate(),
        count: tasksDone,
      });
    }
    return cells;
  }, [allCompletionEvents]);

  // Real Streak: consecutive days with at least 1 completion event
  const currentStreak = useMemo(() => {
    const daysWithActivity = new Set(allCompletionEvents.map((ev) => ev.dateStr));
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      if (daysWithActivity.has(dateStr)) {
        streak++;
      } else {
        // Allow today to have 0 (don't break if today not done yet)
        if (i === 0) continue;
        break;
      }
    }
    return streak;
  }, [allCompletionEvents]);

  return (
    <div className={styles.container}>
      {/* 2 Key Metric Widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', width: '100%' }}>
        {/* Widget 1: Completed Tasks & Growth Badge */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            padding: '16px 18px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.14) 0%, rgba(16, 185, 129, 0.03) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
          }}
        >
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
            Выполнено
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '32px', fontWeight: 800, color: '#10b981', lineHeight: 1 }}>
              {totalDoneTasks}
            </span>
            <span
              style={{
                fontSize: '11.5px',
                fontWeight: 700,
                color: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.18)',
                padding: '2px 8px',
                borderRadius: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              ↑ +35%
            </span>
          </div>
          <div style={{ fontSize: '10.5px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            к прошлой неделе
          </div>
        </div>

        {/* Widget 2: Habit Streak */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            padding: '16px 18px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.14) 0%, rgba(249, 115, 22, 0.03) 100%)',
            border: '1px solid rgba(249, 115, 22, 0.25)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
          }}
        >
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
            Серия активности
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '28px', lineHeight: 1 }}>🔥</span>
            <span style={{ fontSize: '22px', fontWeight: 800, color: '#f97316', lineHeight: 1 }}>
              {currentStreak} {currentStreak === 1 ? 'день' : currentStreak >= 2 && currentStreak <= 4 ? 'дня' : 'дней'}
            </span>
          </div>
          <div style={{ fontSize: '10.5px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            подряд без пропусков
          </div>
        </div>
      </div>

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
                backgroundColor: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                transition: 'all var(--transition-fast)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  🏷 {category}
                </span>
                <span style={{ fontSize: '15px', fontWeight: 800, color: '#10b981' }}>
                  {completedCount}
                </span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                {completedCount === 1 ? '1 выполнена' : `${completedCount} выполнено`}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 7-Day Completion Bar Chart */}
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <Typography variant="h2">📊 Динамика выполнения за 7 дней</Typography>
        <div style={{ width: '100%', height: 220, marginTop: 'var(--space-2)' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="day" stroke="var(--color-text-muted)" fontSize={11} tickLine={false} />
              <YAxis stroke="var(--color-text-muted)" fontSize={11} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                  borderRadius: '12px',
                  color: 'var(--color-text-primary)',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="Выполнено задач" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 30-Day Activity Heatmap */}
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h2">📅 Календарь активности (30 дней)</Typography>
          <Typography variant="caption" style={{ color: 'var(--color-text-muted)' }}>
            Интенсивность
          </Typography>
        </div>

        <div className={styles.heatmapGrid}>
          {heatmapData.map((cell) => {
            let bg = 'rgba(255, 255, 255, 0.04)';
            let borderColor = 'var(--color-border)';

            if (cell.count === 1) {
              bg = 'rgba(16, 185, 129, 0.25)';
              borderColor = 'rgba(16, 185, 129, 0.4)';
            } else if (cell.count === 2) {
              bg = 'rgba(16, 185, 129, 0.5)';
              borderColor = 'rgba(16, 185, 129, 0.7)';
            } else if (cell.count >= 3) {
              bg = '#10b981';
              borderColor = '#10b981';
            }

            return (
              <div
                key={cell.date}
                className={styles.heatmapCell}
                style={{ backgroundColor: bg, borderColor }}
                title={`${cell.date}: ${cell.count} выполнено`}
              >
                {cell.dayNum}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Today Activity List */}
      <TodayActivity logs={logs} />
    </div>
  );
};
