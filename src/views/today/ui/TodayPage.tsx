'use client';

import React, { useEffect, useCallback, useMemo } from 'react';
import { Card, Typography, Progress } from '@/shared/ui';
import { useTaskStore } from '@/entities/task';
import { useGoalStore } from '@/entities/goal';
import { useTopicStore } from '@/entities/topic';
import { useMaterialStore } from '@/entities/material';
import { useRepeatCardStore } from '@/entities/repeat-card';
import { useActivityStore } from '@/entities/activity';
import { TaskPriority } from '@/entities/task/model/types';

import { TodaySummary } from '@/widgets/today-summary/ui/TodaySummary';
import { TodayTasks } from '@/widgets/today-tasks/ui/TodayTasks';
import styles from './TodayPage.module.css';

export const TodayPage: React.FC = () => {
  // Store selectors & actions
  const tasks = useTaskStore((s) => s.tasks);
  const fetchTasks = useTaskStore((s) => s.fetchTasks);
  const addTask = useTaskStore((s) => s.addTask);
  const toggleTaskStatus = useTaskStore((s) => s.toggleTaskStatus);
  const deleteTask = useTaskStore((s) => s.deleteTask);

  const goals = useGoalStore((s) => s.goals);
  const fetchGoals = useGoalStore((s) => s.fetchGoals);

  const topics = useTopicStore((s) => s.topics);
  const fetchTopics = useTopicStore((s) => s.fetchTopics);

  const materials = useMaterialStore((s) => s.materials);
  const fetchMaterials = useMaterialStore((s) => s.fetchMaterials);

  const cards = useRepeatCardStore((s) => s.cards);
  const fetchCards = useRepeatCardStore((s) => s.fetchCards);
  const getDueCards = useRepeatCardStore((s) => s.getDueCards);

  const fetchLogs = useActivityStore((s) => s.fetchLogs);
  const logActivity = useActivityStore((s) => s.logActivity);

  useEffect(() => {
    fetchTasks();
    fetchGoals();
    fetchTopics();
    fetchMaterials();
    fetchCards();
    fetchLogs();
  }, [fetchTasks, fetchGoals, fetchTopics, fetchMaterials, fetchCards, fetchLogs]);

  // Performance optimizations using useMemo & useCallback
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const dueCards = useMemo(() => getDueCards(), [cards, getDueCards]);

  const tasksCompletedToday = useMemo(
    () => tasks.filter((t) => t.status === 'Done' && t.completedAt?.startsWith(todayStr)).length,
    [tasks, todayStr]
  );

  const materialsCompletedToday = useMemo(
    () => materials.filter((m) => m.isCompleted && m.completedAt?.startsWith(todayStr)).length,
    [materials, todayStr]
  );

  const cardsReviewedToday = useMemo(
    () => cards.filter((c) => c.lastReviewedAt?.startsWith(todayStr)).length,
    [cards, todayStr]
  );

  const totalTasksCount = tasks.length;
  const doneTasksCount = tasks.filter((t) => t.status === 'Done').length;
  const progressPercent = totalTasksCount > 0 ? Math.round((doneTasksCount / totalTasksCount) * 100) : 0;

  const handleAddTask = useCallback(
    async (title: string, priority: TaskPriority) => {
      await addTask(title, priority);
      await logActivity('task_created', `Добавлена задача: "${title}"`);
    },
    [addTask, logActivity]
  );

  const handleToggleTask = useCallback(
    async (id: string) => {
      const task = tasks.find((t) => t.id === id);
      await toggleTaskStatus(id);
      if (task && task.status !== 'Done') {
        await logActivity('task_completed', `Выполнена задача: "${task.title}"`);
      }
    },
    [tasks, toggleTaskStatus, logActivity]
  );

  const handleDeleteTask = useCallback(
    async (id: string) => {
      await deleteTask(id);
    },
    [deleteTask]
  );

  return (
    <div className={styles.container}>
      {/* Header Progress Card & Personal Streak Stats */}
      <Card className={styles.headerCard}>
        <div className={styles.headerRow}>
          <div>
            <Typography variant="h1">☀️ Главный Дашборд</Typography>
            <Typography variant="body" style={{ color: 'var(--color-text-muted)', marginTop: '4px' }}>
              {new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
            </Typography>
          </div>
          <div style={{ textAlign: 'right' }}>
            <Typography variant="h1" style={{ color: 'var(--color-accent)' }}>
              {progressPercent}%
            </Typography>
            <Typography variant="caption">
              {doneTasksCount} из {totalTasksCount} задач выполнено
            </Typography>
          </div>
        </div>

        <Progress value={progressPercent} height={8} />

        {/* Personal Streak Stats */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            gap: 'var(--space-3)',
            marginTop: 'var(--space-3)',
            padding: 'var(--space-3)',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--color-border)',
            flexWrap: 'wrap',
          }}
        >
          <div>
            🔥 <strong style={{ color: 'var(--color-warning)' }}>12 дней</strong> серия
          </div>
          <div>
            ✅ <strong>{tasksCompletedToday}</strong> задач сегодня
          </div>
          <div>
            📚 <strong>{materialsCompletedToday}</strong> материалов сегодня
          </div>
          <div>
            🧠 <strong>{cardsReviewedToday}</strong> повторений
          </div>
        </div>
      </Card>

      {/* Widget 1: Today Summary */}
      <TodaySummary
        goalsCount={goals.length}
        activeTopicsCount={topics.length}
        materialsCount={materials.length}
        fsrsCardsCount={cards.length}
        tasksCompletedToday={tasksCompletedToday}
      />

      {/* Main Focus: 🎯 На сегодня (Tasks + Due Repeat Cards) */}
      <TodayTasks
        tasks={tasks}
        topics={topics}
        dueCardsCount={dueCards.length}
        onAddTask={handleAddTask}
        onToggleTask={handleToggleTask}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  );
};
