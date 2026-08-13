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

const VARIANT_TITLES = [
  'Вариант 1: Классические плашки (Текущий)',
  'Вариант 2: Минималистичная таблица с треком',
  'Вариант 3: Hero-баннер с формулой Клира',
  'Вариант 4: Двухколоночный сетчатый Grid',
  'Вариант 5: Стеклянные карточки (Glass-style)',
  'Вариант 6: Круговой кольцевой прогресс дня',
  'Вариант 7: Apple-минимализм с тонкими разделителями',
  'Вариант 8: Мотивационные плитки навыков',
  'Вариант 9: Таблица «Задачи vs Вклад %»',
  'Вариант 10: Индикатор заряда батареи роста',
  'Вариант 11: 5-шаговая трекинг-шкала',
  'Вариант 12: Калькулятор годового профита (ROI)',
  'Вариант 13: Шкала Duolingo и уровень',
  'Вариант 14: Горизонтальные чипы роста',
  'Вариант 15: Финансовый портфель эффективности',
  'Вариант 16: Матрица 5 точек дня',
  'Вариант 17: Сегментированный шкальный метр',
  'Вариант 18: Крупное число + Спарклайн',
  'Вариант 19: Карточки с разбором вклада',
  'Вариант 20: Ультра-чистый дашборд',
  'Вариант 21: Дневная норма роста (Apple-список)',
  'Вариант 22: Apple-список + Баннер прогноза внизу (8.9x vs 37.8x)',
  'Вариант 23: Apple-список + Двойной бейдж темпа (8.9x vs 37.8x)',
  'Вариант 24: Apple-список + Инвест-прогноз роста капитала',
  'Вариант 25: Apple-список + Диалог тренера (Duolingo Coach)',
  'Вариант 26: Apple-список + Сравнительный трек темпа (8.9x vs 37.8x)',
  'Вариант 27: Apple-список + Исполнительный дашборд темпа',
  'Вариант 28: Однострочная плашка с рамкой (8.9x vs 37.8x)',
  'Вариант 29: Ультра-чистая строка с точкой-разделителем',
  'Вариант 30: Две раздельные Apple-капсулы (В 1 ряд)',
  'Вариант 31: Изумрудная полупрозрачная строка-акцент',
  'Вариант 32: Финансовый микро-шрифт (ГОДОВОЙ ТЕМП / ЭТАЛОН)',
  'Вариант 33: Чистая строка с дельтой от цели (-76%)',
  'Вариант 34: Стеклянная плашка (Glassmorphic inline)',
  'Вариант 35: Микро-чипы темпа в один ряд',
];

