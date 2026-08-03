'use client';

import React, { useState } from 'react';
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
  Sparkles,
  Layers,
} from 'lucide-react';
import styles from './DaySwitcherShowcase.module.css';

interface DaySwitcherShowcaseProps {
  selectedDate: string;
  onDateChange: (dateStr: string) => void;
}

const DAYS_RU = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

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
  const [activeVariant, setActiveVariant] = useState<number>(3);

  const todayStr = getTodayStr();
  const isTodaySelected = selectedDate === todayStr;

  const handlePrevDay = () => onDateChange(addDaysToDateStr(selectedDate, -1));
  const handleNextDay = () => onDateChange(addDaysToDateStr(selectedDate, 1));
  const handleGoToday = () => onDateChange(todayStr);

  /**
   * Universal Fail-Proof iOS WebKit Transparent Date Picker Overlay.
   * Renders a transparent <input type="date"> positioned absolutely OVER the button.
   * Tapping it on iOS iPhone triggers the native iOS date picker 100% reliably!
   */
  const renderIosDatePickerOverlay = () => (
    <input
      type="date"
      className={styles.iosDatePickerInput}
      value={selectedDate}
      onChange={(e) => e.target.value && onDateChange(e.target.value)}
      title="Выбрать дату"
    />
  );

  return (
    <div className={styles.showcaseContainer}>
      {/* UX Variant Selector Bar [1] [2] ... [20] */}
      <div className={styles.variantSelectorBar}>
        <div className={styles.variantSelectorHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} color="#38bdf8" />
            <span>UX-вариант смены дня: (Выбрано: {formatDateDisplay(selectedDate)})</span>
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

            <div className={styles.datePickerOverlayWrapper} style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} color="#38bdf8" />
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  {getRelativeLabel(selectedDate, todayStr)} ({formatDateDisplay(selectedDate)})
                </span>
              </div>
              {renderIosDatePickerOverlay()}
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
          <div className={styles.v2SwipeBanner}>
            <button type="button" className={styles.v1ArrowBtn} onClick={handlePrevDay}>
              <ChevronLeft size={18} />
            </button>

            <div className={styles.datePickerOverlayWrapper} style={{ textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 600, letterSpacing: '0.5px' }}>
                  👈 Свайп или клик для выбора даты 👉
                </div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
                  📅 {formatSelectedDateTitle(selectedDate)}
                </div>
              </div>
              {renderIosDatePickerOverlay()}
            </div>

            <button type="button" className={styles.v1ArrowBtn} onClick={handleNextDay}>
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* ── VARIANT 3: 3-Day Visible Mobile Snap Ribbon (iPhone 16 Focus) ── */}
        {activeVariant === 3 && (
          <div className={styles.v3ThreeCardContainer}>
            <button type="button" className={styles.v1ArrowBtn} onClick={handlePrevDay} title="-1 день">
              <ChevronLeft size={18} />
            </button>

            <div className={styles.v3CardRow}>
              {[-1, 0, 1].map((offset) => {
                const dStr = addDaysToDateStr(selectedDate, offset);
                const isSel = offset === 0;
                const isTod = dStr === todayStr;
                return (
                  <div
                    key={dStr}
                    className={`${styles.v3DayCard} ${isSel ? styles.v3DayCardActive : ''}`}
                    onClick={() => onDateChange(dStr)}
                  >
                    <span style={{ fontSize: '10px', color: isTod ? '#fbbf24' : 'var(--color-text-muted)', fontWeight: 700 }}>
                      {isTod ? 'Сегодня' : getDayName(dStr)}
                    </span>
                    <span style={{ fontSize: '16px', fontWeight: 900, color: isSel ? '#38bdf8' : '#fff' }}>
                      {dStr.split('-')[2]}
                    </span>
                    <span style={{ fontSize: '9px', opacity: 0.5 }}>{dStr.split('-')[1]} мес</span>
                  </div>
                );
              })}
            </div>

            <button type="button" className={styles.v1ArrowBtn} onClick={handleNextDay} title="+1 день">
              <ChevronRight size={18} />
            </button>

            <div className={styles.datePickerOverlayWrapper}>
              <button type="button" className={styles.v1ArrowBtn} title="Календарь">
                <Calendar size={16} color="#38bdf8" />
              </button>
              {renderIosDatePickerOverlay()}
            </div>
          </div>
        )}

        {/* ── VARIANT 4: Classic 7-Day Ribbon Strip ───────────────── */}
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
            <div className={styles.datePickerOverlayWrapper}>
              <button type="button" className={styles.v4DayCard} style={{ minWidth: '42px', justifyContent: 'center' }}>
                <Calendar size={16} color="#38bdf8" />
              </button>
              {renderIosDatePickerOverlay()}
            </div>
          </div>
        )}

        {/* ── VARIANT 5: Capsule Pills Ribbon ─────────────────────── */}
        {activeVariant === 5 && (
          <div className={styles.v5CapsuleRibbon}>
            {Array.from({ length: 7 }, (_, i) => addDaysToDateStr(todayStr, i - 3)).map((dStr) => {
              const isSel = dStr === selectedDate;
              const isTod = dStr === todayStr;
              return (
                <div
                  key={dStr}
                  className={`${styles.v5CapsulePill} ${isSel ? styles.v5CapsulePillActive : ''}`}
                  onClick={() => onDateChange(dStr)}
                >
                  <span>{isTod ? '☀️ Сегодня' : getDayName(dStr)}</span>
                  <span>{dStr.split('-')[2]}</span>
                </div>
              );
            })}
            <div className={styles.datePickerOverlayWrapper}>
              <button type="button" className={styles.v5CapsulePill} style={{ background: 'rgba(14,165,233,0.15)', color: '#38bdf8' }}>
                <Calendar size={14} /> Дата
              </button>
              {renderIosDatePickerOverlay()}
            </div>
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
              <div className={styles.datePickerOverlayWrapper}>
                <button type="button" className={styles.v1ArrowBtn}>
                  <Calendar size={18} color="#38bdf8" />
                </button>
                {renderIosDatePickerOverlay()}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" className={styles.todayChip} style={{ flex: 1, justifyContent: 'center', padding: '6px' }} onClick={handlePrevDay}>
                ◀ Назад
              </button>
              <button type="button" className={styles.todayChip} style={{ flex: 1, justifyContent: 'center', padding: '6px', background: isTodaySelected ? 'rgba(14,165,233,0.3)' : undefined }} onClick={handleGoToday}>
                ☀️ В сегодня
              </button>
              <button type="button" className={styles.todayChip} style={{ flex: 1, justifyContent: 'center', padding: '6px' }} onClick={handleNextDay}>
                Вперед ▶
              </button>
            </div>
          </div>
        )}

        {/* ── VARIANT 7: Floating Hub ─────────────────────────────── */}
        {activeVariant === 7 && (
          <div className={styles.v7HubBar}>
            <button type="button" className={styles.v1ArrowBtn} onClick={handlePrevDay}>
              <ChevronLeft size={18} />
            </button>
            <div className={styles.datePickerOverlayWrapper}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8' }} />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>
                  {formatDateDisplay(selectedDate)} ({getRelativeLabel(selectedDate, todayStr)})
                </span>
              </div>
              {renderIosDatePickerOverlay()}
            </div>
            <button type="button" className={styles.v1ArrowBtn} onClick={handleNextDay}>
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* ── VARIANT 8: Glassmorphic Frosted Ribbon ───────────────── */}
        {activeVariant === 8 && (
          <div className={styles.v8GlassmorphicRibbon}>
            {Array.from({ length: 7 }, (_, i) => addDaysToDateStr(todayStr, i - 3)).map((dStr) => {
              const isSel = dStr === selectedDate;
              const isTod = dStr === todayStr;
              return (
                <div
                  key={dStr}
                  className={`${styles.v8GlassCard} ${isSel ? styles.v8GlassCardActive : ''}`}
                  onClick={() => onDateChange(dStr)}
                >
                  <span style={{ fontSize: '10px', color: isTod ? '#fbbf24' : '#cbd5e1', fontWeight: 700 }}>
                    {isTod ? 'Сегодня' : getDayName(dStr)}
                  </span>
                  <span style={{ fontSize: '16px', fontWeight: 900, color: '#fff' }}>
                    {dStr.split('-')[2]}
                  </span>
                </div>
              );
            })}
            <div className={styles.datePickerOverlayWrapper}>
              <button type="button" className={styles.v8GlassCard} style={{ minWidth: '42px', justifyContent: 'center' }}>
                <Calendar size={16} color="#38bdf8" />
              </button>
              {renderIosDatePickerOverlay()}
            </div>
          </div>
        )}

        {/* ── VARIANT 9: Circle Dot Ribbon ───────────────────────── */}
        {activeVariant === 9 && (
          <div className={styles.v9DotRibbon}>
            {Array.from({ length: 7 }, (_, i) => addDaysToDateStr(todayStr, i - 3)).map((dStr) => {
              const isSel = dStr === selectedDate;
              const isTod = dStr === todayStr;
              return (
                <div
                  key={dStr}
                  className={`${styles.v9CircleDot} ${isSel ? styles.v9CircleDotActive : ''}`}
                  onClick={() => onDateChange(dStr)}
                >
                  <span style={{ fontSize: '12px', fontWeight: 800 }}>{dStr.split('-')[2]}</span>
                  <span style={{ fontSize: '8px', opacity: 0.8 }}>{isTod ? 'Сг' : getDayName(dStr)}</span>
                </div>
              );
            })}
            <div className={styles.datePickerOverlayWrapper}>
              <button type="button" className={styles.v9CircleDot} style={{ background: 'rgba(14,165,233,0.2)', borderColor: '#38bdf8' }}>
                <Calendar size={14} color="#38bdf8" />
              </button>
              {renderIosDatePickerOverlay()}
            </div>
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
            <div className={styles.datePickerOverlayWrapper}>
              <button type="button" className={styles.v1ArrowBtn}>
                <Calendar size={14} />
              </button>
              {renderIosDatePickerOverlay()}
            </div>
          </div>
        )}

        {/* ── VARIANT 11: Bottom Sheet Drawer Trigger ─────────────── */}
        {activeVariant === 11 && (
          <div className={styles.v11Trigger}>
            <div className={styles.datePickerOverlayWrapper} style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={18} color="#38bdf8" />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Выбрать день в шторке</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>
                    {formatSelectedDateTitle(selectedDate)}
                  </div>
                </div>
              </div>
              {renderIosDatePickerOverlay()}
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button type="button" className={styles.v1ArrowBtn} onClick={handlePrevDay}>◀</button>
              <button type="button" className={styles.v1ArrowBtn} onClick={handleNextDay}>▶</button>
            </div>
          </div>
        )}

        {/* ── VARIANT 12: Centered 5-Day Strip ────────────────────── */}
        {activeVariant === 12 && (
          <div className={styles.v12Centered5DayStrip}>
            <button type="button" className={styles.v1ArrowBtn} onClick={handlePrevDay}>
              <ChevronLeft size={16} />
            </button>
            {[-2, -1, 0, 1, 2].map((offset) => {
              const dStr = addDaysToDateStr(selectedDate, offset);
              const isSel = offset === 0;
              return (
                <div
                  key={dStr}
                  className={`${styles.v12DayPill} ${isSel ? styles.v12DayPillActive : ''}`}
                  onClick={() => onDateChange(dStr)}
                >
                  <span style={{ fontSize: '10px', opacity: 0.7 }}>{getDayName(dStr)}</span>
                  <span style={{ fontSize: isSel ? '16px' : '13px', fontWeight: isSel ? 800 : 600, color: isSel ? '#38bdf8' : '#fff' }}>
                    {dStr.split('-')[2]}
                  </span>
                </div>
              );
            })}
            <button type="button" className={styles.v1ArrowBtn} onClick={handleNextDay}>
              <ChevronRight size={16} />
            </button>
            <div className={styles.datePickerOverlayWrapper}>
              <button type="button" className={styles.v1ArrowBtn}>
                <Calendar size={14} color="#38bdf8" />
              </button>
              {renderIosDatePickerOverlay()}
            </div>
          </div>
        )}

        {/* ── VARIANT 13: Continuous Segmented Ribbon ───────────────── */}
        {activeVariant === 13 && (
          <div className={styles.v13SegmentedRibbon}>
            {Array.from({ length: 7 }, (_, i) => addDaysToDateStr(todayStr, i - 3)).map((dStr) => {
              const isSel = dStr === selectedDate;
              return (
                <button
                  key={dStr}
                  type="button"
                  className={`${styles.v13SegmentItem} ${isSel ? styles.v13SegmentItemActive : ''}`}
                  onClick={() => onDateChange(dStr)}
                >
                  <span style={{ fontSize: '10px' }}>{getDayName(dStr)}</span>
                  <span style={{ fontSize: '14px', fontWeight: 800 }}>{dStr.split('-')[2]}</span>
                </button>
              );
            })}
            <div className={styles.datePickerOverlayWrapper} style={{ flex: 1 }}>
              <button type="button" className={styles.v13SegmentItem} style={{ color: '#38bdf8' }}>
                <Calendar size={14} />
              </button>
              {renderIosDatePickerOverlay()}
            </div>
          </div>
        )}

        {/* ── VARIANT 14: iOS 17 Cupertino Ribbon ──────────────────── */}
        {activeVariant === 14 && (
          <div className={styles.v14CupertinoRibbon}>
            {Array.from({ length: 7 }, (_, i) => addDaysToDateStr(todayStr, i - 3)).map((dStr) => {
              const isSel = dStr === selectedDate;
              const isTod = dStr === todayStr;
              return (
                <div
                  key={dStr}
                  className={`${styles.v14CupertinoCard} ${isSel ? styles.v14CupertinoCardActive : ''}`}
                  onClick={() => onDateChange(dStr)}
                >
                  <span style={{ fontSize: '10px' }}>{isTod ? 'Сегодня' : getDayName(dStr)}</span>
                  <span style={{ fontSize: '15px' }}>{dStr.split('-')[2]}</span>
                </div>
              );
            })}
            <div className={styles.datePickerOverlayWrapper}>
              <button type="button" className={styles.v14CupertinoCard} style={{ minWidth: '42px', justifyContent: 'center' }}>
                🍎 📅
              </button>
              {renderIosDatePickerOverlay()}
            </div>
          </div>
        )}

        {/* ── VARIANT 15: Material 3 Tonal Chips Ribbon ────────────── */}
        {activeVariant === 15 && (
          <div className={styles.v15MaterialRibbon}>
            {Array.from({ length: 7 }, (_, i) => addDaysToDateStr(todayStr, i - 3)).map((dStr) => {
              const isSel = dStr === selectedDate;
              const isTod = dStr === todayStr;
              return (
                <div
                  key={dStr}
                  className={`${styles.v15TonalChip} ${isSel ? styles.v15TonalChipActive : ''}`}
                  onClick={() => onDateChange(dStr)}
                >
                  <span>{isTod ? '☀️ Сг' : getDayName(dStr)}</span>
                  <span>{dStr.split('-')[2]}</span>
                </div>
              );
            })}
            <div className={styles.datePickerOverlayWrapper}>
              <button type="button" className={styles.v15TonalChip} style={{ background: 'rgba(99,102,241,0.25)', color: '#a5b4fc' }}>
                <Calendar size={14} /> Дата
              </button>
              {renderIosDatePickerOverlay()}
            </div>
          </div>
        )}

        {/* ── VARIANT 16: Mini Month Grid Banner ─────────────────── */}
        {activeVariant === 16 && (
          <div className={styles.v16MiniMonth}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, color: '#38bdf8' }}>
              <span>🗓️ Сетка текущей недели</span>
              <div className={styles.datePickerOverlayWrapper}>
                <span style={{ cursor: 'pointer', color: '#38bdf8' }}>[Открыть весь месяц]</span>
                {renderIosDatePickerOverlay()}
              </div>
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

        {/* ── VARIANT 17: Compact Micro Pills Ribbon ─────────────── */}
        {activeVariant === 17 && (
          <div className={styles.v17MicroRibbon}>
            {Array.from({ length: 7 }, (_, i) => addDaysToDateStr(todayStr, i - 3)).map((dStr) => {
              const isSel = dStr === selectedDate;
              const isTod = dStr === todayStr;
              return (
                <button
                  key={dStr}
                  type="button"
                  className={`${styles.v17MicroPill} ${isSel ? styles.v17MicroPillActive : ''}`}
                  onClick={() => onDateChange(dStr)}
                >
                  {isTod ? '☀️ Сегодня' : `${getDayName(dStr)} ${dStr.split('-')[2]}`}
                </button>
              );
            })}
            <div className={styles.datePickerOverlayWrapper}>
              <button type="button" className={styles.v17MicroPill} style={{ background: 'rgba(14,165,233,0.2)', color: '#38bdf8' }}>
                <Calendar size={12} /> Дата
              </button>
              {renderIosDatePickerOverlay()}
            </div>
          </div>
        )}

        {/* ── VARIANT 18: Glowing Neon Halo Ribbon ────────────────── */}
        {activeVariant === 18 && (
          <div className={styles.v18NeonRibbon}>
            {Array.from({ length: 7 }, (_, i) => addDaysToDateStr(todayStr, i - 3)).map((dStr) => {
              const isSel = dStr === selectedDate;
              const isTod = dStr === todayStr;
              return (
                <div
                  key={dStr}
                  className={`${styles.v18NeonCard} ${isSel ? styles.v18NeonCardActive : ''}`}
                  onClick={() => onDateChange(dStr)}
                >
                  <span style={{ fontSize: '10px', color: isSel ? '#f472b6' : 'var(--color-text-muted)' }}>
                    {isTod ? 'Сг' : getDayName(dStr)}
                  </span>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: isSel ? '#fff' : 'inherit' }}>
                    {dStr.split('-')[2]}
                  </span>
                </div>
              );
            })}
            <div className={styles.datePickerOverlayWrapper}>
              <button type="button" className={styles.v18NeonCard} style={{ borderColor: '#ec4899' }}>
                <Calendar size={16} color="#ec4899" />
              </button>
              {renderIosDatePickerOverlay()}
            </div>
          </div>
        )}

        {/* ── VARIANT 19: 3 Large Mobile Cards Carousel ────────────── */}
        {activeVariant === 19 && (
          <div className={styles.v3ThreeCardContainer}>
            <button type="button" className={styles.v1ArrowBtn} onClick={handlePrevDay} title="-1 день">
              <ChevronLeft size={18} />
            </button>

            <div className={styles.v19BigCardsGrid}>
              {[-1, 0, 1].map((offset) => {
                const dStr = addDaysToDateStr(selectedDate, offset);
                const isSel = offset === 0;
                const isTod = dStr === todayStr;
                return (
                  <div
                    key={dStr}
                    className={`${styles.v19BigCard} ${isSel ? styles.v19BigCardActive : ''}`}
                    onClick={() => onDateChange(dStr)}
                  >
                    <span style={{ fontSize: '11px', fontWeight: 700, opacity: isSel ? 1 : 0.7 }}>
                      {isTod ? '☀️ Сегодня' : getDayName(dStr)}
                    </span>
                    <span style={{ fontSize: '20px', fontWeight: 900 }}>
                      {dStr.split('-')[2]}
                    </span>
                  </div>
                );
              })}
            </div>

            <button type="button" className={styles.v1ArrowBtn} onClick={handleNextDay} title="+1 день">
              <ChevronRight size={18} />
            </button>

            <div className={styles.datePickerOverlayWrapper}>
              <button type="button" className={styles.v1ArrowBtn} title="Календарь">
                <Calendar size={16} color="#38bdf8" />
              </button>
              {renderIosDatePickerOverlay()}
            </div>
          </div>
        )}

        {/* ── VARIANT 20: Dynamic Island Ribbon Capsule ───────────── */}
        {activeVariant === 20 && (
          <div className={styles.v20DynamicIsland}>
            <div className={styles.datePickerOverlayWrapper}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 8px #38bdf8' }} />
                <div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Dynamic Island Ribbon</div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>
                    📅 {getRelativeLabel(selectedDate, todayStr)} • {formatDateDisplay(selectedDate)}
                  </div>
                </div>
              </div>
              {renderIosDatePickerOverlay()}
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
