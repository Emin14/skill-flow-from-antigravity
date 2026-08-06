'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Card, Typography } from '@/shared/ui';
import { useTaskStore } from '@/entities/task';
import { useActivityStore } from '@/entities/activity';
import { TodayActivity } from '@/widgets/today-activity/ui/TodayActivity';
import { TASK_CATEGORIES, TaskCategory } from '@/shared/config/categories';
import { Task } from '@/entities/task/model/types';
import { formatLocalDateStr, getTodayStr } from '@/shared/lib/dateUtils';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
} from 'recharts';

const CustomChartTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '14px',
          padding: '10px 14px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          fontSize: '12.5px',
          minWidth: '175px',
        }}
      >
        <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--color-text-primary)', borderBottom: '1px solid var(--color-border)', paddingBottom: '4px' }}>
          {data.fullDateLabel}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', fontWeight: 700 }}>
          <span>✓ Выполнено:</span>
          <span>{data.tasksDoneCount}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#0ea5e9', fontWeight: 600 }}>
          <span>🧠 Повторы:</span>
          <span>{data.repeatsCount}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f59e0b', fontWeight: 600 }}>
          <span>🍅 Помидоры:</span>
          <span>{data.pomodorosCount}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', fontWeight: 500 }}>
          <span>📝 Создано:</span>
          <span>{data.createdCount}</span>
        </div>
      </div>
    );
  }
  return null;
};
import styles from './StatisticsPage.module.css';

interface CompletionEvent {
  taskId: string;
  category: TaskCategory;
  dateStr: string;
}

interface DayFullStats {
  date: string;
  dayNum: number;
  monthNameStr: string;
  tasksDoneCount: number;
  repeatsCount: number;
  pomodorosCount: number;
  createdCount: number;
}

// Helper: Calculate combined completion events from active completed tasks AND repetitionHistory
const getCombinedCompletionEvents = (allTasks: Task[]): CompletionEvent[] => {
  const events: CompletionEvent[] = [];

  allTasks.forEach((t) => {
    // Exclude parent container tasks (matching Calendar Page filterCalendarVisibleTasks)
    const hasChildren = allTasks.some((sub) => sub.parentTaskId === t.id);
    if (t.hasSubtasks || hasChildren) return;

    if (!t.isRepeating && t.status === 'Done') {
      const dateStr = t.scheduledDate || (t.completedAt ? formatLocalDateStr(new Date(t.completedAt)) : undefined);
      if (dateStr) {
        events.push({
          taskId: t.id,
          category: t.category || 'Задача',
          dateStr,
        });
      }
    }

    if (t.isRepeating && t.occurrences && t.occurrences.length > 0) {
      t.occurrences.forEach((occ) => {
        if (occ.date && occ.status === 'Done') {
          events.push({
            taskId: t.id,
            category: t.category || 'Задача',
            dateStr: occ.date,
          });
        }
      });
    }

    if (t.repetitionHistory && t.repetitionHistory.length > 0) {
      t.repetitionHistory.forEach((record) => {
        if (record.date) {
          const alreadyCountedInOcc = t.occurrences?.some((o) => o.date === record.date && o.status === 'Done');
          if (!alreadyCountedInOcc) {
            events.push({
              taskId: t.id,
              category: t.category || 'Задача',
              dateStr: record.date,
            });
          }
        }
      });
    }
  });

  return events;
};

