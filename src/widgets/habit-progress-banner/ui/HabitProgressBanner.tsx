'use client';

import React from 'react';
import { useTaskStore } from '@/entities/task';
import { getTodayStr } from '@/shared/lib/dateUtils';
import styles from './HabitProgressBanner.module.css';

export const HabitProgressBanner: React.FC = () => {
  const tasks = useTaskStore((s) => s.tasks);
  const todayStr = getTodayStr();

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

  return (
    <div className={styles.container}>
      {/* ─── VARIANT 1: Cyber Glass + Ring + Smooth Gradient Fill ────── */}
      <div className={styles.variant1}>
        <div className={styles.variantTag}>Вариант 1 — Кибер-стекло с градиентным треком</div>
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

      {/* ─── VARIANT 2: Segmented Step Blocks ────────────────────────── */}
      <div className={styles.variant2}>
        <div className={styles.variantTag}>Вариант 2 — Сегментированные шаги-блоки</div>
        <div className={styles.v2Row}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700 }}>{titleText}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              {doneCount} из {totalCount} шагов завершено
            </div>
          </div>
          <div className={styles.v2Badge}>{percent}%</div>
        </div>
        <div className={styles.v2Segments}>
          {Array.from({ length: Math.max(1, totalCount) }).map((_, idx) => (
            <div key={idx} className={idx < doneCount ? styles.v2SegDone : styles.v2SegTodo} />
          ))}
        </div>
      </div>

      {/* ─── VARIANT 3: Floating Card + Big Bold Percent ────────────── */}
      <div className={styles.variant3}>
        <div className={styles.variantTag}>Вариант 3 — Минимализм с крупным процентом</div>
        <div className={styles.v3Top}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700 }}>{titleText}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{doneCount} из {totalCount} выполнено</div>
          </div>
          <div className={styles.v3BigPercent}>{percent}%</div>
        </div>
        <div className={styles.v3BarOuter}>
          <div className={styles.v3BarInner} style={{ width: `${percent}%` }} />
        </div>
      </div>

      {/* ─── VARIANT 4: Dual Stats Metric Card ───────────────────────── */}
      <div className={styles.variant4}>
        <div>
          <div className={styles.variantTag}>Вариант 4 — Метрическая панель показателей</div>
          <div style={{ fontSize: '14.5px', fontWeight: 700, marginTop: '2px' }}>{titleText}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Прогресс дня: {doneCount} из {totalCount}</div>
          <div className={styles.v4BarContainer}>
            <div style={{ height: '100%', width: `${percent}%`, background: '#34d399', borderRadius: '3px' }} />
          </div>
        </div>
        <div className={styles.v4Pill}>{percent}%</div>
      </div>

      {/* ─── VARIANT 5: Holographic Glow + Neon Glow Bar ────────────── */}
      <div className={styles.variant5}>
        <div className={styles.variantTag}>Вариант 5 — Неоновый голографический нео-бар</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#f472b6' }}>{titleText}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              Выполнено {doneCount} из {totalCount} задач
            </div>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#ec4899' }}>{percent}%</div>
        </div>
        <div className={styles.v5GlowBar}>
          <div className={styles.v5GlowFill} style={{ width: `${percent}%` }} />
        </div>
      </div>

      {/* ─── VARIANT 6: Apple Activity Ring Inspired ────────────────── */}
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
            stroke="#10b981"
            strokeWidth="3.8"
            strokeDasharray={`${percent}, 100`}
            strokeLinecap="round"
          />
        </svg>
        <div className={styles.v6Right}>
          <div className={styles.variantTag}>Вариант 6 — Кольцо активности (Apple Style)</div>
          <div style={{ fontSize: '14px', fontWeight: 700 }}>{titleText}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            {doneCount} из {totalCount} ({percent}%)
          </div>
          <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${percent}%`, height: '100%', background: '#10b981', borderRadius: '3px' }} />
          </div>
        </div>
      </div>

      {/* ─── VARIANT 7: Gamified XP Level Bar ────────────────────────── */}
      <div className={styles.variant7}>
        <div className={styles.variantTag}>Вариант 7 — Геймифицированная полоса XP</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#f59e0b' }}>⚡ {titleText}</span>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#ef4444' }}>{percent}% XP</span>
        </div>
        <div className={styles.v7XpTrack}>
          <div className={styles.v7XpFill} style={{ width: `${percent}%` }} />
        </div>
        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', textAlign: 'right' }}>
          {doneCount}/{totalCount} задач • Осталось: {remainingCount}
        </div>
      </div>

      {/* ─── VARIANT 8: Notion Clean Bottom Border Line ──────────────── */}
      <div className={styles.variant8}>
        <div className={styles.variantTag}>Вариант 8 — Индикатор на нижней грани карточки</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700 }}>{titleText}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              Выполнено {doneCount} из {totalCount}
            </div>
          </div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#10b981' }}>{percent}%</div>
        </div>
        <div className={styles.v8BottomLine} style={{ width: `${percent}%` }} />
      </div>

      {/* ─── VARIANT 9: Bento Grid Card with Mini Micro-Chips ────────── */}
      <div className={styles.variant9}>
        <div className={styles.variantTag}>Вариант 9 — Bento-карточка со смарт-чипсами</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '14.5px', fontWeight: 700 }}>{titleText}</div>
          <div className={styles.v9ChipRow}>
            <span className={styles.v9Chip}>✓ {doneCount}</span>
            <span className={styles.v9Chip}>⏳ {remainingCount}</span>
            <span className={styles.v9Chip} style={{ color: '#38bdf8' }}>{percent}%</span>
          </div>
        </div>
        <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ width: `${percent}%`, height: '100%', background: 'linear-gradient(90deg, #38bdf8 0%, #10b981 100%)', borderRadius: '4px' }} />
        </div>
      </div>

      {/* ─── VARIANT 10: Full Capsule with Embedded Text Bar ──────────── */}
      <div className={styles.variant10}>
        <div className={styles.variantTag}>Вариант 10 — Капсульная полоса с текстом внутри</div>
        <div style={{ fontSize: '14px', fontWeight: 700 }}>{titleText}</div>
        <div className={styles.v10CapsuleBar}>
          <div className={styles.v10CapsuleFill} style={{ width: `${percent}%` }} />
          <span className={styles.v10CapsuleText}>
            Прогресс: {percent}% • {doneCount} из {totalCount} выполнено
          </span>
        </div>
      </div>
    </div>
  );
};
