'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Card, Typography, Progress } from '@/shared/ui';
import { useGoalStore } from '@/entities/goal';
import { useTopicStore } from '@/entities/topic';
import { useTaskStore } from '@/entities/task';
import { useMaterialStore } from '@/entities/material';
import { useRepeatCardStore } from '@/entities/repeat-card';
import { useActivityStore } from '@/entities/activity';
import { analyticsService } from '@/features/analytics';
import { TodayActivity } from '@/widgets/today-activity/ui/TodayActivity';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import styles from './StatisticsPage.module.css';

type TopicSortKey = 'progress' | 'title' | 'materials';

export const StatisticsPage: React.FC = () => {
  const { goals, fetchGoals } = useGoalStore();
  const { topics, fetchTopics } = useTopicStore();
  const { tasks, fetchTasks } = useTaskStore();
  const { materials, fetchMaterials } = useMaterialStore();
  const { cards, fetchCards } = useRepeatCardStore();
  const { logs, fetchLogs } = useActivityStore();

  const [topicSort, setTopicSort] = useState<TopicSortKey>('progress');

  useEffect(() => {
    fetchGoals();
    fetchTopics();
    fetchTasks();
    fetchMaterials();
    fetchCards();
    fetchLogs();
  }, [fetchGoals, fetchTopics, fetchTasks, fetchMaterials, fetchCards, fetchLogs]);

  const summary = useMemo(
    () => analyticsService.getSummaryStats(goals, topics, tasks, materials, cards),
    [goals, topics, tasks, materials, cards]
  );

  const goalStats = useMemo(
    () => analyticsService.getGoalProgressStats(goals, topics, tasks, materials),
    [goals, topics, tasks, materials]
  );

  const topicStats = useMemo(
    () => analyticsService.getTopicProgressStats(topics, tasks, materials),
    [topics, tasks, materials]
  );

  const fsrsStats = useMemo(
    () => analyticsService.getFsrsStats(cards),
    [cards]
  );

  const chartData = useMemo(
    () => analyticsService.getDailyChartData(tasks, materials, cards),
    [tasks, materials, cards]
  );

  const achievements = useMemo(
    () => analyticsService.getDynamicAchievements(goals, tasks, materials, cards),
    [goals, tasks, materials, cards]
  );

  const sortedTopicStats = useMemo(() => {
    return [...topicStats].sort((a, b) => {
      if (topicSort === 'progress') return b.progress - a.progress;
      if (topicSort === 'title') return a.topic.title.localeCompare(b.topic.title);
      if (topicSort === 'materials') return b.materialsCount - a.materialsCount;
      return 0;
    });
  }, [topicStats, topicSort]);

  const heatmapData = useMemo(() => {
    const cells = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      const tasksDone = tasks.filter((t) => t.status === 'Done' && t.completedAt?.startsWith(dateStr)).length;
      const matDone = materials.filter((m) => m.isCompleted && m.completedAt?.startsWith(dateStr)).length;
      const fsrsDone = cards.filter((c) => c.lastReviewedAt?.startsWith(dateStr)).length;
      const total = tasksDone + matDone + fsrsDone;

      cells.push({
        date: dateStr,
        dayNum: d.getDate(),
        count: total,
      });
    }
    return cells;
  }, [tasks, materials, cards]);

  return (
    <div className={styles.container}>
      {/* Header */}
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <Typography variant="h1">📊 Аналитика и Прогресс</Typography>
        <Typography variant="body" style={{ color: 'var(--color-text-muted)' }}>
          Глубокий анализ темпов развития, регулярности и памяти
        </Typography>
      </Card>

      {/* Summary Statistics Cards */}
      <div className={styles.summaryGrid}>
        <Card className={styles.statCard}>
          <div className={styles.statValue}>{summary.totalGoals}</div>
          <div className={styles.statLabel}>🏆 Всего целей</div>
        </Card>
        <Card className={styles.statCard}>
          <div className={styles.statValue}>{summary.totalTopics}</div>
          <div className={styles.statLabel}>🐘 Всего тем</div>
        </Card>
        <Card className={styles.statCard}>
          <div className={styles.statValue}>
            {summary.completedTasks}/{summary.totalTasks}
          </div>
          <div className={styles.statLabel}>✅ Выполнено задач</div>
        </Card>
        <Card className={styles.statCard}>
          <div className={styles.statValue}>
            {summary.completedMaterials}/{summary.totalMaterials}
          </div>
          <div className={styles.statLabel}>📚 Изучено материалов</div>
        </Card>
      </div>

      {/* Activity Chart */}
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <Typography variant="h2">📈 Продуктивность за 7 дней</Typography>
        <div style={{ width: '100%', height: 300 }}>
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
              <Legend />
              <Bar dataKey="Задачи" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Материалы" fill="var(--color-success)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Повторение" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Activity Heatmap (30 days) */}
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <Typography variant="h2">🔥 Календарь активности (последние 30 дней)</Typography>
        <Typography variant="caption" style={{ color: 'var(--color-text-muted)' }}>
          Интенсивность выполненных задач, изученных материалов и повторений
        </Typography>

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
              <div key={cell.date} className={cellClass} title={`${cell.date}: ${cell.count} действий`}>
                {cell.dayNum}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Section Grid: Goal Progress & Spaced Repetition Stats */}
      <div className={styles.sectionGrid}>
        {/* Goal Progress Breakdown */}
        <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Typography variant="h2">🏆 Прогресс целей ({goalStats.length})</Typography>

          {goalStats.length === 0 ? (
            <div style={{ color: 'var(--color-text-muted)', padding: 'var(--space-4)', textAlign: 'center' }}>
              🌱 У вас пока нет созданных целей.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {goalStats.map(({ goal, progress, topicsCount, materialsCount, tasksCount }) => (
                <div key={goal.id} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
                      {goal.title}
                    </span>
                    <span style={{ fontWeight: 'var(--font-weight-bold)', color: 'var(--color-accent)' }}>
                      {progress}%
                    </span>
                  </div>
                  <Progress value={progress} height={6} color={goal.color} />
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                    {topicsCount} тем • {materialsCount} материалов • {tasksCount} задач
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Spaced Repetition Analytics */}
        <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Typography variant="h2">🧠 Интервальное Повторение</Typography>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)' }}>
            <div style={{ padding: 'var(--space-3)', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'bold' }}>{fsrsStats.totalCards}</div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Всего карточек</div>
            </div>
            <div style={{ padding: 'var(--space-3)', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'bold', color: 'var(--color-warning)' }}>
                {fsrsStats.dueToday}
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>К повторению сегодня</div>
            </div>
            <div style={{ padding: 'var(--space-3)', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'bold', color: 'var(--color-accent)' }}>
                {fsrsStats.avgInterval} дн.
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Средний интервал</div>
            </div>
            <div style={{ padding: 'var(--space-3)', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'bold', color: 'var(--color-success)' }}>
                {fsrsStats.avgEaseFactor}
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Коэффициент прочности</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Moved Widget: Recent Activity Timeline */}
      <TodayActivity logs={logs} />

      {/* Dynamic Achievements */}
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <Typography variant="h2">🏅 Достижения и Вехи</Typography>

        <div className={styles.achievementsGrid}>
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`${styles.achievementCard} ${ach.isUnlocked ? styles.achievementCardUnlocked : ''}`}
            >
              <span style={{ fontSize: '28px', opacity: ach.isUnlocked ? 1 : 0.4 }}>{ach.icon}</span>
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <span
                  style={{
                    fontWeight: 'var(--font-weight-semibold)',
                    color: ach.isUnlocked ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                  }}
                >
                  {ach.title}
                </span>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                  {ach.description}
                </span>
                <span
                  style={{
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: 'bold',
                    marginTop: '4px',
                    color: ach.isUnlocked ? 'var(--color-success)' : 'var(--color-text-muted)',
                  }}
                >
                  {ach.isUnlocked ? '✓ Разблокировано' : ach.progressText}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
