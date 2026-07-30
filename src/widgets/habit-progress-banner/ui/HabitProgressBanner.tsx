'use client';

import React from 'react';
import { useTaskStore } from '@/entities/task';
import styles from './HabitProgressBanner.module.css';

export const HabitProgressBanner: React.FC = () => {
  const tasks = useTaskStore((s) => s.tasks);
  const todayStr = new Date().toISOString().split('T')[0];

  const todayTasks = tasks.filter(
    (t) => t.scheduledDate === todayStr || t.completedAt?.startsWith(todayStr)
  );

  const totalCount = todayTasks.length;
  const doneCount = todayTasks.filter((t) => t.status === 'Done').length;
  const percent = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 100;

  const isAllCompleted = totalCount > 0 && doneCount === totalCount;

  const titleText = isAllCompleted
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
