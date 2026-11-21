'use client';

import React, { useEffect, useState } from 'react';
import { SessionWordCard, useEnglishStore } from '@/entities/english';
import { EnglishTrainerModal } from '@/features/english-trainer';
import { ArrowRight } from 'lucide-react';
import { EnglishDayDoneModal } from './EnglishDayDoneModal';
import styles from './EnglishDailyWidget.module.css';

export const EnglishDailyWidget: React.FC = () => {
  const session = useEnglishStore((state) => state.session);
  const fetchSession = useEnglishStore((state) => state.fetchSession);
  const raiseDayGoal = useEnglishStore((state) => state.raiseDayGoal);
  const [isTrainerOpen, setIsTrainerOpen] = useState(false);
  const [isDayDoneOpen, setIsDayDoneOpen] = useState(false);
  const [trainerCards, setTrainerCards] = useState<SessionWordCard[] | null>(null);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const newCount = session?.newWords?.length ?? 0;
  const reviewCount = session?.reviewWords?.length ?? 0;
  const totalRemaining = newCount + reviewCount;
  const dailyLearned = session?.dailyLearnedCount ?? 0;
  const dailyTarget = session?.dailyTargetCount ?? 5;
  // Extra words requested from the panel raise the bar for today only, so the
  // counter follows the effective goal rather than the daily setting.
  const effectiveGoal = session?.effectiveGoalCount ?? dailyTarget;
  // The day is done only when nothing is left to study. Reading the queues
  // (instead of a stored flag) is what keeps "Учить" on the widget after extra
  // words are requested and the trainer is closed again.
  const isDone = totalRemaining === 0 && dailyLearned >= effectiveGoal;
  const learnedToday = session?.learnedTodayWords ?? [];

  const openTrainer = (cards: SessionWordCard[] | null = null) => {
    setTrainerCards(cards);
    setIsDayDoneOpen(false);
    setIsTrainerOpen(true);
  };

  const handleWidgetClick = () => {
    if (isDone) {
      setIsDayDoneOpen(true);
      return;
    }
    openTrainer();
  };

  // Ask the server for one more batch, then study exactly that batch. The goal
  // is persisted per date, so closing the trainer no longer loses the words.
  const handleLearnMore = async () => {
    await raiseDayGoal(dailyTarget);
    const fresh = useEnglishStore.getState().session;
    const cards = [...(fresh?.reviewWords ?? []), ...(fresh?.newWords ?? [])];
    openTrainer(cards.length > 0 ? cards : null);
  };

  return (
    <>
      <div
        className={`${styles.widgetCard} ${isDone ? styles.widgetCardDone : ''}`}
        onClick={handleWidgetClick}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleWidgetClick();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={isDone ? 'Открыть список слов, выученных сегодня' : 'Начать учить слова'}
      >
        <div className={styles.leftInfo}>
          <span className={styles.flagIcon}>🇬🇧</span>
          <div className={styles.textGroup}>
            <div className={styles.titleRow}>
              <h3 className={styles.widgetTitle}>Английский</h3>
              <span className={styles.progressCounterText}>
                {dailyLearned}/{effectiveGoal}
              </span>
              {session && session.streakDays > 0 && (
                <span className={styles.streakPill} title={`Серия: ${session.streakDays} дн. подряд`}>
                  🔥{session.streakDays}
                </span>
              )}
            </div>
            <p className={styles.statsSubtitle}>
              {isDone
                ? 'Отличная работа! • Нажми, чтобы увидеть слова'
                : `Осталось: ${totalRemaining} слов • ~${Math.max(2, Math.ceil(totalRemaining * 0.5))} мин`}
            </p>
          </div>
        </div>

        <div className={styles.actionsRight}>
          {isDone ? (
            <span className={styles.completedPill}>✓ Готово</span>
          ) : (
            <button
              type="button"
              className={styles.startBtn}
              onClick={(event) => {
                event.stopPropagation();
                openTrainer();
              }}
            >
              <span>Учить</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>

      <EnglishDayDoneModal
        isOpen={isDayDoneOpen}
        onClose={() => {
          setIsDayDoneOpen(false);
          fetchSession();
        }}
        words={learnedToday}
        dailyTarget={dailyTarget}
        onRepeatToday={() => openTrainer(learnedToday)}
        onLearnMore={handleLearnMore}
      />

      <EnglishTrainerModal
        isOpen={isTrainerOpen}
        startWithWords={trainerCards}
        onClose={() => {
          setIsTrainerOpen(false);
          setTrainerCards(null);
          // Refetch so the widget reflects whatever is still queued.
          fetchSession();
        }}
      />
    </>
  );
};
