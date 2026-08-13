'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '@/shared/ui';
import { useTaskStore } from '@/entities/task';
import { useCategoryStore } from '@/entities/category/model/useCategoryStore';
import { getCategoryColor } from '@/shared/config/categoryColors';
import { formatLocalDateStr } from '@/shared/lib/dateUtils';

export interface CategoryProgressItem {
  id: string;
  name: string;
  color: string;
  periodCount: number;
  totalCount: number;
}

export type GrowthPeriod = 'today' | '7d' | '30d';

const PERIOD_OPTIONS: { id: GrowthPeriod; label: string; days: number }[] = [
  { id: 'today', label: 'Сегодня', days: 0 },
  { id: '7d', label: '7 дней', days: 7 },
  { id: '30d', label: '30 дней', days: 30 },
];

const getActionWord = (count: number) => {
  const abs = Math.abs(count) % 100;
  const lastDigit = abs % 10;
  if (abs > 10 && abs < 20) return 'действий';
  if (lastDigit === 1) return 'действие';
  if (lastDigit >= 2 && lastDigit <= 4) return 'действия';
  return 'действий';
};

export const CategoryGrowthWidget: React.FC = () => {
  const { tasks } = useTaskStore();
  const categories = useCategoryStore((s) => s.categories);

  const [mounted, setMounted] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<GrowthPeriod>('today');

  useEffect(() => {
    setMounted(true);
    const savedPeriod = localStorage.getItem('category-growth-widget-period') as GrowthPeriod;
    if (savedPeriod && PERIOD_OPTIONS.some((p) => p.id === savedPeriod)) {
      setSelectedPeriod(savedPeriod);
    } else {
      setSelectedPeriod('today');
    }
  }, []);

  const handlePeriodSelect = (p: GrowthPeriod) => {
    setSelectedPeriod(p);
    localStorage.setItem('category-growth-widget-period', p);
  };

  // Precise calculation based on real workspace categories & tasks
  const categoryData: CategoryProgressItem[] = useMemo(() => {
    const today = new Date();
    const todayStr = formatLocalDateStr(today);

    let minDateStr: string | null = null;
    if (selectedPeriod === 'today') {
      minDateStr = todayStr;
    } else {
      const days = selectedPeriod === '7d' ? 7 : 30;
      const minD = new Date(today);
      minD.setDate(minD.getDate() - days);
      minDateStr = formatLocalDateStr(minD);
    }

    const validCats = categories.filter((c) => c.name.trim().toLowerCase() !== 'без категории');
    const sourceCats = validCats.length > 0 ? validCats : categories;

    // Demo fallback if workspace has no categories
    if (sourceCats.length === 0) {
      const ratio = selectedPeriod === 'today' ? 0.08 : selectedPeriod === '7d' ? 0.25 : 0.45;
      return [
        { id: 'ts', name: 'TypeScript', color: '#3b82f6', periodCount: Math.round(12 * ratio) || 3, totalCount: 42 },
        { id: 'react', name: 'Опыт на камеру', color: '#6366f1', periodCount: Math.round(8 * ratio) || 2, totalCount: 27 },
        { id: 'algo', name: 'Теория', color: '#8b5cf6', periodCount: Math.round(15 * ratio) || 5, totalCount: 86 },
      ];
    }

    return sourceCats.map((catItem, idx) => {
      const catName = catItem.name;
      const defaultColor = idx % 2 === 0 ? '#3b82f6' : idx % 3 === 1 ? '#8b5cf6' : '#10b981';
      const catColor = catItem.color || getCategoryColor(catName) || defaultColor;

      const catTasks = tasks.filter(
        (t) => (t.category || 'Без категории').trim().toLowerCase() === catName.trim().toLowerCase()
      );

      let periodCount = 0;
      let totalCount = 0;

      catTasks.forEach((t) => {
        // Exclude parent tasks with subtasks to avoid double counting
        const hasChildren = tasks.some((sub) => sub.parentTaskId === t.id);
        if (t.hasSubtasks || hasChildren) return;

        // Non-repeating tasks
        if (!t.isRepeating) {
          if (t.status === 'Done') {
            totalCount += 1;
            const rawCompletedDate = t.completedAt ? t.completedAt.split('T')[0] : undefined;
            const rawUpdatedDate = t.updatedAt ? t.updatedAt.split('T')[0] : undefined;
            const rawCreatedDate = t.createdAt ? t.createdAt.split('T')[0] : undefined;
            const dateStr = rawCompletedDate || t.scheduledDate || rawUpdatedDate || rawCreatedDate || todayStr;

            if (minDateStr && dateStr >= minDateStr && dateStr <= todayStr) {
              periodCount += 1;
            }
          }
        }

        // Repeating tasks (occurrences)
        if (t.isRepeating && t.occurrences && t.occurrences.length > 0) {
          t.occurrences.forEach((occ) => {
            if (occ.status === 'Done' && occ.date) {
              totalCount += 1;
              if (minDateStr && occ.date >= minDateStr && occ.date <= todayStr) {
                periodCount += 1;
              }
            }
          });
        }

        // Legacy repetition history
        if (t.repetitionHistory && t.repetitionHistory.length > 0) {
          t.repetitionHistory.forEach((rec) => {
            const isDone = rec.completed === true || (rec as any).status === 'Done';
            if (rec.date && isDone) {
              const alreadyInOcc = t.occurrences?.some((o) => o.date === rec.date && o.status === 'Done');
              if (!alreadyInOcc) {
                totalCount += 1;
                if (minDateStr && rec.date >= minDateStr && rec.date <= todayStr) {
                  periodCount += 1;
                }
              }
            }
          });
        }
      });

      return {
        id: catItem.id || `cat-${idx}`,
        name: catName,
        color: catColor,
        periodCount,
        totalCount,
      };
    });
  }, [categories, tasks, selectedPeriod]);

  if (!mounted) return null;

  const allTimeActions = categoryData.reduce((sum, item) => sum + item.totalCount, 0);

  return (
    <Card style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '18px 16px', borderRadius: '22px', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
      {/* Widget Header (Title Only - Top Filter Removed) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '26px',
              height: '26px',
              borderRadius: '7px',
              background: 'rgba(16, 185, 129, 0.14)',
              border: '1px solid rgba(16, 185, 129, 0.28)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
          </div>
          <span style={{ fontSize: '15.5px', fontWeight: 700, letterSpacing: '-0.2px', color: 'var(--color-text-primary)' }}>Твой рост</span>
        </div>
      </div>

      {/* Subheader Counter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10.5px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
        <span>НАКОПЛЕННЫЙ ПРОГРЕСС</span>
        <span style={{ color: '#10b981', fontWeight: 700 }}>{allTimeActions} {getActionWord(allTimeActions)} развития</span>
      </div>

      {/* Table Header Row: Category | Period Selector (Green) | Total (Neutral) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 4px 5px 4px', borderBottom: '1px solid var(--color-border)' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', flex: 1, minWidth: 0 }}>Категория</span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
          {/* Period Selector Dropdown for Column 1 (Fixed 76px Centered) */}
          <div style={{ position: 'relative', width: '76px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <select
              value={selectedPeriod}
              onChange={(e) => handlePeriodSelect(e.target.value as GrowthPeriod)}
              style={{
                width: '100%',
                padding: '2px 14px 2px 4px',
                borderRadius: '5px',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#10b981',
                fontSize: '11px',
                fontWeight: 700,
                outline: 'none',
                cursor: 'pointer',
                appearance: 'none',
                WebkitAppearance: 'none',
                textAlign: 'center',
                textAlignLast: 'center',
              }}
            >
              {PERIOD_OPTIONS.map((p) => (
                <option
                  key={p.id}
                  value={p.id}
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-text-primary)',
                    textAlign: 'center',
                  }}
                >
                  {p.label}
                </option>
              ))}
            </select>
            <span style={{ position: 'absolute', right: '4px', pointerEvents: 'none', color: '#10b981', fontSize: '7.5px', fontWeight: 800 }}>▼</span>
          </div>

          {/* Total Header for Column 2 (Fixed 48px Centered) */}
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', width: '48px', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            Всего
          </span>
        </div>
      </div>

      {/* Category Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        {categoryData.map((s, idx) => {
          const isZero = s.periodCount === 0;
          return (
            <div
              key={s.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 4px',
                borderBottom: idx < categoryData.length - 1 ? '1px solid var(--color-border)' : 'none',
                opacity: isZero ? 0.45 : 1,
                transition: 'opacity 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: 0, flex: 1, paddingRight: '8px' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: isZero ? 'var(--color-text-disabled)' : s.color, flexShrink: 0 }} />
                <span style={{ fontSize: '13px', fontWeight: isZero ? 500 : 600, color: isZero ? 'var(--color-text-muted)' : 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {s.name}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
                {/* Period Column Value (Green '+' if > 0, Neutral '0' if 0 - Fixed 76px Centered) */}
                <span
                  style={{
                    fontSize: '13.5px',
                    fontWeight: isZero ? 500 : 700,
                    color: isZero ? 'var(--color-text-muted)' : '#10b981',
                    fontVariantNumeric: 'tabular-nums',
                    width: '76px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  {isZero ? '0' : `+${s.periodCount}`}
                </span>

                {/* Total Column Value (Neutral - Fixed 48px Centered) */}
                <span
                  style={{
                    fontSize: '13.5px',
                    fontWeight: 600,
                    color: isZero ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
                    fontVariantNumeric: 'tabular-nums',
                    width: '48px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    opacity: isZero ? 0.8 : 0.9,
                  }}
                >
                  {s.totalCount}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