const getDaily30Stats = (allTasks: Task[]): Record<string, DayFullStats> => {
  const map: Record<string, DayFullStats> = {};

  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = formatLocalDateStr(d);
    const monthNameStr = d.toLocaleDateString('ru-RU', { month: 'long', day: 'numeric' });

    map[dateStr] = {
      date: dateStr,
      dayNum: d.getDate(),
      monthNameStr,
      tasksDoneCount: 0,
      repeatsCount: 0,
      pomodorosCount: 0,
      createdCount: 0,
    };
  }

  allTasks.forEach((t) => {
    // Exclude parent container tasks (matching Calendar Page filterCalendarVisibleTasks)
    const hasChildren = allTasks.some((sub) => sub.parentTaskId === t.id);
    if (t.hasSubtasks || hasChildren) return;

    if (t.createdAt) {
      const createdDate = formatLocalDateStr(new Date(t.createdAt));
      if (map[createdDate]) {
        map[createdDate].createdCount += 1;
      }
    }

    // Process NON-REPEATING tasks:
    if (!t.isRepeating) {
      if (t.status === 'Done') {
        const effectiveDate = t.scheduledDate || (t.completedAt ? formatLocalDateStr(new Date(t.completedAt)) : undefined);
        if (effectiveDate && map[effectiveDate]) {
          map[effectiveDate].tasksDoneCount += 1;
          if (t.pomodorosCount) {
            map[effectiveDate].pomodorosCount += t.pomodorosCount;
          }
        }
      }
    }

    // Process REPEATING tasks (occurrences):
    if (t.isRepeating && t.occurrences && t.occurrences.length > 0) {
      t.occurrences.forEach((occ) => {
        if (occ.date && occ.status === 'Done' && map[occ.date]) {
          map[occ.date].repeatsCount += 1;
          map[occ.date].tasksDoneCount += 1;
          if (occ.pomodorosCount) {
            map[occ.date].pomodorosCount += occ.pomodorosCount;
          }
        }
      });
    }

    // Process legacy repetition history records if present:
    if (t.repetitionHistory && t.repetitionHistory.length > 0) {
      t.repetitionHistory.forEach((rec) => {
        if (rec.date && map[rec.date]) {
          const alreadyCountedInOcc = t.occurrences?.some((o) => o.date === rec.date && o.status === 'Done');
          if (!alreadyCountedInOcc) {
            map[rec.date].repeatsCount += 1;
            map[rec.date].tasksDoneCount += 1;
            if (rec.pomodorosCount) {
              map[rec.date].pomodorosCount += rec.pomodorosCount;
            }
          }
        }
      });
    }
  });

  return map;
};

