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
  completedCount: number;
}

export type TimePeriod = 'today' | '7d' | '14d' | '30d' | '90d' | '180d' | '365d' | 'all';

const PERIOD_OPTIONS: { id: TimePeriod; label: string; days: number }[] = [
  { id: 'today', label: 'За сегодня', days: 0 },
  { id: '7d', label: 'За неделю', days: 7 },
  { id: '14d', label: '2 недели', days: 14 },
  { id: '30d', label: '1 месяц', days: 30 },
  { id: '90d', label: '3 месяца', days: 90 },
  { id: '180d', label: '6 месяцев', days: 180 },
  { id: '365d', label: '1 год', days: 365 },
  { id: 'all', label: 'За все время', days: 730 },
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
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('all');

  useEffect(() => {
    setMounted(true);
    const savedPeriod = localStorage.getItem('category-growth-widget-period') as TimePeriod;
    if (savedPeriod && PERIOD_OPTIONS.some((p) => p.id === savedPeriod)) {
      setSelectedPeriod(savedPeriod);
    } else {
      setSelectedPeriod('all');
    }
  }, []);

  const handlePeriodSelect = (p: TimePeriod) => {
    setSelectedPeriod(p);
    localStorage.setItem('category-growth-widget-period', p);
  };

  const currentPeriod = useMemo(() => {
    return PERIOD_OPTIONS.find((p) => p.id === selectedPeriod) || PERIOD_OPTIONS[7];
  }, [selectedPeriod]);

  // Precise calculation based on real workspace categories & tasks
  const categoryData: CategoryProgressItem[] = useMemo(() => {
    const today = new Date();
    const todayStr = formatLocalDateStr(today);
    let minDateStr: string | null = null;

    if (selectedPeriod === 'today') {
      minDateStr = todayStr;
    } else if (selectedPeriod !== 'all') {
      const minD = new Date(today);
      minD.setDate(minD.getDate() - currentPeriod.days);
      minDateStr = formatLocalDateStr(minD);
    }

    const validCats = categories.filter((c) => c.name.trim().toLowerCase() !== 'без категории');
    const sourceCats = validCats.length > 0 ? validCats : categories;

    // Demo fallback if workspace has no categories
    if (sourceCats.length === 0) {
      const ratio =
        selectedPeriod === 'today'
          ? 0.05
          : selectedPeriod === '7d'
          ? 0.12
          : selectedPeriod === '14d'
          ? 0.20
          : selectedPeriod === '30d'
          ? 0.35
          : selectedPeriod === '90d'
          ? 0.55
          : selectedPeriod === '180d'
          ? 0.75
          : selectedPeriod === '365d'
          ? 0.90
          : 1.0;

      return [
        { id: 'ts', name: 'TypeScript', color: '#3b82f6', completedCount: Math.round(124 * ratio) },
        { id: 'react', name: 'React', color: '#6366f1', completedCount: Math.round(87 * ratio) },
        { id: 'algo', name: 'Алгоритмы', color: '#8b5cf6', completedCount: Math.round(61 * ratio) },
        { id: 'eng', name: 'Английский', color: '#10b981', completedCount: Math.round(73 * ratio) },
      ];
    }

    return sourceCats.map((catItem, idx) => {
      const catName = catItem.name;
      const defaultColor = idx % 2 === 0 ? '#3b82f6' : idx % 3 === 1 ? '#8b5cf6' : '#10b981';
      const catColor = catItem.color || getCategoryColor(catName) || defaultColor;

      const catTasks = tasks.filter(
        (t) => (t.category || 'Без категории').trim().toLowerCase() === catName.trim().toLowerCase()
      );

      let count = 0;
      catTasks.forEach((t) => {
        // Exclude parent tasks with subtasks to avoid double counting
        const hasChildren = tasks.some((sub) => sub.parentTaskId === t.id);
        if (t.hasSubtasks || hasChildren) return;

        // Non-repeating tasks
        if (!t.isRepeating) {
          if (t.status === 'Done') {
            const dateStr =
              (t.completedAt ? formatLocalDateStr(new Date(t.completedAt)) : undefined) ||
              t.scheduledDate ||
              (t.updatedAt ? formatLocalDateStr(new Date(t.updatedAt)) : undefined) ||
              (t.createdAt ? formatLocalDateStr(new Date(t.createdAt)) : undefined) ||
              todayStr;

            if (!minDateStr || (dateStr >= minDateStr && dateStr <= todayStr)) {
              count += 1;
            }
          }
        }

        // Repeating tasks (occurrences)
        if (t.isRepeating && t.occurrences && t.occurrences.length > 0) {
          t.occurrences.forEach((occ) => {
            if (occ.status === 'Done' && occ.date) {
              if (!minDateStr || (occ.date >= minDateStr && occ.date <= todayStr)) {
                count += 1;
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
                if (!minDateStr || (rec.date >= minDateStr && rec.date <= todayStr)) {
                  count += 1;
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
        completedCount: count,
      };
    });
  }, [categories, tasks, selectedPeriod, currentPeriod.days]);

  if (!mounted) return null;

  const totalActions = categoryData.reduce((sum, item) => sum + item.completedCount, 0);

  return (
    <Card style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '22px 18px', borderRadius: '24px', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
      {/* Widget Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.14)',
              border: '1px solid rgba(16, 185, 129, 0.28)',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
          </div>
          <span style={{ fontSize: '16.5px', fontWeight: 700, letterSpacing: '-0.2px', color: 'var(--color-text-primary)' }}>Твой рост</span>
        </div>

        {/* Period Selector Dropdown */}
        <div style={{ position: 'relative' }}>
          <select
            value={selectedPeriod}
            onChange={(e) => handlePeriodSelect(e.target.value as TimePeriod)}
            style={{
              padding: '5px 24px 5px 12px',
              borderRadius: '10px',
              backgroundColor: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
              fontSize: '12px',
              fontWeight: 600,
              outline: 'none',
              cursor: 'pointer',
              appearance: 'none',
              WebkitAppearance: 'none',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.12)',
            }}
          >
            {PERIOD_OPTIONS.map((p) => (
              <option
                key={p.id}
                value={p.id}
                style={{
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-primary)',
                }}
              >
                {p.label}
              </option>
            ))}
          </select>
          <span style={{ position: 'absolute', right: '9px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#10b981', fontSize: '9px', fontWeight: 800 }}>▼</span>
        </div>
      </div>

      {/* Subheader Counter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
        <span>НАКОПЛЕННЫЙ ПРОГРЕСС</span>
        <span style={{ color: '#10b981', fontWeight: 700 }}>{totalActions} {getActionWord(totalActions)} развития</span>
      </div>

      {/* Category Rows (Ultra-Minimalist Numbers) */}
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        {categoryData.map((s, idx) => (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 4px', borderBottom: idx < categoryData.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color }} />
              <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{s.name}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span
                style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#10b981',
                  fontVariantNumeric: 'tabular-nums',
                  letterSpacing: '-0.3px',
                }}
              >
                +{s.completedCount}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
