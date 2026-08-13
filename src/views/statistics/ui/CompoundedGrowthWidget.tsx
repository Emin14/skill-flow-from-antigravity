'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '@/shared/ui';
import { useTaskStore } from '@/entities/task';
import { useCategoryStore } from '@/entities/category/model/useCategoryStore';
import { getCategoryColor } from '@/shared/config/categoryColors';
import { formatLocalDateStr, getTodayStr } from '@/shared/lib/dateUtils';

// Mathematical weight: 1 completed action = +0.2% daily compound growth (5 actions/day = ideal +1.0% daily growth for (1.01)^365 = 37.8x)
const GAIN_PER_ACTION_PERCENT = 0.2;

const getActionWord = (count: number) => {
  const abs = Math.abs(count) % 100;
  const lastDigit = abs % 10;
  if (abs > 10 && abs < 20) return 'действий';
  if (lastDigit === 1) return 'действие';
  if (lastDigit >= 2 && lastDigit <= 4) return 'действия';
  return 'действий';
};

const calculatePaceInfo = (dailyGainNum: number, totalTasksToday: number) => {
  if (totalTasksToday === 0 || dailyGainNum === 0) {
    return {
      paceMultiplier: '1.0x',
      neededTasks: 5,
      statusText: 'Сегодня пока 0%. Сделай 1 задачу (+0.2%), чтобы запустить сложный процент!',
      isTargetMet: false,
    };
  }

  const dailyRate = dailyGainNum / 100;
  const annualMult = Math.pow(1 + dailyRate, 365);
  const formattedPace = annualMult >= 100 ? `${Math.round(annualMult)}x` : `${annualMult.toFixed(1)}x`;

  const neededTasks = Math.max(0, 5 - totalTasksToday);
  const isTargetMet = totalTasksToday >= 5;

  let statusText = '';
  if (isTargetMet) {
    statusText = `🔥 Отлично! Ты закрыл ${totalTasksToday} ${getActionWord(totalTasksToday)} (+${dailyGainNum.toFixed(1)}%). Твой темп — ${formattedPace} за год (цель 37.8x перевыполнена)!`;
  } else {
    statusText = `Сегодня у тебя +${dailyGainNum.toFixed(1)}%. Такими темпами твой рост за год составит ${formattedPace}. Осталось всего ${neededTasks} ${getActionWord(neededTasks)}, чтобы выйти на 37.8x!`;
  }

  return {
    paceMultiplier: formattedPace,
    neededTasks,
    statusText,
    isTargetMet,
  };
};