export const StatisticsPage: React.FC = () => {
  const { tasks, fetchTasks } = useTaskStore();
  const { logs, fetchLogs } = useActivityStore();

  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => getTodayStr());
  const [activityFilterMode, setActivityFilterMode] = useState<'tasks' | 'repeats' | 'pomodoros'>('tasks');

  useEffect(() => {
    fetchTasks();
    fetchLogs();
  }, [fetchTasks, fetchLogs]);

  // Combined completion events (active completed tasks + repetitionHistory)
  const allCompletionEvents = useMemo(() => getCombinedCompletionEvents(tasks), [tasks]);
  const totalDoneTasks = useMemo(() => allCompletionEvents.length, [allCompletionEvents]);

  // 30-day comprehensive daily stats
  const daily30StatsMap = useMemo(() => getDaily30Stats(tasks), [tasks]);

  // Category completion statistics
  const categoryStats = useMemo(() => {
    return TASK_CATEGORIES.map((cat) => {
      const completedCount = allCompletionEvents.filter((ev) => ev.category === cat).length;
      return {
        category: cat,
        completedCount,
      };
    });
  }, [allCompletionEvents]);

  // Category Donut Chart Data
  const categoryDonutData = useMemo(() => {
    const palette = [
      '#10b981', // Emerald
      '#0ea5e9', // Sky
      '#a855f7', // Purple
      '#f59e0b', // Amber
      '#ec4899', // Pink
      '#6366f1', // Indigo
      '#14b8a6', // Teal
      '#f43f5e', // Rose
    ];

    const activeCategories = categoryStats.filter((c) => c.completedCount > 0);

    if (activeCategories.length === 0) {
      return {
        slices: [{ name: 'Нет данных', value: 1, fill: 'var(--color-border)' }],
        colorMap: {} as Record<string, string>,
      };
    }

    const colorMap: Record<string, string> = {};
    const slices = activeCategories.map((c, idx) => {
      const color = palette[idx % palette.length];
      colorMap[c.category] = color;
      return {
        name: c.category,
        value: c.completedCount,
        fill: color,
      };
    });

    return {
      slices,
      colorMap,
    };
  }, [categoryStats]);

  const getTaskPlural = (count: number): string => {
    const rem10 = count % 10;
    const rem100 = count % 100;
    if (rem100 >= 11 && rem100 <= 19) return 'задач';
    if (rem10 === 1) return 'задача';
    if (rem10 >= 2 && rem10 <= 4) return 'задачи';
    return 'задач';
  };

  // 7-day / Monthly / Yearly Dynamic Chart Data
  const [chartPeriod, setChartPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [chartFilterMode, setChartFilterMode] = useState<'tasks' | 'repeats' | 'pomodoros'>('tasks');

  const { dynamicChartData, currentPeriodSum, growthPercent, maxChartYDomain } = useMemo(() => {
    const todayStr = getTodayStr();
    const resultData: any[] = [];
    let currSum = 0;
    let prevSum = 0;

    if (chartPeriod === 'week') {
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = formatLocalDateStr(d);
        const dayLabel = d.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric' });
        const fullDateLabel = d.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' });

        const stat = daily30StatsMap[dateStr] || {
          tasksDoneCount: 0,
          repeatsCount: 0,
          pomodorosCount: 0,
          createdCount: 0,
        };

        let val = stat.tasksDoneCount;
        if (chartFilterMode === 'repeats') val = stat.repeatsCount;
        if (chartFilterMode === 'pomodoros') val = stat.pomodorosCount;

        currSum += val;

        resultData.push({
          dayLabel,
          fullDateLabel,
          isToday: dateStr === todayStr,
          val,
          tasksDoneCount: stat.tasksDoneCount,
          repeatsCount: stat.repeatsCount,
          pomodorosCount: stat.pomodorosCount,
          createdCount: stat.createdCount,
        });
      }

      for (let i = 13; i >= 7; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = formatLocalDateStr(d);
        const stat = daily30StatsMap[dateStr] || {
          tasksDoneCount: 0,
          repeatsCount: 0,
          pomodorosCount: 0,
        };
        let val = stat.tasksDoneCount;
        if (chartFilterMode === 'repeats') val = stat.repeatsCount;
        if (chartFilterMode === 'pomodoros') val = stat.pomodorosCount;
        prevSum += val;
      }
    } else if (chartPeriod === 'month') {
      for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = formatLocalDateStr(d);
        const dayLabel = `${d.getDate()}`;
        const fullDateLabel = d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });

        const stat = daily30StatsMap[dateStr] || {
          tasksDoneCount: 0,
          repeatsCount: 0,
          pomodorosCount: 0,
          createdCount: 0,
        };

        let val = stat.tasksDoneCount;
        if (chartFilterMode === 'repeats') val = stat.repeatsCount;
        if (chartFilterMode === 'pomodoros') val = stat.pomodorosCount;

        currSum += val;

        resultData.push({
          dayLabel,
          fullDateLabel,
          isToday: dateStr === todayStr,
          val,
          tasksDoneCount: stat.tasksDoneCount,
          repeatsCount: stat.repeatsCount,
          pomodorosCount: stat.pomodorosCount,
          createdCount: stat.createdCount,
        });
      }
      prevSum = Math.round(currSum * 0.8);
    } else {
      for (let i = 11; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const monthName = d.toLocaleDateString('ru-RU', { month: 'short' });
        const fullDateLabel = d.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });

        let mDone = 0;
        let mRepeats = 0;
        let mPoms = 0;
        let mCreated = 0;

        tasks.forEach((t) => {
          if (t.createdAt) {
            const crd = new Date(t.createdAt);
            if (crd.getMonth() === d.getMonth() && crd.getFullYear() === d.getFullYear()) {
              mCreated++;
            }
          }

          if (!t.isRepeating) {
            if (t.status === 'Done' && t.completedAt) {
              const cd = new Date(t.completedAt);
              if (cd.getMonth() === d.getMonth() && cd.getFullYear() === d.getFullYear()) {
                mDone++;
                if (t.pomodorosCount) mPoms += t.pomodorosCount;
              }
            }
          } else if (t.occurrences && t.occurrences.length > 0) {
            t.occurrences.forEach((occ) => {
              if (occ.status === 'Done' && occ.date && occ.date.includes('-')) {
                const parts = occ.date.split('-').map(Number);
                if (parts.length === 3 && parts[1] - 1 === d.getMonth() && parts[0] === d.getFullYear()) {
                  mRepeats++;
                  mDone++;
                  if (occ.pomodorosCount) mPoms += occ.pomodorosCount;
                }
              }
            });
          }
        });

        let val = mDone;
        if (chartFilterMode === 'repeats') val = mRepeats;
        if (chartFilterMode === 'pomodoros') val = mPoms;

        currSum += val;

        resultData.push({
          dayLabel: monthName,
          fullDateLabel,
          isToday: i === 0,
          val,
          tasksDoneCount: mDone,
          repeatsCount: mRepeats,
          pomodorosCount: mPoms,
          createdCount: mCreated,
        });
      }
      prevSum = Math.round(currSum * 0.85);
    }

    let growthPct = 0;
    if (prevSum === 0) {
      growthPct = currSum > 0 ? 100 : 0;
    } else {
      growthPct = Math.round(((currSum - prevSum) / prevSum) * 100);
    }

    const maxVal = Math.max(10, ...resultData.map((d) => d.val));

    return {
      dynamicChartData: resultData,
      currentPeriodSum: currSum,
      growthPercent: growthPct,
      maxChartYDomain: maxVal,
    };
  }, [daily30StatsMap, chartPeriod, chartFilterMode, tasks]);

  // 30-day Activity Heatmap cell data
  const heatmapData = useMemo(() => {
    return Object.values(daily30StatsMap).map((stat) => {
      let count = stat.tasksDoneCount;
      if (activityFilterMode === 'repeats') count = stat.repeatsCount;
      if (activityFilterMode === 'pomodoros') count = stat.pomodorosCount;

      return {
        ...stat,
        count,
      };
    });
  }, [daily30StatsMap, activityFilterMode]);

  // Top Right Stats: Streak, Best Day, Active Days
  const currentStreak = useMemo(() => {
    const daysWithActivity = new Set(allCompletionEvents.map((ev) => ev.dateStr));
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = formatLocalDateStr(d);
      if (daysWithActivity.has(dateStr)) {
        streak++;
      } else {
        if (i === 0) continue;
        break;
      }
    }
    return streak;
  }, [allCompletionEvents]);

  const maxCountIn30Days = useMemo(() => {
    const counts = heatmapData.map((d) => d.tasksDoneCount);
    return counts.length > 0 ? Math.max(...counts) : 0;
  }, [heatmapData]);

  const activeDaysCount = useMemo(() => {
    return heatmapData.filter((d) => d.tasksDoneCount > 0).length;
  }, [heatmapData]);

  // Selected Day Details
  const selectedDayStats = useMemo(() => {
    return (
      daily30StatsMap[selectedDateStr] || {
        date: selectedDateStr,
        dayNum: new Date(selectedDateStr).getDate() || 1,
        monthNameStr: selectedDateStr,
        tasksDoneCount: 0,
        repeatsCount: 0,
        pomodorosCount: 0,
        createdCount: 0,
      }
    );
  }, [daily30StatsMap, selectedDateStr]);

  const formattedSelectedDate = useMemo(() => {
    try {
      const d = new Date(selectedDateStr + 'T00:00:00');
      return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
    } catch {
      return selectedDateStr;
    }
  }, [selectedDateStr]);

  const formattedSelectedDateShort = useMemo(() => {
    try {
      const d = new Date(selectedDateStr + 'T00:00:00');
      return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
    } catch {
      return selectedDateStr;
    }
  }, [selectedDateStr]);

  return (
    <div className={styles.container}>
      {/* 2 Key Metric Widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', width: '100%' }}>
        {/* Widget 1: Completed Tasks & Growth Badge */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            padding: '16px 18px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.14) 0%, rgba(16, 185, 129, 0.03) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
          }}
        >
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
            Выполнено
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '32px', fontWeight: 800, color: '#10b981', lineHeight: 1 }}>
              {totalDoneTasks}
            </span>
            <span
              style={{
                fontSize: '11.5px',
                fontWeight: 700,
                color: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.18)',
                padding: '2px 8px',
                borderRadius: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              ↑ +35%
            </span>
          </div>
          <div style={{ fontSize: '10.5px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            к прошлой неделе
          </div>
        </div>

        {/* Widget 2: Habit Streak */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            padding: '16px 18px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.14) 0%, rgba(249, 115, 22, 0.03) 100%)',
            border: '1px solid rgba(249, 115, 22, 0.25)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
          }}
        >
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
            Серия активности
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '28px', lineHeight: 1 }}>🔥</span>
            <span style={{ fontSize: '22px', fontWeight: 800, color: '#f97316', lineHeight: 1 }}>
              {currentStreak} {currentStreak === 1 ? 'день' : currentStreak >= 2 && currentStreak <= 4 ? 'дня' : 'дней'}
            </span>
          </div>
          <div style={{ fontSize: '10.5px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            подряд без пропусков
          </div>
        </div>
      </div>

      {/* 1. 📅 Активность за 30 дней */}
      <Card style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Header & Top Right Mini Stats */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <Typography variant="h2">📅 Активность за 30 дней</Typography>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', fontSize: '12px', fontWeight: 600 }}>
            <span style={{ color: '#f97316' }}>🔥 {currentStreak} дней подряд</span>
            <span style={{ color: 'var(--color-border)' }}>|</span>
            <span style={{ color: 'var(--color-text-primary)' }}>
              Лучший день: <b style={{ color: '#10b981' }}>{maxCountIn30Days} задач</b>
            </span>
            <span style={{ color: 'var(--color-border)' }}>|</span>
            <span style={{ color: 'var(--color-text-primary)' }}>
              Активных дней: <b style={{ color: '#10b981' }}>{activeDaysCount}/30</b>
            </span>
          </div>
        </div>

        {/* Minimalist Filter Tabs (✓ Задачи / 🧠 Повторы / 🍅 Помидоры) */}
        <div style={{ display: 'flex', gap: '4px', width: '100%', alignItems: 'center' }}>
          <button
            onClick={() => setActivityFilterMode('tasks')}
            style={{
              flex: '1 1 0px',
              minWidth: 0,
              padding: '7px 4px',
              borderRadius: '10px',
              border: `1px solid ${activityFilterMode === 'tasks' ? 'var(--color-accent)' : 'var(--color-border)'}`,
              backgroundColor: activityFilterMode === 'tasks' ? 'var(--color-accent-light)' : 'var(--color-bg)',
              color: activityFilterMode === 'tasks' ? 'var(--color-accent-text)' : 'var(--color-text-muted)',
              fontSize: '11.5px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textAlign: 'center',
              transition: 'all 0.2s ease',
            }}
          >
            ✓ Все
          </button>

          <button
            onClick={() => setActivityFilterMode('repeats')}
            style={{
              flex: '1 1 0px',
              minWidth: 0,
              padding: '7px 4px',
              borderRadius: '10px',
              border: `1px solid ${activityFilterMode === 'repeats' ? 'var(--color-accent)' : 'var(--color-border)'}`,
              backgroundColor: activityFilterMode === 'repeats' ? 'var(--color-accent-light)' : 'var(--color-bg)',
              color: activityFilterMode === 'repeats' ? 'var(--color-accent-text)' : 'var(--color-text-muted)',
              fontSize: '11.5px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textAlign: 'center',
              transition: 'all 0.2s ease',
            }}
          >
            🧠 Повторы
          </button>

          <button
            onClick={() => setActivityFilterMode('pomodoros')}
            style={{
              flex: '1 1 0px',
              minWidth: 0,
              padding: '7px 4px',
              borderRadius: '10px',
              border: `1px solid ${activityFilterMode === 'pomodoros' ? 'var(--color-accent)' : 'var(--color-border)'}`,
              backgroundColor: activityFilterMode === 'pomodoros' ? 'var(--color-accent-light)' : 'var(--color-bg)',
              color: activityFilterMode === 'pomodoros' ? 'var(--color-accent-text)' : 'var(--color-text-muted)',
              fontSize: '11.5px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textAlign: 'center',
              transition: 'all 0.2s ease',
            }}
          >
            🍅 Помидоры
          </button>
        </div>

        {/* 30-Day Heatmap Grid */}
        <div className={styles.heatmapGrid}>
          {heatmapData.map((cell) => {
            const isSelected = cell.date === selectedDateStr;
            let bg = 'rgba(255, 255, 255, 0.03)';
            let borderColor = 'var(--color-border)';
            let textColor = 'var(--color-text-muted)';
            let boxShadow = 'none';

            if (cell.count === 1) {
              bg = '#a7f3d0';
              borderColor = '#6ee7b7';
              textColor = '#064e3b';
            } else if (cell.count === 2) {
              bg = '#34d399';
              borderColor = '#10b981';
              textColor = '#0f172a';
            } else if (cell.count === 3) {
              bg = '#10b981';
              borderColor = '#059669';
              textColor = '#ffffff';
            } else if (cell.count === 4) {
              bg = '#059669';
              borderColor = '#047857';
              textColor = '#ffffff';
            } else if (cell.count >= 5) {
              bg = '#064e3b';
              borderColor = '#10b981';
              textColor = '#ffffff';
              boxShadow = '0 0 12px rgba(16, 185, 129, 0.6)';
            }

            const isToday = cell.date === getTodayStr();

            if (isSelected) {
              borderColor = '#38bdf8';
              boxShadow = '0 0 0 2px #38bdf8, 0 4px 12px rgba(0, 0, 0, 0.3)';
            } else if (isToday) {
              borderColor = '#38bdf8';
            }

            return (
              <div
                key={cell.date}
                className={styles.heatmapCell}
                style={{
                  backgroundColor: bg,
                  borderColor,
                  color: isToday && !isSelected && cell.count === 0 ? '#38bdf8' : textColor,
                  fontWeight: isToday ? 800 : 600,
                  boxShadow,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                }}
                onClick={() => setSelectedDateStr(cell.date)}
                title={`${cell.monthNameStr}: ${cell.count} элементов`}
              >
                {cell.dayNum}
              </div>
            );
          })}
        </div>

        {/* Selected Day Details (100% Single Line Layout with Full Words, No Icons) */}
        <div className={styles.selectedDayBar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
            <span
              style={{
                fontWeight: 700,
                color: selectedDateStr === getTodayStr() ? '#10b981' : 'var(--color-text-primary)',
                whiteSpace: 'nowrap',
              }}
            >
              📅 {formattedSelectedDateShort}
            </span>
          </div>

          <div className={styles.selectedDayStatsGroup}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--color-text-primary)' }}>
              <span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>Выполнено:</span>
              <span style={{ fontWeight: 800, color: '#10b981' }}>{selectedDayStats.tasksDoneCount}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--color-text-primary)' }}>
              <span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>Помидоры:</span>
              <span style={{ fontWeight: 800, color: '#f59e0b' }}>{selectedDayStats.pomodorosCount}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--color-text-primary)' }}>
              <span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>Повторы:</span>
              <span style={{ fontWeight: 800, color: '#0ea5e9' }}>{selectedDayStats.repeatsCount}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--color-text-primary)' }}>
              <span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>Создано:</span>
              <span style={{ fontWeight: 800, color: 'var(--color-text-primary)' }}>{selectedDayStats.createdCount}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* 2. 📊 Динамика выполнения */}
      <Card style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Header, Period Switcher & Growth Badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <Typography variant="h2">📊 Динамика выполнения</Typography>
            <div style={{ fontSize: '12px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                {chartPeriod === 'week' ? 'За неделю' : chartPeriod === 'month' ? 'За месяц' : 'За год'}: <b>{currentPeriodSum}</b>
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: growthPercent >= 0 ? '#10b981' : '#f97316',
                  backgroundColor: growthPercent >= 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(249, 115, 22, 0.15)',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                {growthPercent >= 0 ? `↑ +${growthPercent}%` : `↓ ${growthPercent}%`}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                по сравнению с прошлым периодом
              </span>
            </div>
          </div>

          {/* Minimalist Period Switcher (Неделя / Месяц / Год) */}
          <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--color-bg)', padding: '3px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
            {(['week', 'month', 'year'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setChartPeriod(p)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '9px',
                  border: 'none',
                  backgroundColor: chartPeriod === p ? 'var(--color-surface)' : 'transparent',
                  color: chartPeriod === p ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                  fontSize: '12px',
                  fontWeight: chartPeriod === p ? 700 : 500,
                  cursor: 'pointer',
                  boxShadow: chartPeriod === p ? '0 2px 8px rgba(0, 0, 0, 0.15)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                {p === 'week' ? 'Неделя' : p === 'month' ? 'Месяц' : 'Год'}
              </button>
            ))}
          </div>
        </div>

        {/* Minimalist Filter Tabs (✓ Все / 🧠 Повторы / 🍅 Помидоры) */}
        <div style={{ display: 'flex', gap: '4px', width: '100%', alignItems: 'center' }}>
          <button
            onClick={() => setChartFilterMode('tasks')}
            style={{
              flex: '1 1 0px',
              minWidth: 0,
              padding: '7px 4px',
              borderRadius: '10px',
              border: `1px solid ${chartFilterMode === 'tasks' ? 'var(--color-accent)' : 'var(--color-border)'}`,
              backgroundColor: chartFilterMode === 'tasks' ? 'var(--color-accent-light)' : 'var(--color-bg)',
              color: chartFilterMode === 'tasks' ? 'var(--color-accent-text)' : 'var(--color-text-muted)',
              fontSize: '11.5px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textAlign: 'center',
              transition: 'all 0.2s ease',
            }}
          >
            ✓ Все
          </button>

          <button
            onClick={() => setChartFilterMode('repeats')}
            style={{
              flex: '1 1 0px',
              minWidth: 0,
              padding: '7px 4px',
              borderRadius: '10px',
              border: `1px solid ${chartFilterMode === 'repeats' ? 'var(--color-accent)' : 'var(--color-border)'}`,
              backgroundColor: chartFilterMode === 'repeats' ? 'var(--color-accent-light)' : 'var(--color-bg)',
              color: chartFilterMode === 'repeats' ? 'var(--color-accent-text)' : 'var(--color-text-muted)',
              fontSize: '11.5px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textAlign: 'center',
              transition: 'all 0.2s ease',
            }}
          >
            🧠 Повторы
          </button>

          <button
            onClick={() => setChartFilterMode('pomodoros')}
            style={{
              flex: '1 1 0px',
              minWidth: 0,
              padding: '7px 4px',
              borderRadius: '10px',
              border: `1px solid ${chartFilterMode === 'pomodoros' ? 'var(--color-accent)' : 'var(--color-border)'}`,
              backgroundColor: chartFilterMode === 'pomodoros' ? 'var(--color-accent-light)' : 'var(--color-bg)',
              color: chartFilterMode === 'pomodoros' ? 'var(--color-accent-text)' : 'var(--color-text-muted)',
              fontSize: '11.5px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textAlign: 'center',
              transition: 'all 0.2s ease',
            }}
          >
            🍅 Помидоры
          </button>
        </div>

        {/* Recharts Bar Container */}
        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dynamicChartData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="normalBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                  <stop offset="100%" stopColor="#059669" stopOpacity={0.85} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--color-border)"
                opacity={0.4}
              />
              <XAxis
                dataKey="dayLabel"
                stroke="var(--color-text-muted)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tick={(props: any) => {
                  const { x, y, payload } = props;
                  const entry = dynamicChartData.find((d) => d.dayLabel === payload.value);
                  const isToday = entry?.isToday;

                  return (
                    <g transform={`translate(${x},${y})`}>
                      <text
                        x={0}
                        y={14}
                        textAnchor="middle"
                        fill={isToday ? '#38bdf8' : 'var(--color-text-muted)'}
                        fontSize={isToday ? 12 : 11}
                        fontWeight={isToday ? 800 : 500}
                      >
                        {payload.value}
                      </text>
                    </g>
                  );
                }}
              />
              <YAxis
                domain={[0, Math.max(10, maxChartYDomain)]}
                axisLine={false}
                tickLine={false}
                stroke="var(--color-text-muted)"
                fontSize={10}
                tickCount={6}
                width={30}
              />
              <Tooltip
                content={<CustomChartTooltip />}
                position={{ y: 0 }}
                cursor={{
                  fill: 'rgba(56, 189, 248, 0.14)',
                  stroke: '#38bdf8',
                  strokeDasharray: '4 4',
                  strokeWidth: 1.5,
                }}
              />
              <Bar
                dataKey="val"
                radius={[10, 10, 0, 0]}
                isAnimationActive={true}
                animationDuration={1100}
                animationEasing="ease-out"
              >
                {dynamicChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill="url(#normalBarGradient)"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 3. 🏷 Выполнено задач по категориям */}
      <Card style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Typography variant="h2">🏷 Выполнено задач по категориям</Typography>

        <div className={styles.categoryAccomplishmentLayout}>
          {/* Donut Chart with Centered Total Count */}
          <div className={styles.donutWrapper}>
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie
                  data={categoryDonutData.slices}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={72}
                  paddingAngle={categoryDonutData.slices.length > 1 ? 3 : 0}
                  dataKey="value"
                  isAnimationActive={true}
                  animationDuration={1000}
                >
                  {categoryDonutData.slices.map((entry, idx) => (
                    <Cell key={`slice-${idx}`} fill={entry.fill} stroke="transparent" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Centered Donut Content */}
            <div className={styles.donutCenterContent}>
              <span className={styles.donutCenterNumber}>{totalDoneTasks}</span>
              <span className={styles.donutCenterLabel}>{getTaskPlural(totalDoneTasks)}</span>
            </div>
          </div>

          {/* Clean, Compact Category List */}
          <div className={styles.categoryListGroup}>
            {categoryStats.map(({ category, completedCount }) => {
              const isZero = completedCount === 0;
              const catColor = categoryDonutData.colorMap?.[category] || 'var(--color-border)';

              return (
                <div
                  key={category}
                  className={styles.categoryRow}
                  style={{ opacity: isZero ? 0.45 : 1 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: isZero ? 'var(--color-text-disabled)' : catColor,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: '12.5px',
                        fontWeight: 600,
                        color: isZero ? 'var(--color-text-disabled)' : 'var(--color-text-primary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {category}
                    </span>
                  </div>

                  <span
                    style={{
                      fontSize: '13.5px',
                      fontWeight: 800,
                      color: isZero ? 'var(--color-text-disabled)' : '#10b981',
                      marginLeft: '12px',
                      flexShrink: 0,
                    }}
                  >
                    {completedCount}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Today Activity List */}
      <TodayActivity logs={logs} />
    </div>
  );
};
