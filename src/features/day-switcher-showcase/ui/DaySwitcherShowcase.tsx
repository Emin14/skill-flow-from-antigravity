'use client';

import React, { useState, useRef } from 'react';
import {
  getTodayStr,
  addDaysToDateStr,
  formatDateDisplay,
  formatSelectedDateTitle,
} from '@/shared/lib/dateUtils';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Sun,
  Clock,
  RotateCcw,
  Sliders,
  ChevronDown,
  Layers,
  Sparkles,
  ArrowRightLeft,
} from 'lucide-react';
import styles from './DaySwitcherShowcase.module.css';

interface DaySwitcherShowcaseProps {
  selectedDate: string;
  onDateChange: (dateStr: string) => void;
}

const DAYS_RU = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const MONTHS_RU = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];

const getDayName = (dateStr: string) => {
  if (!dateStr || !dateStr.includes('-')) return '';
  const parts = dateStr.split('-').map(Number);
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  return DAYS_RU[d.getDay()];
};

const getRelativeLabel = (dateStr: string, todayStr: string) => {
  if (dateStr === todayStr) return 'Сегодня';
  if (dateStr === addDaysToDateStr(todayStr, -1)) return 'Вчера';
  if (dateStr === addDaysToDateStr(todayStr, 1)) return 'Завтра';
  return getDayName(dateStr);
};

