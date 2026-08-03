'use client';

import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Sparkles, Sun, Zap, Compass, Star } from 'lucide-react';
import styles from './MonthCalendarWidget.module.css';

export interface MonthDayInfo {
  dateStr: string;
  dayNum: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  tasksCount: number;
  doneCount: number;
}

interface MonthCalendarWidgetProps {
  currentMonthDate: Date;
  selectedDate: string;
  todayStr: string;
  monthDays: MonthDayInfo[];
  onSelectDate: (dateStr: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onGoToToday: () => void;
  activeVariant?: number;
}

export const MonthCalendarWidget: React.FC<MonthCalendarWidgetProps> = ({
  currentMonthDate,
  selectedDate,
  monthDays,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  onGoToToday,
  activeVariant = 1,
}) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    // Touch Swipe threshold for changing month
    if (diff > 45) {
      onNextMonth();
    } else if (diff < -45) {
      onPrevMonth();
    }
    setTouchStart(null);
  };

  const monthTitleStr = currentMonthDate.toLocaleDateString('ru-RU', {
    month: 'long',
    year: 'numeric',
  });

  // Reusable 7-Column Days Grid Matrix
  const renderDaysGrid = () => (
    <div className={styles.calendarMatrixGrid}>
      {monthDays.map((d) => {
        const isSelected = d.dateStr === selectedDate;
        const hasTasks = d.tasksCount > 0;
        const isAllDone = hasTasks && d.doneCount === d.tasksCount;

        return (
          <div
            key={d.dateStr}
            className={`${styles.dateCell} ${!d.isCurrentMonth ? styles.dateCellOtherMonth : ''} ${
              d.isToday ? styles.dateCellToday : ''
            } ${isSelected ? styles.dateCellActive : ''}`}
            onClick={() => onSelectDate(d.dateStr)}
          >
            <span className={styles.dayNum}>{d.dayNum}</span>

            {hasTasks && (
              <div className={styles.taskDots}>
                <div className={`${styles.dot} ${isAllDone ? styles.dotDone : ''}`} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  // Reusable Week Header Row
  const renderWeekHeader = () => (
    <div className={styles.weekHeaderGrid}>
      <div className={styles.weekHeaderCell}>Пн</div>
      <div className={styles.weekHeaderCell}>Вт</div>
      <div className={styles.weekHeaderCell}>Ср</div>
      <div className={styles.weekHeaderCell}>Чт</div>
      <div className={styles.weekHeaderCell}>Пт</div>
      <div className={styles.weekHeaderCell} style={{ color: '#f59e0b' }}>Сб</div>
      <div className={styles.weekHeaderCell} style={{ color: '#ef4444' }}>Вс</div>
    </div>
  );

  // Reusable Nav Arrow Controls
  const renderNavControls = (customClass?: string) => (
    <div className={customClass || styles.navBtnGroup}>
      <button
        type="button"
        className={styles.todayBtn}
        onClick={onGoToToday}
        title="Перейти к сегодняшней дате"
      >
        <Sun size={12} />
        <span>Сегодня</span>
      </button>
      <button
        type="button"
        className={styles.navArrowBtn}
        onClick={onPrevMonth}
        title="Предыдущий месяц"
      >
        <ChevronLeft size={14} />
      </button>
      <button
        type="button"
        className={styles.navArrowBtn}
        onClick={onNextMonth}
        title="Следующий месяц"
      >
        <ChevronRight size={14} />
      </button>
    </div>
  );

  // Select variant class
  const getVariantClass = () => {
    switch (activeVariant) {
      case 1: return styles.v1CupertinoGlass;
      case 2: return styles.v2NotionMinimal;
      case 3: return styles.v3LinearCyber;
      case 4: return styles.v4FantasticalCapsule;
      case 5: return styles.v5VisionOS3D;
      case 6: return styles.v6AppleReminders;
      case 7: return styles.v7AirCalendarCapsule;
      case 8: return styles.v8Material3Tonal;
      case 9: return styles.v9HeadspaceBlobs;
      case 10: return styles.v10CyberpunkHolo;
      case 11: return styles.v11MinimalText;
      case 12: return styles.v12SpotlightPills;
      case 13: return styles.v13DualToneStrips;
      case 14: return styles.v14DashedGrid;
      case 15: return styles.v15AppleJournal;
      case 16: return styles.v16MicroSquare;
      case 17: return styles.v17FloatingBubbles;
      case 18: return styles.v18InsetSlots;
      case 19: return styles.v19BigNumbers;
      case 20: return styles.v20MasterSuite;
      default: return styles.v1CupertinoGlass;
    }
  };

  return (
    <div
      className={`${styles.baseCalendarCard} ${getVariantClass()}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Dynamic Header based on Variant */}
      {activeVariant === 10 ? (
        // Cyberpunk Holo Header
        <div className={styles.monthHeaderRow}>
          <div className={styles.monthTitleText} style={{ fontFamily: 'monospace' }}>
            <Zap size={16} color="#f59e0b" />
            <span>[{monthTitleStr.toUpperCase()}]</span>
          </div>
          {renderNavControls()}
        </div>
      ) : activeVariant === 13 ? (
        // Dual-Tone Badge Header
        <div className={styles.monthHeaderRow}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ background: '#0ea5e9', color: '#fff', fontSize: '10px', fontWeight: 900, padding: '2px 7px', borderRadius: '6px' }}>
              МЕСЯЦ
            </span>
            <span className={styles.monthTitleText}>{monthTitleStr}</span>
          </div>
          {renderNavControls()}
        </div>
      ) : activeVariant === 19 ? (
        // Vertical Split Header
        <div className={styles.monthHeaderRow} style={{ borderBottom: '1px dashed var(--color-border)', paddingBottom: '8px' }}>
          <div className={styles.monthTitleText}>
            <Compass size={18} color="#38bdf8" />
            <span>{monthTitleStr}</span>
          </div>
          {renderNavControls()}
        </div>
      ) : activeVariant === 20 ? (
        // Master Suite Header
        <div className={styles.monthHeaderRow}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Star size={18} color="#f59e0b" />
            <span className={styles.monthTitleText}>{monthTitleStr}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '10px', color: '#38bdf8', fontWeight: 800, background: 'rgba(56,189,248,0.15)', padding: '2px 6px', borderRadius: '6px' }}>
              SWIPE ↔
            </span>
            {renderNavControls()}
          </div>
        </div>
      ) : (
        // Standard Sleek Header for all other variants
        <div className={styles.monthHeaderRow}>
          <div className={styles.monthTitleText}>
            <Calendar size={18} color="#38bdf8" />
            <span style={{ textTransform: 'capitalize' }}>{monthTitleStr}</span>
          </div>
          {renderNavControls()}
        </div>
      )}

      {/* Week Header Row */}
      {renderWeekHeader()}

      {/* Days Grid Matrix */}
      {renderDaysGrid()}
    </div>
  );
};

/** Standalone Selector Bar Rendered DIRECTLY UNDER the Monthly Calendar Widget */
export const MonthCalendarSelectorBar: React.FC<{
  activeVariant: number;
  onSelectVariant: (v: number) => void;
}> = ({ activeVariant, onSelectVariant }) => {
  return (
    <div className={styles.selectorBarUnderWidget}>
      <div className={styles.selectorHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={14} color="#38bdf8" />
          <span>UX-концепция Календаря (под виджетом): (Вариант #{activeVariant})</span>
        </div>
        <span style={{ fontSize: '10px', opacity: 0.7 }}>20 Концепций</span>
      </div>

      <div className={styles.selectorGrid}>
        {Array.from({ length: 20 }, (_, i) => i + 1).map((v) => (
          <button
            key={v}
            type="button"
            className={`${styles.selectorBtn} ${activeVariant === v ? styles.selectorBtnActive : ''}`}
            onClick={() => onSelectVariant(v)}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
};
