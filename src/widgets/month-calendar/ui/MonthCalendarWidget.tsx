'use client';

import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Sun } from 'lucide-react';
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
}

export const MonthCalendarWidget: React.FC<MonthCalendarWidgetProps> = ({
  currentMonthDate,
  selectedDate,
  monthDays,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  onGoToToday,
}) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    // Touch Swipe threshold for changing month on mobile
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
  const renderNavControls = () => (
    <div className={styles.navBtnGroup}>
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

  return (
    <div
      className={`${styles.material3Container} ${styles.size6}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Sleek Month Header */}
      <div className={styles.monthHeaderRow}>
        <div className={styles.monthTitleText}>
          <Calendar size={18} color="#6366f1" />
          <span style={{ textTransform: 'capitalize' }}>{monthTitleStr}</span>
        </div>
        {renderNavControls()}
      </div>

      {/* Week Header Row */}
      {renderWeekHeader()}

      {/* Days Grid Matrix */}
      {renderDaysGrid()}
    </div>
  );
};
