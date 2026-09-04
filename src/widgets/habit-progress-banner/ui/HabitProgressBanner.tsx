'use client';

import React, { useState, useEffect } from 'react';
import { useTaskStore } from '@/entities/task';
import { getTodayStr } from '@/shared/lib/dateUtils';
import { STORAGE_KEYS } from '@/shared/config/storageKeys';
import styles from './HabitProgressBanner.module.css';

interface HabitProgressBannerProps {
  targetDate?: string;
}

export const HabitProgressBanner: React.FC<HabitProgressBannerProps> = ({ targetDate }) => {
  const tasks = useTaskStore((s) => s.tasks);
  const activeDateStr = targetDate || getTodayStr();

  const [activeVariant, setActiveVariant] = useState<string>('1');

  useEffect(() => {
    const loadVariant = () => {
      const saved = localStorage.getItem(STORAGE_KEYS.HABIT_BANNER_VARIANT) || '1';
      setActiveVariant(saved);
    };

    loadVariant();
    window.addEventListener('storage', loadVariant);
    return () => window.removeEventListener('storage', loadVariant);
  }, []);

  // Strictly filter ALL tasks for TODAY / targetDate (both regular and repeating, excluding parent container tasks)
  const todayTasks = tasks.filter((t) => {
    if (t.excludeFromStats) return false;
    const hasChildren = tasks.some((sub) => sub.parentTaskId === t.id);
    if (t.hasSubtasks || hasChildren) return false;

    if (t.isRepeating) {
      if (t.occurrences && t.occurrences.length > 0) {
        return t.occurrences.some((o) => o.date === activeDateStr);
      }
      return t.scheduledDate === activeDateStr;
    }
    if (!t.scheduledDate || t.scheduledDate === '' || t.scheduledDate === 'anytime') return false;
    return t.scheduledDate === activeDateStr;
  });

  const isTaskDoneForToday = (t: typeof tasks[0]): boolean => {
    if (t.isRepeating) {
      const occ = t.occurrences?.find((o) => o.date === activeDateStr);
      if (occ) return occ.status === 'Done';
      const legacyOcc = t.repetitionHistory?.find((h) => h.date === activeDateStr);
      if (legacyOcc) return legacyOcc.completed;
      return false;
    }
    return t.status === 'Done';
  };

  const totalCount = todayTasks.length;
  const doneCount = todayTasks.filter((t) => isTaskDoneForToday(t)).length;
  const percent = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
  const remainingCount = Math.max(0, totalCount - doneCount);

  const titleText = totalCount === 0
    ? 'На сегодня нет запланированных задач ☕'
    : percent === 100
    ? 'Отличная работа! Все задачи выполнены 🚀'
    : percent > 0
    ? 'В процессе выполнения задач! 💪'
    : 'Время покорять новые вершины! ⚡';

  // Render strictly the chosen theme-adaptive variant (1 to 5)
  switch (activeVariant) {
    // Variant 2: Метрическая панель
    case '2':
      return (
        <div className={styles.variant2}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{titleText}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              Прогресс дня: {doneCount} из {totalCount}
            </div>
            <div className={styles.v2BarContainer}>
              <div style={{ height: '100%', width: `${percent}%`, background: 'var(--color-accent)', borderRadius: '3px', transition: 'width 0.4s ease' }} />
            </div>
          </div>
          <div className={styles.v2Pill}>{percent}%</div>
        </div>
      );

    // Variant 3: Изумрудно-акцентная панель
    case '3':
      return (
        <div className={styles.variant3}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{titleText}</div>
              <div style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                Выполнено {doneCount} из {totalCount} задач
              </div>
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-accent)' }}>{percent}%</div>
          </div>
          <div className={styles.v3Track}>
            <div className={styles.v3Fill} style={{ width: `${percent}%` }} />
          </div>
        </div>
      );

    // Variant 4: Кольцо активности Apple Style
    case '4':
      return (
        <div className={styles.variant4}>
          <svg className={styles.v4SvgRing} viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="var(--color-border)"
              strokeWidth="3.8"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="3.8"
              strokeDasharray={`${percent}, 100`}
              strokeLinecap="round"
            />
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{titleText}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
              {doneCount} из {totalCount} ({percent}%)
            </div>
            <div style={{ width: '100%', height: '5px', background: 'var(--color-border)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${percent}%`, height: '100%', background: 'var(--color-accent)', borderRadius: '3px', transition: 'width 0.4s ease' }} />
            </div>
          </div>
        </div>
      );

    // Variant 5: Геймифицированная полоса XP
    case '5':
      return (
        <div className={styles.variant5}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-accent-text)' }}>⚡ {titleText}</span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-accent-text)' }}>{percent}% XP</span>
          </div>
          <div className={styles.v5XpTrack}>
            <div className={styles.v5XpFill} style={{ width: `${percent}%` }} />
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', textAlign: 'right' }}>
            {doneCount}/{totalCount} задач • Осталось: {remainingCount}
          </div>
        </div>
      );

    // Variant 6: 🎯 Прогресс за день (XP-трекер сложного процента)
    case '6': {
      const dailyGainNum = (doneCount * 0.2).toFixed(1);
      const neededTasks = Math.max(0, 5 - doneCount);
      const isTargetMet = doneCount >= 5;
      const progressPercent = Math.min(100, (Number(dailyGainNum) / 1.0) * 100);
      const annualMult = Math.pow(1 + Number(dailyGainNum) / 100, 365);
      const formattedPace = doneCount === 0 ? '1.0x' : annualMult >= 100 ? `${Math.round(annualMult)}x` : `${annualMult.toFixed(1)}x`;

      const getTaskWord = (c: number) => {
        const abs = Math.abs(c) % 100;
        const lastDigit = abs % 10;
        if (abs > 10 && abs < 20) return 'задач';
        if (lastDigit === 1) return 'задача';
        if (lastDigit >= 2 && lastDigit <= 4) return 'задачи';
        return 'задач';
      };

      let subtitleText = '';
      if (doneCount === 0) {
        subtitleText = 'Сейчас ты растёшь с темпом 1.0x за год. Ещё 5 задач сегодня, чтобы достичь развития в 37.8x!';
      } else if (isTargetMet) {
        subtitleText = `🔥 Отлично! Твой текущий темп — ${formattedPace} за год. Цель развития в 37.8x достигнута!`;
      } else {
        subtitleText = `Сейчас ты растёшь с темпом ${formattedPace} за год. Ещё ${neededTasks} ${getTaskWord(neededTasks)} сегодня, чтобы достичь развития в 37.8x!`;
      }

      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            padding: '14px 16px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, var(--color-surface) 0%, rgba(16, 185, 129, 0.05) 100%)',
            border: '1px solid var(--color-border)',
            boxSizing: 'border-box',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                🎯 Прогресс за день
              </span>
            </div>
            <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#10b981' }}>
              +{dailyGainNum}% XP
            </span>
          </div>

          <div style={{ width: '100%', height: '8px', borderRadius: '4px', backgroundColor: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                borderRadius: '4px',
                background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                transition: 'width 0.6s ease',
              }}
            />
          </div>

          <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', lineHeight: 1.35 }}>
            {subtitleText}
          </div>
        </div>
      );
    }

    // Variant 7: 🎯 Прогресс за день (Матовое стекло)
    case '7': {
      const dailyGainNum = (doneCount * 0.2).toFixed(1);
      const progressPercent = Math.min(100, (Number(dailyGainNum) / 1.0) * 100);
      const annualMult = Math.pow(1 + Number(dailyGainNum) / 100, 365);
      const formattedPace = annualMult >= 100 ? `${Math.round(annualMult)}x` : `${annualMult.toFixed(1)}x`;

      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            padding: '14px 16px',
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            boxShadow: '0 4px 20px rgba(16, 185, 129, 0.06)',
            boxSizing: 'border-box',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              🎯 Прогресс за день
            </span>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#10b981' }}>
              +{dailyGainNum}% ({doneCount}/{Math.max(5, doneCount)})
            </span>
          </div>
          <div style={{ width: '100%', height: '8px', borderRadius: '4px', backgroundColor: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #34d399)', transition: 'width 0.6s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-muted)' }}>
            <span>⚡ Темп: <strong style={{ color: '#10b981' }}>{formattedPace}</strong></span>
            <span>Цель: 37.8x</span>
          </div>
        </div>
      );
    }

    // Variant 1 (Default): Кибер-стекло с кольцом
    case '1':
    default:
      return (
        <div className={styles.variant1}>
          <div className={styles.v1Header}>
            <div className={styles.v1Ring}>{percent}%</div>
            <div>
              <div className={styles.v1Title}>{titleText}</div>
              <div className={styles.v1Sub}>{doneCount} из {totalCount} выполнено</div>
            </div>
          </div>
          <div className={styles.v1Track}>
            <div className={styles.v1Fill} style={{ width: `${percent}%` }} />
          </div>
        </div>
      );
  }
};
