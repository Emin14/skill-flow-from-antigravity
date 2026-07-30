'use client';

import React, { useEffect } from 'react';
import { useTaskStore } from '@/entities/task';
import { useGoalStore } from '@/entities/goal';
import { useTopicStore } from '@/entities/topic';
import { useMaterialStore } from '@/entities/material';
import { useRepeatCardStore } from '@/entities/repeat-card';
import { useActivityStore } from '@/entities/activity';

import { TodayTasks } from '@/widgets/today-tasks/ui/TodayTasks';
import { HabitProgressBanner } from '@/widgets/habit-progress-banner/ui/HabitProgressBanner';
import styles from './TodayPage.module.css';

export const TodayPage: React.FC = () => {
  const fetchTasks = useTaskStore((s) => s.fetchTasks);
  const fetchGoals = useGoalStore((s) => s.fetchGoals);
  const fetchTopics = useTopicStore((s) => s.fetchTopics);
  const fetchMaterials = useMaterialStore((s) => s.fetchMaterials);
  const fetchCards = useRepeatCardStore((s) => s.fetchCards);
  const fetchLogs = useActivityStore((s) => s.fetchLogs);

  useEffect(() => {
    fetchTasks();
    fetchGoals();
    fetchTopics();
    fetchMaterials();
    fetchCards();
    fetchLogs();
  }, [fetchTasks, fetchGoals, fetchTopics, fetchMaterials, fetchCards, fetchLogs]);

  return (
    <div className={styles.container}>
      {/* Primary Top Header Dashboard Banner */}
      <HabitProgressBanner />

      {/* Main Focus: 🎯 На сегодня — Vertical Mobile Kanban */}
      <TodayTasks />
    </div>
  );
};
