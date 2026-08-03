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

/** Reusable Touch & Drag Gesture Wrapper for Swipe-based Variants */
const SwipeGestureBox: React.FC<{
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}> = ({ onSwipeLeft, onSwipeRight, children, className, style }) => {
  const [startX, setStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startX === null) return;
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    if (diff > 35) onSwipeLeft();
    else if (diff < -35) onSwipeRight();
    setStartX(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (startX === null) return;
    const diff = startX - e.clientX;
    if (diff > 35) onSwipeLeft();
    else if (diff < -35) onSwipeRight();
    setStartX(null);
  };

  return (
    <div
      className={className}
      style={{ userSelect: 'none', cursor: 'grab', touchAction: 'pan-y', ...style }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {children}
    </div>
  );
};

export const DaySwitcherShowcase: React.FC<DaySwitcherShowcaseProps> = ({
  selectedDate,
  onDateChange,
}) => {
  const [activeVariant, setActiveVariant] = useState<number>(3);
  const scrollRibbonRef = React.useRef<HTMLDivElement>(null);

  const todayStr = getTodayStr();
  const isTodaySelected = selectedDate === todayStr;

  const handlePrevDay = () => onDateChange(addDaysToDateStr(selectedDate, -1));
  const handleNextDay = () => onDateChange(addDaysToDateStr(selectedDate, 1));
  const handleGoToday = () => onDateChange(todayStr);

  // Auto-center active card inside scroll ribbons when mounted or when selection changes
  React.useEffect(() => {
    if (scrollRibbonRef.current) {
      const activeEl = scrollRibbonRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [selectedDate, activeVariant]);

  /** Universal Fail-Proof iOS WebKit Transparent Date Picker Overlay */
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
        {/* ── VARIANT 1: Stepper ─────────────────────────────── */}
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

        {/* ── VARIANT 2: 3-Card Swipe Snap (No arrows, No calendar icon) ── */}
        {activeVariant === 2 && (
          <SwipeGestureBox onSwipeLeft={handleNextDay} onSwipeRight={handlePrevDay}>
            <div className={styles.swipeGrid3}>
              {[-1, 0, 1].map((offset) => {
                const dStr = addDaysToDateStr(selectedDate, offset);
                const isSel = offset === 0;
                const isTod = dStr === todayStr;
                return (
                  <div
                    key={dStr}
                    className={`${styles.swipeCardBase} ${isSel ? styles.swipeCardActive : ''} ${isTod ? styles.todayCardBorder : ''}`}
                    onClick={() => onDateChange(dStr)}
                  >
                    {isTod ? (
                      <span className={styles.todayGoldBadge}>☀️ СЕГОДНЯ</span>
                    ) : (
                      <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontWeight: 700 }}>{getDayName(dStr)}</span>
                    )}
                    <span style={{ fontSize: '16px', fontWeight: 900, color: isSel ? '#38bdf8' : '#fff' }}>{dStr.split('-')[2]}</span>
                    <span style={{ fontSize: '9px', opacity: 0.5 }}>{dStr.split('-')[1]} мес</span>
                  </div>
                );
              })}
            </div>
          </SwipeGestureBox>
        )}

        {/* ── VARIANT 3: 3-Day Visible Mobile Snap Ribbon (With arrows) ── */}
        {activeVariant === 3 && (
          <div className={styles.swipeGrid3} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button type="button" className={styles.v1ArrowBtn} onClick={handlePrevDay} title="-1 день">
              <ChevronLeft size={18} />
            </button>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', flex: 1 }}>
              {[-1, 0, 1].map((offset) => {
                const dStr = addDaysToDateStr(selectedDate, offset);
                const isSel = offset === 0;
                const isTod = dStr === todayStr;
                return (
                  <div
                    key={dStr}
                    className={`${styles.swipeCardBase} ${isSel ? styles.swipeCardActive : ''} ${isTod ? styles.todayCardBorder : ''}`}
                    onClick={() => onDateChange(dStr)}
                  >
                    {isTod ? <span className={styles.todayGoldBadge}>☀️ СЕГОДНЯ</span> : <span style={{ fontSize: '10px', opacity: 0.7 }}>{getDayName(dStr)}</span>}
                    <span style={{ fontSize: '16px', fontWeight: 900, color: isSel ? '#38bdf8' : '#fff' }}>{dStr.split('-')[2]}</span>
                  </div>
                );
              })}
            </div>
            <button type="button" className={styles.v1ArrowBtn} onClick={handleNextDay} title="+1 день">
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* ── VARIANT 4: Classic 7-Day Ribbon Strip (Scroll + Calendar) ── */}
        {activeVariant === 4 && (
          <div className={styles.v4RibbonStrip} ref={scrollRibbonRef}>
            {Array.from({ length: 7 }, (_, i) => addDaysToDateStr(todayStr, i - 3)).map((dStr) => {
              const isSel = dStr === selectedDate;
              const isTod = dStr === todayStr;
              return (
                <div
                  key={dStr}
                  data-active={isSel}
                  className={`${styles.v4DayCard} ${isSel ? styles.v4DayCardActive : ''} ${isTod ? styles.todayCardBorder : ''}`}
                  onClick={() => onDateChange(dStr)}
                >
                  {isTod ? <span className={styles.todayGoldBadge}>☀️ СЕГОДНЯ</span> : <span style={{ fontSize: '10px', opacity: 0.7 }}>{getDayName(dStr)}</span>}
                  <span style={{ fontSize: '15px', fontWeight: 800, color: isSel ? '#38bdf8' : '#fff' }}>{dStr.split('-')[2]}</span>
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

        {/* ── VARIANT 5: Capsule Pills Swipe (No arrows, No calendar) ── */}
        {activeVariant === 5 && (
          <SwipeGestureBox onSwipeLeft={handleNextDay} onSwipeRight={handlePrevDay}>
            <div className={styles.swipeGrid5}>
              {[-2, -1, 0, 1, 2].map((offset) => {
                const dStr = addDaysToDateStr(selectedDate, offset);
                const isSel = offset === 0;
                const isTod = dStr === todayStr;
                return (
                  <div
                    key={dStr}
                    className={`${styles.swipeCardBase} ${styles.v5CapsuleCard} ${isSel ? styles.swipeCardActive : ''} ${isTod ? styles.todayCardBorder : ''}`}
                    onClick={() => onDateChange(dStr)}
                  >
                    {isTod ? <span className={styles.todayGoldBadge}>☀️ СЕГОДНЯ</span> : <span style={{ fontSize: '10px', opacity: 0.7 }}>{getDayName(dStr)}</span>}
                    <span style={{ fontSize: '14px', fontWeight: 800, color: isSel ? '#38bdf8' : '#fff' }}>{dStr.split('-')[2]}</span>
                  </div>
                );
              })}
            </div>
          </SwipeGestureBox>
        )}

        {/* ── VARIANT 6: Hero Banner ─────────────────────────── */}
        {activeVariant === 6 && (
          <div className={styles.v6HeroBanner}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>Выбранный день</div>
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
              <button type="button" className={styles.todayChip} style={{ flex: 1, justifyContent: 'center', padding: '6px' }} onClick={handlePrevDay}>◀ Назад</button>
              <button type="button" className={styles.todayChip} style={{ flex: 1, justifyContent: 'center', padding: '6px', background: isTodaySelected ? 'rgba(14,165,233,0.3)' : undefined }} onClick={handleGoToday}>☀️ В сегодня</button>
              <button type="button" className={styles.todayChip} style={{ flex: 1, justifyContent: 'center', padding: '6px' }} onClick={handleNextDay}>Вперед ▶</button>
            </div>
          </div>
        )}

        {/* ── VARIANT 7: Floating Island Swipe (No arrows, No calendar) ── */}
        {activeVariant === 7 && (
          <SwipeGestureBox onSwipeLeft={handleNextDay} onSwipeRight={handlePrevDay}>
            <div className={styles.swipeGrid5}>
              {[-2, -1, 0, 1, 2].map((offset) => {
                const dStr = addDaysToDateStr(selectedDate, offset);
                const isSel = offset === 0;
                const isTod = dStr === todayStr;
                return (
                  <div
                    key={dStr}
                    className={`${styles.swipeCardBase} ${styles.v7FloatingIslandCard} ${isSel ? styles.swipeCardActive : ''} ${isTod ? styles.todayCardBorder : ''}`}
                    onClick={() => onDateChange(dStr)}
                  >
                    {isTod ? <span className={styles.todayGoldBadge}>☀️ СЕГОДНЯ</span> : <span style={{ fontSize: '10px', opacity: 0.7 }}>{getDayName(dStr)}</span>}
                    <span style={{ fontSize: '14px', fontWeight: 800, color: isSel ? '#38bdf8' : '#fff' }}>{dStr.split('-')[2]}</span>
                  </div>
                );
              })}
            </div>
          </SwipeGestureBox>
        )}

        {/* ── VARIANT 8: Glassmorphic Frosted Ribbon (Scroll) ───────── */}
        {activeVariant === 8 && (
          <div className={styles.v8GlassmorphicRibbon} ref={scrollRibbonRef}>
            {Array.from({ length: 7 }, (_, i) => addDaysToDateStr(todayStr, i - 3)).map((dStr) => {
              const isSel = dStr === selectedDate;
              const isTod = dStr === todayStr;
              return (
                <div
                  key={dStr}
                  data-active={isSel}
                  className={`${styles.v4DayCard} ${isSel ? styles.v4DayCardActive : ''} ${isTod ? styles.todayCardBorder : ''}`}
                  onClick={() => onDateChange(dStr)}
                >
                  {isTod ? <span className={styles.todayGoldBadge}>☀️ СЕГОДНЯ</span> : <span style={{ fontSize: '10px', opacity: 0.7 }}>{getDayName(dStr)}</span>}
                  <span style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>{dStr.split('-')[2]}</span>
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

        {/* ── VARIANT 9: Circle Dot Ribbon (Scroll) ─────────────────── */}
        {activeVariant === 9 && (
          <div className={styles.v9DotRibbon} ref={scrollRibbonRef}>
            {Array.from({ length: 7 }, (_, i) => addDaysToDateStr(todayStr, i - 3)).map((dStr) => {
              const isSel = dStr === selectedDate;
              const isTod = dStr === todayStr;
              return (
                <div
                  key={dStr}
                  data-active={isSel}
                  className={`${styles.v9CircleDot} ${isSel ? styles.v9CircleDotActive : ''} ${isTod ? styles.todayCardBorder : ''}`}
                  onClick={() => onDateChange(dStr)}
                >
                  <span style={{ fontSize: '12px', fontWeight: 800 }}>{dStr.split('-')[2]}</span>
                  <span style={{ fontSize: '8px', opacity: 0.8 }}>{isTod ? '☀️' : getDayName(dStr)}</span>
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

        {/* ── VARIANT 10: Timeline Track Swipe (No arrows, No calendar) ── */}
        {activeVariant === 10 && (
          <SwipeGestureBox onSwipeLeft={handleNextDay} onSwipeRight={handlePrevDay}>
            <div className={styles.swipeGrid5}>
              {[-2, -1, 0, 1, 2].map((offset) => {
                const dStr = addDaysToDateStr(selectedDate, offset);
                const isSel = offset === 0;
                const isTod = dStr === todayStr;
                return (
                  <div
                    key={dStr}
                    className={`${styles.swipeCardBase} ${isSel ? styles.swipeCardActive : ''} ${isTod ? styles.todayCardBorder : ''}`}
                    onClick={() => onDateChange(dStr)}
                  >
                    {isTod ? <span className={styles.todayGoldBadge}>☀️ СЕГОДНЯ</span> : <span style={{ fontSize: '10px', opacity: 0.7 }}>{getDayName(dStr)}</span>}
                    <span style={{ fontSize: '14px', fontWeight: 800, color: isSel ? '#38bdf8' : '#fff' }}>{dStr.split('-')[2]}</span>
                  </div>
                );
              })}
            </div>
          </SwipeGestureBox>
        )}

        {/* ── VARIANT 11: 3 Big Cards Swipe Carousel (No arrows, No calendar) ── */}
        {activeVariant === 11 && (
          <SwipeGestureBox onSwipeLeft={handleNextDay} onSwipeRight={handlePrevDay}>
            <div className={styles.swipeGrid3}>
              {[-1, 0, 1].map((offset) => {
                const dStr = addDaysToDateStr(selectedDate, offset);
                const isSel = offset === 0;
                const isTod = dStr === todayStr;
                return (
                  <div
                    key={dStr}
                    className={`${styles.swipeCardBase} ${isSel ? styles.swipeCardActive : ''} ${isTod ? styles.todayCardBorder : ''}`}
                    onClick={() => onDateChange(dStr)}
                    style={{ padding: '14px 8px' }}
                  >
                    {isTod ? <span className={styles.todayGoldBadge}>☀️ СЕГОДНЯ</span> : <span style={{ fontSize: '11px', fontWeight: 700, opacity: 0.8 }}>{getDayName(dStr)}</span>}
                    <span style={{ fontSize: '20px', fontWeight: 900, color: isSel ? '#38bdf8' : '#fff' }}>{dStr.split('-')[2]}</span>
                  </div>
                );
              })}
            </div>
          </SwipeGestureBox>
        )}

        {/* ── VARIANT 12 (MODIFIED): Scroll Ribbon (Style 12: Centered Enlarged Day, NO ARROWS, NO CALENDAR ICON) ── */}
        {activeVariant === 12 && (
          <div className={styles.v12ScrollRibbon} ref={scrollRibbonRef}>
            {Array.from({ length: 9 }, (_, i) => addDaysToDateStr(todayStr, i - 4)).map((dStr) => {
              const isSel = dStr === selectedDate;
              const isTod = dStr === todayStr;
              return (
                <div
                  key={dStr}
                  data-active={isSel}
                  className={`${styles.v12Pill} ${isSel ? styles.v12PillActive : ''} ${isTod ? styles.todayCardBorder : ''}`}
                  onClick={() => onDateChange(dStr)}
                >
                  {isTod ? <span className={styles.todayGoldBadge}>☀️ СЕГОДНЯ</span> : <span style={{ fontSize: '10px', opacity: 0.7 }}>{getDayName(dStr)}</span>}
                  <span style={{ fontSize: isSel ? '17px' : '14px', fontWeight: isSel ? 900 : 600, color: isSel ? '#38bdf8' : '#fff' }}>
                    {dStr.split('-')[2]}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* ── VARIANT 13: Segmented Strip Swipe (No arrows, No calendar) ── */}
        {activeVariant === 13 && (
          <SwipeGestureBox onSwipeLeft={handleNextDay} onSwipeRight={handlePrevDay}>
            <div className={styles.swipeGrid5}>
              {[-2, -1, 0, 1, 2].map((offset) => {
                const dStr = addDaysToDateStr(selectedDate, offset);
                const isSel = offset === 0;
                const isTod = dStr === todayStr;
                return (
                  <div
                    key={dStr}
                    className={`${styles.swipeCardBase} ${isSel ? styles.swipeCardActive : ''} ${isTod ? styles.todayCardBorder : ''}`}
                    onClick={() => onDateChange(dStr)}
                  >
                    {isTod ? <span className={styles.todayGoldBadge}>☀️ СЕГОДНЯ</span> : <span style={{ fontSize: '10px', opacity: 0.7 }}>{getDayName(dStr)}</span>}
                    <span style={{ fontSize: '14px', fontWeight: 800, color: isSel ? '#38bdf8' : '#fff' }}>{dStr.split('-')[2]}</span>
                  </div>
                );
              })}
            </div>
          </SwipeGestureBox>
        )}

        {/* ── VARIANT 14: iOS 17 Cupertino Swipe (No arrows, No calendar) ── */}
        {activeVariant === 14 && (
          <SwipeGestureBox onSwipeLeft={handleNextDay} onSwipeRight={handlePrevDay}>
            <div className={styles.swipeGrid5}>
              {[-2, -1, 0, 1, 2].map((offset) => {
                const dStr = addDaysToDateStr(selectedDate, offset);
                const isSel = offset === 0;
                const isTod = dStr === todayStr;
                return (
                  <div
                    key={dStr}
                    className={`${styles.swipeCardBase} ${styles.v14CupertinoCard} ${isSel ? styles.swipeCardActive : ''} ${isTod ? styles.todayCardBorder : ''}`}
                    onClick={() => onDateChange(dStr)}
                  >
                    {isTod ? <span className={styles.todayGoldBadge}>☀️ СЕГОДНЯ</span> : <span style={{ fontSize: '10px', opacity: 0.7 }}>{getDayName(dStr)}</span>}
                    <span style={{ fontSize: '14px', fontWeight: 800, color: isSel ? '#38bdf8' : '#fff' }}>{dStr.split('-')[2]}</span>
                  </div>
                );
              })}
            </div>
          </SwipeGestureBox>
        )}

        {/* ── VARIANT 15: Material 3 Tonal Swipe (No arrows, No calendar) ── */}
        {activeVariant === 15 && (
          <SwipeGestureBox onSwipeLeft={handleNextDay} onSwipeRight={handlePrevDay}>
            <div className={styles.swipeGrid5}>
              {[-2, -1, 0, 1, 2].map((offset) => {
                const dStr = addDaysToDateStr(selectedDate, offset);
                const isSel = offset === 0;
                const isTod = dStr === todayStr;
                return (
                  <div
                    key={dStr}
                    className={`${styles.swipeCardBase} ${styles.v15TonalCard} ${isSel ? styles.swipeCardActive : ''} ${isTod ? styles.todayCardBorder : ''}`}
                    onClick={() => onDateChange(dStr)}
                  >
                    {isTod ? <span className={styles.todayGoldBadge}>☀️ СЕГОДНЯ</span> : <span style={{ fontSize: '10px', opacity: 0.7 }}>{getDayName(dStr)}</span>}
                    <span style={{ fontSize: '14px', fontWeight: 800, color: isSel ? '#818cf8' : '#fff' }}>{dStr.split('-')[2]}</span>
                  </div>
                );
              })}
            </div>
          </SwipeGestureBox>
        )}

        {/* ── VARIANT 16: Big Numbers Gradient Swipe (No arrows, No calendar) ── */}
        {activeVariant === 16 && (
          <SwipeGestureBox onSwipeLeft={handleNextDay} onSwipeRight={handlePrevDay}>
            <div className={styles.swipeGrid3}>
              {[-1, 0, 1].map((offset) => {
                const dStr = addDaysToDateStr(selectedDate, offset);
                const isSel = offset === 0;
                const isTod = dStr === todayStr;
                return (
                  <div
                    key={dStr}
                    className={`${styles.swipeCardBase} ${isSel ? styles.swipeCardActive : ''} ${isTod ? styles.todayCardBorder : ''}`}
                    onClick={() => onDateChange(dStr)}
                    style={{ padding: '14px 8px' }}
                  >
                    {isTod ? <span className={styles.todayGoldBadge}>☀️ СЕГОДНЯ</span> : <span style={{ fontSize: '11px', fontWeight: 700, opacity: 0.7 }}>{getDayName(dStr)}</span>}
                    <span style={{ fontSize: '22px', fontWeight: 900, color: isSel ? '#38bdf8' : '#fff' }}>{dStr.split('-')[2]}</span>
                  </div>
                );
              })}
            </div>
          </SwipeGestureBox>
        )}

        {/* ── VARIANT 17: Micro Pills Swipe (No arrows, No calendar) ── */}
        {activeVariant === 17 && (
          <SwipeGestureBox onSwipeLeft={handleNextDay} onSwipeRight={handlePrevDay}>
            <div className={styles.swipeGrid5}>
              {[-2, -1, 0, 1, 2].map((offset) => {
                const dStr = addDaysToDateStr(selectedDate, offset);
                const isSel = offset === 0;
                const isTod = dStr === todayStr;
                return (
                  <div
                    key={dStr}
                    className={`${styles.swipeCardBase} ${isSel ? styles.swipeCardActive : ''} ${isTod ? styles.todayCardBorder : ''}`}
                    onClick={() => onDateChange(dStr)}
                    style={{ padding: '8px 4px' }}
                  >
                    {isTod ? <span className={styles.todayGoldBadge}>☀️ СЕГОДНЯ</span> : <span style={{ fontSize: '10px', opacity: 0.7 }}>{getDayName(dStr)}</span>}
                    <span style={{ fontSize: '13px', fontWeight: 800, color: isSel ? '#38bdf8' : '#fff' }}>{dStr.split('-')[2]}</span>
                  </div>
                );
              })}
            </div>
          </SwipeGestureBox>
        )}

        {/* ── VARIANT 18: Glowing Neon Halo Ribbon (Scroll) ─────────── */}
        {activeVariant === 18 && (
          <div className={styles.v18NeonRibbon} ref={scrollRibbonRef}>
            {Array.from({ length: 7 }, (_, i) => addDaysToDateStr(todayStr, i - 3)).map((dStr) => {
              const isSel = dStr === selectedDate;
              const isTod = dStr === todayStr;
              return (
                <div
                  key={dStr}
                  data-active={isSel}
                  className={`${styles.v18NeonCard} ${isSel ? styles.v18NeonCardActive : ''} ${isTod ? styles.todayCardBorder : ''}`}
                  onClick={() => onDateChange(dStr)}
                >
                  {isTod ? <span className={styles.todayGoldBadge}>☀️ СЕГОДНЯ</span> : <span style={{ fontSize: '10px', opacity: 0.7 }}>{getDayName(dStr)}</span>}
                  <span style={{ fontSize: '15px', fontWeight: 800, color: isSel ? '#fff' : 'inherit' }}>{dStr.split('-')[2]}</span>
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

        {/* ── VARIANT 19 (MODIFIED): Scroll Ribbon (Style 19: Extra Large Cards & Vibrant Gradient, NO ARROWS, NO CALENDAR ICON) ── */}
        {activeVariant === 19 && (
          <div className={styles.v19ScrollRibbon} ref={scrollRibbonRef}>
            {Array.from({ length: 9 }, (_, i) => addDaysToDateStr(todayStr, i - 4)).map((dStr) => {
              const isSel = dStr === selectedDate;
              const isTod = dStr === todayStr;
              return (
                <div
                  key={dStr}
                  data-active={isSel}
                  className={`${styles.v19BigCard} ${isSel ? styles.v19BigCardActive : ''} ${isTod ? styles.todayCardBorder : ''}`}
                  onClick={() => onDateChange(dStr)}
                >
                  {isTod ? <span className={styles.todayGoldBadge}>☀️ СЕГОДНЯ</span> : <span style={{ fontSize: '10px', opacity: 0.8 }}>{getDayName(dStr)}</span>}
                  <span style={{ fontSize: '20px', fontWeight: 900 }}>{dStr.split('-')[2]}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* ── VARIANT 20: Dynamic Island Glow Swipe (No arrows, No calendar) ── */}
        {activeVariant === 20 && (
          <SwipeGestureBox onSwipeLeft={handleNextDay} onSwipeRight={handlePrevDay}>
            <div className={styles.swipeGrid5}>
              {[-2, -1, 0, 1, 2].map((offset) => {
                const dStr = addDaysToDateStr(selectedDate, offset);
                const isSel = offset === 0;
                const isTod = dStr === todayStr;
                return (
                  <div
                    key={dStr}
                    className={`${styles.swipeCardBase} ${styles.v20IslandCard} ${isSel ? styles.swipeCardActive : ''} ${isTod ? styles.todayCardBorder : ''}`}
                    onClick={() => onDateChange(dStr)}
                  >
                    {isTod ? <span className={styles.todayGoldBadge}>☀️ СЕГОДНЯ</span> : <span style={{ fontSize: '10px', opacity: 0.7 }}>{getDayName(dStr)}</span>}
                    <span style={{ fontSize: '14px', fontWeight: 800, color: isSel ? '#38bdf8' : '#fff' }}>{dStr.split('-')[2]}</span>
                  </div>
                );
              })}
            </div>
          </SwipeGestureBox>
        )}
      </div>
    </div>
  );
};
