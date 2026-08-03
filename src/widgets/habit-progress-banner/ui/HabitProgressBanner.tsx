'use client';

import React from 'react';
import { useTaskStore } from '@/entities/task';
import { getTodayStr } from '@/shared/lib/dateUtils';
import styles from './HabitProgressBanner.module.css';

export const HabitProgressBanner: React.FC = () => {
  const tasks = useTaskStore((s) => s.tasks);
  const todayStr = getTodayStr();

  // Strictly filter ALL tasks for TODAY (both regular and repeating, without sub-division)
  const todayTasks = tasks.filter((t) => {
    if (t.isRepeating) {
      return t.occurrences?.some((o) => o.date === todayStr) || (t.scheduledDate && t.scheduledDate === todayStr);
    }
    if (!t.scheduledDate || t.scheduledDate === '' || t.scheduledDate === 'anytime') return false;
    return t.scheduledDate === todayStr;
  });

  // Calculate status for each today task
  const isTaskDoneForToday = (t: typeof tasks[0]): boolean => {
    if (t.isRepeating) {
      const occ = t.occurrences?.find((o) => o.date === todayStr);
      if (occ) return occ.status === 'Done';
      const legacyOcc = t.repetitionHistory?.find((h) => h.date === todayStr);
      if (legacyOcc) return legacyOcc.completed;
      return false;
    }
    return t.status === 'Done';
  };

  const totalCount = todayTasks.length;
  const doneCount = todayTasks.filter((t) => isTaskDoneForToday(t)).length;
  const percent = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  const isAllCompleted = totalCount > 0 && doneCount === totalCount;

  const titleText = totalCount === 0
    ? 'На сегодня нет запланированных задач ☕'
    : isAllCompleted
    ? 'Отличная работа! Все задачи выполнены 🚀'
    : percent > 0
    ? 'В процессе выполнения задач! 💪'
    : 'Время покорять новые вершины! ⚡';

  return (
    <div className={`${styles.banner} ${!isAllCompleted ? styles.bannerPartial : ''}`}>
      {/* Percentage Circle Ring */}
      <div className={`${styles.circleRing} ${!isAllCompleted ? styles.circleRingPartial : ''}`}>
        {percent}%
      </div>

      {/* Text Group */}
      <div className={styles.textGroup}>
        <span className={styles.title}>{titleText}</span>
        <span className={`${styles.subtitle} ${!isAllCompleted ? styles.subtitlePartial : ''}`}>
          {doneCount} из {totalCount} выполнено
        </span>
      </div>
    </div>
  );
};
