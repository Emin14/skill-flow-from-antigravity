'use client';

import React, { useEffect, useState } from 'react';
import { useTaskStore } from '@/entities/task';
import { useGoalStore } from '@/entities/goal';
import { useTopicStore } from '@/entities/topic';
import { useMaterialStore } from '@/entities/material';
import { useRepeatCardStore } from '@/entities/repeat-card';
import { useActivityStore } from '@/entities/activity';
import { STORAGE_KEYS } from '@/shared/config/storageKeys';
import { getTodayStr } from '@/shared/lib/dateUtils';
import { DaySwitcherShowcase } from '@/features/day-switcher-showcase/ui/DaySwitcherShowcase';

import { DailyQuoteWidget } from '@/widgets/daily-quote/ui/DailyQuoteWidget';
import { HabitProgressBanner } from '@/widgets/habit-progress-banner/ui/HabitProgressBanner';
import { TodayTasks } from '@/widgets/today-tasks/ui/TodayTasks';
import styles from './TodayPage.module.css';

export const TodayPage: React.FC = () => {
  const fetchTasks = useTaskStore((s) => s.fetchTasks);
  const fetchGoals = useGoalStore((s) => s.fetchGoals);
  const fetchTopics = useTopicStore((s) => s.fetchTopics);
  const fetchMaterials = useMaterialStore((s) => s.fetchMaterials);
  const fetchCards = useRepeatCardStore((s) => s.fetchCards);
  const fetchLogs = useActivityStore((s) => s.fetchLogs);

  const [daySwitcherVariant, setDaySwitcherVariant] = useState<'12' | '19'>('12');
  const [selectedDate, setSelectedDate] = useState<string>(getTodayStr());

  useEffect(() => {
    fetchTasks();
    fetchGoals();
    fetchTopics();
    fetchMaterials();
    fetchCards();
    fetchLogs();

    const savedVariant = (localStorage.getItem(STORAGE_KEYS.DAY_SWITCHER_VARIANT) || '12') as '12' | '19';
    setDaySwitcherVariant(savedVariant);

    const handleStorageChange = () => {
      const updatedVariant = (localStorage.getItem(STORAGE_KEYS.DAY_SWITCHER_VARIANT) || '12') as '12' | '19';
      setDaySwitcherVariant(updatedVariant);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [fetchTasks, fetchGoals, fetchTopics, fetchMaterials, fetchCards, fetchLogs]);

  return (
    <div className={styles.container}>
      {/* 1. Daily Motivational Quote Widget (Variant #15 - Minimalist Caption) */}
      <DailyQuoteWidget />

      {/* 2. 1st Top Widget: Day Switcher Ribbon */}
      <DaySwitcherShowcase
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        variant={daySwitcherVariant}
      />

      {/* 3. 2nd Top Widget: Primary Dashboard Banner ("Время покорять вершины!") */}
      <HabitProgressBanner />

      {/* 4. Main Today Tasks Board */}
      <TodayTasks showDaySwitcher={false} />
    </div>
  );
};
