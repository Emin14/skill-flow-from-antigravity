'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Card } from '@/shared/ui';
import { useTaskStore } from '@/entities/task';
import { useCategoryStore } from '@/entities/category/model/useCategoryStore';
import { getCategoryColor } from '@/shared/config/categoryColors';
import { formatLocalDateStr, getTodayStr } from '@/shared/lib/dateUtils';

type PeriodType = 'today' | '7days' | '30days';

const PERIOD_CONFIG: Record<
  PeriodType,
  { label: string; daysCount: number; targetDailyNorm: number }
> = {
  today: { label: 'день', daysCount: 1, targetDailyNorm: 5 },
  '7days': { label: '7 дней', daysCount: 7, targetDailyNorm: 35 },
  '30days': { label: '30 дней', daysCount: 30, targetDailyNorm: 150 },
};

const GAIN_PER_ACTION_PERCENT = 0.2;

export const CompoundedGrowthWidget: React.FC = () => {
  const { tasks } = useTaskStore();
  const categories = useCategoryStore((s) => s.categories);

  const [mounted, setMounted] = useState(false);
  const [period, setPeriod] = useState<PeriodType>('today');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('periodic-compound-growth-period');
    if (saved === 'today' || saved === '7days' || saved === '30days') {
      setPeriod(saved);
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handlePeriodChange = (p: PeriodType) => {
    setPeriod(p);
    setIsDropdownOpen(false);
    localStorage.setItem('periodic-compound-growth-period', p);
  };

  const todayStr = useMemo(() => getTodayStr(), []);

  // Generate date set for the chosen period
  const periodDateSet = useMemo(() => {
    const config = PERIOD_CONFIG[period];
    const set = new Set<string>();

    for (let i = 0; i < config.daysCount; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      set.add(formatLocalDateStr(d));
    }

    return set;
  }, [period]);

  const compoundData = useMemo(() => {
    const validCats = categories.filter((c) => c.name.trim().toLowerCase() !== 'без категории');
    const sourceCats = validCats.length > 0 ? validCats : categories;
    const config = PERIOD_CONFIG[period];

    if (sourceCats.length === 0) {
      const demoDone = period === 'today' ? 4 : period === '7days' ? 26 : 110;
      return {
        list: [
          { id: '1', name: 'TypeScript', color: '#3b82f6', count: Math.round(demoDone * 0.5), gainPercent: (demoDone * 0.5 * 0.2).toFixed(1) },
          { id: '2', name: 'Английский', color: '#8b5cf6', count: Math.round(demoDone * 0.3), gainPercent: (demoDone * 0.3 * 0.2).toFixed(1) },
          { id: '3', name: 'Алгоритмы', color: '#10b981', count: Math.round(demoDone * 0.2), gainPercent: (demoDone * 0.2 * 0.2).toFixed(1) },
        ],
        totalDone: demoDone,
        totalGainPercent: (demoDone * GAIN_PER_ACTION_PERCENT).toFixed(1),
        targetTasks: config.targetDailyNorm,
        targetPercent: `${(config.targetDailyNorm * GAIN_PER_ACTION_PERCENT).toFixed(0)}%`,
      };
    }

    let totalDone = 0;

    const list = sourceCats.map((cat, idx) => {
      const catName = cat.name;
      const defaultColor = idx % 2 === 0 ? '#3b82f6' : idx % 3 === 1 ? '#8b5cf6' : '#10b981';
      const catColor = cat.color || getCategoryColor(catName) || defaultColor;

      const catTasks = tasks.filter(
        (t) => (t.category || 'Без категории').trim().toLowerCase() === catName.trim().toLowerCase()
      );

      let doneInPeriod = 0;

      catTasks.forEach((t) => {
        const hasChildren = tasks.some((sub) => sub.parentTaskId === t.id);
        if (t.hasSubtasks || hasChildren) return;

        if (!t.isRepeating && t.status === 'Done') {
          const dateStr = (t.completedAt ? formatLocalDateStr(new Date(t.completedAt)) : undefined) || t.scheduledDate;
          if (dateStr && periodDateSet.has(dateStr)) {
            doneInPeriod += 1;
          }
        }

        if (t.isRepeating && t.occurrences) {
          t.occurrences.forEach((occ) => {
            if (occ.status === 'Done' && occ.date && periodDateSet.has(occ.date)) {
              doneInPeriod += 1;
            }
          });
        }

        if (t.repetitionHistory) {
          t.repetitionHistory.forEach((rec) => {
            const isRecDone = rec.completed === true || (rec as any).status === 'Done';
            if (isRecDone && rec.date && periodDateSet.has(rec.date)) {
              const alreadyCounted = t.occurrences?.some((o) => o.date === rec.date && o.status === 'Done');
              if (!alreadyCounted) {
                doneInPeriod += 1;
              }
            }
          });
        }
      });

      totalDone += doneInPeriod;
      const gainPercent = (doneInPeriod * GAIN_PER_ACTION_PERCENT).toFixed(1);

      return {
        id: cat.id || `cat-${idx}`,
        name: catName,
        color: catColor,
        count: doneInPeriod,
        gainPercent,
      };
    });

    const sortedList = list.sort((a, b) => {
      if (a.count > 0 && b.count === 0) return -1;
      if (a.count === 0 && b.count > 0) return 1;
      if (a.count > 0 && b.count > 0) {
        return b.count - a.count;
      }
      return 0;
    });

    const totalGainPercent = (totalDone * GAIN_PER_ACTION_PERCENT).toFixed(1);
    const targetTasks = config.targetDailyNorm;
    const targetPercent = `${(targetTasks * GAIN_PER_ACTION_PERCENT).toFixed(0)}%`;

    return {
      list: sortedList,
      totalDone,
      totalGainPercent,
      targetTasks,
      targetPercent,
    };
  }, [categories, tasks, period, periodDateSet]);

  if (!mounted) return null;

  const currentConfig = PERIOD_CONFIG[period];
  const totalGainNum = Number(compoundData.totalGainPercent);
  const isTargetMet = compoundData.totalDone >= compoundData.targetTasks;

  // Pace Calculation (Annual Multiplier based on daily average in period)
  const averageDailyActions = compoundData.totalDone / currentConfig.daysCount;
  const averageDailyGainRate = (averageDailyActions * GAIN_PER_ACTION_PERCENT) / 100;
  const annualMultiplier = Math.pow(1 + averageDailyGainRate, 365);
  const formattedPace =
    compoundData.totalDone === 0
      ? '1.0x'
      : annualMultiplier >= 100
      ? `${Math.round(annualMultiplier)}x`
      : `${annualMultiplier.toFixed(1)}x`;

  const progressPercent = Math.min(100, (compoundData.totalDone / compoundData.targetTasks) * 100);

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
      {/* Header Section with Custom Seamless Period Dropdown */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                lineHeight: 1,
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              🎯 Прогресс за
            </span>

            {/* Custom Seamless Dropdown with 100% Identical Typographical Baseline */}
            <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '3px 8px',
                  borderRadius: '7px',
                  backgroundColor: 'var(--color-surface-hover)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                  fontSize: '15px',
                  fontWeight: 700,
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  lineHeight: 1,
                  transition: 'all 0.15s ease',
                  userSelect: 'none',
                }}
              >
                <span>{PERIOD_CONFIG[period].label}</span>
                <span
                  style={{
                    fontSize: '8px',
                    color: 'var(--color-text-muted)',
                    transition: 'transform 0.2s ease',
                    transform: isDropdownOpen ? 'rotate(180deg)' : 'none',
                  }}
                >
                  ▼
                </span>
              </button>

              {/* Dropdown Popover */}
              {isDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    left: 0,
                    zIndex: 50,
                    minWidth: '100px',
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '10px',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.16)',
                    padding: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                  }}
                >
                  {(['today', '7days', '30days'] as PeriodType[]).map((p) => {
                    const isSelected = period === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => handlePeriodChange(p)}
                        style={{
                          textAlign: 'left',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          backgroundColor: isSelected ? 'var(--color-surface-hover)' : 'transparent',
                          color: isSelected ? '#10b981' : 'var(--color-text-primary)',
                          fontSize: '13.5px',
                          fontWeight: isSelected ? 700 : 500,
                          fontFamily: 'inherit',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'background-color 0.15s ease',
                        }}
                      >
                        <span>{PERIOD_CONFIG[p].label}</span>
                        {isSelected && <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 800 }}>✓</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Section: Top Filled % & (X/Total) + Goal % + 10px Indicator Bar */}
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
                {totalGainNum > 0 ? `+${compoundData.totalGainPercent}%` : '0%'}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--color-text-muted)',
                  letterSpacing: '0.2px',
                }}
              >
                ({compoundData.totalDone}/{compoundData.targetTasks}
                {isTargetMet ? ' ✓' : ''})
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
              {compoundData.targetPercent}
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
                width: `${progressPercent}%`,
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
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid var(--color-border)',
            fontSize: '11.5px',
            marginTop: '2px',
          }}
        >
          <span style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>
            ⚡ Прогноз: <strong style={{ color: '#10b981', fontWeight: 800 }}>{formattedPace}</strong>
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
