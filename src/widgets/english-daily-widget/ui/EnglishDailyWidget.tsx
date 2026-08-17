'use client';

import React, { useEffect, useState } from 'react';
import { useEnglishStore } from '@/entities/english';
import { EnglishTrainerModal } from '@/features/english-trainer';
import styles from './EnglishDailyWidget.module.css';

export const EnglishDailyWidget: React.FC = () => {
  const { session, isLoadingSession, fetchSession } = useEnglishStore();
  const [isTrainerOpen, setIsTrainerOpen] = useState(false);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const newCount = session?.newWords?.length ?? 0;
  const reviewCount = session?.reviewWords?.length ?? 0;
  const totalRemaining = newCount + reviewCount;
  const dailyLearned = session?.dailyLearnedCount ?? 0;
  const dailyTarget = session?.dailyTargetCount ?? 5;
  const isDone = session?.isCompletedToday || totalRemaining === 0;

  return (
    <>
      <div className={styles.widgetCard}>
        <div className={styles.leftInfo}>
          <span className={styles.flagIcon}>🇬🇧</span>
          <div className={styles.textGroup}>
            <div className={styles.titleRow}>
              <h3 className={styles.widgetTitle}>Английский</h3>
              {/* Daily Progress Badge (e.g. 2/5) */}
              <span className={styles.progressCounterPill}>
                {dailyLearned}/{dailyTarget} выучено
              </span>
              {session && session.streakDays > 0 && (
                <span className={styles.streakPill}>🔥 {session.streakDays} дн.</span>
              )}
            </div>
            <p className={styles.statsSubtitle}>
              {isDone
                ? `Выполнено на сегодня! (Всего выучено: ${session?.totalLearned || 0} слов)`
                : `Осталось выучить: ${totalRemaining} слов • ~${Math.max(2, Math.ceil(totalRemaining * 0.5))} мин`}
            </p>
          </div>
        </div>

        <div className={styles.actionsRight}>
          {isDone ? (
            <span className={styles.completedPill}>✓ Выполнено</span>
          ) : (
            <button
              className={styles.startBtn}
              onClick={() => setIsTrainerOpen(true)}
            >
              <span>▶</span>
              <span>Учить ({totalRemaining})</span>
            </button>
          )}
        </div>
      </div>

      <EnglishTrainerModal
        isOpen={isTrainerOpen}
        onClose={() => {
          setIsTrainerOpen(false);
          fetchSession();
        }}
      />
    </>
  );
};