export const DaySwitcherShowcase: React.FC<DaySwitcherShowcaseProps> = ({
  selectedDate,
  onDateChange,
}) => {
  const [activeVariant, setActiveVariant] = useState<number>(1);
  const nativeDateInputRef = useRef<HTMLInputElement>(null);

  const todayStr = getTodayStr();
  const isTodaySelected = selectedDate === todayStr;

  const handlePrevDay = () => onDateChange(addDaysToDateStr(selectedDate, -1));
  const handleNextDay = () => onDateChange(addDaysToDateStr(selectedDate, 1));
  const handleGoToday = () => onDateChange(todayStr);

  const openNativePicker = () => {
    if (nativeDateInputRef.current) {
      const el = nativeDateInputRef.current;
      if (typeof el.showPicker === 'function') {
        el.showPicker();
      } else {
        el.click();
      }
    }
  };

  return (
    <div className={styles.showcaseContainer}>
      {/* Invisible Native Date Input for universal fallback */}
      <input
        type="date"
        ref={nativeDateInputRef}
        value={selectedDate}
        onChange={(e) => e.target.value && onDateChange(e.target.value)}
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0, colorScheme: 'dark' }}
      />

      {/* UX Variant Selector Bar [1] [2] ... [20] */}
      <div className={styles.variantSelectorBar}>
        <div className={styles.variantSelectorHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} color="#38bdf8" />
            <span>UX-вариант смены дня: (Выбрана дата: {formatDateDisplay(selectedDate)})</span>
          </div>
          {!isTodaySelected && (
            <button type="button" className={styles.todayChip} onClick={handleGoToday}>
              <Sun size={11} /> Вернуться в Сегодня
            </button>
          )}
        </div>

        <div className={styles.variantGrid}>
          {Array.from({ length: 20 }, (_, i) => i + 1).map((v) => (
            <button
              key={v}
              type="button"
              className={`${styles.variantBtn} ${activeVariant === v ? styles.variantBtnActive : ''}`}
              onClick={() => setActiveVariant(v)}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic UX Variant Render Box */}
      <div className={styles.variantRenderBox}>
        {/* ── VARIANT 1: Compact Arrow Stepper ─────────────────── */}
        {activeVariant === 1 && (
          <div className={styles.v1Stepper}>
            <button type="button" className={styles.v1ArrowBtn} onClick={handlePrevDay} title="Предыдущий день">
              <ChevronLeft size={18} />
            </button>

            <div
              style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
              onClick={openNativePicker}
              title="Нажмите чтобы выбрать дату"
            >
              <Calendar size={16} color="#38bdf8" />
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                {getRelativeLabel(selectedDate, todayStr)} ({formatDateDisplay(selectedDate)})
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {!isTodaySelected && (
                <button type="button" className={styles.todayChip} onClick={handleGoToday}>
                  ☀️ Сегодня
                </button>
              )}
              <button type="button" className={styles.v1ArrowBtn} onClick={handleNextDay} title="Следующий день">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* ── VARIANT 2: Touch Swipe Banner ───────────────────────── */}
        {activeVariant === 2 && (
          <div
            className={styles.v2SwipeBanner}
            onClick={openNativePicker}
          >
            <button
              type="button"
              className={styles.v1ArrowBtn}
              onClick={(e) => { e.stopPropagation(); handlePrevDay(); }}
            >
              <ChevronLeft size={18} />
            </button>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 600, letterSpacing: '0.5px' }}>
                👈 Свайп или клик для выбора даты 👉
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
                📅 {formatSelectedDateTitle(selectedDate)}
              </div>
            </div>

            <button
              type="button"
              className={styles.v1ArrowBtn}
              onClick={(e) => { e.stopPropagation(); handleNextDay(); }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* ── VARIANT 3: Segmented Control Bar ───────────────────── */}
        {activeVariant === 3 && (
          <div className={styles.v3SegmentedBar}>
            <button
              type="button"
              className={`${styles.v3SegmentBtn} ${selectedDate === addDaysToDateStr(todayStr, -1) ? styles.v3SegmentActive : ''}`}
              onClick={() => onDateChange(addDaysToDateStr(todayStr, -1))}
            >
              Вчера
            </button>
            <button
              type="button"
              className={`${styles.v3SegmentBtn} ${selectedDate === todayStr ? styles.v3SegmentActive : ''}`}
              onClick={handleGoToday}
            >
              ☀️ Сегодня
            </button>
            <button
              type="button"
              className={`${styles.v3SegmentBtn} ${selectedDate === addDaysToDateStr(todayStr, 1) ? styles.v3SegmentActive : ''}`}
              onClick={() => onDateChange(addDaysToDateStr(todayStr, 1))}
            >
              Завтра
            </button>
            <button
              type="button"
              className={`${styles.v3SegmentBtn} ${!isTodaySelected && selectedDate !== addDaysToDateStr(todayStr, -1) && selectedDate !== addDaysToDateStr(todayStr, 1) ? styles.v3SegmentActive : ''}`}
              onClick={openNativePicker}
            >
              📅 {formatDateDisplay(selectedDate)}
            </button>
          </div>
        )}

        {/* ── VARIANT 4: Weekly Ribbon Strip ──────────────────────── */}
        {activeVariant === 4 && (
          <div className={styles.v4RibbonStrip}>
            {Array.from({ length: 7 }, (_, i) => addDaysToDateStr(todayStr, i - 3)).map((dStr) => {
              const isSel = dStr === selectedDate;
              const isTod = dStr === todayStr;
              return (
                <div
                  key={dStr}
                  className={`${styles.v4DayCard} ${isSel ? styles.v4DayCardActive : ''}`}
                  onClick={() => onDateChange(dStr)}
                >
                  <span style={{ fontSize: '10px', color: isTod ? '#fbbf24' : 'var(--color-text-muted)', fontWeight: 700 }}>
                    {isTod ? 'Сегодня' : getDayName(dStr)}
                  </span>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: isSel ? '#38bdf8' : '#fff' }}>
                    {dStr.split('-')[2]}
                  </span>
                </div>
              );
            })}
            <button
              type="button"
              className={styles.v4DayCard}
              onClick={openNativePicker}
              style={{ minWidth: '42px', justifyContent: 'center' }}
            >
              <Calendar size={16} color="#38bdf8" />
            </button>
          </div>
        )}

        {/* ── VARIANT 5: Tumbler Wheel ────────────────────────────── */}
        {activeVariant === 5 && (
          <div className={styles.v5Tumbler}>
            <button type="button" className={styles.v1ArrowBtn} onClick={handlePrevDay}>
              ▲
            </button>
            <div
              style={{ textAlign: 'center', cursor: 'pointer', padding: '4px 12px', background: 'rgba(255,255,255,0.06)', borderRadius: '12px' }}
              onClick={openNativePicker}
            >
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>Барабан дат</div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#38bdf8' }}>
                {getRelativeLabel(selectedDate, todayStr)} • {formatDateDisplay(selectedDate)}
              </div>
            </div>
            <button type="button" className={styles.v1ArrowBtn} onClick={handleNextDay}>
              ▼
            </button>
          </div>
        )}

        {/* ── VARIANT 6: Hero Date Banner ─────────────────────────── */}
        {activeVariant === 6 && (
          <div className={styles.v6HeroBanner}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>
                  Выбранный день
                </div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#fff', marginTop: '2px' }}>
                  📅 {formatSelectedDateTitle(selectedDate)}
                </div>
              </div>
              <button type="button" className={styles.v1ArrowBtn} onClick={openNativePicker}>
                <Calendar size={18} color="#38bdf8" />
              </button>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" className={styles.v3SegmentBtn} style={{ background: 'rgba(255,255,255,0.08)' }} onClick={handlePrevDay}>
                ◀ День назад
              </button>
              <button type="button" className={styles.v3SegmentBtn} style={{ background: isTodaySelected ? 'rgba(14,165,233,0.3)' : 'rgba(255,255,255,0.08)' }} onClick={handleGoToday}>
                ☀️ В сегодня
              </button>
              <button type="button" className={styles.v3SegmentBtn} style={{ background: 'rgba(255,255,255,0.08)' }} onClick={handleNextDay}>
                День вперед ▶
              </button>
            </div>
          </div>
        )}

        {/* ── VARIANT 7: Floating Quick Hub ───────────────────────── */}
        {activeVariant === 7 && (
          <div className={styles.v7HubBar}>
            <button type="button" className={styles.v1ArrowBtn} onClick={handlePrevDay}>
              <ChevronLeft size={18} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={openNativePicker}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8' }} />
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>
                {formatDateDisplay(selectedDate)} ({getRelativeLabel(selectedDate, todayStr)})
              </span>
            </div>
            <button type="button" className={styles.v1ArrowBtn} onClick={handleNextDay}>
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* ── VARIANT 8: Calendar Badge & Popover Grid ─────────────── */}
        {activeVariant === 8 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button type="button" className={styles.v1ArrowBtn} onClick={handlePrevDay}>
              <ChevronLeft size={18} />
            </button>
            <button type="button" className={styles.v8BadgeBtn} onClick={openNativePicker}>
              <Calendar size={16} />
              <span>{formatSelectedDateTitle(selectedDate)}</span>
              <ChevronDown size={14} />
            </button>
            <button type="button" className={styles.v1ArrowBtn} onClick={handleNextDay}>
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* ── VARIANT 9: Time Breadcrumb Trail ─────────────────────── */}
        {activeVariant === 9 && (
          <div className={styles.v9Breadcrumbs}>
            <span style={{ opacity: 0.5, cursor: 'pointer' }} onClick={handlePrevDay}>
              {getDayName(addDaysToDateStr(selectedDate, -1))}
            </span>
            <span style={{ opacity: 0.4 }}>➔</span>
            <span style={{ color: '#38bdf8', fontWeight: 800, cursor: 'pointer' }} onClick={openNativePicker}>
              [{getRelativeLabel(selectedDate, todayStr)} {formatDateDisplay(selectedDate)}]
            </span>
            <span style={{ opacity: 0.4 }}>➔</span>
            <span style={{ opacity: 0.5, cursor: 'pointer' }} onClick={handleNextDay}>
              {getDayName(addDaysToDateStr(selectedDate, 1))}
            </span>
          </div>
        )}

        {/* ── VARIANT 10: Horizontal Timeline Track ───────────────── */}
        {activeVariant === 10 && (
          <div className={styles.v10Timeline}>
            {[-3, -2, -1, 0, 1, 2, 3].map((offset) => {
              const targetDate = addDaysToDateStr(selectedDate, offset);
              const isActive = offset === 0;
              return (
                <div
                  key={offset}
                  onClick={() => onDateChange(targetDate)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '10px',
                    background: isActive ? 'rgba(14, 165, 233, 0.3)' : 'rgba(255, 255, 255, 0.04)',
                    border: isActive ? '1px solid #38bdf8' : '1px solid transparent',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: isActive ? 700 : 400,
                    color: isActive ? '#38bdf8' : 'var(--color-text-muted)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {offset === 0 ? formatDateDisplay(selectedDate) : `${offset > 0 ? '+' : ''}${offset}д`}
                </div>
              );
            })}
            <button type="button" className={styles.v1ArrowBtn} onClick={openNativePicker}>
              <Calendar size={14} />
            </button>
          </div>
        )}

        {/* ── VARIANT 11: Bottom Sheet Drawer Trigger ─────────────── */}
        {activeVariant === 11 && (
          <div className={styles.v11Trigger} onClick={openNativePicker}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} color="#38bdf8" />
              <div>
                <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Выбрать день в шторке</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>
                  {formatSelectedDateTitle(selectedDate)}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button type="button" className={styles.v1ArrowBtn} onClick={(e) => { e.stopPropagation(); handlePrevDay(); }}>
                ◀
              </button>
              <button type="button" className={styles.v1ArrowBtn} onClick={(e) => { e.stopPropagation(); handleNextDay(); }}>
                ▶
              </button>
            </div>
          </div>
        )}

        {/* ── VARIANT 12: Glassmorphic Popover Menu ───────────────── */}
        {activeVariant === 12 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button type="button" className={styles.v12PopoverBtn} onClick={openNativePicker}>
              <Sparkles size={15} color="#38bdf8" />
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>
                {getRelativeLabel(selectedDate, todayStr)} • {formatDateDisplay(selectedDate)}
              </span>
              <ChevronDown size={14} color="#94a3b8" />
            </button>
            <button type="button" className={styles.v1ArrowBtn} onClick={handlePrevDay}>◀</button>
            <button type="button" className={styles.v1ArrowBtn} onClick={handleNextDay}>▶</button>
          </div>
        )}

        {/* ── VARIANT 13: Native Select Dropdown ─────────────────── */}
        {activeVariant === 13 && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <select
              className={styles.v13Select}
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
            >
              <option value={addDaysToDateStr(todayStr, -1)}>◀ Вчера ({formatDateDisplay(addDaysToDateStr(todayStr, -1))})</option>
              <option value={todayStr}>☀️ Сегодня ({formatDateDisplay(todayStr)})</option>
              <option value={addDaysToDateStr(todayStr, 1)}>▶ Завтра ({formatDateDisplay(addDaysToDateStr(todayStr, 1))})</option>
              {!isTodaySelected && selectedDate !== addDaysToDateStr(todayStr, -1) && selectedDate !== addDaysToDateStr(todayStr, 1) && (
                <option value={selectedDate}>📅 Выбрано: {formatDateDisplay(selectedDate)}</option>
              )}
            </select>
            <button type="button" className={styles.v1ArrowBtn} onClick={openNativePicker} title="Календарь">
              <Calendar size={16} />
            </button>
          </div>
        )}

        {/* ── VARIANT 14: iOS Cupertino Date Trigger ────────────── */}
        {activeVariant === 14 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button type="button" className={styles.v1ArrowBtn} onClick={handlePrevDay}>-1</button>
            <div className={styles.v14CupertinoCapsule} onClick={openNativePicker}>
              <span>🍎 {getRelativeLabel(selectedDate, todayStr)}</span>
              <span style={{ opacity: 0.6 }}>|</span>
              <span>{formatDateDisplay(selectedDate)}</span>
            </div>
            <button type="button" className={styles.v1ArrowBtn} onClick={handleNextDay}>+1</button>
          </div>
        )}

        {/* ── VARIANT 15: Android Material Floating Chip ─────────── */}
        {activeVariant === 15 && (
          <div className={styles.v15MaterialChip}>
            <button type="button" style={{ background: 'none', border: 'none', color: '#a5b4fc', cursor: 'pointer' }} onClick={handlePrevDay}>
              ◀
            </button>
            <div style={{ cursor: 'pointer', fontWeight: 700 }} onClick={openNativePicker}>
              🤖 Material Date: {formatSelectedDateTitle(selectedDate)}
            </div>
            <button type="button" style={{ background: 'none', border: 'none', color: '#a5b4fc', cursor: 'pointer' }} onClick={handleNextDay}>
              ▶
            </button>
          </div>
        )}

        {/* ── VARIANT 16: Mini Month Grid Banner ─────────────────── */}
        {activeVariant === 16 && (
          <div className={styles.v16MiniMonth}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, color: '#38bdf8' }}>
              <span>🗓️ Сетка текущей недели</span>
              <span style={{ cursor: 'pointer' }} onClick={openNativePicker}>[Открыть весь месяц]</span>
            </div>
            <div style={{ display: 'flex', gap: '4px', justifyContent: 'space-between' }}>
              {Array.from({ length: 7 }, (_, i) => addDaysToDateStr(selectedDate, i - 3)).map((dStr) => {
                const isSel = dStr === selectedDate;
                return (
                  <button
                    key={dStr}
                    type="button"
                    onClick={() => onDateChange(dStr)}
                    style={{
                      flex: 1,
                      padding: '6px 2px',
                      borderRadius: '8px',
                      background: isSel ? '#0ea5e9' : 'rgba(255,255,255,0.05)',
                      color: isSel ? '#fff' : 'var(--color-text-muted)',
                      border: 'none',
                      fontSize: '11px',
                      fontWeight: isSel ? 800 : 500,
                      cursor: 'pointer',
                    }}
                  >
                    {getDayName(dStr)} {dStr.split('-')[2]}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── VARIANT 17: Slide & Scrub Slider Bar ───────────────── */}
        {activeVariant === 17 && (
          <div className={styles.v17SliderContainer}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, color: '#fff' }}>
              <span>🎚️ Слайдер дат: {formatSelectedDateTitle(selectedDate)}</span>
              <span style={{ color: '#38bdf8', cursor: 'pointer' }} onClick={openNativePicker}>📅 Календарь</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button type="button" className={styles.v1ArrowBtn} onClick={handlePrevDay}>◀</button>
              <input
                type="range"
                min="-7"
                max="7"
                value={0}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val !== 0) onDateChange(addDaysToDateStr(selectedDate, val));
                }}
                style={{ flex: 1, cursor: 'pointer' }}
              />
              <button type="button" className={styles.v1ArrowBtn} onClick={handleNextDay}>▶</button>
            </div>
          </div>
        )}

        {/* ── VARIANT 18: Quick Jump Shortcut Pills ──────────────── */}
        {activeVariant === 18 && (
          <div className={styles.v18PillsBar}>
            <button type="button" className={styles.v1ArrowBtn} onClick={handlePrevDay}>◀</button>
            <button type="button" className={styles.v3SegmentBtn} style={{ background: 'rgba(255,255,255,0.08)' }} onClick={() => onDateChange(addDaysToDateStr(todayStr, -1))}>
              Вчера
            </button>
            <button type="button" className={styles.v3SegmentBtn} style={{ background: isTodaySelected ? 'rgba(14,165,233,0.3)' : 'rgba(255,255,255,0.08)', border: isTodaySelected ? '1px solid #38bdf8' : undefined }} onClick={handleGoToday}>
              ☀️ Сегодня
            </button>
            <button type="button" className={styles.v3SegmentBtn} style={{ background: 'rgba(255,255,255,0.08)' }} onClick={() => onDateChange(addDaysToDateStr(todayStr, 1))}>
              Завтра
            </button>
            <button type="button" className={styles.v3SegmentBtn} style={{ background: 'rgba(255,255,255,0.08)' }} onClick={() => onDateChange(addDaysToDateStr(todayStr, 7))}>
              +7дн
            </button>
            <button type="button" className={styles.v3SegmentBtn} style={{ background: 'rgba(14,165,233,0.2)', color: '#38bdf8' }} onClick={openNativePicker}>
              📅 Дата
            </button>
            <button type="button" className={styles.v1ArrowBtn} onClick={handleNextDay}>▶</button>
          </div>
        )}

        {/* ── VARIANT 19: Radial Ring Date Dial ──────────────────── */}
        {activeVariant === 19 && (
          <div className={styles.v19DialContainer}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#38bdf8', fontSize: '13px' }}>
                ⚙️
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Радиальный сектор недели</div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>
                  {formatSelectedDateTitle(selectedDate)}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button type="button" className={styles.v1ArrowBtn} onClick={handlePrevDay}>◀</button>
              <button type="button" className={styles.v1ArrowBtn} onClick={openNativePicker}>📅</button>
              <button type="button" className={styles.v1ArrowBtn} onClick={handleNextDay}>▶</button>
            </div>
          </div>
        )}

        {/* ── VARIANT 20: Dynamic Island Date Capsule ────────────── */}
        {activeVariant === 20 && (
          <div className={styles.v20DynamicIsland}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={openNativePicker}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 8px #38bdf8' }} />
              <div>
                <div style={{ fontSize: '10px', color: '#94a3b8', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Dynamic Island</div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>
                  📅 {getRelativeLabel(selectedDate, todayStr)} • {formatDateDisplay(selectedDate)}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button type="button" className={styles.v1ArrowBtn} onClick={handlePrevDay} title="Вчера">◀</button>
              {!isTodaySelected && (
                <button type="button" className={styles.todayChip} onClick={handleGoToday}>☀️</button>
              )}
              <button type="button" className={styles.v1ArrowBtn} onClick={handleNextDay} title="Завтра">▶</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
