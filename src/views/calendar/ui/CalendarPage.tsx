'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Typography, Checkbox } from '@/shared/ui';
import { useTaskStore } from '@/entities/task';
import { useTopicStore } from '@/entities/topic';
import { Task } from '@/entities/task/model/types';
import { SmartRating } from '@/shared/config/repetitionRules';
import { EditTaskModal } from '@/features/edit-task/ui/EditTaskModal';
import { RepeatingTaskDetailModal } from '@/features/edit-task/ui/RepeatingTaskDetailModal';
import { SmartRatingModal } from '@/features/smart-rating-modal/ui/SmartRatingModal';
import styles from './CalendarPage.module.css';

const formatDateStr = (y: number, m: number, d: number): string => {
  const year = y;
  const month = String(m + 1).padStart(2, '0');
  const day = String(d).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatSelectedDateTitle = (dateStr: string) => {
  if (!dateStr || !dateStr.includes('-')) return dateStr;
  const parts = dateStr.split('-').map(Number);
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  return d.toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

// Filter helper: Subtask is shown separately ONLY IF its scheduledDate differs from parent's scheduledDate
const filterCalendarVisibleTasks = (allTasks: Task[], targetDateStr: string): Task[] => {
  return allTasks.filter((t) => {
    if (t.scheduledDate !== targetDateStr) return false;

    if (t.parentTaskId) {
      const parentTask = allTasks.find((p) => p.id === t.parentTaskId);
      // If parent and subtask have the SAME scheduledDate, do NOT show subtask as a separate top-level item
      if (parentTask && parentTask.scheduledDate === t.scheduledDate) {
        return false;
      }
    }

    return true;
  });
};

export const CalendarPage: React.FC = () => {
  const todayStr = useMemo(() => {
    const now = new Date();
    return formatDateStr(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date());
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const [smartTask, setSmartTask] = useState<Task | null>(null);

  const [touchStart, setTouchStart] = useState<number | null>(null);

  const { tasks, isLoading, fetchTasks, toggleTaskStatus, updateTaskStatus } = useTaskStore();
  const { topics, fetchTopics } = useTopicStore();

  useEffect(() => {
    fetchTasks();
    fetchTopics();
  }, [fetchTasks, fetchTopics]);

  const handlePrevMonth = () => {
    setCurrentMonthDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleGoToToday = () => {
    const now = new Date();
    setCurrentMonthDate(now);
    setSelectedDate(formatDateStr(now.getFullYear(), now.getMonth(), now.getDate()));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (diff > 45) {
      handleNextMonth();
    } else if (diff < -45) {
      handlePrevMonth();
    }
    setTouchStart(null);
  };

  const handleCheckboxToggle = (task: Task) => {
    if (task.status !== 'Done' && task.repetitionMode === 'smart') {
      setSmartTask(task);
    } else {
      toggleTaskStatus(task.id);
    }
  };

  const handleSelectSmartRating = (rating: SmartRating) => {
    if (smartTask) {
      updateTaskStatus(smartTask.id, 'Done', rating);
      setSmartTask(null);
    }
  };

  const monthDays = useMemo(() => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const jsFirstDay = firstDayOfMonth.getDay();
    const startPadding = jsFirstDay === 0 ? 6 : jsFirstDay - 1;

    const totalCells = Math.ceil((startPadding + lastDayOfMonth.getDate()) / 7) * 7;
    const days = [];

    for (let i = 0; i < totalCells; i++) {
      const dayOffset = i - startPadding + 1;
      const cellDate = new Date(year, month, dayOffset);
      const dateStr = formatDateStr(cellDate.getFullYear(), cellDate.getMonth(), cellDate.getDate());
      const dayNum = cellDate.getDate();
      const isCurrentMonth = cellDate.getMonth() === month;

      const dateTasks = filterCalendarVisibleTasks(tasks, dateStr);
      const doneCount = dateTasks.filter((t) => t.status === 'Done').length;

      days.push({
        dateStr,
        dayNum,
        isCurrentMonth,
        isToday: dateStr === todayStr,
        tasksCount: dateTasks.length,
        doneCount,
      });
    }
    return days;
  }, [currentMonthDate, todayStr, tasks]);

  const selectedDayTasks = useMemo(() => {
    return filterCalendarVisibleTasks(tasks, selectedDate);
  }, [tasks, selectedDate]);

  const monthTitleStr = currentMonthDate.toLocaleDateString('ru-RU', {
    month: 'long',
    year: 'numeric',
  });

  const formattedSelectedDate = formatSelectedDateTitle(selectedDate);

  const handleTaskClick = (task: Task) => {
    setDetailTask(task);
  };

  return (
    <div className={styles.container}>
      {/* 7-Column Calendar Grid */}
      <div
        className={styles.calendarCard}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Month Navigation Header */}
        <div className={styles.monthNavHeader}>
          <div className={styles.monthTitle}>
            📅 {monthTitleStr}
          </div>
          <div className={styles.navControls}>
            <button
              className={styles.navBtn}
              onClick={handleGoToToday}
              title="Перейти к сегодняшней дате"
            >
              Сегодня
            </button>
            <button
              className={styles.navBtn}
              onClick={handlePrevMonth}
              title="Предыдущий месяц"
            >
              ◄
            </button>
            <button
              className={styles.navBtn}
              onClick={handleNextMonth}
              title="Следующий месяц"
            >
              ►
            </button>
          </div>
        </div>

        {/* Day of Week Headers */}
        <div className={styles.weekHeaderGrid}>
          <div className={styles.weekHeaderCell}>Пн</div>
          <div className={styles.weekHeaderCell}>Вт</div>
          <div className={styles.weekHeaderCell}>Ср</div>
          <div className={styles.weekHeaderCell}>Чт</div>
          <div className={styles.weekHeaderCell}>Пт</div>
          <div className={styles.weekHeaderCell} style={{ color: 'var(--color-warning)' }}>Сб</div>
          <div className={styles.weekHeaderCell} style={{ color: 'var(--color-danger)' }}>Вс</div>
        </div>

        {/* Days Grid */}
        <div className={styles.daysGrid}>
          {monthDays.map((d) => {
            const isSelected = d.dateStr === selectedDate;
            const hasTasks = d.tasksCount > 0;
            const isAllDone = hasTasks && d.doneCount === d.tasksCount;

            return (
              <div
                key={d.dateStr}
                className={`${styles.dayCell} ${!d.isCurrentMonth ? styles.dayCellOtherMonth : ''} ${
                  d.isToday ? styles.dayCellToday : ''
                } ${isSelected ? styles.dayCellSelected : ''}`}
                onClick={() => setSelectedDate(d.dateStr)}
              >
                <div className={styles.dayNumRow}>
                  <span className={styles.dayNum}>{d.dayNum}</span>
                </div>

                {hasTasks && (
                  <div className={styles.badgeRow}>
                    <span className={`${styles.taskBadge} ${isAllDone ? styles.taskBadgeDone : ''}`}>
                      {d.tasksCount}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Agenda Header & Task List */}
      <div className={styles.selectedDayCard}>
        <div className={styles.selectedDayHeader}>
          <div className={styles.selectedDayTitle}>
            📋 {formattedSelectedDate}
          </div>
          <div className={styles.selectedDayMeta}>
            {selectedDayTasks.length === 0
              ? 'Нет запланированных задач'
              : `Задач: ${selectedDayTasks.length}`}
          </div>
        </div>

        {/* Task List for Selected Date */}
        {isLoading ? (
          <div className={styles.emptyState}>Загрузка...</div>
        ) : selectedDayTasks.length === 0 ? (
          <div className={styles.emptyState}>
            🌱 На этот день нет запланированных задач.
          </div>
        ) : (
          <div className={styles.taskList}>
            {selectedDayTasks.map((t) => {
              const isDone = t.status === 'Done';
              const isRepeating = t.isRepeating;
              const topicObj = topics.find((top) => top.id === t.topicId);

              return (
                <div
                  key={t.id}
                  className={`${styles.agendaTaskCard} ${isDone ? styles.agendaTaskCardDone : ''}`}
                  onClick={() => handleTaskClick(t)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div onClick={(e) => { e.stopPropagation(); handleCheckboxToggle(t); }}>
                      <Checkbox checked={isDone} onChange={() => {}} />
                    </div>
                    <span className={`${styles.taskTitle} ${isDone ? styles.taskTitleDone : ''}`}>
                      {t.title}
                    </span>
                  </div>

                  <div className={styles.taskMetaRow}>
                    <span className={styles.categoryBadge}>🏷 {t.category}</span>
                    {topicObj && (
                      <span className={styles.topicBadge}>📌 {topicObj.title}</span>
                    )}
                    {isRepeating && (
                      <span className={styles.repeatBadge}>🔄 Повторяющаяся</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Task Modal */}
      <EditTaskModal
        task={editingTask}
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
      />

      {/* Repeating Task Detail Modal */}
      <RepeatingTaskDetailModal
        task={detailTask}
        isOpen={!!detailTask}
        onClose={() => setDetailTask(null)}
        onOpenEdit={() => {
          setEditingTask(detailTask);
          setDetailTask(null);
        }}
      />

      {/* Smart Rating Completion Modal */}
      <SmartRatingModal
        task={smartTask}
        isOpen={!!smartTask}
        onClose={() => setSmartTask(null)}
        onSelectRating={handleSelectSmartRating}
      />
    </div>
  );
};
