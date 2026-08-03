'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useTaskStore, GlassmorphicTaskCard } from '@/entities/task';
import { Task } from '@/entities/task/model/types';
import { SmartRating } from '@/shared/config/repetitionRules';
import { EditTaskModal } from '@/features/edit-task/ui/EditTaskModal';
import { RepeatingTaskDetailModal } from '@/features/edit-task/ui/RepeatingTaskDetailModal';
import { SmartRatingModal } from '@/features/smart-rating-modal/ui/SmartRatingModal';
import { getTodayStr, formatSelectedDateTitle, formatDateStr } from '@/shared/lib/dateUtils';
import styles from './CalendarPage.module.css';

const getNowDateStr = () => getTodayStr();


const filterCalendarVisibleTasks = (allTasks: Task[], targetDateStr: string): Task[] => {
  const tasksMap = new Map(allTasks.map((t) => [t.id, t]));
  return allTasks.filter((t) => {
    // Hide parent tasks with subtasks from Calendar view (Point 1 mandate)
    const hasChildren = allTasks.some((sub) => sub.parentTaskId === t.id);
    if (t.hasSubtasks || hasChildren) return false;

    if (t.isRepeating) {
      const hasOcc = t.occurrences?.some((o) => o.date === targetDateStr);
      if (!hasOcc && t.scheduledDate !== targetDateStr) return false;
    } else {
      if (!t.scheduledDate || t.scheduledDate !== targetDateStr) return false;
    }

    if (t.parentTaskId) {
      const parentTask = tasksMap.get(t.parentTaskId);
      if (parentTask && parentTask.scheduledDate === targetDateStr) {
        return false;
      }
    }

    return true;
  });
};