export const CompoundedGrowthWidget: React.FC = () => {
  const { tasks } = useTaskStore();
  const categories = useCategoryStore((s) => s.categories);

  const [mounted, setMounted] = useState(false);
  const [activeVariant, setActiveVariant] = useState<number>(1);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('compounded-growth-widget-variant');
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (parsed >= 1 && parsed <= 35) setActiveVariant(parsed);
    }
  }, []);

  const handleVariantChange = (v: number) => {
    setActiveVariant(v);
    localStorage.setItem('compounded-growth-widget-variant', v.toString());
  };

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

    const dailyPercentGain = (totalDoneToday * GAIN_PER_ACTION_PERCENT).toFixed(1);

    return {
      list,
      dailyPercentGain,
      yearlyMultiplier: '37.8x',
      totalActionsToday: totalDoneToday,
    };
  }, [categories, tasks, todayStr]);

  if (!mounted) return null;

  const totalGainNum = Number(compoundData.dailyPercentGain);
  const paceInfo = calculatePaceInfo(totalGainNum, compoundData.totalActionsToday);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
      {/* 🧪 VARIANT SWITCHER CONTROLS BAR */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 12px', borderRadius: '14px', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '12px' }}>🧪</span>
          <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            Сложный процент ({activeVariant}/35)
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => handleVariantChange(activeVariant > 1 ? activeVariant - 1 : 35)}
            style={{
              padding: '3px 8px',
              borderRadius: '6px',
              backgroundColor: 'var(--color-surface-hover)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            ←
          </button>

          <select
            value={activeVariant}
            onChange={(e) => handleVariantChange(Number(e.target.value))}
            style={{
              padding: '3px 8px',
              borderRadius: '6px',
              backgroundColor: 'var(--color-surface-hover)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
              fontSize: '11px',
              fontWeight: 600,
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            {VARIANT_TITLES.map((t, idx) => (
              <option key={idx + 1} value={idx + 1} style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text-primary)' }}>
                {t}
              </option>
            ))}
          </select>

          <button
            onClick={() => handleVariantChange(activeVariant < 35 ? activeVariant + 1 : 1)}
            style={{
              padding: '3px 8px',
              borderRadius: '6px',
              backgroundColor: 'var(--color-surface-hover)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            →
          </button>
        </div>
      </div>

      {/* ─────────────────── VARIANT 1: Classic Pill Cards ─────────────────── */}
      {activeVariant === 1 && (
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '20px 18px', borderRadius: '24px', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '7px', background: 'rgba(16, 185, 129, 0.14)', border: '1px solid rgba(16, 185, 129, 0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '13px' }}>📈</span>
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.2px' }}>Сложный процент роста</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 500 }}>(1.01)³⁶⁵ = {compoundData.yearlyMultiplier} роста в год</div>
              </div>
            </div>

            <span style={{ fontSize: '11.5px', fontWeight: 700, color: totalGainNum > 0 ? '#10b981' : 'var(--color-text-muted)', backgroundColor: totalGainNum > 0 ? 'rgba(16, 185, 129, 0.12)' : 'var(--color-surface-hover)', padding: '3px 9px', borderRadius: '8px' }}>
              {totalGainNum > 0 ? `+${compoundData.dailyPercentGain}% сегодня` : '0% сегодня'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {compoundData.list.map((item) => {
              const isZero = item.count === 0;
              return (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '12px', background: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', opacity: isZero ? 0.5 : 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: isZero ? 'var(--color-text-disabled)' : item.color }} />
                    <span style={{ fontSize: '13px', fontWeight: 600, color: isZero ? 'var(--color-text-muted)' : 'var(--color-text-primary)' }}>{item.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                    <span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>{item.count} {getActionWord(item.count)}</span>
                    <span style={{ fontWeight: 700, color: isZero ? 'var(--color-text-muted)' : '#10b981' }}>({isZero ? '0%' : `+${item.gainPercent}%`})</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 500, fontStyle: 'italic', borderTop: '1px dashed var(--color-border)', paddingTop: '8px' }}>
            💡 «Маленькие ежедневные шаги дают гигантский прыжок на дистанции года»
          </div>
        </Card>
      )}

      {/* ─────────────────── VARIANT 2: Minimalist Table with Progress Tracks ─────────────────── */}
      {activeVariant === 2 && (
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px 18px', borderRadius: '24px', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>📈 Сложный процент роста</div>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#10b981' }}>+{compoundData.dailyPercentGain}% / день</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {compoundData.list.map((item) => {
              const isZero = item.count === 0;
              const fillPercent = Math.min(100, (item.count / 5) * 100);
              return (
                <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px', opacity: isZero ? 0.45 : 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: item.color }} />
                      <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{item.name}</span>
                    </div>
                    <span style={{ fontWeight: 700, color: isZero ? 'var(--color-text-muted)' : '#10b981' }}>
                      {isZero ? '0%' : `+${item.gainPercent}%`}
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '5px', borderRadius: '3px', backgroundColor: 'var(--color-surface-hover)', overflow: 'hidden' }}>
                    <div style={{ width: `${fillPercent}%`, height: '100%', backgroundColor: isZero ? 'var(--color-text-disabled)' : item.color, borderRadius: '3px' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* ─────────────────── VARIANT 3: Hero Formula Card ─────────────────── */}
      {activeVariant === 3 && (
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '20px 18px', borderRadius: '24px', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div style={{ padding: '14px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.02) 100%)', border: '1px solid rgba(16, 185, 129, 0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600 }}>ДНЕВНОЙ ПРИРОСТ МАКСИМАЛЬНОЙ ФОРМЫ</div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#10b981', lineHeight: 1.1 }}>+{compoundData.dailyPercentGain}%</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600 }}>ФОРМУЛА ГОДА</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>(1.01)³⁶⁵ = 37.8x</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {compoundData.list.map((item) => (
              <div key={item.id} style={{ flex: '1 1 calc(50% - 4px)', padding: '10px 12px', borderRadius: '12px', background: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '2px', opacity: item.count === 0 ? 0.45 : 1 }}>
                <span style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', fontWeight: 600 }}>{item.name}</span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: item.count === 0 ? 'var(--color-text-muted)' : '#10b981' }}>{item.count === 0 ? '0%' : `+${item.gainPercent}%`}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ─────────────────── VARIANT 4: Side-by-Side Dual Column Grid ─────────────────── */}
      {activeVariant === 4 && (
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px 18px', borderRadius: '24px', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>📈 Сложный процент развития</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {compoundData.list.map((item) => (
              <div key={item.id} style={{ padding: '12px', borderRadius: '14px', background: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '6px', opacity: item.count === 0 ? 0.5 : 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }} />
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{item.name}</span>
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: item.count === 0 ? 'var(--color-text-muted)' : '#10b981' }}>{item.count === 0 ? '0%' : `+${item.gainPercent}%`}</div>
                <span style={{ fontSize: '10.5px', color: 'var(--color-text-muted)' }}>{item.count} {getActionWord(item.count)} сегодня</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ─────────────────── VARIANT 5: Stacked Glass Chips ─────────────────── */}
      {activeVariant === 5 && (
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px 18px', borderRadius: '24px', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>📈 Накопительный эффект</span>
            <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#10b981', background: 'rgba(16, 185, 129, 0.14)', padding: '4px 10px', borderRadius: '10px' }}>Итог: +{compoundData.dailyPercentGain}%</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {compoundData.list.map((item) => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)', border: '1px solid var(--color-border)', opacity: item.count === 0 ? 0.45 : 1 }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{item.name}</span>
                <span style={{ fontSize: '13.5px', fontWeight: 800, color: item.count === 0 ? 'var(--color-text-muted)' : '#10b981', fontVariantNumeric: 'tabular-nums' }}>{item.count === 0 ? '0%' : `+${item.gainPercent}%`}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ─────────────────── VARIANT 6: Target Ring Layout (5 Tasks = 100%) ─────────────────── */}
      {activeVariant === 6 && (
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '20px 18px', borderRadius: '24px', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>📈 Сложный процент (5 задач = 1%)</span>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>(1.01)³⁶⁵ = 37.8x</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: '12px', alignItems: 'center' }}>
            <div style={{ width: '70px', height: '70px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="70" height="70" viewBox="0 0 70 70">
                <circle cx="35" cy="35" r="28" stroke="var(--color-border)" strokeWidth="6" fill="none" />
                <circle cx="35" cy="35" r="28" stroke="#10b981" strokeWidth="6" strokeDasharray={175} strokeDashoffset={175 - (Math.min(5, compoundData.totalActionsToday) / 5) * 175} strokeLinecap="round" fill="none" transform="rotate(-90 35 35)" />
              </svg>
              <span style={{ position: 'absolute', fontSize: '13px', fontWeight: 800, color: '#10b981' }}>+{compoundData.dailyPercentGain}%</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {compoundData.list.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', opacity: item.count === 0 ? 0.45 : 1 }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{item.name}</span>
                  <span style={{ fontWeight: 700, color: item.count === 0 ? 'var(--color-text-muted)' : '#10b981' }}>{item.count === 0 ? '0%' : `+${item.gainPercent}%`}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* ─────────────────── VARIANT 7: Apple Minimalist List ─────────────────── */}
      {activeVariant === 7 && (
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px 18px', borderRadius: '24px', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>📈 Сложный процент</span>
            <span style={{ fontSize: '16px', fontWeight: 800, color: '#10b981', fontVariantNumeric: 'tabular-nums' }}>+{compoundData.dailyPercentGain}%</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            {compoundData.list.map((item, idx) => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: idx < compoundData.list.length - 1 ? '1px solid var(--color-border)' : 'none', opacity: item.count === 0 ? 0.45 : 1 }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{item.name}</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: item.count === 0 ? 'var(--color-text-muted)' : '#10b981', fontVariantNumeric: 'tabular-nums' }}>{item.count === 0 ? '0%' : `+${item.gainPercent}%`}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ─────────────────── VARIANT 8: Atomic Habit Cards with Advice ─────────────────── */}
      {activeVariant === 8 && (
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '20px 18px', borderRadius: '24px', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>🌱 Атомные привычки</span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#10b981' }}>Всего: +{compoundData.dailyPercentGain}%</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {compoundData.list.map((item) => (
              <div key={item.id} style={{ padding: '10px 14px', borderRadius: '14px', background: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: item.count === 0 ? 0.45 : 1 }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{item.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{item.count} {getActionWord(item.count)} сегодня</div>
                </div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: item.count === 0 ? 'var(--color-text-muted)' : '#10b981' }}>{item.count === 0 ? '0%' : `+${item.gainPercent}%`}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ─────────────────── VARIANT 9: Split Table (Tasks vs Impact) ─────────────────── */}
      {activeVariant === 9 && (
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px 18px', borderRadius: '24px', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>📈 Таблица прироста</span>
            <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#10b981' }}>1 задача = +0.2%</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 6px', fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border)' }}>
            <span>Категория</span>
            <span>Задачи</span>
            <span>Прирост</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {compoundData.list.map((item) => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 6px', fontSize: '12.5px', opacity: item.count === 0 ? 0.45 : 1 }}>
                <span style={{ fontWeight: 600, color: 'var(--color-text-primary)', flex: 1 }}>{item.name}</span>
                <span style={{ color: 'var(--color-text-muted)', width: '60px', textAlign: 'center' }}>{item.count}</span>
                <span style={{ fontWeight: 700, color: item.count === 0 ? 'var(--color-text-muted)' : '#10b981', width: '60px', textAlign: 'right' }}>{item.count === 0 ? '0%' : `+${item.gainPercent}%`}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ─────────────────── VARIANT 10: Battery Charge Indicator ─────────────────── */}
      {activeVariant === 10 && (
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '20px 18px', borderRadius: '24px', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>⚡ Заряд роста дня</span>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#10b981' }}>+{compoundData.dailyPercentGain}%</span>
          </div>

          <div style={{ width: '100%', height: '22px', borderRadius: '11px', backgroundColor: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', padding: '2px', display: 'flex', overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(100, (compoundData.totalActionsToday / 5) * 100)}%`, height: '100%', borderRadius: '9px', background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)', transition: 'width 0.6s ease' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
            <span>Цель: 5 задач (+1.0%)</span>
            <span>Выполнено: {compoundData.totalActionsToday} задач</span>
          </div>
        </Card>
      )}

      {/* ─────────────────── VARIANT 11: 5-Step Progress Timeline ─────────────────── */}
      {activeVariant === 11 && (
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '20px 18px', borderRadius: '24px', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>📈 5 шагов к 1% роста</span>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#10b981' }}>+{compoundData.dailyPercentGain}%</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', padding: '0 10px' }}>
            {[1, 2, 3, 4, 5].map((step) => {
              const active = compoundData.totalActionsToday >= step;
              return (
                <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', zIndex: 1 }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: active ? '#10b981' : 'var(--color-surface-hover)', border: `2px solid ${active ? '#10b981' : 'var(--color-border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: active ? '#ffffff' : 'var(--color-text-muted)', fontSize: '10px', fontWeight: 800 }}>
                    +{step * 0.2}%
                  </div>
                  <span style={{ fontSize: '10px', color: active ? '#10b981' : 'var(--color-text-muted)', fontWeight: 600 }}>{step} з.</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* ─────────────────── VARIANT 12: Yearly ROI Calculator ─────────────────── */}
      {activeVariant === 12 && (
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px 18px', borderRadius: '24px', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div style={{ padding: '14px', borderRadius: '16px', background: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600 }}>ПРОГНОЗ ГОДОВОГО УМНОЖЕНИЯ</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#10b981' }}>37.8x за год</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600 }}>СЕГОДНЯ</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)' }}>+{compoundData.dailyPercentGain}%</div>
            </div>
          </div>
        </Card>
      )}

      {/* ─────────────────── VARIANT 13: Duolingo Mastery Meter ─────────────────── */}
      {activeVariant === 13 && (
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '20px 18px', borderRadius: '24px', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>🎯 Дневная норма роста</span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#8b5cf6', backgroundColor: 'rgba(139, 92, 246, 0.12)', padding: '3px 8px', borderRadius: '8px' }}>Duolingo style</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Цель: 1.0% в день</span>
              <span style={{ fontWeight: 800, color: '#10b981' }}>+{compoundData.dailyPercentGain}%</span>
            </div>
            <div style={{ width: '100%', height: '10px', borderRadius: '5px', backgroundColor: 'var(--color-surface-hover)', overflow: 'hidden' }}>
              <div style={{ width: `${Math.min(100, (totalGainNum / 1.0) * 100)}%`, height: '100%', borderRadius: '5px', backgroundColor: '#10b981' }} />
            </div>
          </div>
        </Card>
      )}

      {/* ─────────────────── VARIANT 14: Horizontal Chip Carousel ─────────────────── */}
      {activeVariant === 14 && (
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px 18px', borderRadius: '24px', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>📈 Чипы роста</span>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#10b981' }}>+{compoundData.dailyPercentGain}%</span>
          </div>

          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {compoundData.list.map((item) => (
              <div key={item.id} style={{ flex: '0 0 auto', padding: '6px 12px', borderRadius: '20px', background: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', opacity: item.count === 0 ? 0.45 : 1 }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: item.color }} />
                <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{item.name}</span>
                <span style={{ fontWeight: 800, color: item.count === 0 ? 'var(--color-text-muted)' : '#10b981' }}>{item.count === 0 ? '0%' : `+${item.gainPercent}%`}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ─────────────────── VARIANT 15: Financial Portfolio ROI ─────────────────── */}
      {activeVariant === 15 && (
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px 18px', borderRadius: '24px', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600 }}>ПРИРОСТ КАПИТАЛА НАВЫКОВ</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#10b981' }}>+{compoundData.dailyPercentGain}% ROI</div>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)' }}>(1.01)³⁶⁵ = 37.8x</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {compoundData.list.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', padding: '6px 8px', borderRadius: '8px', background: 'var(--color-surface-hover)', opacity: item.count === 0 ? 0.45 : 1 }}>
                <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{item.name}</span>
                <span style={{ fontWeight: 700, color: item.count === 0 ? 'var(--color-text-muted)' : '#10b981' }}>{item.count === 0 ? '0.00%' : `+${item.gainPercent}%`}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ─────────────────── VARIANT 16: Dot Matrix (5 Dots) ─────────────────── */}
      {activeVariant === 16 && (
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px 18px', borderRadius: '24px', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>📈 Матрица 5 действий</span>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#10b981' }}>+{compoundData.dailyPercentGain}%</span>
          </div>

          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
            {[1, 2, 3, 4, 5].map((dot) => {
              const active = compoundData.totalActionsToday >= dot;
              return (
                <div key={dot} style={{ width: '40px', height: '8px', borderRadius: '4px', backgroundColor: active ? '#10b981' : 'var(--color-surface-hover)', border: `1px solid ${active ? '#10b981' : 'var(--color-border)'}` }} />
              );
            })}
          </div>
        </Card>
      )}

      {/* ─────────────────── VARIANT 17: Segmented Meter ─────────────────── */}
      {activeVariant === 17 && (
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px 18px', borderRadius: '24px', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>📈 Сегментированный метр</span>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#10b981' }}>+{compoundData.dailyPercentGain}%</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
            {[1, 2, 3, 4, 5].map((seg) => (
              <div key={seg} style={{ height: '14px', borderRadius: '4px', backgroundColor: compoundData.totalActionsToday >= seg ? '#10b981' : 'var(--color-surface-hover)', border: '1px solid var(--color-border)' }} />
            ))}
          </div>
        </Card>
      )}

      {/* ─────────────────── VARIANT 18: Headline + Micro Sparkline ─────────────────── */}
      {activeVariant === 18 && (
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px 18px', borderRadius: '24px', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span style={{ fontSize: '32px', fontWeight: 800, color: '#10b981', lineHeight: 1 }}>+{compoundData.dailyPercentGain}%</span>
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>прирост формы за сегодня</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Основано на формуле (1.01)³⁶⁵ = 37.8x за год</div>
        </Card>
      )}

      {/* ─────────────────── VARIANT 19: Accordion Impact Cards ─────────────────── */}
      {activeVariant === 19 && (
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px 18px', borderRadius: '24px', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>📈 Вклад каждой задачи (+0.2%)</span>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#10b981' }}>+{compoundData.dailyPercentGain}%</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {compoundData.list.map((item) => (
              <div key={item.id} style={{ padding: '8px 12px', borderRadius: '10px', background: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: item.count === 0 ? 0.45 : 1 }}>
                <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{item.name}</span>
                <span style={{ fontSize: '12.5px', fontWeight: 800, color: item.count === 0 ? 'var(--color-text-muted)' : '#10b981' }}>{item.count === 0 ? '0%' : `+${item.gainPercent}%`}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ─────────────────── VARIANT 20: Executive Dashboard Tile ─────────────────── */}
      {activeVariant === 20 && (
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '20px 18px', borderRadius: '24px', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600 }}>ИМПУЛЬС ДНЯ</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-primary)' }}>Сложный процент</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#10b981' }}>+{compoundData.dailyPercentGain}%</div>
              <div style={{ fontSize: '10.5px', color: 'var(--color-text-muted)' }}>5 задач = 1.0%</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {compoundData.list.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', opacity: item.count === 0 ? 0.45 : 1 }}>
                <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{item.name}</span>
                <span style={{ fontWeight: 700, color: item.count === 0 ? 'var(--color-text-muted)' : '#10b981' }}>{item.count === 0 ? '0%' : `+${item.gainPercent}%`}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ─────────────────── VARIANT 21: Daily Norm Progress + Apple Minimalist List ─────────────────── */}
      {activeVariant === 21 && (
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '20px 18px', borderRadius: '24px', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '12px', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>🎯 Дневная норма роста</span>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 500 }}>(1.01)³⁶⁵ = 37.8x</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Цель: 1.0% в день</span>
                <span style={{ fontWeight: 800, color: totalGainNum > 0 ? '#10b981' : 'var(--color-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                  {totalGainNum > 0 ? `+${compoundData.dailyPercentGain}%` : '0%'}
                </span>
              </div>
              <div style={{ width: '100%', height: '10px', borderRadius: '5px', backgroundColor: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
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
          </div>

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
                    padding: '10px 0',
                    borderBottom: idx < compoundData.list.length - 1 ? '1px solid var(--color-border)' : 'none',
                    opacity: isZero ? 0.45 : 1,
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: isZero ? 'var(--color-text-disabled)' : item.color }} />
                    <span style={{ fontSize: '13.5px', fontWeight: 600, color: isZero ? 'var(--color-text-muted)' : 'var(--color-text-primary)' }}>
                      {item.name}
                    </span>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: isZero ? 'var(--color-text-muted)' : '#10b981', fontVariantNumeric: 'tabular-nums' }}>
                    {isZero ? '0%' : `+${item.gainPercent}%`}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* ─────────────────── VARIANT 22: Apple-список + Баннер прогноза внизу ─────────────────── */}
      {activeVariant === 22 && (
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '20px 18px', borderRadius: '24px', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '12px', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>🎯 Дневная норма роста</span>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 500 }}>(1.01)³⁶⁵ = 37.8x</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Цель: 1.0% в день</span>
                <span style={{ fontWeight: 800, color: totalGainNum > 0 ? '#10b981' : 'var(--color-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                  {totalGainNum > 0 ? `+${compoundData.dailyPercentGain}%` : '0%'}
                </span>
              </div>
              <div style={{ width: '100%', height: '10px', borderRadius: '5px', backgroundColor: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (totalGainNum / 1.0) * 100)}%`, height: '100%', borderRadius: '5px', backgroundColor: '#10b981', transition: 'width 0.6s ease' }} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            {compoundData.list.map((item, idx) => {
              const isZero = item.count === 0;
              return (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: idx < compoundData.list.length - 1 ? '1px solid var(--color-border)' : 'none', opacity: isZero ? 0.45 : 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: isZero ? 'var(--color-text-disabled)' : item.color }} />
                    <span style={{ fontSize: '13.5px', fontWeight: 600, color: isZero ? 'var(--color-text-muted)' : 'var(--color-text-primary)' }}>{item.name}</span>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: isZero ? 'var(--color-text-muted)' : '#10b981' }}>{isZero ? '0%' : `+${item.gainPercent}%`}</span>
                </div>
              );
            })}
          </div>

          <div style={{ padding: '10px 12px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.22)', fontSize: '11.5px', color: 'var(--color-text-primary)', lineHeight: 1.4, fontWeight: 500 }}>
            💡 {paceInfo.statusText}
          </div>
        </Card>
      )}

      {/* ─────────────────── VARIANT 23: Apple-список + Двойной бейдж темпа (8.9x vs 37.8x) ─────────────────── */}
      {activeVariant === 23 && (
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '20px 18px', borderRadius: '24px', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '12px', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>🎯 Дневная норма роста</span>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 500 }}>(1.01)³⁶⁵ = 37.8x</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Цель: 1.0% в день</span>
                <span style={{ fontWeight: 800, color: totalGainNum > 0 ? '#10b981' : 'var(--color-text-muted)' }}>
                  {totalGainNum > 0 ? `+${compoundData.dailyPercentGain}%` : '0%'}
                </span>
              </div>
              <div style={{ width: '100%', height: '10px', borderRadius: '5px', backgroundColor: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (totalGainNum / 1.0) * 100)}%`, height: '100%', borderRadius: '5px', backgroundColor: '#10b981', transition: 'width 0.6s ease' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <div style={{ flex: 1, padding: '6px 10px', borderRadius: '8px', background: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                ⚡ Прогноз темпа: <strong style={{ color: '#10b981' }}>{paceInfo.paceMultiplier}</strong> / год
              </div>
              <div style={{ flex: 1, padding: '6px 10px', borderRadius: '8px', background: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                🎯 Идеальный целевой темп: <strong style={{ color: 'var(--color-text-primary)' }}>37.8x</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            {compoundData.list.map((item, idx) => {
              const isZero = item.count === 0;
              return (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: idx < compoundData.list.length - 1 ? '1px solid var(--color-border)' : 'none', opacity: isZero ? 0.45 : 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: isZero ? 'var(--color-text-disabled)' : item.color }} />
                    <span style={{ fontSize: '13.5px', fontWeight: 600, color: isZero ? 'var(--color-text-muted)' : 'var(--color-text-primary)' }}>{item.name}</span>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: isZero ? 'var(--color-text-muted)' : '#10b981' }}>{isZero ? '0%' : `+${item.gainPercent}%`}</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* ─────────────────── VARIANT 24: Apple-список + Инвест-прогноз роста капитала ─────────────────── */}
      {activeVariant === 24 && (
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '20px 18px', borderRadius: '24px', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div style={{ padding: '12px 14px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(59, 130, 246, 0.05) 100%)', border: '1px solid rgba(16, 185, 129, 0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '10.5px', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}>ПРОГНОЗ РОСТА НА 365 ДНЕЙ</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#10b981' }}>{paceInfo.paceMultiplier} <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)' }}>(цель 37.8x)</span></div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '10.5px', color: 'var(--color-text-muted)', fontWeight: 600 }}>СЕГОДНЯ</div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: totalGainNum > 0 ? '#10b981' : 'var(--color-text-muted)' }}>+{compoundData.dailyPercentGain}%</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Цель дня: 1.0% (5 задач)</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>{Math.min(100, Math.round((totalGainNum / 1.0) * 100))}%</span>
            </div>
            <div style={{ width: '100%', height: '8px', borderRadius: '4px', backgroundColor: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
              <div style={{ width: `${Math.min(100, (totalGainNum / 1.0) * 100)}%`, height: '100%', borderRadius: '4px', backgroundColor: '#10b981', transition: 'width 0.6s ease' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            {compoundData.list.map((item, idx) => {
              const isZero = item.count === 0;
              return (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: idx < compoundData.list.length - 1 ? '1px solid var(--color-border)' : 'none', opacity: isZero ? 0.45 : 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: isZero ? 'var(--color-text-disabled)' : item.color }} />
                    <span style={{ fontSize: '13.5px', fontWeight: 600, color: isZero ? 'var(--color-text-muted)' : 'var(--color-text-primary)' }}>{item.name}</span>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: isZero ? 'var(--color-text-muted)' : '#10b981' }}>{isZero ? '0%' : `+${item.gainPercent}%`}</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* ─────────────────── VARIANT 25: Apple-список + Диалог тренера (Duolingo Coach) ─────────────────── */}
      {activeVariant === 25 && (
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '20px 18px', borderRadius: '24px', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>🎯 Дневная норма роста</span>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#10b981' }}>+{compoundData.dailyPercentGain}%</span>
          </div>

          <div style={{ padding: '12px 14px', borderRadius: '16px', backgroundColor: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
              🦉
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-primary)', lineHeight: 1.45, fontWeight: 500 }}>
              <strong style={{ color: '#8b5cf6' }}>Тренер SkillFlow:</strong> «{paceInfo.statusText}»
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ width: '100%', height: '8px', borderRadius: '4px', backgroundColor: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
              <div style={{ width: `${Math.min(100, (totalGainNum / 1.0) * 100)}%`, height: '100%', borderRadius: '4px', backgroundColor: '#10b981', transition: 'width 0.6s ease' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            {compoundData.list.map((item, idx) => {
              const isZero = item.count === 0;
              return (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: idx < compoundData.list.length - 1 ? '1px solid var(--color-border)' : 'none', opacity: isZero ? 0.45 : 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: isZero ? 'var(--color-text-disabled)' : item.color }} />
                    <span style={{ fontSize: '13.5px', fontWeight: 600, color: isZero ? 'var(--color-text-muted)' : 'var(--color-text-primary)' }}>{item.name}</span>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: isZero ? 'var(--color-text-muted)' : '#10b981' }}>{isZero ? '0%' : `+${item.gainPercent}%`}</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* ─────────────────── VARIANT 26: Apple-список + Сравнительный трек темпа (8.9x vs 37.8x) ─────────────────── */}
      {activeVariant === 26 && (
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '20px 18px', borderRadius: '24px', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>📈 Сравнение темпа роста</span>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#10b981' }}>+{compoundData.dailyPercentGain}%</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', borderRadius: '14px', background: 'var(--color-surface-hover)', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', fontWeight: 600 }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Текущий годовой темп: <strong style={{ color: '#10b981' }}>{paceInfo.paceMultiplier}</strong></span>
              <span style={{ color: 'var(--color-text-muted)' }}>Цель: <strong style={{ color: 'var(--color-text-primary)' }}>37.8x</strong></span>
            </div>
            <div style={{ width: '100%', height: '10px', borderRadius: '5px', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', overflow: 'hidden', position: 'relative' }}>
              <div style={{ width: `${Math.min(100, (totalGainNum / 1.0) * 100)}%`, height: '100%', borderRadius: '5px', backgroundColor: '#10b981', transition: 'width 0.6s ease' }} />
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              {!paceInfo.isTargetMet ? `⚡ Ещё ${paceInfo.neededTasks} ${getActionWord(paceInfo.neededTasks)} за сегодня до выбивания нормы 37.8x!` : '🎉 Целевой темп дня 37.8x достигнут!'}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            {compoundData.list.map((item, idx) => {
              const isZero = item.count === 0;
              return (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: idx < compoundData.list.length - 1 ? '1px solid var(--color-border)' : 'none', opacity: isZero ? 0.45 : 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: isZero ? 'var(--color-text-disabled)' : item.color }} />
                    <span style={{ fontSize: '13.5px', fontWeight: 600, color: isZero ? 'var(--color-text-muted)' : 'var(--color-text-primary)' }}>{item.name}</span>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: isZero ? 'var(--color-text-muted)' : '#10b981' }}>{isZero ? '0%' : `+${item.gainPercent}%`}</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* ─────────────────── VARIANT 27: Apple-список + Исполнительный дашборд темпа ─────────────────── */}
      {activeVariant === 27 && (
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '20px 18px', borderRadius: '24px', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', padding: '10px 12px', borderRadius: '14px', background: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontWeight: 600 }}>ТЕКУЩИЙ ТЕМП</div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#10b981' }}>{paceInfo.paceMultiplier}</div>
            </div>
            <div style={{ borderLeft: '1px solid var(--color-border)', borderRight: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontWeight: 600 }}>ЦЕЛЬ ГОДА</div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-text-primary)' }}>37.8x</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontWeight: 600 }}>ОСТАЛОСЬ</div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: paceInfo.isTargetMet ? '#10b981' : '#f59e0b' }}>
                {paceInfo.isTargetMet ? '0 задач' : `${paceInfo.neededTasks} з.`}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ width: '100%', height: '8px', borderRadius: '4px', backgroundColor: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
              <div style={{ width: `${Math.min(100, (totalGainNum / 1.0) * 100)}%`, height: '100%', borderRadius: '4px', backgroundColor: '#10b981', transition: 'width 0.6s ease' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            {compoundData.list.map((item, idx) => {
              const isZero = item.count === 0;
              return (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: idx < compoundData.list.length - 1 ? '1px solid var(--color-border)' : 'none', opacity: isZero ? 0.45 : 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: isZero ? 'var(--color-text-disabled)' : item.color }} />
                    <span style={{ fontSize: '13.5px', fontWeight: 600, color: isZero ? 'var(--color-text-muted)' : 'var(--color-text-primary)' }}>{item.name}</span>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: isZero ? 'var(--color-text-muted)' : '#10b981' }}>{isZero ? '0%' : `+${item.gainPercent}%`}</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* ─────────────────── VARIANT 28: Bordered Pill Bar ─────────────────── */}
      {activeVariant === 28 && (
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '20px 18px', borderRadius: '24px', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '12px', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>🎯 Дневная норма роста</span>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 500 }}>(1.01)³⁶⁵ = 37.8x</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Цель: 1.0% в день</span>
                <span style={{ fontWeight: 800, color: totalGainNum > 0 ? '#10b981' : 'var(--color-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                  {totalGainNum > 0 ? `+${compoundData.dailyPercentGain}%` : '0%'}
                </span>
              </div>
              <div style={{ width: '100%', height: '10px', borderRadius: '5px', backgroundColor: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (totalGainNum / 1.0) * 100)}%`, height: '100%', borderRadius: '5px', backgroundColor: '#10b981', transition: 'width 0.6s ease' }} />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '10px', background: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', fontSize: '11.5px', fontWeight: 600, marginTop: '2px' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>
                ⚡ Прогноз темпа: <strong style={{ color: '#10b981' }}>{paceInfo.paceMultiplier} / год</strong>
              </span>
              <span style={{ color: 'var(--color-text-muted)' }}>
                🎯 Идеальный темп: <strong style={{ color: 'var(--color-text-primary)' }}>37.8x</strong>
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            {compoundData.list.map((item, idx) => {
              const isZero = item.count === 0;
              return (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: idx < compoundData.list.length - 1 ? '1px solid var(--color-border)' : 'none', opacity: isZero ? 0.45 : 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: isZero ? 'var(--color-text-disabled)' : item.color }} />
                    <span style={{ fontSize: '13.5px', fontWeight: 600, color: isZero ? 'var(--color-text-muted)' : 'var(--color-text-primary)' }}>{item.name}</span>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: isZero ? 'var(--color-text-muted)' : '#10b981' }}>{isZero ? '0%' : `+${item.gainPercent}%`}</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* ─────────────────── VARIANT 29: Ultra-Clean Separator Line (No Background Card) ─────────────────── */}
      {activeVariant === 29 && (
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '20px 18px', borderRadius: '24px', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '12px', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>🎯 Дневная норма роста</span>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 500 }}>(1.01)³⁶⁵ = 37.8x</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Цель: 1.0% в день</span>
                <span style={{ fontWeight: 800, color: totalGainNum > 0 ? '#10b981' : 'var(--color-text-muted)' }}>
                  {totalGainNum > 0 ? `+${compoundData.dailyPercentGain}%` : '0%'}
                </span>
              </div>
              <div style={{ width: '100%', height: '10px', borderRadius: '5px', backgroundColor: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (totalGainNum / 1.0) * 100)}%`, height: '100%', borderRadius: '5px', backgroundColor: '#10b981', transition: 'width 0.6s ease' }} />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px', color: 'var(--color-text-muted)', fontWeight: 500, paddingTop: '2px' }}>
              <span>⚡ Прогноз: <strong style={{ color: '#10b981', fontWeight: 700 }}>{paceInfo.paceMultiplier} / год</strong></span>
              <span style={{ color: 'var(--color-border)' }}>•</span>
              <span>🎯 Цель: <strong style={{ color: 'var(--color-text-primary)', fontWeight: 700 }}>37.8x</strong></span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            {compoundData.list.map((item, idx) => {
              const isZero = item.count === 0;
              return (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: idx < compoundData.list.length - 1 ? '1px solid var(--color-border)' : 'none', opacity: isZero ? 0.45 : 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: isZero ? 'var(--color-text-disabled)' : item.color }} />
                    <span style={{ fontSize: '13.5px', fontWeight: 600, color: isZero ? 'var(--color-text-muted)' : 'var(--color-text-primary)' }}>{item.name}</span>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: isZero ? 'var(--color-text-muted)' : '#10b981' }}>{isZero ? '0%' : `+${item.gainPercent}%`}</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* ─────────────────── VARIANT 30: Apple Segmented Pill Badges in 1 Row ─────────────────── */}
      {activeVariant === 30 && (
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '20px 18px', borderRadius: '24px', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '12px', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>🎯 Дневная норма роста</span>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 500 }}>(1.01)³⁶⁵ = 37.8x</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Цель: 1.0% в день</span>
                <span style={{ fontWeight: 800, color: totalGainNum > 0 ? '#10b981' : 'var(--color-text-muted)' }}>
                  {totalGainNum > 0 ? `+${compoundData.dailyPercentGain}%` : '0%'}
                </span>
              </div>
              <div style={{ width: '100%', height: '10px', borderRadius: '5px', backgroundColor: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (totalGainNum / 1.0) * 100)}%`, height: '100%', borderRadius: '5px', backgroundColor: '#10b981', transition: 'width 0.6s ease' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '2px' }}>
              <div style={{ padding: '5px 10px', borderRadius: '20px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', fontSize: '11px', fontWeight: 600, color: '#10b981', textAlign: 'center' }}>
                ⚡ {paceInfo.paceMultiplier} / год
              </div>
              <div style={{ padding: '5px 10px', borderRadius: '20px', background: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textAlign: 'center' }}>
                🎯 37.8x цель
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            {compoundData.list.map((item, idx) => {
              const isZero = item.count === 0;
              return (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: idx < compoundData.list.length - 1 ? '1px solid var(--color-border)' : 'none', opacity: isZero ? 0.45 : 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: isZero ? 'var(--color-text-disabled)' : item.color }} />
                    <span style={{ fontSize: '13.5px', fontWeight: 600, color: isZero ? 'var(--color-text-muted)' : 'var(--color-text-primary)' }}>{item.name}</span>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: isZero ? 'var(--color-text-muted)' : '#10b981' }}>{isZero ? '0%' : `+${item.gainPercent}%`}</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* ─────────────────── VARIANT 31: Emerald Tinted Accent Bar ─────────────────── */}
      {activeVariant === 31 && (
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '20px 18px', borderRadius: '24px', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '12px', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>🎯 Дневная норма роста</span>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 500 }}>(1.01)³⁶⁵ = 37.8x</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Цель: 1.0% в день</span>
                <span style={{ fontWeight: 800, color: totalGainNum > 0 ? '#10b981' : 'var(--color-text-muted)' }}>
                  {totalGainNum > 0 ? `+${compoundData.dailyPercentGain}%` : '0%'}
                </span>
              </div>
              <div style={{ width: '100%', height: '10px', borderRadius: '5px', backgroundColor: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (totalGainNum / 1.0) * 100)}%`, height: '100%', borderRadius: '5px', backgroundColor: '#10b981', transition: 'width 0.6s ease' }} />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 12px', borderRadius: '12px', background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.03) 100%)', border: '1px solid rgba(16, 185, 129, 0.22)', fontSize: '11.5px', marginTop: '2px' }}>
              <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>⚡ Темп года: <strong style={{ color: '#10b981', fontWeight: 800 }}>{paceInfo.paceMultiplier}</strong></span>
              <span style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>Целевой темп: <strong style={{ color: 'var(--color-text-primary)', fontWeight: 700 }}>37.8x</strong></span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            {compoundData.list.map((item, idx) => {
              const isZero = item.count === 0;
              return (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: idx < compoundData.list.length - 1 ? '1px solid var(--color-border)' : 'none', opacity: isZero ? 0.45 : 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: isZero ? 'var(--color-text-disabled)' : item.color }} />
                    <span style={{ fontSize: '13.5px', fontWeight: 600, color: isZero ? 'var(--color-text-muted)' : 'var(--color-text-primary)' }}>{item.name}</span>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: isZero ? 'var(--color-text-muted)' : '#10b981' }}>{isZero ? '0%' : `+${item.gainPercent}%`}</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* ─────────────────── VARIANT 32: Financial Terminal Micro-Font Styling ─────────────────── */}
      {activeVariant === 32 && (
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '20px 18px', borderRadius: '24px', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '12px', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>🎯 Дневная норма роста</span>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 500 }}>(1.01)³⁶⁵ = 37.8x</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Цель: 1.0% в день</span>
                <span style={{ fontWeight: 800, color: totalGainNum > 0 ? '#10b981' : 'var(--color-text-muted)' }}>
                  {totalGainNum > 0 ? `+${compoundData.dailyPercentGain}%` : '0%'}
                </span>
              </div>
              <div style={{ width: '100%', height: '10px', borderRadius: '5px', backgroundColor: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (totalGainNum / 1.0) * 100)}%`, height: '100%', borderRadius: '5px', backgroundColor: '#10b981', transition: 'width 0.6s ease' }} />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', borderRadius: '8px', background: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', fontSize: '10.5px', letterSpacing: '0.4px', textTransform: 'uppercase', fontWeight: 700, color: 'var(--color-text-muted)' }}>
              <span>ГОДОВОЙ ТЕМП: <span style={{ color: '#10b981', fontWeight: 800 }}>{paceInfo.paceMultiplier}</span></span>
              <span>ЭТАЛОН: <span style={{ color: 'var(--color-text-primary)', fontWeight: 800 }}>37.8x</span></span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            {compoundData.list.map((item, idx) => {
              const isZero = item.count === 0;
              return (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: idx < compoundData.list.length - 1 ? '1px solid var(--color-border)' : 'none', opacity: isZero ? 0.45 : 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: isZero ? 'var(--color-text-disabled)' : item.color }} />
                    <span style={{ fontSize: '13.5px', fontWeight: 600, color: isZero ? 'var(--color-text-muted)' : 'var(--color-text-primary)' }}>{item.name}</span>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: isZero ? 'var(--color-text-muted)' : '#10b981' }}>{isZero ? '0%' : `+${item.gainPercent}%`}</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* ─────────────────── VARIANT 33: Underline Accent Bar with Target Delta ─────────────────── */}
      {activeVariant === 33 && (
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '20px 18px', borderRadius: '24px', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '12px', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>🎯 Дневная норма роста</span>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 500 }}>(1.01)³⁶⁵ = 37.8x</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Цель: 1.0% в день</span>
                <span style={{ fontWeight: 800, color: totalGainNum > 0 ? '#10b981' : 'var(--color-text-muted)' }}>
                  {totalGainNum > 0 ? `+${compoundData.dailyPercentGain}%` : '0%'}
                </span>
              </div>
              <div style={{ width: '100%', height: '10px', borderRadius: '5px', backgroundColor: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (totalGainNum / 1.0) * 100)}%`, height: '100%', borderRadius: '5px', backgroundColor: '#10b981', transition: 'width 0.6s ease' }} />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px', fontWeight: 600, color: 'var(--color-text-muted)', borderLeft: '3px solid #10b981', paddingLeft: '8px', marginTop: '2px' }}>
              <span>⚡ Темп: <strong style={{ color: '#10b981', fontWeight: 700 }}>{paceInfo.paceMultiplier}</strong> / 🎯 37.8x</span>
              {!paceInfo.isTargetMet && (
                <span style={{ fontSize: '10.5px', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.12)', padding: '2px 6px', borderRadius: '6px' }}>
                  -{paceInfo.neededTasks * 20}% от нормы
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            {compoundData.list.map((item, idx) => {
              const isZero = item.count === 0;
              return (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: idx < compoundData.list.length - 1 ? '1px solid var(--color-border)' : 'none', opacity: isZero ? 0.45 : 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: isZero ? 'var(--color-text-disabled)' : item.color }} />
                    <span style={{ fontSize: '13.5px', fontWeight: 600, color: isZero ? 'var(--color-text-muted)' : 'var(--color-text-primary)' }}>{item.name}</span>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: isZero ? 'var(--color-text-muted)' : '#10b981' }}>{isZero ? '0%' : `+${item.gainPercent}%`}</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* ─────────────────── VARIANT 34: Glassmorphic Floating Row ─────────────────── */}
      {activeVariant === 34 && (
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '20px 18px', borderRadius: '24px', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '12px', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>🎯 Дневная норма роста</span>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 500 }}>(1.01)³⁶⁵ = 37.8x</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Цель: 1.0% в день</span>
                <span style={{ fontWeight: 800, color: totalGainNum > 0 ? '#10b981' : 'var(--color-text-muted)' }}>
                  {totalGainNum > 0 ? `+${compoundData.dailyPercentGain}%` : '0%'}
                </span>
              </div>
              <div style={{ width: '100%', height: '10px', borderRadius: '5px', backgroundColor: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (totalGainNum / 1.0) * 100)}%`, height: '100%', borderRadius: '5px', backgroundColor: '#10b981', transition: 'width 0.6s ease' }} />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 12px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.04)', backdropFilter: 'blur(12px)', border: '1px solid var(--color-border)', fontSize: '11.5px', marginTop: '2px' }}>
              <span style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>⚡ Прогноз: <strong style={{ color: '#10b981', fontWeight: 800 }}>{paceInfo.paceMultiplier}</strong></span>
              <span style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>🎯 Цель: <strong style={{ color: 'var(--color-text-primary)', fontWeight: 800 }}>37.8x</strong></span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            {compoundData.list.map((item, idx) => {
              const isZero = item.count === 0;
              return (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: idx < compoundData.list.length - 1 ? '1px solid var(--color-border)' : 'none', opacity: isZero ? 0.45 : 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: isZero ? 'var(--color-text-disabled)' : item.color }} />
                    <span style={{ fontSize: '13.5px', fontWeight: 600, color: isZero ? 'var(--color-text-muted)' : 'var(--color-text-primary)' }}>{item.name}</span>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: isZero ? 'var(--color-text-muted)' : '#10b981' }}>{isZero ? '0%' : `+${item.gainPercent}%`}</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* ─────────────────── VARIANT 35: Floating Micro-Chips in 1 Row ─────────────────── */}
      {activeVariant === 35 && (
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '20px 18px', borderRadius: '24px', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '12px', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>🎯 Дневная норма роста</span>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 500 }}>(1.01)³⁶⁵ = 37.8x</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Цель: 1.0% в день</span>
                <span style={{ fontWeight: 800, color: totalGainNum > 0 ? '#10b981' : 'var(--color-text-muted)' }}>
                  {totalGainNum > 0 ? `+${compoundData.dailyPercentGain}%` : '0%'}
                </span>
              </div>
              <div style={{ width: '100%', height: '10px', borderRadius: '5px', backgroundColor: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (totalGainNum / 1.0) * 100)}%`, height: '100%', borderRadius: '5px', backgroundColor: '#10b981', transition: 'width 0.6s ease' }} />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <span style={{ padding: '4px 9px', borderRadius: '16px', background: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', fontSize: '11px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                ⚡ {paceInfo.paceMultiplier} / год
              </span>
              <span style={{ padding: '4px 9px', borderRadius: '16px', background: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                🎯 37.8x цель
              </span>
              {!paceInfo.isTargetMet && (
                <span style={{ marginLeft: 'auto', fontSize: '10.5px', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                  Ещё {paceInfo.neededTasks} з.
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            {compoundData.list.map((item, idx) => {
              const isZero = item.count === 0;
              return (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: idx < compoundData.list.length - 1 ? '1px solid var(--color-border)' : 'none', opacity: isZero ? 0.45 : 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: isZero ? 'var(--color-text-disabled)' : item.color }} />
                    <span style={{ fontSize: '13.5px', fontWeight: 600, color: isZero ? 'var(--color-text-muted)' : 'var(--color-text-primary)' }}>{item.name}</span>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: isZero ? 'var(--color-text-muted)' : '#10b981' }}>{isZero ? '0%' : `+${item.gainPercent}%`}</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};
