'use client';

import React, { useState, useEffect } from 'react';
import { useTaskStore } from '@/entities/task';
import { getTodayStr } from '@/shared/lib/dateUtils';
import { applyProgressWidgetStyle } from '@/shared/config/progressWidgetThemes';
import { STORAGE_KEYS } from '@/shared/config/storageKeys';
import styles from './HabitProgressBanner.module.css';

export const HabitProgressBanner: React.FC = () => {
  const tasks = useTaskStore((s) => s.tasks);
  const todayStr = getTodayStr();

  const [activeVariant, setActiveVariant] = useState<string>('3');

  useEffect(() => {
    const loadVariant = () => {
      const saved = localStorage.getItem(STORAGE_KEYS.HABIT_BANNER_VARIANT) || '3';
      setActiveVariant(saved);
      const savedColorVariant = localStorage.getItem('progress-widget-color-variant') || 'adaptive';
      applyProgressWidgetStyle(savedColorVariant);
    };

    loadVariant();
    window.addEventListener('storage', loadVariant);
    return () => window.removeEventListener('storage', loadVariant);
  }, []);

  // Strictly filter ALL tasks for TODAY (both regular and repeating)
  const todayTasks = tasks.filter((t) => {
    if (t.isRepeating) {
      return t.occurrences?.some((o) => o.date === todayStr) || (t.scheduledDate && t.scheduledDate === todayStr);
    }
    if (!t.scheduledDate || t.scheduledDate === '' || t.scheduledDate === 'anytime') return false;
    return t.scheduledDate === todayStr;
  });

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
  const remainingCount = Math.max(0, totalCount - doneCount);

  const titleText = totalCount === 0
    ? 'На сегодня нет запланированных задач ☕'
    : percent === 100
    ? 'Отличная работа! Все задачи выполнены 🚀'
    : percent > 0
    ? 'В процессе выполнения задач! 💪'
    : 'Время покорять новые вершины! ⚡';

  // Render strictly the single chosen variant (Variant 3 by default)
  switch (activeVariant) {
    case '1':
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

    case '2':
      return (
        <div className={styles.variant2}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{titleText}</div>
              <div style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                {doneCount} из {totalCount} выполнено
              </div>
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-accent)' }}>{percent}%</div>
          </div>
          <div className={styles.v2Track}>
            <div className={styles.v2Fill} style={{ width: `${percent}%` }} />
          </div>
        </div>
      );

    case '4':
      return (
        <div className={styles.variant4}>
          <div>
            <div style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{titleText}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Прогресс дня: {doneCount} из {totalCount}</div>
            <div className={styles.v4BarContainer}>
              <div style={{ height: '100%', width: `${percent}%`, background: 'var(--color-accent)', borderRadius: '3px' }} />
            </div>
          </div>
          <div className={styles.v4Pill} style={{ background: 'var(--color-accent)', color: '#ffffff' }}>{percent}%</div>
        </div>
      );

    case '5':
      return (
        <div className={styles.variant5}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{titleText}</div>
              <div style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                Выполнено {doneCount} из {totalCount} задач
              </div>
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-accent)' }}>{percent}%</div>
          </div>
          <div className={styles.v5Track}>
            <div className={styles.v5Fill} style={{ width: `${percent}%`, background: 'var(--color-accent)' }} />
          </div>
        </div>
      );

    case '6':
      return (
        <div className={styles.variant6}>
          <svg className={styles.v6SvgRing} viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
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
          <div className={styles.v6Right}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{titleText}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
              {doneCount} из {totalCount} ({percent}%)
            </div>
            <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${percent}%`, height: '100%', background: 'var(--color-accent)', borderRadius: '3px' }} />
            </div>
          </div>
        </div>
      );

    case '7':
      return (
        <div className={styles.variant7}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-accent)' }}>⚡ {titleText}</span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-accent)' }}>{percent}% XP</span>
          </div>
          <div className={styles.v7XpTrack}>
            <div className={styles.v7XpFill} style={{ width: `${percent}%`, background: 'var(--color-accent)' }} />
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', textAlign: 'right' }}>
            {doneCount}/{totalCount} задач • Осталось: {remainingCount}
          </div>
        </div>
      );

    case '8':
      return (
        <div className={styles.variant8}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{titleText}</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                Выполнено {doneCount} из {totalCount}
              </div>
            </div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-accent)' }}>{percent}%</div>
          </div>
          <div className={styles.v8BottomLine} style={{ width: `${percent}%`, background: 'var(--color-accent)' }} />
        </div>
      );

    case '9':
      return (
        <div className={styles.variant9}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{titleText}</div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-accent)' }}>{percent}%</div>
          </div>
          <div className={styles.v9Row}>
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
              {doneCount} / {totalCount} задач
            </span>
            <div className={styles.v9Track}>
              <div className={styles.v9Fill} style={{ width: `${percent}%`, background: 'var(--color-accent)' }} />
            </div>
          </div>
        </div>
      );

    case '10':
      return (
        <div className={styles.variant10}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{titleText}</div>
          <div className={styles.v10CapsuleBar}>
            <div className={styles.v10CapsuleFill} style={{ width: `${percent}%`, background: 'var(--color-accent)' }} />
            <span className={styles.v10CapsuleText}>
              Прогресс: {percent}% • {doneCount} из {totalCount} выполнено
            </span>
          </div>
        </div>
      );

    case '3':
    default:
      return (
        <div className={styles.variant3}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{titleText}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{doneCount} из {totalCount}</div>
          </div>
          <div className={styles.v3PinBarContainer}>
            {percent > 5 && (
              <div className={styles.v3PinTag} style={{ left: `${percent}%` }}>
                {percent}%
              </div>
            )}
            <div className={styles.v3Track}>
              <div className={styles.v3Fill} style={{ width: `${percent}%` }} />
            </div>
          </div>
        </div>
      );
  }
};