export const CalendarPage: React.FC = () => {
  const [todayStr, setTodayStr] = useState<string>(getNowDateStr());
  const [selectedDate, setSelectedDate] = useState<string>(getNowDateStr());
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date());
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const [smartTask, setSmartTask] = useState<Task | null>(null);

  const [touchStart, setTouchStart] = useState<number | null>(null);

  const { tasks, isLoading, fetchTasks, toggleTaskStatus, updateTaskStatus, deleteTask, deleteTaskOccurrence } = useTaskStore();

  // BUG-HIGH-08: Midnight auto-update timer
  useEffect(() => {
    fetchTasks();
    const interval = setInterval(() => {
      const nowStr = getNowDateStr();
      if (nowStr !== todayStr) {
        setTodayStr(nowStr);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchTasks, todayStr]);

  const handlePrevMonth = () => {
    setCurrentMonthDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleGoToToday = () => {
    const now = new Date();
    setCurrentMonthDate(now);
    setSelectedDate(getTodayStr());
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

  const isTaskDoneOnDate = (task: Task, dateStr: string): boolean => {
    if (task.isRepeating) {
      const occ = task.occurrences?.find((o) => o.date === dateStr);
      if (occ) return occ.status === 'Done';
      const legacyOcc = task.repetitionHistory?.find((h) => h.date === dateStr);
      if (legacyOcc) return legacyOcc.completed;
      return false;
    }
    return task.status === 'Done';
  };

  const handleCheckboxToggle = (task: Task) => {
    const isDone = isTaskDoneOnDate(task, selectedDate);

    if (isDone) {
      // Un-checking completed task: ALWAYS toggle directly to Todo, NEVER open rating modal!
      toggleTaskStatus(task.id, undefined, selectedDate);
    } else if (task.repetitionMode === 'smart' || task.repetitionMode === 'spaced') {
      // Completing task: Open rating modal if smart or spaced repetition
      setSmartTask(task);
    } else {
      toggleTaskStatus(task.id, undefined, selectedDate);
    }
  };

  const handleSelectSmartRating = (rating: SmartRating) => {
    if (smartTask) {
      updateTaskStatus(smartTask.id, 'Done', rating, selectedDate);
      setSmartTask(null);
    }
  };

  // BUG-CRIT-07: Optimized O(N) dateStatsMap pass over tasks
  const dateStatsMap = useMemo(() => {
    const map = new Map<string, { total: number; done: number }>();
    const tasksMap = new Map(tasks.map((t) => [t.id, t]));

    for (const t of tasks) {
      if (t.isRepeating && t.occurrences && t.occurrences.length > 0) {
        for (const occ of t.occurrences) {
          if (t.parentTaskId) {
            const parent = tasksMap.get(t.parentTaskId);
            if (parent && parent.scheduledDate === occ.date) continue;
          }
          const existing = map.get(occ.date) || { total: 0, done: 0 };
          existing.total += 1;
          if (occ.status === 'Done') {
            existing.done += 1;
          }
          map.set(occ.date, existing);
        }
      } else {
        if (!t.scheduledDate || t.scheduledDate === '' || t.scheduledDate === 'anytime') continue;
        if (t.parentTaskId) {
          const parent = tasksMap.get(t.parentTaskId);
          if (parent && parent.scheduledDate === t.scheduledDate) continue;
        }

        const existing = map.get(t.scheduledDate) || { total: 0, done: 0 };
        existing.total += 1;
        if (t.status === 'Done') {
          existing.done += 1;
        }
        map.set(t.scheduledDate, existing);
      }
    }
    return map;
  }, [tasks]);

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

      const stats = dateStatsMap.get(dateStr) || { total: 0, done: 0 };

      days.push({
        dateStr,
        dayNum,
        isCurrentMonth,
        isToday: dateStr === todayStr,
        tasksCount: stats.total,
        doneCount: stats.done,
      });
    }
    return days;
  }, [currentMonthDate, todayStr, dateStatsMap]);

  const selectedDayTasks = useMemo(() => {
    const list = filterCalendarVisibleTasks(tasks, selectedDate);
    return [...list].sort((a, b) => {
      const aDone = isTaskDoneOnDate(a, selectedDate);
      const bDone = isTaskDoneOnDate(b, selectedDate);
      if (aDone === bDone) return 0;
      return aDone ? 1 : -1; // Uncompleted first (false < true)
    });
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
                onClick={() => setSelectedDate(d.dateStr)}
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

        {/* Task List for Selected Date (Unified GlassmorphicTaskCard + Subtasks) */}
        {isLoading ? (
          <div className={styles.emptyState}>Загрузка...</div>
        ) : selectedDayTasks.length === 0 ? (
          <div className={styles.emptyState}>
            🌱 На этот день нет запланированных задач.
          </div>
        ) : (
          <div className={styles.taskList}>
            {selectedDayTasks.map((t) => {
              const renderSubtasksRecursive = (parentId: string, depthLevel = 1, visited = new Set<string>()): React.ReactNode => {
                if (depthLevel > 10 || visited.has(parentId)) return null;
                visited.add(parentId);

                const children = tasks.filter((sub) => sub.parentTaskId === parentId);
                if (children.length === 0) return null;

                return children.map((subtask) => (
                  <React.Fragment key={subtask.id}>
                    <div style={{ marginLeft: `${Math.min(depthLevel, 4) * 16}px`, marginTop: '6px' }}>
                      <GlassmorphicTaskCard
                        task={subtask}
                        occurrenceDate={selectedDate}
                        allTasks={tasks}
                        showDragHandle={false}
                        onToggleCheckbox={() => handleCheckboxToggle(subtask)}
                        onDelete={() => deleteTaskOccurrence(subtask.id, selectedDate)}
                        onClick={() => handleTaskClick(subtask)}
                      />
                    </div>
                    {renderSubtasksRecursive(subtask.id, depthLevel + 1, new Set(visited))}
                  </React.Fragment>
                ));
              };

              return (
                <React.Fragment key={t.id}>
                  <GlassmorphicTaskCard
                    task={t}
                    occurrenceDate={selectedDate}
                    allTasks={tasks}
                    showDragHandle={false}
                    onToggleCheckbox={() => handleCheckboxToggle(t)}
                    onDelete={() => deleteTaskOccurrence(t.id, selectedDate)}
                    onClick={() => handleTaskClick(t)}
                  />
                  {renderSubtasksRecursive(t.id, 1)}
                </React.Fragment>
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