export const CompoundedGrowthWidget: React.FC = () => {
  const { tasks } = useTaskStore();
  const categories = useCategoryStore((s) => s.categories);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const todayStr = useMemo(() => getTodayStr(), []);

  const compoundData = useMemo(() => {
    const validCats = categories.filter((c) => c.name.trim().toLowerCase() !== 'без категории');
    const sourceCats = validCats.length > 0 ? validCats : categories;

    if (sourceCats.length === 0) {
      return {
        list: [
          { id: '1', name: 'TypeScript', color: '#3b82f6', count: 3, gainPercent: '0.6' },
          { id: '2', name: 'Английский', color: '#8b5cf6', count: 2, gainPercent: '0.4' },
          { id: '3', name: 'Алгоритмы', color: '#10b981', count: 1, gainPercent: '0.2' },
        ],
        dailyPercentGain: '1.2',
        yearlyMultiplier: '37.8x',
        totalActionsToday: 6,
      };
    }

    let totalDoneToday = 0;

    const list = sourceCats.map((cat, idx) => {
      const catName = cat.name;
      const defaultColor = idx % 2 === 0 ? '#3b82f6' : idx % 3 === 1 ? '#8b5cf6' : '#10b981';
      const catColor = cat.color || getCategoryColor(catName) || defaultColor;

      const catTasks = tasks.filter(
        (t) => (t.category || 'Без категории').trim().toLowerCase() === catName.trim().toLowerCase()
      );

      let doneToday = 0;
      catTasks.forEach((t) => {
        const hasChildren = tasks.some((sub) => sub.parentTaskId === t.id);
        if (t.hasSubtasks || hasChildren) return;

        if (!t.isRepeating && t.status === 'Done') {
          const dateStr = (t.completedAt ? formatLocalDateStr(new Date(t.completedAt)) : undefined) || t.scheduledDate;
          if (dateStr === todayStr) doneToday += 1;
        }
        if (t.isRepeating && t.occurrences) {
          t.occurrences.forEach((occ) => {
            if (occ.status === 'Done' && occ.date === todayStr) doneToday += 1;
          });
        }
      });

      totalDoneToday += doneToday;
      const gainPercent = (doneToday * GAIN_PER_ACTION_PERCENT).toFixed(1);

      return {
        id: cat.id || `cat-${idx}`,
        name: catName,
        color: catColor,
        count: doneToday,
        gainPercent,
      };
    });

    // Sort: categories with growth (> 0) on top (sorted by count desc),
    // and categories without growth (=== 0) at the bottom
    const sortedList = list.sort((a, b) => {
      if (a.count > 0 && b.count === 0) return -1;
      if (a.count === 0 && b.count > 0) return 1;
      if (a.count > 0 && b.count > 0) {
        return b.count - a.count;
      }
      return 0;
    });

    const dailyPercentGain = (totalDoneToday * GAIN_PER_ACTION_PERCENT).toFixed(1);

    return {
      list: sortedList,
      dailyPercentGain,
      yearlyMultiplier: '37.8x',
      totalActionsToday: totalDoneToday,
    };
  }, [categories, tasks, todayStr]);

  if (!mounted) return null;

  const totalGainNum = Number(compoundData.dailyPercentGain);
  const paceInfo = calculatePaceInfo(totalGainNum, compoundData.totalActionsToday);

  return (
    <Card
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        padding: '20px 18px',
        borderRadius: '24px',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
      }}
    >
      {/* Header Section */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          paddingBottom: '12px',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            🎯 Прогресс за день
          </span>
        </div>

        {/* Progress Section: Top Filled % & (X/5) + 1% Goal + 10px Indicator Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 800,
                  color: totalGainNum > 0 ? '#10b981' : 'var(--color-text-muted)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {totalGainNum > 0 ? `+${compoundData.dailyPercentGain}%` : '0%'}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--color-text-muted)',
                  letterSpacing: '0.2px',
                }}
              >
                ({compoundData.totalActionsToday}/5{compoundData.totalActionsToday >= 5 ? ' ✓' : ''})
              </span>
            </div>

            <span
              style={{
                fontSize: '12px',
                fontWeight: 800,
                color: 'var(--color-text-secondary)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              1%
            </span>
          </div>

          {/* 10px Indicator Track */}
          <div
            style={{
              width: '100%',
              height: '10px',
              borderRadius: '5px',
              backgroundColor: 'var(--color-surface-hover)',
              border: '1px solid var(--color-border)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${Math.min(100, (totalGainNum / 1.0) * 100)}%`,
                height: '100%',
                borderRadius: '5px',
                backgroundColor: '#10b981',
                transition: 'width 0.6s ease',
              }}
            />
          </div>
        </div>

        {/* Glassmorphic Sub-Banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '7px 12px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.04)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--color-border)',
            fontSize: '11.5px',
            marginTop: '2px',
          }}
        >
          <span style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>
            ⚡ Прогноз: <strong style={{ color: '#10b981', fontWeight: 800 }}>{paceInfo.paceMultiplier}</strong>
          </span>
          <span style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>
            🎯 Цель: <strong style={{ color: 'var(--color-text-primary)', fontWeight: 800 }}>37.8x</strong>
          </span>
        </div>
      </div>

      {/* Category Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        {compoundData.list.map((item, idx) => {
          const isZero = item.count === 0;
          return (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '9px 0',
                borderBottom: idx < compoundData.list.length - 1 ? '1px solid var(--color-border)' : 'none',
                opacity: isZero ? 0.45 : 1,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: isZero ? 'var(--color-text-disabled)' : item.color,
                  }}
                />
                <span
                  style={{
                    fontSize: '13.5px',
                    fontWeight: 600,
                    color: isZero ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
                  }}
                >
                  {item.name}
                </span>
              </div>
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: isZero ? 'var(--color-text-muted)' : '#10b981',
                }}
              >
                {isZero ? '0%' : `+${item.gainPercent}%`}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
