'use client';

import React, { useEffect, useState } from 'react';
import { useEnglishStore } from '@/entities/english';
import { EnglishTrainerModal } from '@/features/english-trainer';
import { RotateCcw } from 'lucide-react';
import styles from './EnglishDailyWidget.module.css';

export const EnglishDailyWidget: React.FC = () => {
  const { session, isLoadingSession, fetchSession, resetTodayProgress } = useEnglishStore();
  const [isTrainerOpen, setIsTrainerOpen] = useState(false);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const newCount = session?.newWords?.length ?? 0;
  const reviewCount = session?.reviewWords?.length ?? 0;
  const totalRemaining = newCount + reviewCount;
  const dailyLearned = session?.dailyLearnedCount ?? 0;
  const dailyTarget = session?.dailyTargetCount ?? 5;
  const isDone = session?.isCompletedToday || (totalRemaining === 0 && dailyLearned > 0);

  const handleResetToday = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await resetTodayProgress();
  };

  return (
    <>
      <div className={styles.widgetCard}>
        <div className={styles.leftInfo}>
          <span className={styles.flagIcon}>🇬🇧</span>
          <div className={styles.textGroup}>
            <div className={styles.titleRow}>
              <h3 className={styles.widgetTitle}>Английский</h3>
              <span className={styles.progressCounterPill}>
                {dailyLearned}/{dailyTarget}
              </span>
              {session && session.streakDays > 0 && (
                <span className={styles.streakPill} title={`Серия: ${session.streakDays} дн. подряд`}>
                  🔥{session.streakDays}
                </span>
              )}
            </div>
            <p className={styles.statsSubtitle}>
              {isDone
                ? `Выполнено! (${session?.totalLearned || 0} слов)`
                : `Осталось: ${totalRemaining} • ~${Math.max(2, Math.ceil(totalRemaining * 0.5))} мин`}
            </p>
          </div>
        </div>

        <div className={styles.actionsRight}>
          {isDone ? (
            <div className={styles.completedGroup}>
              <span className={styles.completedPill}>✓ Готово</span>
              <button
                className={styles.resetBtn}
                onClick={handleResetToday}
                title="Сбросить прогресс за сегодня и пройти 5 слов заново"
              >
                <RotateCcw size={12} />
                <span>Заново</span>
              </button>
            </div>
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
